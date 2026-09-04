from datetime import datetime
from typing import Any, Dict, List, Optional, Type, TypeVar

from pymongo import ReturnDocument

from app.models.schemas import (
    ActivityLog,
    BuyerProfile,
    FarmerProfile,
    HarvestItem,
    HistoricalPressurePoint,
    MarketSnapshot,
    ShipmentItem,
    ExternalSignal,
)
from app.repository.mongo_store import MongoStore

T = TypeVar("T")


INIT_FARMER = FarmerProfile(
    id="demo-farmer",
    name="Arjun Patel",
    farmName="Malur Agro Farm",
    location="Malur, Kolar District",
    region="Karnataka, India",
    activeCrop="Tomato",
    quantityKg=800.0,
    harvestTiming="Tomorrow (Sept 2)",
    storageCapacityDays=2,
    cashRequirement=50000.0,
    cashDeadline="Friday (Sept 5)",
    rating=4.9,
)

INIT_HARVEST: List[HarvestItem] = [
    HarvestItem(
        id="h-1",
        cropName="Tomato",
        variety="Sahu Hybrid Grade A",
        quantityKg=800.0,
        harvestDate="Tomorrow",
        storageLimitDays=2,
        status="READY",
        estimatedValue=21600.0,
        fieldLocation="Plot 3A - Malur North",
    ),
    HarvestItem(
        id="h-2",
        cropName="Onion",
        variety="Nasik Red Heavy",
        quantityKg=500.0,
        harvestDate="In 5 days",
        storageLimitDays=7,
        status="GROWING",
        estimatedValue=14500.0,
        fieldLocation="Plot 1B - Malur East",
    ),
    HarvestItem(
        id="h-3",
        cropName="Chilli",
        variety="Guntur Teja",
        quantityKg=250.0,
        harvestDate="Today",
        storageLimitDays=4,
        status="READY",
        estimatedValue=18750.0,
        fieldLocation="Plot 2C - Greenhouse",
    ),
]

INIT_MARKETS: List[MarketSnapshot] = [
    MarketSnapshot(
        id="market-a",
        name="Market A (Kolar APMC)",
        location="Kolar APMC Yard",
        distanceKm=24.0,
        pricePerKg=27.0,
        priceChangePct=8.2,
        arrivalsTonnes=1240.0,
        referenceCapacityTonnes=1500.0,
        supplyPressure="HIGH",
        pressureScore=0.82,
        transportCostPerKg=2.62,
        updatedTimeAgo="3 min ago",
        sparkline=[24.5, 25.0, 25.8, 26.2, 27.0],
        historicalPressure=[
            HistoricalPressurePoint(time="04:00", price=28.5, arrivals=750.0),
            HistoricalPressurePoint(time="06:00", price=28.0, arrivals=900.0),
            HistoricalPressurePoint(time="08:00", price=27.5, arrivals=1100.0),
            HistoricalPressurePoint(time="10:00", price=27.0, arrivals=1240.0),
        ],
    ),
    MarketSnapshot(
        id="market-b",
        name="Market B (Bengaluru Central)",
        location="K R Market Yard",
        distanceKm=42.0,
        pricePerKg=25.0,
        priceChangePct=2.1,
        arrivalsTonnes=820.0,
        referenceCapacityTonnes=1500.0,
        supplyPressure="MEDIUM",
        pressureScore=0.54,
        transportCostPerKg=1.87,
        updatedTimeAgo="5 min ago",
        sparkline=[24.0, 24.2, 24.8, 25.0, 25.0],
        historicalPressure=[
            HistoricalPressurePoint(time="04:00", price=24.5, arrivals=700.0),
            HistoricalPressurePoint(time="06:00", price=24.8, arrivals=750.0),
            HistoricalPressurePoint(time="08:00", price=25.0, arrivals=800.0),
            HistoricalPressurePoint(time="10:00", price=25.0, arrivals=820.0),
        ],
    ),
    MarketSnapshot(
        id="market-c",
        name="Market C (Hosur Wholesale)",
        location="Hosur Border Terminal",
        distanceKm=38.0,
        pricePerKg=23.0,
        priceChangePct=-4.7,
        arrivalsTonnes=1450.0,
        referenceCapacityTonnes=1500.0,
        supplyPressure="HIGH",
        pressureScore=0.96,
        transportCostPerKg=2.25,
        updatedTimeAgo="8 min ago",
        sparkline=[25.5, 24.8, 24.0, 23.5, 23.0],
        historicalPressure=[
            HistoricalPressurePoint(time="04:00", price=25.0, arrivals=1100.0),
            HistoricalPressurePoint(time="06:00", price=24.2, arrivals=1250.0),
            HistoricalPressurePoint(time="08:00", price=23.6, arrivals=1380.0),
            HistoricalPressurePoint(time="10:00", price=23.0, arrivals=1450.0),
        ],
    ),
    MarketSnapshot(
        id="market-d",
        name="Market D (Tumakuru Hub)",
        location="Tumakuru Grain & Produce",
        distanceKm=65.0,
        pricePerKg=28.5,
        priceChangePct=4.5,
        arrivalsTonnes=610.0,
        referenceCapacityTonnes=1500.0,
        supplyPressure="LOW",
        pressureScore=0.40,
        transportCostPerKg=3.80,
        updatedTimeAgo="12 min ago",
        sparkline=[26.0, 26.8, 27.5, 28.0, 28.5],
        historicalPressure=[
            HistoricalPressurePoint(time="04:00", price=26.5, arrivals=500.0),
            HistoricalPressurePoint(time="06:00", price=27.2, arrivals=540.0),
            HistoricalPressurePoint(time="08:00", price=28.0, arrivals=580.0),
            HistoricalPressurePoint(time="10:00", price=28.5, arrivals=610.0),
        ],
    ),
]

