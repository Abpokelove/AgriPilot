from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional

from app.api.websocket_manager import ws_manager
from app.auth.security import get_current_user, hash_password, issue_session, user_public_profile, verify_password
from app.agents.coordinator import coordinator_agent
from app.models.schemas import (
    ActivityLog,
    AuthLoginRequest,
    AuthRegisterRequest,
    AuthSession,
    AuthUser,
    BuyerProfile,
    ChatRequest,
    ChatResponse,
    FarmerProfile,
    FarmerUpdateRequest,
    HarvestCreateRequest,
    HarvestItem,
    HarvestUpdateRequest,
    MarketShockRequest,
    MarketSnapshot,
    RecommendationPlan,
    RecommendationRequest,
    ShipmentItem,
    ExternalSignal,
)
from app.repository.db import repo
from app.services.market_service import MarketService

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok", "service": "AgriPilot Decision Intelligence API", "version": "1.0.0"}


@router.get("/api/status")
def get_status():
    db_status = repo.get_connection_status()
    return {
        "backend": "ok",
        "service": "AgriPilot Decision Intelligence API",
        "version": "1.0.0",
        "database": "connected" if db_status["connected"] else "unavailable",
        "databaseStatus": db_status,
        "websocket": "ready",
        "gemini": coordinator_agent.get_gemini_status(),
    }


