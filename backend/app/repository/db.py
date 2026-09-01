import os
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.models.schemas import (
    FarmerProfile, HarvestItem, MarketSnapshot, BuyerProfile, 
    ShipmentItem, ExternalSignal, ActivityLog, HistoricalPressurePoint
)

# Baseline Mock / Demo Data Store
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
    rating=4.9
)

INIT_HARVEST: List[HarvestItem] = [
    HarvestItem(
        id="h-1", cropName="Tomato", variety="Sahu Hybrid Grade A",
        quantityKg=800.0, harvestDate="Tomorrow", storageLimitDays=2,
        status="READY", estimatedValue=21600.0, fieldLocation="Plot 3A - Malur North"
    ),
    HarvestItem(
        id="h-2", cropName="Onion", variety="Nasik Red Heavy",
        quantityKg=500.0, harvestDate="In 5 days", storageLimitDays=7,
        status="GROWING", estimatedValue=14500.0, fieldLocation="Plot 1B - Malur East"
    ),
    HarvestItem(
        id="h-3", cropName="Chilli", variety="Guntur Teja",
        quantityKg=250.0, harvestDate="Today", storageLimitDays=4,
        status="READY", estimatedValue=18750.0, fieldLocation="Plot 2C - Greenhouse"
    )
]

INIT_MARKETS: List[MarketSnapshot] = [
    MarketSnapshot(
        id="market-a", name="Market A (Kolar APMC)", location="Kolar APMC Yard", distanceKm=24.0,
        pricePerKg=27.0, priceChangePct=8.2, arrivalsTonnes=1240.0, referenceCapacityTonnes=1500.0,
        supplyPressure="HIGH", pressureScore=0.82, transportCostPerKg=2.62, updatedTimeAgo="3 min ago",
        sparkline=[24.5, 25.0, 25.8, 26.2, 27.0],
        historicalPressure=[
            HistoricalPressurePoint(time="04:00", price=28.5, arrivals=750.0),
            HistoricalPressurePoint(time="06:00", price=28.0, arrivals=900.0),
            HistoricalPressurePoint(time="08:00", price=27.5, arrivals=1100.0),
            HistoricalPressurePoint(time="10:00", price=27.0, arrivals=1240.0)
        ]
    ),
    MarketSnapshot(
        id="market-b", name="Market B (Bengaluru Central)", location="K R Market Yard", distanceKm=42.0,
        pricePerKg=25.0, priceChangePct=2.1, arrivalsTonnes=820.0, referenceCapacityTonnes=1500.0,
        supplyPressure="MEDIUM", pressureScore=0.54, transportCostPerKg=1.87, updatedTimeAgo="5 min ago",
        sparkline=[24.0, 24.2, 24.8, 25.0, 25.0],
        historicalPressure=[
            HistoricalPressurePoint(time="04:00", price=24.5, arrivals=700.0),
            HistoricalPressurePoint(time="06:00", price=24.8, arrivals=750.0),
            HistoricalPressurePoint(time="08:00", price=25.0, arrivals=800.0),
            HistoricalPressurePoint(time="10:00", price=25.0, arrivals=820.0)
        ]
    ),
    MarketSnapshot(
        id="market-c", name="Market C (Hosur Wholesale)", location="Hosur Border Terminal", distanceKm=38.0,
        pricePerKg=23.0, priceChangePct=-4.7, arrivalsTonnes=1450.0, referenceCapacityTonnes=1500.0,
        supplyPressure="HIGH", pressureScore=0.96, transportCostPerKg=2.25, updatedTimeAgo="8 min ago",
        sparkline=[25.5, 24.8, 24.0, 23.5, 23.0],
        historicalPressure=[
            HistoricalPressurePoint(time="04:00", price=25.0, arrivals=1100.0),
            HistoricalPressurePoint(time="06:00", price=24.2, arrivals=1250.0),
            HistoricalPressurePoint(time="08:00", price=23.6, arrivals=1380.0),
            HistoricalPressurePoint(time="10:00", price=23.0, arrivals=1450.0)
        ]
    ),
    MarketSnapshot(
        id="market-d", name="Market D (Tumakuru Hub)", location="Tumakuru Grain & Produce", distanceKm=65.0,
        pricePerKg=28.5, priceChangePct=4.5, arrivalsTonnes=610.0, referenceCapacityTonnes=1500.0,
        supplyPressure="LOW", pressureScore=0.40, transportCostPerKg=3.80, updatedTimeAgo="12 min ago",
        sparkline=[26.0, 26.8, 27.5, 28.0, 28.5],
        historicalPressure=[
            HistoricalPressurePoint(time="04:00", price=26.5, arrivals=500.0),
            HistoricalPressurePoint(time="06:00", price=27.2, arrivals=540.0),
            HistoricalPressurePoint(time="08:00", price=28.0, arrivals=580.0),
            HistoricalPressurePoint(time="10:00", price=28.5, arrivals=610.0)
        ]
    )
]