INIT_BUYERS: List[BuyerProfile] = [
    BuyerProfile(
        id="buyer-b",
        name="Buyer B (FreshChoice Organics)",
        category="Organic Retail Chain",
        cropRequired="Tomato",
        offeredPricePerKg=26.0,
        quantityRequiredKg=800.0,
        distanceKm=18.0,
        paymentTerms="2 days",
        reliabilityScore=96.0,
        activeStatus="Active now",
        transportCostEstimate=900.0,
    ),
    BuyerProfile(
        id="buyer-a",
        name="Buyer A (Kolar Processing Corp)",
        category="Food Processing Plant",
        cropRequired="Tomato",
        offeredPricePerKg=27.0,
        quantityRequiredKg=500.0,
        distanceKm=32.0,
        paymentTerms="1 day",
        reliabilityScore=94.0,
        activeStatus="Active 8 min ago",
        transportCostEstimate=1400.0,
    ),
    BuyerProfile(
        id="buyer-c",
        name="Buyer C (Apex Hotel Consortium)",
        category="Institutional Buyers",
        cropRequired="Tomato",
        offeredPricePerKg=28.5,
        quantityRequiredKg=300.0,
        distanceKm=45.0,
        paymentTerms="Immediate Cash",
        reliabilityScore=98.0,
        activeStatus="Active 15 min ago",
        transportCostEstimate=1800.0,
    ),
]

INIT_SHIPMENTS: List[ShipmentItem] = [
    ShipmentItem(
        id="SH-9042",
        cropName="Tomato",
        destination="Buyer B (FreshChoice Organics)",
        quantityKg=600.0,
        status="IN TRANSIT",
        etaMinutes=42,
        vehicleNumber="TN 74 XX 1234",
        driverName="Ramesh K.",
        driverPhone="+91 98451 22910",
        dispatchTime="08:30 AM",
        expectedDelivery="09:45 AM",
        timeline=[
            {"title": "Order Confirmed", "time": "07:45 AM", "completed": True},
            {"title": "Pickup Completed", "time": "08:30 AM", "completed": True},
            {"title": "In Transit (Highway NH-75)", "time": "08:45 AM", "completed": True},
            {"title": "Arriving at Destination Yard", "time": "09:35 AM", "completed": False},
            {"title": "Delivered & Payment Triggered", "time": "09:45 AM", "completed": False},
        ],
    )
]

