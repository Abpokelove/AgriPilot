import os
import requests
from datetime import datetime
from typing import List, Dict, Any, Tuple
from app.config.logging_config import logger
from app.models.canonical_market import (
    CanonicalMarketSnapshot,
    DataFreshness,
    ValidationStatus
)


class DataGovInIngestionService:
    """
    Official Ingestion Pipeline for Government of India (data.gov.in) Mandi Dataset.
    Source: Department of Agriculture & Farmers Welfare / Directorate of Marketing & Inspection.
    Dataset: Current Daily Price of Various Commodities from Various Markets (Mandi)
    """

    BASE_URL = "https://api.data.gov.in/resource"
    DEFAULT_RESOURCE_ID = "9ef74157-132f-4505-81de-35b569305a3f"

    @classmethod
    def get_api_key(cls) -> str:
        key = os.getenv("DATAGOVIN_API_KEY", "").strip()
        if not key:
            from dotenv import load_dotenv
            env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")
            load_dotenv(dotenv_path=env_path, override=True)
            key = os.getenv("DATAGOVIN_API_KEY", "").strip()
        return key

    @classmethod
    def get_resource_id(cls) -> str:
        return os.getenv("DATAGOVIN_RESOURCE_ID", cls.DEFAULT_RESOURCE_ID).strip()

    @classmethod
    def validate_record(cls, record: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Validation step: Verify mandatory fields and numeric sanity.
        Rejects corrupted or incomplete records.
        """
        required_fields = ["market", "state", "commodity", "modal_price"]
        for field in required_fields:
            if field not in record or record[field] is None:
                return False, f"Missing mandatory field: {field}"

        try:
            modal_price = float(record.get("modal_price", 0))
            if modal_price <= 0 or modal_price > 50000:
                return False, f"Invalid modal price: {modal_price}"
        except (ValueError, TypeError):
            return False, f"Non-numeric modal price: {record.get('modal_price')}"

        if not str(record.get("market", "")).strip():
            return False, "Empty market name"

        return True, "VALIDATED"

    @classmethod
    def normalize_record(cls, record: Dict[str, Any], market_id_prefix: str = "mandi") -> CanonicalMarketSnapshot:
        """
        Normalization step: Convert raw data.gov.in fields into internal CanonicalMarketSnapshot.
        Prices on data.gov.in are typically given in ₹/Quintal (100 kg), so we convert to ₹/kg.
        If arrival_quantity is missing from source payload, it is set to None (no fake numbers).
        """
        now_str = datetime.utcnow().isoformat() + "Z"
        raw_market = str(record.get("market", "Unknown Mandi")).strip()
        raw_district = str(record.get("district", record.get("state", "Kolar"))).strip()
        raw_state = str(record.get("state", "Karnataka")).strip()
        raw_commodity = str(record.get("commodity", "Tomato")).strip()
        raw_variety = str(record.get("variety", "Standard")).strip()
        raw_date = str(record.get("arrival_date", datetime.utcnow().strftime("%Y-%m-%d"))).strip()

        # Parse prices (raw prices are per quintal = 100 kg)
        min_q = float(record.get("min_price", record.get("modal_price", 2500)))
        max_q = float(record.get("max_price", record.get("modal_price", 3000)))
        modal_q = float(record.get("modal_price", 2700))

        min_kg = round(min_q / 100.0, 2)
        max_kg = round(max_q / 100.0, 2)
        modal_kg = round(modal_q / 100.0, 2)

        # Parse arrival quantity if present in source payload (do NOT invent if missing)
        has_arrivals = "arrival_quantity" in record and record["arrival_quantity"] is not None
        arrival_qty: Optional[float] = float(record["arrival_quantity"]) if has_arrivals else None
        capacity = 1500.0

        if arrival_qty is not None and arrival_qty > 0:
            pressure_score: Optional[float] = round(arrival_qty / capacity, 2)
            if pressure_score > 1.0:
                pressure_cat = "CRITICAL"
            elif pressure_score >= 0.75:
                pressure_cat = "HIGH"
            elif pressure_score >= 0.5:
                pressure_cat = "MEDIUM"
            else:
                pressure_cat = "LOW"
        else:
            pressure_score = None
            pressure_cat = "UNAVAILABLE"

        m_id = f"{market_id_prefix}-{raw_market.lower().replace(' ', '-')}"

        return CanonicalMarketSnapshot(
            id=m_id,
            market=raw_market,
            district=raw_district,
            state=raw_state,
            commodity=raw_commodity,
            variety=raw_variety,
            grade="FAQ",
            date=raw_date,
            min_price=min_kg,
            max_price=max_kg,
            modal_price=modal_kg,
            price_unit="₹/kg",
            arrival_quantity=arrival_qty,
            has_arrival_data=has_arrivals,
            reference_capacity=capacity,
            estimated_supply_pressure=pressure_score,
            pressure_category=pressure_cat,
            source="Government of India (data.gov.in)",
            source_url="https://data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi",
            source_timestamp=raw_date,
            fetched_at=now_str,
            freshness=DataFreshness.FRESH,
            validation_status=ValidationStatus.VALIDATED,
        )

    @classmethod
    def fetch_mandi_data(
        cls, state: str = "Karnataka", commodity: str = "Tomato", limit: int = 20
    ) -> List[CanonicalMarketSnapshot]:
        """
        Fetches, validates, and normalizes live mandi data from data.gov.in.
        Handles missing API key, network errors, and invalid records gracefully.
        """
        api_key = cls.get_api_key()
        resource_id = cls.get_resource_id()

        if not api_key or api_key == "your_data_gov_in_api_key_here":
            logger.warning("[IngestionService] DATAGOVIN_API_KEY is not configured. Returning fallback snapshot.")
            return []

        url = f"{cls.BASE_URL}/{resource_id}"
        params = {
            "api-key": api_key,
            "format": "json",
            "offset": 0,
            "limit": limit,
            "filters[state]": state,
            "filters[commodity]": commodity,
        }

        try:
            response = requests.get(url, params=params, timeout=5)
            if response.status_code != 200:
                logger.warning(
                    f"[IngestionService] data.gov.in API returned HTTP {response.status_code}: {response.text[:100]}"
                )
                return []

            data = response.json()
            records = data.get("records", [])
            logger.info(f"[IngestionService] Fetched {len(records)} raw records from data.gov.in for commodity '{commodity}'")

            canonical_list: List[CanonicalMarketSnapshot] = []
            for raw in records:
                is_valid, reason = cls.validate_record(raw)
                if is_valid:
                    canonical_list.append(cls.normalize_record(raw))
                else:
                    logger.warning(f"[IngestionService] Quarantined invalid record: {reason}")

            return canonical_list

        except Exception as exc:
            logger.warning(f"[IngestionService] Exception while fetching data.gov.in for '{commodity}': {exc}")
            return []
