from typing import List
from app.models.schemas import MarketSnapshot
from app.repository.db import repo

class MarketService:
    @staticmethod
    def calculate_pressure_score(arrivals: float, reference_capacity: float = 1500.0) -> tuple[float, str]:
        score = round(arrivals / reference_capacity, 2)
        if score > 1.0:
            pressure = "CRITICAL"
        elif score >= 0.75:
            pressure = "HIGH"
        elif score >= 0.5:
            pressure = "MEDIUM"
        else:
            pressure = "LOW"
        return score, pressure

    @classmethod
    def get_markets(cls) -> List[MarketSnapshot]:
        markets = repo.get_markets()
        for m in markets:
            score, pressure = cls.calculate_pressure_score(m.arrivalsTonnes, m.referenceCapacityTonnes)
            if m.supplyPressure != "CRITICAL":
                m.pressureScore = score
                m.supplyPressure = pressure
        return markets

    @classmethod
    def apply_shock(cls, market_id: str = "market-a", surge_pct: float = 70.0) -> List[MarketSnapshot]:
        repo.apply_market_shock(market_id, surge_pct)
        return cls.get_markets()

    @classmethod
    def reset_shock(cls) -> List[MarketSnapshot]:
        repo.reset_markets()
        return cls.get_markets()