INIT_SIGNALS: List[ExternalSignal] = [
    ExternalSignal(
        id="sig-1",
        type="ROAD ALERT",
        title="Highway Disruption Near Market A",
        source="Karnataka Traffic Intelligence",
        timestamp="18 min ago",
        impactText="+18 min transport delay on NH-75 route to Kolar APMC",
        severity="WARNING",
    ),
    ExternalSignal(
        id="sig-2",
        type="FESTIVAL DEMAND",
        title="Ganesh Chaturthi Demand Spike",
        source="Bengaluru Retail Traders Guild",
        timestamp="1 hour ago",
        impactText="Expected +15% increase in tomato demand across city centers over next 48 hours",
        severity="POSITIVE",
    ),
    ExternalSignal(
        id="sig-3",
        type="APMC UPDATE",
        title="Market Operating Hours Extended",
        source="APMC Yard Director Board",
        timestamp="2 hours ago",
        impactText="Kolar Yard accepting arrivals until 06:00 PM today instead of 04:00 PM",
        severity="INFO",
    ),
]

INIT_ACTIVITY: List[ActivityLog] = [
    ActivityLog(
        id="act-1",
        timestamp="09:42 AM",
        title="Market A arrivals increased by 31%",
        category="MARKET",
        description="Kolar APMC recorded sudden inflow of 1,240 tonnes of tomatoes from neighboring districts.",
        impact="Moderate downward pressure on spot price",
    ),
    ActivityLog(
        id="act-2",
        timestamp="09:43 AM",
        title="AgriPilot recalculated expected realization",
        category="DECISION",
        description="Algorithm evaluated 4 allocation combinations across 3 markets and 2 direct buyers.",
        impact="Optimization score: 94/100",
    ),
    ActivityLog(
        id="act-3",
        timestamp="09:44 AM",
        title="Alternative buyer identified (Buyer B)",
        category="BUYER",
        description="FreshChoice Organics issued active buying order for 800 kg grade A tomatoes at ₹26/kg.",
        impact="Provides cash stability for Friday requirement",
    ),
    ActivityLog(
        id="act-4",
        timestamp="09:45 AM",
        title="Recommendation updated",
        category="DECISION",
        description="Plan generated: 400 kg Market A, 200 kg Buyer B, 200 kg Hold.",
        impact="+8.4% realization compared to local sell-all",
    ),
]


