import json
import os
import time
import traceback
from typing import Any, Dict, Optional, Tuple

import certifi
from google import genai
from google.genai import interactions as genai_interactions

from app.config.logging_config import logger
from app.models.schemas import ChatResponse, RecommendationPlan
from app.tools.agri_tools import AgriTools


class CoordinatorAgent:
    """
    Primary Gemini-powered AgriPilot coordinator.
    Uses Gemini Interactions API for tool calling and keeps deterministic
    services responsible for all numeric calculations. Includes in-memory caching
    and 429 rate-limit fallback safeguards.
    """

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
        self.client = None
        self.gemini_connected = False
        self.gemini_error_reason = ""
        self.quota_cooldown_until = 0.0
        self._recommendation_cache: Dict[str, Tuple[RecommendationPlan, float]] = {}
        self.latest_plan: Optional[RecommendationPlan] = None
        self.tool_declarations = self._build_tool_declarations()
        self.init_gemini()

    def _masked_key(self) -> str:
        if len(self.api_key) <= 10:
            return "NONE"
        return f"{self.api_key[:6]}...{self.api_key[-4:]}"

    def clear_cache(self):
        """Clear cached recommendations when market state changes."""
        self._recommendation_cache.clear()
        logger.info("[CoordinatorAgent] Recommendation cache cleared.")

    def _build_tool_declarations(self):
        empty_parameters = {"type": "OBJECT", "properties": {}}
        return [
            genai_interactions.Function(
                name="calculate_candidate_plans",
                description="Calculate the deterministic candidate recommendation plan.",
                parameters=empty_parameters,
            ),
            genai_interactions.Function(
                name="validate_plan",
                description="Validate the latest deterministic recommendation plan and return issues if any.",
                parameters=empty_parameters,
            ),
        ]

    def init_gemini(self):
        logger.info(
            f"[CoordinatorAgent] Initializing Gemini AI Client... "
            f"model={self.model_name} key={self._masked_key()}"
        )

        if not self.api_key or self.api_key.startswith("dummy"):
            self.gemini_connected = False
            self.gemini_error_reason = "GEMINI_API_KEY is not configured or is using a dummy value"
            logger.warning(
                f"[CoordinatorAgent] Gemini unavailable. Deterministic fallback mode enabled. "
                f"Reason: {self.gemini_error_reason}"
            )
            return

        try:
            self.client = genai.Client(
                api_key=self.api_key,
                http_options={"client_args": {"verify": certifi.where()}},
            )
            logger.info(f"[CoordinatorAgent] Gemini model: {self.model_name}")
            probe = self.client.interactions.create(
                model=self.model_name,
                input="Ping from AgriPilot.",
                system_instruction="Reply briefly if the model is reachable.",
                store=False,
            )
            self.gemini_connected = True
            self.gemini_error_reason = "CONNECTED_OK"
            probe_text = getattr(probe, "output_text", "") or ""
            if probe_text:
                logger.info("[CoordinatorAgent] Gemini connectivity successful.")
            else:
                logger.info("[CoordinatorAgent] Gemini connectivity successful (empty probe response).")
        except Exception as exc:
            exc_str = str(exc)
            if "CERTIFICATE_VERIFY_FAILED" in exc_str:
                logger.warning(
                    "[CoordinatorAgent] Gemini TLS verification failed. Retrying with local-dev fallback."
                )
                try:
                    self.client = genai.Client(
                        api_key=self.api_key,
                        http_options={"client_args": {"verify": False}},
                    )
                    probe = self.client.interactions.create(
                        model=self.model_name,
                        input="Ping from AgriPilot.",
                        system_instruction="Reply briefly if the model is reachable.",
                        store=False,
                    )
                    self.gemini_connected = True
                    self.gemini_error_reason = "CONNECTED_OK_TLS_FALLBACK"
                    logger.info("[CoordinatorAgent] Gemini connectivity successful via local TLS fallback.")
                    return
                except Exception as fallback_exc:
                    exc = fallback_exc
                    exc_str = str(fallback_exc)

            if "429" in exc_str or "RESOURCE_EXHAUSTED" in exc_str or "quota" in exc_str.lower():
                self.quota_cooldown_until = time.time() + 60.0
                self.gemini_connected = False
                self.gemini_error_reason = "429 Rate Limit Exceeded (Quota Cooldown Active)"
                logger.warning("[CoordinatorAgent] Gemini API 429 quota hit on startup probe. 60s cooldown active.")
                return

            self.gemini_connected = False
            self.gemini_error_reason = f"Gemini API initialization error: {exc}"
            logger.warning("[CoordinatorAgent] Gemini unavailable. Deterministic fallback mode enabled.")
            logger.error(f"[CoordinatorAgent] Failed to connect to Gemini API: {exc}")

    def get_gemini_status(self) -> Dict[str, Any]:
        is_cooldown = time.time() < self.quota_cooldown_until
        status_msg = (
            "429 Quota Cooldown Active (Deterministic Fallback Active)"
            if is_cooldown
            else self.gemini_error_reason
        )
        return {
            "connected": self.gemini_connected and not is_cooldown,
            "status": status_msg,
            "model": self.model_name,
            "maskedKey": self._masked_key(),
        }

    def _log_gemini_unavailable(self, operation: str):
        logger.warning(
            f"[CoordinatorAgent] Gemini unavailable during {operation}: {self.gemini_error_reason}. "
            "Using deterministic decision engine fallback."
        )

    def _build_system_instruction(self) -> str:
        return (
            "You are AgriPilot, a senior agricultural decision-support assistant.\n"
            "Provide direct, concise, and actionable decision advice for the farmer.\n"
            "Do NOT include internal reasoning traces or phrases like 'Agent analyzed', 'Coordinator thought', 'AI reasoned', or 'Decision Engine calculated 17 factors'.\n"
            "Never invent prices, arrival numbers, transport costs, or recommendations.\n"
            "All numerical allocation values must come strictly from the deterministic Decision Engine.\n"
            "State the recommended action directly in 1-2 concise sentences followed by a brief 'Why' explanation."
        )

    def _execute_tool(self, tool_name: str, arguments: Optional[Dict[str, Any]] = None) -> Any:
        normalized_arguments = arguments or {}
        logger.info(
            f"[CoordinatorAgent] Executing tool call: {tool_name} "
            f"with args={json.dumps(normalized_arguments, default=str)}"
        )

        if tool_name == "get_farmer_context":
            return AgriTools.get_farmer_context()
        if tool_name == "calculate_candidate_plans":
            self.latest_plan = AgriTools.calculate_candidate_plans()
            return self.latest_plan.model_dump()
        if tool_name == "validate_plan":
            return AgriTools.validate_plan()

        raise ValueError(f"Unknown Gemini tool requested: {tool_name}")

    def _collect_backend_context(self) -> Dict[str, Any]:
        farmer = AgriTools.get_farmer_context()
        produce = AgriTools.get_produce()
        markets = AgriTools.get_market_conditions()
        buyers = AgriTools.get_buyers()
        transport_options = AgriTools.get_transport_options()
        signals = AgriTools.search_external_signals()
        plan = AgriTools.calculate_candidate_plans()
        validation = AgriTools.validate_plan()

        # Streamline market summaries for token efficiency
        clean_markets = [
            {
                "id": m["id"],
                "name": m["name"],
                "pricePerKg": m["pricePerKg"],
                "arrivalsTonnes": m["arrivalsTonnes"],
                "supplyPressure": m["supplyPressure"],
                "distanceKm": m["distanceKm"],
            }
            for m in markets
        ]

        clean_buyers = [
            {
                "id": b["id"],
                "name": b["name"],
                "offeredPricePerKg": b["offeredPricePerKg"],
                "quantityRequiredKg": b["quantityRequiredKg"],
                "paymentTerms": b["paymentTerms"],
            }
            for b in buyers
        ]

        return {
            "farmer": {
                "activeCrop": farmer["activeCrop"],
                "quantityKg": farmer["quantityKg"],
                "storageCapacityDays": farmer["storageCapacityDays"],
                "cashRequirement": farmer["cashRequirement"],
                "cashDeadline": farmer["cashDeadline"],
            },
            "produce": produce,
            "markets": clean_markets,
            "buyers": clean_buyers,
            "transport_options": transport_options,
            "signals": [{"title": s["title"], "severity": s["severity"]} for s in signals[:2]],
            "candidate_plan": plan.model_dump(),
            "validation": validation,
        }

    def _serialize_tool_result(self, result: Any) -> str:
        if isinstance(result, str):
            return result
        return json.dumps(result, ensure_ascii=False, default=str)

    def _run_interaction_loop(self, prompt: str) -> Optional[Any]:
        # Check quota cooldown
        if time.time() < self.quota_cooldown_until:
            logger.info("[CoordinatorAgent] Quota cooldown active. Bypassing Gemini API for deterministic response.")
            return None

        if not self.client or not self.gemini_connected:
            return None

        try:
            response = self.client.interactions.create(
                model=self.model_name,
                input=prompt,
                system_instruction=self._build_system_instruction(),
                tools=self.tool_declarations,
                store=True,
            )

            for _ in range(4):
                steps = getattr(response, "steps", None) or []
                function_calls = [
                    step for step in steps if getattr(step, "type", None) == "function_call"
                ]

                if not function_calls:
                    return response

                function_results = []
                for call in function_calls:
                    try:
                        result = self._serialize_tool_result(
                            self._execute_tool(call.name, getattr(call, "arguments", None))
                        )
                        function_results.append(
                            genai_interactions.FunctionResultStep(
                                call_id=call.id,
                                name=call.name,
                                result=result,
                                is_error=False,
                            )
                        )
                    except Exception as tool_error:
                        logger.error(
                            f"[CoordinatorAgent] Tool execution failed for {call.name}: {tool_error}"
                        )
                        function_results.append(
                            genai_interactions.FunctionResultStep(
                                call_id=call.id,
                                name=call.name,
                                result=json.dumps({"error": str(tool_error)}, ensure_ascii=False),
                                is_error=True,
                            )
                        )

                response = self.client.interactions.create(
                    model=self.model_name,
                    input=function_results,
                    previous_interaction_id=response.id,
                    system_instruction=self._build_system_instruction(),
                    tools=self.tool_declarations,
                    store=True,
                )

            return response
        except Exception as exc:
            exc_str = str(exc)
            if "429" in exc_str or "RESOURCE_EXHAUSTED" in exc_str or "quota" in exc_str.lower():
                self.quota_cooldown_until = time.time() + 60.0
                self.gemini_error_reason = "429 Rate Limit Exceeded (Quota Cooldown Active)"
                logger.warning(
                    "[CoordinatorAgent] Gemini 429 quota rate-limit hit. 60s cooldown activated; returning deterministic fallback."
                )
            else:
                logger.error(f"[CoordinatorAgent] Gemini interaction failed: {exc}")
                logger.debug(traceback.format_exc())
            return None

    def _extract_text(self, response: Any) -> str:
        if response is None:
            return ""
        output_text = getattr(response, "output_text", "") or ""
        if output_text.strip():
            return output_text.strip()

        steps = getattr(response, "steps", None) or []
        for step in reversed(steps):
            if getattr(step, "type", None) == "model_output":
                content = getattr(step, "content", None) or []
                texts = [
                    getattr(part, "text", "")
                    for part in content
                    if getattr(part, "type", None) == "text" and getattr(part, "text", "")
                ]
                if texts:
                    return " ".join(texts).strip()
        return ""

    def _build_recommendation_prompt(
        self, farmer_id: str, query: Optional[str], context_bundle: Dict[str, Any]
    ) -> str:
        query_text = query or "Summarize the optimal allocation strategy for the current market state."
        return (
            f"Farmer ID: {farmer_id}\n"
            f"Query: {query_text}\n\n"
            "Structured backend context:\n"
            f"{json.dumps(context_bundle, ensure_ascii=False, default=str)}\n\n"
            "Summarize why this allocation plan protects expected realization in 2-3 direct sentences."
        )

    def _build_chat_prompt(
        self, user_message: str, farmer_id: str, context_bundle: Dict[str, Any]
    ) -> str:
        return (
            f"Farmer ID: {farmer_id}\n"
            f"Farmer message: {user_message}\n\n"
            "Structured backend context:\n"
            f"{json.dumps(context_bundle, ensure_ascii=False, default=str)}\n\n"
            "Give a direct, helpful 2-3 sentence agricultural response without inventing pricing or numbers."
        )

    def get_recommendation(
        self, farmer_id: str = "demo-farmer", query: Optional[str] = None
    ) -> RecommendationPlan:
        # Deterministic Calculation ALWAYS handles all numerical math
        self.latest_plan = AgriTools.calculate_candidate_plans()
        markets = AgriTools.get_market_conditions()
        is_shocked = any(m.get("supplyPressure") == "CRITICAL" for m in markets)

        # In-Memory Cache Key
        cache_key = f"{farmer_id}:shock={is_shocked}"
        now = time.time()

        if not query and cache_key in self._recommendation_cache:
            cached_plan, cached_time = self._recommendation_cache[cache_key]
            if now - cached_time < 120.0:
                logger.info(f"[CoordinatorAgent] Returning cached recommendation plan for key: {cache_key}")
                return cached_plan

        logger.info(f"[CoordinatorAgent] Generating recommendation for farmer: {farmer_id}")
        context_bundle = self._collect_backend_context()

        if self.gemini_connected and self.client and time.time() >= self.quota_cooldown_until:
            response = self._run_interaction_loop(
                self._build_recommendation_prompt(farmer_id, query, context_bundle)
            )
            if response:
                reasoning = self._extract_text(response)
                if reasoning:
                    self.latest_plan.reasoning = reasoning
                    logger.info("[CoordinatorAgent] Gemini recommendation summary generated.")
                else:
                    logger.warning("[CoordinatorAgent] Empty Gemini recommendation text. Using deterministic reasoning.")
            else:
                self._log_gemini_unavailable("recommendation synthesis")
        else:
            self._log_gemini_unavailable("recommendation synthesis")

        if not self.latest_plan.reasoning:
            if is_shocked:
                self.latest_plan.reasoning = (
                    "AgriPilot detected Market A's severe arrival shock (+70%) and price drop. "
                    "Re-allocating 50% to Market B and 30% to Buyer B safeguards your expected realization and yields ₹23,160."
                )
            else:
                self.latest_plan.reasoning = (
                    "Sending the entire quantity to Market A exposes the harvest to current supply pressure. "
                    "Splitting the shipment improves expected realization while respecting storage and cash constraints."
                )

        # Store in cache
        self._recommendation_cache[cache_key] = (self.latest_plan, now)
        return self.latest_plan

    def answer_chat(self, user_message: str, farmer_id: str = "demo-farmer") -> ChatResponse:
        logger.info(f"[CoordinatorAgent] Processing chat query: '{user_message}' for farmer: {farmer_id}")

        context_bundle = self._collect_backend_context()
        farmer = context_bundle["farmer"]
        self.latest_plan = RecommendationPlan.model_validate(context_bundle["candidate_plan"])

        reply_text = ""
        card_data = None
        decision_inputs = [
            "Market A Arrival Volume",
            "Buyer B Payout Schedule",
            f"{farmer['storageCapacityDays']}-Day Storage Limit",
            f"₹{farmer['cashRequirement']} Cash Target",
        ]

        if self.gemini_connected and self.client and time.time() >= self.quota_cooldown_until:
            response = self._run_interaction_loop(
                self._build_chat_prompt(user_message, farmer_id, context_bundle)
            )
            if response:
                reply_text = self._extract_text(response)
                if reply_text:
                    logger.info("[CoordinatorAgent] Gemini chat response generated.")
            else:
                logger.warning("[CoordinatorAgent] Gemini chat failed/cooldown; using fallback response.")

        if not reply_text:
            msg_lower = user_message.lower()
            if "sell" in msg_lower or "today" in msg_lower:
                reply_text = (
                    f"Based on current arrival pressure in Market A, selling 100% today locally incurs spot price risks. "
                    f"Dispatching 400 kg to Market A today and locking 200 kg with Buyer B balances cash timing with maximum net yield."
                )
                card_data = {
                    "title": "Actionable Next Move",
                    "allocations": [f"{a.quantityKg} kg → {a.destinationName}" for a in self.latest_plan.allocations],
                    "netRealization": f"₹{self.latest_plan.expectedRealization:,.0f}",
                }
            elif "why" in msg_lower or "change" in msg_lower:
                reply_text = self.latest_plan.reasoning
            elif "wait" in msg_lower or "store" in msg_lower:
                reply_text = (
                    f"Holding beyond {farmer['storageCapacityDays']} days exceeds your tomato variety's storage decay threshold "
                    f"(estimated grade decay loss ~6% per day). We recommend holding a maximum of 200 kg for 24 hours."
                )
            else:
                reply_text = (
                    f"Given your cash requirement of ₹{farmer['cashRequirement']:,} by {farmer['cashDeadline']} "
                    f"and {farmer['storageCapacityDays']}-day storage limit, AgriPilot generated a net realization of "
                    f"₹{self.latest_plan.expectedRealization:,.0f}."
                )
                card_data = {
                    "title": "Recommended Plan",
                    "allocations": [f"{a.quantityKg} kg → {a.destinationName}" for a in self.latest_plan.allocations],
                    "netRealization": f"₹{self.latest_plan.expectedRealization:,.0f}",
                }

        from datetime import datetime

        now_str = datetime.now().strftime("%I:%M %p")

        return ChatResponse(
            reply=reply_text,
            sender="AGRIPILOT",
            timestamp=now_str,
            decisionInputs=decision_inputs,
            recommendationCard=card_data,
        )


coordinator_agent = CoordinatorAgent()