INIT_BUYERS: List[BuyerProfile] = [
    BuyerProfile(
        id="buyer-b", name="Buyer B (FreshChoice Organics)", category="Organic Retail Chain",
        cropRequired="Tomato", offeredPricePerKg=26.0, quantityRequiredKg=800.0, distanceKm=18.0,
        paymentTerms="2 days", reliabilityScore=96.0, activeStatus="Active now", transportCostEstimate=900.0
    ),
    BuyerProfile(
        id="buyer-a", name="Buyer A (Kolar Processing Corp)", category="Food Processing Plant",
        cropRequired="Tomato", offeredPricePerKg=27.0, quantityRequiredKg=500.0, distanceKm=32.0,
        paymentTerms="1 day", reliabilityScore=94.0, activeStatus="Active 8 min ago", transportCostEstimate=1400.0
    ),
    BuyerProfile(
        id="buyer-c", name="Buyer C (Apex Hotel Consortium)", category="Institutional Buyers",
        cropRequired="Tomato", offeredPricePerKg=28.5, quantityRequiredKg=300.0, distanceKm=45.0,
        paymentTerms="Immediate Cash", reliabilityScore=98.0, activeStatus="Active 15 min ago", transportCostEstimate=1800.0
    )
]

INIT_SHIPMENTS: List[ShipmentItem] = [
    ShipmentItem(
        id="SH-9042", cropName="Tomato", destination="Buyer B (FreshChoice Organics)", quantityKg=600.0,
        status="IN TRANSIT", etaMinutes=42, vehicleNumber="TN 74 XX 1234", driverName="Ramesh K.",
        driverPhone="+91 98451 22910", dispatchTime="08:30 AM", expectedDelivery="09:45 AM",
        timeline=[
            {"title": "Order Confirmed", "time": "07:45 AM", "completed": True},
            {"title": "Pickup Completed", "time": "08:30 AM", "completed": True},
            {"title": "In Transit (Highway NH-75)", "time": "08:45 AM", "completed": True},
            {"title": "Arriving at Destination Yard", "time": "09:35 AM", "completed": False},
            {"title": "Delivered & Payment Triggered", "time": "09:45 AM", "completed": False}
        ]
    )
]

INIT_SIGNALS: List[ExternalSignal] = [
    ExternalSignal(
        id="sig-1", type="ROAD ALERT", title="Highway Disruption Near Market A",
        source="Karnataka Traffic Intelligence", timestamp="18 min ago",
        impactText="+18 min transport delay on NH-75 route to Kolar APMC", severity="WARNING"
    ),
    ExternalSignal(
        id="sig-2", type="FESTIVAL DEMAND", title="Ganesh Chaturthi Demand Spike",
        source="Bengaluru Retail Traders Guild", timestamp="1 hour ago",
        impactText="Expected +15% increase in tomato demand across city centers over next 48 hours", severity="POSITIVE"
    ),
    ExternalSignal(
        id="sig-3", type="APMC UPDATE", title="Market Operating Hours Extended",
        source="APMC Yard Director Board", timestamp="2 hours ago",
        impactText="Kolar Yard accepting arrivals until 06:00 PM today instead of 04:00 PM", severity="INFO"
    )
]