class DataRepository:
    def __init__(self):
        self.mongo = MongoStore()
        self.is_shocked = False

        self.farmer = self._load_single("farmer", INIT_FARMER)
        self.harvest = self._load_many("harvest", INIT_HARVEST)
        self.markets = self._load_many("markets", INIT_MARKETS)
        self.buyers = self._load_many("buyers", INIT_BUYERS)
        self.shipments = self._load_many("shipments", INIT_SHIPMENTS)
        self.signals = self._load_many("signals", INIT_SIGNALS)
        self.activity_logs = self._load_many("activity_logs", INIT_ACTIVITY)

        state_doc = self._get_state_document()
        if state_doc is not None:
            self.is_shocked = bool(state_doc.get("is_shocked", False))
        else:
            self._save_state_document({"_id": "app-state", "is_shocked": False})

        self._sync_market_pressure()

    def _collection(self, name: str):
        return self.mongo.collection(name)

    def _serialize_model(self, model: Any) -> Dict[str, Any]:
        return model.model_dump(mode="json")

    def _deserialize_model(self, model_cls: Type[T], payload: Dict[str, Any]) -> T:
        clean_payload = {key: value for key, value in payload.items() if key != "_id"}
        return model_cls.model_validate(clean_payload)

    def _load_many(self, collection_name: str, seed_models: List[T]) -> List[T]:
        collection = self._collection(collection_name)
        if collection is None:
            return [item.model_copy() for item in seed_models]

        existing = list(collection.find({}, {"_id": 0}))
        if not existing:
            collection.insert_many([self._serialize_model(item) for item in seed_models])
            return [item.model_copy() for item in seed_models]

        model_type = type(seed_models[0])
        return [self._deserialize_model(model_type, doc) for doc in existing]

    def _load_single(self, collection_name: str, seed_model: T) -> T:
        collection = self._collection(collection_name)
        if collection is None:
            return seed_model.model_copy()

        existing = collection.find_one({}, {"_id": 0})
        if not existing:
            collection.insert_one(self._serialize_model(seed_model))
            return seed_model.model_copy()

        return self._deserialize_model(type(seed_model), existing)

    def _save_single(self, collection_name: str, model: Any) -> None:
        collection = self._collection(collection_name)
        if collection is None:
            return
        collection.delete_many({})
        collection.insert_one(self._serialize_model(model))

    def _save_many(self, collection_name: str, models: List[Any]) -> None:
        collection = self._collection(collection_name)
        if collection is None:
            return
        collection.delete_many({})
        if models:
            collection.insert_many([self._serialize_model(model) for model in models])

    def _save_state_document(self, document: Dict[str, Any]) -> None:
        collection = self._collection("app_state")
        if collection is None:
            return
        collection.replace_one({"_id": document["_id"]}, document, upsert=True)

    def _get_state_document(self) -> Optional[Dict[str, Any]]:
        collection = self._collection("app_state")
        if collection is None:
            return None
        return collection.find_one({"_id": "app-state"}, {"_id": 1, "is_shocked": 1})

    def _user_collection(self):
        return self._collection("users")

    def _serialize_user(self, user_doc: Dict[str, Any]) -> Dict[str, Any]:
        return dict(user_doc)

    def _public_user_payload(self, user_doc: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "id": user_doc["id"],
            "fullName": user_doc["fullName"],
            "mobileNumber": user_doc["mobileNumber"],
            "email": user_doc["email"],
            "location": user_doc["location"],
            "primaryCrop": user_doc["primaryCrop"],
            "avatarSeed": (user_doc.get("fullName", "AP")[:2] or "AP").upper(),
            "createdAt": user_doc["createdAt"],
        }

    def _farmer_from_user(self, user_doc: Dict[str, Any]) -> FarmerProfile:
        base_name = user_doc.get("fullName", "AgriPilot Farmer")
        location = user_doc.get("location", "Unknown location")
        crop = user_doc.get("primaryCrop", "Tomato")
        return FarmerProfile(
            id=user_doc["id"],
            name=base_name,
            farmName=f"{location} Farm",
            location=location,
            region=user_doc.get("location", "India"),
            activeCrop=crop,
            quantityKg=float(user_doc.get("quantityKg", INIT_FARMER.quantityKg)),
            harvestTiming=user_doc.get("harvestTiming", INIT_FARMER.harvestTiming),
            storageCapacityDays=int(user_doc.get("storageCapacityDays", INIT_FARMER.storageCapacityDays)),
            cashRequirement=float(user_doc.get("cashRequirement", INIT_FARMER.cashRequirement)),
            cashDeadline=user_doc.get("cashDeadline", INIT_FARMER.cashDeadline),
            rating=float(user_doc.get("rating", INIT_FARMER.rating)),
        )

    def _sync_market_pressure(self) -> None:
        for market in self.markets:
            score = round(market.arrivalsTonnes / market.referenceCapacityTonnes, 2)
            market.pressureScore = score
            if market.id == "market-a" and market.supplyPressure != "CRITICAL":
                if score > 1.0:
                    market.supplyPressure = "CRITICAL"
                elif score >= 0.75:
                    market.supplyPressure = "HIGH"
                elif score >= 0.5:
                    market.supplyPressure = "MEDIUM"
                else:
                    market.supplyPressure = "LOW"

    def get_connection_status(self) -> Dict[str, Any]:
        status = self.mongo.status()
        return {
            "connected": status.connected,
            "database": status.database_name,
            "status": status.message,
            "maskedUri": status.uri_masked,
        }

    def get_farmer(self) -> FarmerProfile:
        return self.farmer

    def get_farmer_for_user(self, user_doc: Dict[str, Any]) -> FarmerProfile:
        return self._farmer_from_user(user_doc)

    def get_harvest(self) -> List[HarvestItem]:
        return self.harvest

    def add_harvest_item(self, new_item: HarvestItem) -> HarvestItem:
        self.harvest.insert(0, new_item)
        self._save_many("harvest", self.harvest)
        return new_item

    def update_harvest_item(self, item_id: str, updated: Dict[str, Any]) -> Optional[HarvestItem]:
        updated_item: Optional[HarvestItem] = None
        next_harvest: List[HarvestItem] = []
        for item in self.harvest:
            if item.id == item_id:
                merged = item.model_dump()
                merged.update(updated)
                updated_item = HarvestItem.model_validate(merged)
                next_harvest.append(updated_item)
            else:
                next_harvest.append(item)
        if updated_item is None:
            return None
        self.harvest = next_harvest
        self._save_many("harvest", self.harvest)
        return updated_item

    def delete_harvest_item(self, item_id: str) -> bool:
        original_length = len(self.harvest)
        self.harvest = [item for item in self.harvest if item.id != item_id]
        if len(self.harvest) == original_length:
            return False
        self._save_many("harvest", self.harvest)
        return True

    def get_markets(self) -> List[MarketSnapshot]:
        return self.markets

    def set_markets(self, markets: List[MarketSnapshot]) -> List[MarketSnapshot]:
        self.markets = [market.model_copy() for market in markets]
        self._sync_market_pressure()
        self._save_many("markets", self.markets)
        self._save_state_document({"_id": "app-state", "is_shocked": self.is_shocked})
        return self.markets

    def get_buyers(self) -> List[BuyerProfile]:
        return self.buyers

    def get_shipments(self) -> List[ShipmentItem]:
        return self.shipments

    def get_signals(self) -> List[ExternalSignal]:
        return self.signals

    def get_activity_logs(self) -> List[ActivityLog]:
        return self.activity_logs

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        collection = self._user_collection()
        if collection is None or not user_id:
            return None
        return collection.find_one({"id": user_id}, {"_id": 0})

    def get_user_by_identifier(self, identifier: str) -> Optional[Dict[str, Any]]:
        collection = self._user_collection()
        if collection is None or not identifier:
            return None
        normalized = identifier.strip().lower()
        return collection.find_one(
            {
                "$or": [
                    {"email": normalized},
                    {"mobileNumber": identifier.strip()},
                ]
            },
            {"_id": 0},
        )

    def create_user(self, user_doc: Dict[str, Any]) -> Dict[str, Any]:
        collection = self._user_collection()
        if collection is None:
            raise RuntimeError("MongoDB is not connected")
        collection.insert_one(self._serialize_user(user_doc))
        return user_doc

    def update_user(self, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        collection = self._user_collection()
        if collection is None:
            return None
        result = collection.find_one_and_update(
            {"id": user_id},
            {"$set": updates},
            return_document=ReturnDocument.AFTER,
        )
        if not result:
            return None
        result.pop("_id", None)
        return result

    def get_user_count(self) -> int:
        collection = self._user_collection()
        if collection is None:
            return 0
        return int(collection.count_documents({}))

    def add_activity_log(self, log: ActivityLog):
        self.activity_logs.insert(0, log)
        self._save_many("activity_logs", self.activity_logs)

    def reset_markets(self):
        self.markets = [market.model_copy() for market in INIT_MARKETS]
        self.is_shocked = False
        self._sync_market_pressure()
        self._save_many("markets", self.markets)
        self._save_state_document({"_id": "app-state", "is_shocked": False})

    def apply_market_shock(self, market_id: str = "market-a", surge_pct: float = 70.0):
        self.is_shocked = True
        for market in self.markets:
            if market.id == market_id:
                market.arrivalsTonnes = round(market.arrivalsTonnes * (1 + surge_pct / 100.0), 1)
                market.pricePerKg = 21.0
                market.priceChangePct = -14.2
                market.supplyPressure = "CRITICAL"
                market.pressureScore = min(1.0, market.arrivalsTonnes / market.referenceCapacityTonnes)
                market.updatedTimeAgo = "Just now (SHOCK DETECTED)"
                market.sparkline = [27.0, 26.0, 24.5, 22.5, 21.0]
                market.historicalPressure.append(
                    HistoricalPressurePoint(time="10:15", price=21.0, arrivals=market.arrivalsTonnes)
                )
            elif market.id == "market-b":
                market.pricePerKg = 25.4
                market.priceChangePct = 3.8
                market.arrivalsTonnes = 890.0
        self._save_many("markets", self.markets)
        self._save_state_document({"_id": "app-state", "is_shocked": True})


repo = DataRepository()
