from typing import List, Tuple
from app.models.schemas import MarketSnapshot
from app.services.crop_service import CropService
from app.services.ingestion import DataGovInIngestionService
from app.services.market_cache import market_cache
from app.repository.db import repo


class MarketService:
    @staticmethod
    def calculate_pressure_score(arrivals: float, reference_capacity: float = 1500.0) -> Tuple[float, str]:
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
    def get_markets(cls, crop_name: str = "Tomato") -> List[MarketSnapshot]:
        crop_def = CropService.normalize_crop(crop_name)
        canonical_crop = crop_def.canonical_name

        # Try fetching real data from data.gov.in for the specific crop if cache doesn't match
        if market_cache._cached_crop.lower() != canonical_crop.lower() or market_cache.get_freshness_status().value == "UNAVAILABLE":
            canonical_records = DataGovInIngestionService.fetch_mandi_data(
                state="Karnataka",
                commodity=crop_def.external_commodity_name
            )
            if canonical_records:
                market_cache.set_canonical_records(canonical_records, crop=canonical_crop)

        # Get snapshots from cache service
        snapshots = market_cache.get_market_snapshots(crop=canonical_crop)

        # Sync repository state
        for m in snapshots:
            repo.update_market(m)

        return snapshots

    @classmethod
    def apply_shock(cls, market_id: str = "kolar-apmc", surge_pct: float = 70.0, crop_name: str = "Tomato") -> List[MarketSnapshot]:
        market_cache.apply_shock(market_id, surge_pct)
        repo.apply_market_shock(market_id, surge_pct)
        return cls.get_markets(crop_name=crop_name)

    @classmethod
    def reset_shock(cls, crop_name: str = "Tomato") -> List[MarketSnapshot]:
        market_cache.reset_shock()
        repo.reset_markets()
        return cls.get_markets(crop_name=crop_name)