INIT_ACTIVITY: List[ActivityLog] = [
    ActivityLog(
        id="act-1", timestamp="09:42 AM", title="Market A arrivals increased by 31%", category="MARKET",
        description="Kolar APMC recorded sudden inflow of 1,240 tonnes of tomatoes from neighboring districts.",
        impact="Moderate downward pressure on spot price"
    ),
    ActivityLog(
        id="act-2", timestamp="09:43 AM", title="AgriPilot recalculated expected realization", category="DECISION",
        description="Algorithm evaluated 4 allocation combinations across 3 markets and 2 direct buyers.",
        impact="Optimization score: 94/100"
    ),
    ActivityLog(
        id="act-3", timestamp="09:44 AM", title="Alternative buyer identified (Buyer B)", category="BUYER",
        description="FreshChoice Organics issued active buying order for 800 kg grade A tomatoes at ₹26/kg.",
        impact="Provides cash stability for Friday requirement"
    ),
    ActivityLog(
        id="act-4", timestamp="09:45 AM", title="Recommendation updated", category="DECISION",
        description="Plan generated: 400 kg Market A, 200 kg Buyer B, 200 kg Hold.",
        impact="+8.4% realization compared to local sell-all"
    )
]

# Repository Class
class DataRepository:
    def __init__(self):
        self.farmer = INIT_FARMER.model_copy()
        self.harvest = [h.model_copy() for h in INIT_HARVEST]
        self.markets = [m.model_copy() for m in INIT_MARKETS]
        self.buyers = [b.model_copy() for b in INIT_BUYERS]
        self.shipments = [s.model_copy() for s in INIT_SHIPMENTS]
        self.signals = [sig.model_copy() for sig in INIT_SIGNALS]
        self.activity_logs = [a.model_copy() for a in INIT_ACTIVITY]
        self.is_shocked = False

    def get_farmer(self) -> FarmerProfile:
        return self.farmer

    def get_harvest(self) -> List[HarvestItem]:
        return self.harvest

    def get_markets(self) -> List[MarketSnapshot]:
        return self.markets

    def get_buyers(self) -> List[BuyerProfile]:
        return self.buyers

    def get_shipments(self) -> List[ShipmentItem]:
        return self.shipments

    def get_signals(self) -> List[ExternalSignal]:
        return self.signals

    def get_activity_logs(self) -> List[ActivityLog]:
        return self.activity_logs

    def add_activity_log(self, log: ActivityLog):
        self.activity_logs.insert(0, log)

    def reset_markets(self):
        self.markets = [m.model_copy() for m in INIT_MARKETS]
        self.is_shocked = False

    def apply_market_shock(self, market_id: str = "market-a", surge_pct: float = 70.0):
        self.is_shocked = True
        for m in self.markets:
            if m.id == market_id:
                m.arrivalsTonnes = round(m.arrivalsTonnes * (1 + surge_pct / 100.0), 1)
                m.pricePerKg = 21.0
                m.priceChangePct = -14.2
                m.supplyPressure = "CRITICAL"
                m.pressureScore = min(1.0, m.arrivalsTonnes / m.referenceCapacityTonnes)
                m.updatedTimeAgo = "Just now (SHOCK DETECTED)"
                m.sparkline = [27.0, 26.0, 24.5, 22.5, 21.0]
                m.historicalPressure.append(
                    HistoricalPressurePoint(time="10:15", price=21.0, arrivals=m.arrivalsTonnes)
                )
            elif m.id == "market-b":
                m.pricePerKg = 25.4
                m.priceChangePct = 3.8
                m.arrivalsTonnes = 890.0

repo = DataRepository()
