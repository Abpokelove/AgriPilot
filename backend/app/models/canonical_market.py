from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class DataFreshness(str, Enum):
    FRESH = "FRESH"
    STALE = "STALE"
    UNAVAILABLE = "UNAVAILABLE"


class ValidationStatus(str, Enum):
    VALIDATED = "VALIDATED"
    QUARANTINED = "QUARANTINED"


class CanonicalMarketSnapshot(BaseModel):
    """
    Canonical, normalized internal representation of Mandi market data.
    Decouples raw external API schemas (data.gov.in) from internal agents and Decision Engine.
    """
    id: str
    market: str
    district: str
    state: str
    commodity: str
    variety: str = "Standard"
    grade: str = "FAQ"
    date: str
    min_price: float  # ₹/kg
    max_price: float  # ₹/kg
    modal_price: float  # ₹/kg
    price_unit: str = "₹/kg"
    arrival_quantity: Optional[float] = None  # tonnes (None if unavailable from source)
    has_arrival_data: bool = True
    reference_capacity: float = 1500.0  # tonnes capacity reference
    estimated_supply_pressure: Optional[float] = 0.5  # arrivals / reference_capacity (None if arrivals missing)
    pressure_category: str = "MEDIUM"  # LOW, MEDIUM, HIGH, CRITICAL, UNAVAILABLE
    source: str = "Government of India (data.gov.in)"
    source_url: str = "https://data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi"
    source_timestamp: str
    fetched_at: str
    freshness: DataFreshness = DataFreshness.FRESH
    validation_status: ValidationStatus = ValidationStatus.VALIDATED
    quarantine_reason: Optional[str] = None
