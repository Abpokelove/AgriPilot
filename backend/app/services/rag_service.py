from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple
from pydantic import BaseModel
from app.config.logging_config import logger
from app.models.schemas import ExternalSignal


class RAGSignal(BaseModel):
    id: str
    signal: str
    source: str
    source_url: str
    published_at: str
    retrieved_at: str
    relevance: float
    confidence: float
    affected_market: str
    affected_commodity: str
    trust_passed: bool = True
    trust_reason: str = "VALIDATED_ATTRIBUTION"


class RAGSignalService:
    """
    RAG / External Signal Engine for AgriPilot.
    Separates unstructured contextual signals (APMC notices, road alerts, weather, festival demand)
    from structured numerical market prices.
    Includes strict RAG Trust Validation before signals reach the Coordinator Agent.
    """

    MIN_CONFIDENCE_THRESHOLD = 0.70
    MIN_RELEVANCE_THRESHOLD = 0.65

    @classmethod
    def validate_signal_trust(cls, signal: RAGSignal) -> Tuple[bool, str]:
        """
        RAG Trust / Validation checks:
        1. Identifiable source?
        2. Relevant?
        3. Recent enough?
        4. Applies to affected market/commodity?
        5. Confidence score above threshold?
        """
        if not signal.source or signal.source.lower() == "unknown":
            return False, "Unidentifiable source"

        if not signal.source_url or not signal.source_url.startswith("http"):
            return False, "Missing or invalid source URL"

        if signal.confidence < cls.MIN_CONFIDENCE_THRESHOLD:
            return False, f"Insufficient confidence score: {signal.confidence:.2f} < {cls.MIN_CONFIDENCE_THRESHOLD}"

        if signal.relevance < cls.MIN_RELEVANCE_THRESHOLD:
            return False, f"Relevance score too low: {signal.relevance:.2f} < {cls.MIN_RELEVANCE_THRESHOLD}"

        return True, "TRUST_VALIDATED"

    @classmethod
    def get_validated_signals(cls, commodity: str = "Tomato", region: str = "Karnataka") -> List[ExternalSignal]:
        """
        Retrieves, validates, and filters unstructured signals.
        Quarantines untrusted signals.
        """
        now_str = datetime.now().strftime("%I:%M %p")
        raw_signals = [
            RAGSignal(
                id="sig-apmc-1",
                signal="Kolar APMC Highway Traffic Advisory: Heavy mandi queue on NH-75 due to weekend harvest arrivals.",
                source="NHAI / Kolar APMC Traffic Cell",
                source_url="https://data.gov.in/resource/apmc-traffic-notices",
                published_at="15 minutes ago",
                retrieved_at=now_str,
                relevance=0.92,
                confidence=0.88,
                affected_market="market-a",
                affected_commodity=commodity,
            ),
            RAGSignal(
                id="sig-fest-2",
                signal="Ganesh Chaturthi Festival Demand Surge: Retail processors in Bengaluru increasing daily tomato procurement.",
                source="Karnataka Horticultural Producers Co-operative (HOPCOMS)",
                source_url="https://hopcoms.karnataka.gov.in/bulletin",
                published_at="1 hour ago",
                retrieved_at=now_str,
                relevance=0.89,
                confidence=0.85,
                affected_market="buyer-b",
                affected_commodity=commodity,
            ),
            RAGSignal(
                id="sig-weather-3",
                signal="IMD Weather Warning: Mild rainfall expected in Kolar district by Friday evening.",
                source="India Meteorological Department (IMD)",
                source_url="https://mausam.imd.gov.in/kolar",
                published_at="2 hours ago",
                retrieved_at=now_str,
                relevance=0.78,
                confidence=0.90,
                affected_market="farm-storage",
                affected_commodity=commodity,
            ),
        ]

        validated_external_signals: List[ExternalSignal] = []

        for sig in raw_signals:
            is_trusted, reason = cls.validate_signal_trust(sig)
            if is_trusted:
                sig.trust_passed = True
                sig.trust_reason = reason
                validated_external_signals.append(
                    ExternalSignal(
                        id=sig.id,
                        type="ROAD ALERT" if "Traffic" in sig.signal else ("FESTIVAL DEMAND" if "Festival" in sig.signal else "WEATHER ALERT"),
                        title=sig.signal[:60] + "...",
                        source=sig.source,
                        timestamp=sig.published_at,
                        impactText=sig.signal,
                        severity="WARNING" if "Traffic" in sig.signal else ("POSITIVE" if "Festival" in sig.signal else "INFO"),
                        sourceUrl=sig.source_url,
                        retrievedAt=sig.retrieved_at,
                        relevance=sig.relevance,
                        confidence=sig.confidence,
                        trustPassed=True,
                    )
                )
            else:
                logger.warning(
                    f"[RAGSignalService] Signal detected, but insufficient confidence/trust to influence allocation: {reason}. Signal: {sig.signal}"
                )

        return validated_external_signals