@router.post("/api/auth/register", response_model=AuthSession)
def register_user(payload: AuthRegisterRequest):
    if payload.password != payload.confirmPassword:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")

    if len(payload.password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 8 characters")

    existing_user = repo.get_user_by_identifier(payload.email) or repo.get_user_by_identifier(payload.mobileNumber)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account already exists for this email or mobile number")

    now_str = datetime.utcnow().isoformat() + "Z"
    user_doc = {
        "id": f"farmer-{uuid4().hex[:12]}",
        "fullName": payload.fullName.strip(),
        "mobileNumber": payload.mobileNumber.strip(),
        "email": payload.email.strip().lower(),
        "location": payload.location.strip(),
        "primaryCrop": payload.primaryCrop.strip(),
        "passwordHash": hash_password(payload.password),
        "createdAt": now_str,
        "updatedAt": now_str,
        "avatarSeed": (payload.fullName[:2] or "AP").upper(),
    }

    repo.create_user(user_doc)
    return issue_session(user_doc)


@router.post("/api/auth/login", response_model=AuthSession)
def login_user(payload: AuthLoginRequest):
    user = repo.get_user_by_identifier(payload.identifier)
    if not user or not verify_password(payload.password, user.get("passwordHash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid login credentials")
    return issue_session(user)


@router.post("/api/auth/demo", response_model=AuthSession)
def demo_login():
    demo_email = "demo@agripilot.local"
    demo_mobile = "9000000000"
    demo_user = repo.get_user_by_identifier(demo_email) or repo.get_user_by_identifier(demo_mobile)

    if not demo_user:
        now_str = datetime.utcnow().isoformat() + "Z"
        demo_user = {
            "id": "demo-farmer",
            "fullName": "Arjun Patel",
            "mobileNumber": demo_mobile,
            "email": demo_email,
            "location": "Malur, Karnataka",
            "primaryCrop": "Tomato",
            "passwordHash": hash_password("demo12345"),
            "createdAt": now_str,
            "updatedAt": now_str,
            "avatarSeed": "AP",
        }
        repo.create_user(demo_user)

    return issue_session(demo_user)


@router.get("/api/auth/me", response_model=AuthUser)
def current_authenticated_user(current_user=Depends(get_current_user)):
    return user_public_profile(current_user)


@router.post("/api/auth/logout")
def logout_user():
    return {"status": "ok"}


@router.get("/api/farmer", response_model=FarmerProfile)
def get_farmer(current_user=Depends(get_current_user)):
    return repo.get_farmer_for_user(current_user)


@router.put("/api/farmer/crop", response_model=FarmerProfile)
def update_farmer_crop(payload: FarmerUpdateRequest, current_user=Depends(get_current_user)):
    crop_name = payload.activeCrop or "Tomato"
    updated_profile = repo.update_farmer_crop(current_user["id"], crop_name)
    return updated_profile or repo.get_farmer_for_user(current_user)


@router.get("/api/harvest", response_model=List[HarvestItem])
def get_harvest(current_user=Depends(get_current_user)):
    return repo.get_harvest()


@router.post("/api/harvest", response_model=HarvestItem)
def add_harvest_item(payload: HarvestCreateRequest, current_user=Depends(get_current_user)):
    created_item = repo.add_harvest_item(
        HarvestItem(
            id=f"h-{uuid4().hex[:12]}",
            cropName=payload.cropName,
            variety=payload.variety,
            quantityKg=payload.quantityKg,
            harvestDate=payload.harvestDate,
            storageLimitDays=payload.storageLimitDays,
            status=payload.status,
            estimatedValue=payload.estimatedValue,
            fieldLocation=payload.fieldLocation,
        )
    )
    return created_item


@router.put("/api/harvest/{item_id}", response_model=HarvestItem)
def edit_harvest_item(item_id: str, payload: HarvestUpdateRequest, current_user=Depends(get_current_user)):
    updated_item = repo.update_harvest_item(item_id, payload.model_dump(exclude_unset=True))
    if not updated_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Harvest item not found")
    return updated_item


@router.delete("/api/harvest/{item_id}")
def delete_harvest_item(item_id: str, current_user=Depends(get_current_user)):
    deleted = repo.delete_harvest_item(item_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Harvest item not found")
    return {"status": "deleted", "id": item_id}


@router.get("/api/markets", response_model=List[MarketSnapshot])
def get_markets(crop: Optional[str] = None, current_user=Depends(get_current_user)):
    target_crop = crop or current_user.get("primaryCrop", "Tomato")
    return MarketService.get_markets(crop_name=target_crop)


@router.get("/api/buyers", response_model=List[BuyerProfile])
def get_buyers(current_user=Depends(get_current_user)):
    return repo.get_buyers()


@router.get("/api/shipments", response_model=List[ShipmentItem])
def get_shipments(current_user=Depends(get_current_user)):
    return repo.get_shipments()


@router.get("/api/signals", response_model=List[ExternalSignal])
def get_signals(current_user=Depends(get_current_user)):
    return repo.get_signals()


@router.get("/api/activity", response_model=List[ActivityLog])
def get_activity(current_user=Depends(get_current_user)):
    return repo.get_activity_logs()


@router.post("/api/recommendations", response_model=RecommendationPlan)
def get_recommendation(req: RecommendationRequest, current_user=Depends(get_current_user)):
    return coordinator_agent.get_recommendation(farmer_id=current_user["id"], query=req.user_query)


@router.post("/api/chat", response_model=ChatResponse)
def handle_chat(req: ChatRequest, current_user=Depends(get_current_user)):
    return coordinator_agent.answer_chat(user_message=req.message, farmer_id=current_user["id"])


@router.post("/api/demo/market-shock")
async def trigger_market_shock(req: MarketShockRequest, current_user=Depends(get_current_user)):
    """
    End-to-end scenario flow:
    1. Market arrivals surge.
    2. Decision engine recalculates.
    3. Coordinator agent summarizes the updated recommendation.
    4. Activity log records the event.
    5. WebSocket broadcasts the change.
    """
    updated_markets = MarketService.apply_shock(req.market_id, req.arrival_surge_pct)
    coordinator_agent.clear_cache()
    updated_recommendation = coordinator_agent.get_recommendation(farmer_id=current_user["id"])

    now_str = datetime.now().strftime("%I:%M %p")
    shock_log = ActivityLog(
        id=f"act-shock-{int(datetime.now().timestamp())}",
        timestamp=now_str,
        title="Critical supply surge detected at Market A",
        category="ALERT",
        description="Market A arrivals jumped sharply and price pressure increased.",
        impact=f"AgriPilot rerouted the plan to protect expected earnings of ₹{updated_recommendation.expectedRealization:,.0f}.",
        isShockEvent=True,
    )
    repo.add_activity_log(shock_log)

    event_payload = {
        "type": "MARKET_CHANGED",
        "timestamp": now_str,
        "isShocked": True,
        "market": "Market A (Kolar APMC)",
        "change": {
            "arrivalVolume": "+70%",
            "price": "₹21.0/kg (-14.2%)",
        },
        "recommendation": updated_recommendation.model_dump(),
        "markets": [market.model_dump() for market in updated_markets],
        "activityLog": shock_log.model_dump(),
    }
    await ws_manager.broadcast(event_payload)

    return {
        "status": "SHOCK_APPLIED",
        "isShocked": True,
        "recommendation": updated_recommendation,
        "markets": updated_markets,
    }


@router.post("/api/demo/reset")
async def reset_demo_state(current_user=Depends(get_current_user)):
    reset_markets = MarketService.reset_shock()
    coordinator_agent.clear_cache()
    updated_recommendation = coordinator_agent.get_recommendation(farmer_id=current_user["id"])

    event_payload = {
        "type": "MARKET_RESET",
        "timestamp": datetime.now().strftime("%I:%M %p"),
        "isShocked": False,
        "recommendation": updated_recommendation.model_dump(),
        "markets": [market.model_dump() for market in reset_markets],
    }
    await ws_manager.broadcast(event_payload)

    return {
        "status": "RESET_SUCCESS",
        "isShocked": False,
        "recommendation": updated_recommendation,
        "markets": reset_markets,
    }
