import unittest
from app.services.ingestion import DataGovInIngestionService
from app.models.canonical_market import CanonicalMarketSnapshot, DataFreshness, ValidationStatus
from app.services.market_cache import MarketCacheService
from app.services.rag_service import RAGSignalService, RAGSignal
from app.decision.engine import DecisionEngine
from app.models.schemas import FarmerProfile, MarketSnapshot, BuyerProfile


class TestAgriPilotPipeline(unittest.TestCase):

    def test_data_gov_in_validation_and_normalization(self):
        """Verify ingestion validation rejects malformed records and normalizes valid records."""
        valid_raw = {
            "market": "Kolar",
            "district": "Kolar",
            "state": "Karnataka",
            "commodity": "Tomato",
            "variety": "Hybrid",
            "arrival_date": "2026-09-05",
            "min_price": 2400,
            "max_price": 3000,
            "modal_price": 2700,
            "arrival_quantity": 1200,
        }
        is_valid, reason = DataGovInIngestionService.validate_record(valid_raw)
        self.assertTrue(is_valid)
        self.assertEqual(reason, "VALIDATED")

        normalized = DataGovInIngestionService.normalize_record(valid_raw)
        self.assertEqual(normalized.market, "Kolar")
        self.assertEqual(normalized.modal_price, 27.0)  # converted per kg (2700 / 100)
        self.assertEqual(normalized.validation_status, ValidationStatus.VALIDATED)
        self.assertEqual(normalized.source, "Government of India (data.gov.in)")

        # Test malformed record rejection
        invalid_raw = {
            "market": "Kolar",
            "state": "Karnataka",
            "commodity": "Tomato",
            "modal_price": -500,  # Negative price
        }
        is_valid, reason = DataGovInIngestionService.validate_record(invalid_raw)
        self.assertFalse(is_valid)
        self.assertIn("Invalid modal price", reason)

    def test_data_freshness_classification(self):
        """Verify freshness classification produces FRESH, STALE, or UNAVAILABLE."""
        cache = MarketCacheService(ttl_seconds=1)
        self.assertEqual(cache.get_freshness_status(), DataFreshness.UNAVAILABLE)

        canonical_record = CanonicalMarketSnapshot(
            id="mandi-kolar",
            market="Kolar",
            district="Kolar",
            state="Karnataka",
            commodity="Tomato",
            date="2026-09-05",
            min_price=24.0,
            max_price=30.0,
            modal_price=27.0,
            arrival_quantity=1200.0,
            source_timestamp="2026-09-05",
            fetched_at="2026-09-05T12:00:00Z",
        )
        cache.set_canonical_records([canonical_record])
        self.assertEqual(cache.get_freshness_status(), DataFreshness.FRESH)

    def test_decision_engine_allocation_conservation(self):
        """Verify that total allocated quantity equals inventory quantity strictly."""
        farmer = FarmerProfile(
            id="test-farmer",
            name="Test Farmer",
            quantityKg=1000.0,
            activeCrop="Tomato",
        )
        markets = [
            MarketSnapshot(
                id="market-a",
                name="Market A",
                location="Kolar",
                distanceKm=20.0,
                pricePerKg=27.0,
                priceChangePct=0.0,
                arrivalsTonnes=1200.0,
                supplyPressure="HIGH",
                pressureScore=0.8,
                transportCostPerKg=2.0,
                updatedTimeAgo="Now",
                sparkline=[27.0],
                historicalPressure=[],
            ),
            MarketSnapshot(
                id="market-b",
                name="Market B",
                location="Bengaluru",
                distanceKm=50.0,
                pricePerKg=25.0,
                priceChangePct=0.0,
                arrivalsTonnes=800.0,
                supplyPressure="MEDIUM",
                pressureScore=0.5,
                transportCostPerKg=1.8,
                updatedTimeAgo="Now",
                sparkline=[25.0],
                historicalPressure=[],
            ),
        ]
        buyers = [
            BuyerProfile(
                id="buyer-b",
                name="Buyer B",
                category="Processor",
                cropRequired="Tomato",
                offeredPricePerKg=26.0,
                quantityRequiredKg=500.0,
                distanceKm=30.0,
                paymentTerms="Immediate",
                reliabilityScore=4.8,
                activeStatus="Active",
                transportCostEstimate=2.2,
            )
        ]

        plan = DecisionEngine.calculate_optimal_plan(farmer, markets, buyers)
        allocated_sum = sum(alloc.quantityKg for alloc in plan.allocations)

        self.assertEqual(round(allocated_sum, 1), round(farmer.quantityKg, 1))

        validation = DecisionEngine.validate_plan(plan, farmer, markets, buyers)
        self.assertTrue(validation["valid"])
        self.assertEqual(len(validation["issues"]), 0)

    def test_rag_trust_validation(self):
        """Verify RAG Trust validation filters low-confidence or unattributed signals."""
        untrusted_signal = RAGSignal(
            id="untrusted-1",
            signal="Random social media rumor about price spike",
            source="Unknown",
            source_url="invalid-url",
            published_at="Just Now",
            retrieved_at="Just Now",
            relevance=0.3,
            confidence=0.4,
            affected_market="market-a",
            affected_commodity="Tomato",
        )
        is_trusted, reason = RAGSignalService.validate_signal_trust(untrusted_signal)
        self.assertFalse(is_trusted)

        trusted_signal = RAGSignal(
            id="trusted-1",
            signal="APMC Kolar Official Advisory: Traffic clear on highway.",
            source="APMC Kolar Board",
            source_url="https://data.gov.in/resource/apmc-notices",
            published_at="Just Now",
            retrieved_at="Just Now",
            relevance=0.9,
            confidence=0.85,
            affected_market="market-a",
            affected_commodity="Tomato",
        )
        is_trusted, reason = RAGSignalService.validate_signal_trust(trusted_signal)
        self.assertTrue(is_trusted)
        self.assertEqual(reason, "TRUST_VALIDATED")

    def test_market_shock_replanning(self):
        """Verify that market shock recalculates allocation away from crashed market."""
        farmer = FarmerProfile(quantityKg=1000.0)
        m1 = MarketSnapshot(
            id="kolar-apmc",
            name="Kolar APMC Yard",
            location="Kolar",
            distanceKm=20.0,
            pricePerKg=27.0,
            priceChangePct=0.0,
            arrivalsTonnes=1200.0,
            supplyPressure="HIGH",
            pressureScore=0.8,
            transportCostPerKg=2.0,
            updatedTimeAgo="Now",
            sparkline=[27.0],
            historicalPressure=[],
        )
        m2 = MarketSnapshot(
            id="bengaluru-kr-market",
            name="Bengaluru K R Market",
            location="Bengaluru",
            distanceKm=45.0,
            pricePerKg=25.4,
            priceChangePct=1.2,
            arrivalsTonnes=900.0,
            supplyPressure="MEDIUM",
            pressureScore=0.5,
            transportCostPerKg=1.8,
            updatedTimeAgo="Now",
            sparkline=[25.4],
            historicalPressure=[],
        )
        normal_markets = [m1, m2]
        buyers = [
            BuyerProfile(
                id="buyer-b",
                name="Buyer B",
                category="Processor",
                cropRequired="Tomato",
                offeredPricePerKg=26.0,
                quantityRequiredKg=500.0,
                distanceKm=30.0,
                paymentTerms="Immediate",
                reliabilityScore=4.8,
                activeStatus="Active",
                transportCostEstimate=2.2,
            )
        ]

        normal_plan = DecisionEngine.calculate_optimal_plan(farmer, normal_markets, buyers)

        m1_shocked = m1.model_copy()
        m1_shocked.pricePerKg = 21.0
        m1_shocked.priceChangePct = -14.2
        m1_shocked.arrivalsTonnes = 2108.0
        m1_shocked.supplyPressure = "CRITICAL"
        m1_shocked.pressureScore = 1.41

        shocked_markets = [m1_shocked, m2]

        shocked_plan = DecisionEngine.calculate_optimal_plan(farmer, shocked_markets, buyers)

        normal_a_alloc = next((a.pct for a in normal_plan.allocations if a.destinationId == m1.id), 0)
        shocked_a_alloc = next((a.pct for a in shocked_plan.allocations if a.destinationId == m1_shocked.id), 0)

        self.assertLess(shocked_a_alloc, normal_a_alloc)

    def test_crop_service_normalization(self):
        """Verify deterministic crop master alias matching and dynamic title-casing."""
        from app.services.crop_service import CropService

        t1 = CropService.normalize_crop("tomatoes")
        self.assertEqual(t1.canonical_name, "Tomato")

        c1 = CropService.normalize_crop("green chilli")
        self.assertEqual(c1.canonical_name, "Chilli")

        p1 = CropService.normalize_crop(" POTATO ")
        self.assertEqual(p1.canonical_name, "Potato")

        d1 = CropService.normalize_crop("dragon fruit")
        self.assertEqual(d1.canonical_name, "Dragon Fruit")

    def test_missing_arrival_data_handling(self):
        """Verify that missing arrival quantity in raw payload sets arrival_quantity to None without inventing data."""
        raw_without_arrivals = {
            "market": "Madurai",
            "state": "Tamil Nadu",
            "commodity": "Onion",
            "modal_price": 3200,
        }
        normalized = DataGovInIngestionService.normalize_record(raw_without_arrivals)
        self.assertIsNone(normalized.arrival_quantity)
        self.assertFalse(normalized.has_arrival_data)
        self.assertEqual(normalized.pressure_category, "UNAVAILABLE")


if __name__ == "__main__":
    unittest.main()
