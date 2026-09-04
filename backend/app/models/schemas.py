from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class FarmerProfile(BaseModel):
    id: str = "demo-farmer"
    name: str = "Arjun Patel"
    farmName: str = "Malur Agro Farm"
    location: str = "Malur, Kolar District"
    region: str = "Karnataka, India"
    activeCrop: str = "Tomato"
    quantityKg: float = 800.0
    harvestTiming: str = "Tomorrow (Sept 2)"
    storageCapacityDays: int = 2
    cashRequirement: float = 50000.0
    cashDeadline: str = "Friday (Sept 5)"
    rating: float = 4.9

class HarvestItem(BaseModel):
    id: str
    cropName: str
    variety: str
    quantityKg: float
    harvestDate: str
    storageLimitDays: int
    status: Literal["READY", "GROWING", "HARVESTED", "DISPATCHED"]
    estimatedValue: float
    fieldLocation: str


class HarvestCreateRequest(BaseModel):
    cropName: str
    variety: str
    quantityKg: float
    harvestDate: str
    storageLimitDays: int
    status: Literal["READY", "GROWING", "HARVESTED", "DISPATCHED"]
    estimatedValue: float
    fieldLocation: str


class HarvestUpdateRequest(BaseModel):
    cropName: Optional[str] = None
    variety: Optional[str] = None
    quantityKg: Optional[float] = None
    harvestDate: Optional[str] = None
    storageLimitDays: Optional[int] = None
    status: Optional[Literal["READY", "GROWING", "HARVESTED", "DISPATCHED"]] = None
    estimatedValue: Optional[float] = None
    fieldLocation: Optional[str] = None

class HistoricalPressurePoint(BaseModel):
    time: str
    price: float
    arrivals: float

class MarketSnapshot(BaseModel):
    id: str
    name: str
    location: str
    distanceKm: float
    pricePerKg: float
    priceChangePct: float
    arrivalsTonnes: float
    referenceCapacityTonnes: float = 1500.0
    supplyPressure: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    pressureScore: float
    transportCostPerKg: float
    updatedTimeAgo: str
    sparkline: List[float]
    historicalPressure: List[HistoricalPressurePoint]

class BuyerProfile(BaseModel):
    id: str
    name: str
    category: str
    cropRequired: str
    offeredPricePerKg: float
    quantityRequiredKg: float
    distanceKm: float
    paymentTerms: str
    reliabilityScore: float
    activeStatus: str
    transportCostEstimate: float
    verifiedPartner: bool = True

class ShipmentTimelineStep(BaseModel):
    title: str
    time: str
    completed: bool

class ShipmentItem(BaseModel):
    id: str
    cropName: str
    destination: str
    quantityKg: float
    status: Literal["IN TRANSIT", "DELIVERED", "PICKUP PENDING", "SCHEDULED"]
    etaMinutes: int
    vehicleNumber: str
    driverName: str
    driverPhone: str
    dispatchTime: str
    expectedDelivery: str
    timeline: List[ShipmentTimelineStep]

class ExternalSignal(BaseModel):
    id: str
    type: Literal["ROAD ALERT", "FESTIVAL DEMAND", "APMC UPDATE", "WEATHER ALERT"]
    title: str
    source: str
    timestamp: str
    impactText: str
    severity: Literal["INFO", "WARNING", "CRITICAL", "POSITIVE"]

class PlanAllocation(BaseModel):
    destinationId: str
    destinationName: str
    quantityKg: float
    pct: float
    pricePerKg: float
    expectedRevenue: float
    transportCost: float
    netRealization: float
    badgeText: str

class RecommendationPlan(BaseModel):
    status: str = "OPTIMIZED"
    situationText: str
    allocations: List[PlanAllocation]
    expectedRealization: float
    baselineComparison: float
    pctImprovement: float
    downsideAvoided: float
    spoilageEstimatePct: float
    transportCostTotal: float
    reasoning: str
    confidenceScore: float = 0.94
    factors: List[str] = []
    dataTimestamp: str = "Just Now"

class ActivityLog(BaseModel):
    id: str
    timestamp: str
    title: str
    category: Literal["MARKET", "SYSTEM", "BUYER", "DECISION", "ALERT"]
    description: str
    impact: str
    isShockEvent: bool = False

class RecommendationRequest(BaseModel):
    farmer_id: str = "demo-farmer"
    produce_id: Optional[str] = None
    user_query: Optional[str] = None

class ChatRequest(BaseModel):
    farmer_id: str = "demo-farmer"
    message: str

class ChatResponse(BaseModel):
    reply: str
    sender: str = "AGRIPILOT"
    timestamp: str
    decisionInputs: Optional[List[str]] = None
    recommendationCard: Optional[dict] = None

class MarketShockRequest(BaseModel):
    market_id: str = "market-a"
    arrival_surge_pct: float = 70.0


class AuthRegisterRequest(BaseModel):
    fullName: str
    mobileNumber: str
    email: str
    password: str
    confirmPassword: str
    location: str
    primaryCrop: str


class AuthLoginRequest(BaseModel):
    identifier: str
    password: str


class AuthUser(BaseModel):
    id: str
    fullName: str
    mobileNumber: str
    email: str
    location: str
    primaryCrop: str
    avatarSeed: str = "AP"
    createdAt: str


class AuthSession(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    user: AuthUser


class FarmerUpdateRequest(BaseModel):
    name: Optional[str] = None
    farmName: Optional[str] = None
    location: Optional[str] = None
    region: Optional[str] = None
    activeCrop: Optional[str] = None
    quantityKg: Optional[float] = None
    harvestTiming: Optional[str] = None
    storageCapacityDays: Optional[int] = None
    cashRequirement: Optional[float] = None
    cashDeadline: Optional[str] = None
    rating: Optional[float] = None
