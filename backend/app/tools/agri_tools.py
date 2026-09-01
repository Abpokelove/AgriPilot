from typing import List, Dict, Any
from app.repository.db import repo
from app.services.market_service import MarketService
from app.decision.engine import DecisionEngine
from app.models.schemas import RecommendationPlan

class AgriTools:
    @staticmethod
    def get_farmer_context() -> Dict[str, Any]:
        farmer = repo.get_farmer()
        return farmer.model_dump()

    @staticmethod
    def get_produce() -> List[Dict[str, Any]]:
        harvest = repo.get_harvest()
        return [h.model_dump() for h in harvest]

    @staticmethod
    def get_market_conditions() -> List[Dict[str, Any]]:
        markets = MarketService.get_markets()
        return [m.model_dump() for m in markets]

    @staticmethod
    def get_buyers() -> List[Dict[str, Any]]:
        buyers = repo.get_buyers()
        return [b.model_dump() for b in buyers]

    @staticmethod
    def get_transport_options() -> List[Dict[str, Any]]:
        return [
            {"mode": "Small Truck (TATA Ace)", "capacity_kg": 1000, "base_cost_per_km": 35, "eta_min": 30},
            {"mode": "Medium Truck (Eicher)", "capacity_kg": 3000, "base_cost_per_km": 50, "eta_min": 45}
        ]

    @staticmethod
    def search_external_signals() -> List[Dict[str, Any]]:
        signals = repo.get_signals()
        return [s.model_dump() for s in signals]

    @staticmethod
    def calculate_candidate_plans() -> RecommendationPlan:
        farmer = repo.get_farmer()
        markets = MarketService.get_markets()
        buyers = repo.get_buyers()
        return DecisionEngine.calculate_optimal_plan(farmer, markets, buyers)

    @staticmethod
    def validate_plan() -> Dict[str, Any]:
        farmer = repo.get_farmer()
        markets = MarketService.get_markets()
        buyers = repo.get_buyers()
        plan = DecisionEngine.calculate_optimal_plan(farmer, markets, buyers)
        return DecisionEngine.validate_plan(plan, farmer, markets, buyers)
