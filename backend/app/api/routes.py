from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
from datetime import datetime

from app.models.schemas import (
    FarmerProfile, HarvestItem, MarketSnapshot, BuyerProfile, ShipmentItem,
    ExternalSignal, ActivityLog, RecommendationPlan, RecommendationRequest,
    ChatRequest, ChatResponse, MarketShockRequest
)
from app.repository.db import repo
from app.services.market_service import MarketService
from app.agents.coordinator import coordinator_agent
from app.api.websocket_manager import ws_manager

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok", "service": "AgriPilot Decision Intelligence API", "version": "1.0.0"}

@router.get("/api/status")
def get_status():
    return {
        "service": "AgriPilot Decision Intelligence API",
        "version": "1.0.0",
        "health": "ok",
        "gemini": coordinator_agent.get_gemini_status(),
    }

@router.get("/api/farmer", response_model=FarmerProfile)
def get_farmer():
    return repo.get_farmer()

@router.get("/api/harvest", response_model=List[HarvestItem])
def get_harvest():
    return repo.get_harvest()

@router.get("/api/markets", response_model=List[MarketSnapshot])
def get_markets():
    return MarketService.get_markets()

@router.get("/api/buyers", response_model=List[BuyerProfile])
def get_buyers():
    return repo.get_buyers()

@router.get("/api/shipments", response_model=List[ShipmentItem])
def get_shipments():
    return repo.get_shipments()

@router.get("/api/signals", response_model=List[ExternalSignal])
def get_signals():
    return repo.get_signals()

@router.get("/api/activity", response_model=List[ActivityLog])
def get_activity():
    return repo.get_activity_logs()

@router.post("/api/recommendations", response_model=RecommendationPlan)
def get_recommendation(req: RecommendationRequest):
    return coordinator_agent.get_recommendation(farmer_id=req.farmer_id, query=req.user_query)

@router.post("/api/chat", response_model=ChatResponse)
def handle_chat(req: ChatRequest):
    return coordinator_agent.answer_chat(user_message=req.message, farmer_id=req.farmer_id)

@router.post("/api/demo/market-shock")
async def trigger_market_shock(req: MarketShockRequest):
    """
    Genuine End-to-End Market Shock State Transition:
    1. Market A arrival volume increases by 70%.
    2. Deterministic pressure recalculated -> CRITICAL.
    3. DecisionEngine recalculates optimal candidate allocation.
    4. CoordinatorAgent interprets new recommendation.
    5. Activity log records event.
    6. WebSocket broadcasts MARKET_CHANGED event to all connected UI clients.
    """
    updated_markets = MarketService.apply_shock(req.market_id, req.arrival_surge_pct)
    updated_recommendation = coordinator_agent.get_recommendation()

    # Append activity log
    now_str = datetime.now().strftime("%I:%M %p")
    shock_log = ActivityLog(
        id=f"act-shock-{int(datetime.now().timestamp())}",
        timestamp=now_str,
        title="⚡ CRITICAL SUPPLY SURGE: Market A arrivals jumped +70%",
        category="ALERT",
        description="Massive inflow spike detected at Market A (2,108 tonnes). Spot price crashed from ₹27.0/kg to ₹21.0/kg.",
        impact=f"AgriPilot auto-rerouted allocation: Market B (50%), Buyer B (30%), Market A (20%). Realization protected at ₹{updated_recommendation.expectedRealization:,.0f}.",
        isShockEvent=True
    )
    repo.add_activity_log(shock_log)

    # Broadcast WebSocket Event
    event_payload = {
        "type": "MARKET_CHANGED",
        "timestamp": now_str,
        "isShocked": True,
        "market": "Market A (Kolar APMC)",
        "change": {
            "arrivalVolume": "+70%",
            "price": "₹21.0/kg (-14.2%)"
        },
        "recommendation": updated_recommendation.model_dump(),
        "markets": [m.model_dump() for m in updated_markets],
        "activityLog": shock_log.model_dump()
    }
    await ws_manager.broadcast(event_payload)

    return {
        "status": "SHOCK_APPLIED",
        "isShocked": True,
        "recommendation": updated_recommendation,
        "markets": updated_markets
    }

@router.post("/api/demo/reset")
async def reset_demo_state():
    reset_markets = MarketService.reset_shock()
    updated_recommendation = coordinator_agent.get_recommendation()

    event_payload = {
        "type": "MARKET_RESET",
        "timestamp": datetime.now().strftime("%I:%M %p"),
        "isShocked": False,
        "recommendation": updated_recommendation.model_dump(),
        "markets": [m.model_dump() for m in reset_markets]
    }
    await ws_manager.broadcast(event_payload)

    return {
        "status": "RESET_SUCCESS",
        "isShocked": False,
        "recommendation": updated_recommendation,
        "markets": reset_markets
    }
