import json
import os
import traceback
from typing import Any, Dict, Optional

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
    services responsible for all numeric calculations.
    """

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
        self.client = None
        self.gemini_connected = False
        self.gemini_error_reason = ""
        self.latest_plan: Optional[RecommendationPlan] = None
        self.tool_declarations = self._build_tool_declarations()
        self.init_gemini()

    def _masked_key(self) -> str:
        if len(self.api_key) <= 10:
            return "NONE"
        return f"{self.api_key[:6]}...{self.api_key[-4:]}"

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
                f"[CoordinatorAgent] Gemini unavailable. Demo fallback mode enabled. "
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
            if "CERTIFICATE_VERIFY_FAILED" in str(exc):
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
                    probe_text = getattr(probe, "output_text", "") or ""
                    if probe_text:
                        logger.info(
                            "[CoordinatorAgent] Gemini connectivity successful via local TLS fallback."
                        )
                    else:
                        logger.info(
                            "[CoordinatorAgent] Gemini connectivity successful via local TLS fallback (empty probe response)."
                        )
                    return
                except Exception as fallback_exc:
                    exc = fallback_exc

            self.gemini_connected = False
            self.gemini_error_reason = f"Gemini API initialization error: {exc}"
            logger.warning("[CoordinatorAgent] Gemini unavailable. Demo fallback mode enabled.")
            logger.error(f"[CoordinatorAgent] Failed to connect to Gemini API: {exc}")
            logger.debug(traceback.format_exc())

    def get_gemini_status(self) -> Dict[str, Any]:
        return {
            "connected": self.gemini_connected,
            "status": self.gemini_error_reason,
            "model": self.model_name,
            "maskedKey": self._masked_key(),
        }

    def _log_gemini_unavailable(self, operation: str):
        logger.warning(
            f"[CoordinatorAgent] Gemini unavailable during {operation}: {self.gemini_error_reason}. "
            "Using deterministic fallback."
        )

    def _build_system_instruction(self) -> str:
        return (
            "You are AgriPilot, a senior agricultural decision assistant.\n"
            "Use the structured backend context and deterministic tools for any recomputation.\n"
            "Never invent prices, quantities, transport costs, or recommendations.\n"
            "Numeric reasoning must come from the deterministic backend.\n"
            "After tool results are available, answer in 2-3 concise sentences.\n"
            "Do not reveal chain-of-thought."
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
        return {
            "farmer": farmer,
            "produce": produce,
            "markets": markets,
            "buyers": buyers,
            "transport_options": transport_options,
            "signals": signals,
            "candidate_plan": plan.model_dump(),
            "validation": validation,
        }

    def _serialize_tool_result(self, result: Any) -> str:
        if isinstance(result, str):
            return result
        return json.dumps(result, ensure_ascii=False, default=str)

    def _run_interaction_loop(self, prompt: str) -> Optional[Any]:
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

            for _ in range(6):
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
                        logger.debug(traceback.format_exc())
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

            logger.warning(
                "[CoordinatorAgent] Gemini interaction exceeded the maximum tool-call loop count."
            )
            return response
        except Exception as exc:
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
        query_text = query or "Generate the best recommendation for the current farmer context."
        return (
            f"Farmer ID: {farmer_id}\n"
            f"User query: {query_text}\n\n"
            "Use the structured backend context below.\n"
            "If a replanning check is needed, call calculate_candidate_plans and validate_plan.\n"
            "If validation fails, explain the issue briefly and recommend replanning.\n"
            "After the tools are resolved, summarize the recommendation in concise language only."
            f"\n\nStructured backend context:\n{json.dumps(context_bundle, ensure_ascii=False, default=str)}"
        )

    def _build_chat_prompt(
        self, user_message: str, farmer_id: str, context_bundle: Dict[str, Any]
    ) -> str:
        return (
            f"Farmer ID: {farmer_id}\n"
            f"Farmer message: {user_message}\n\n"
            "Use the structured backend context below.\n"
            "If you need to recompute the plan, call calculate_candidate_plans and validate_plan.\n"
            "Never invent pricing or allocation numbers.\n"
            "Give a direct, helpful 2-3 sentence response."
            f"\n\nStructured backend context:\n{json.dumps(context_bundle, ensure_ascii=False, default=str)}"
        )

    def get_recommendation(
        self, farmer_id: str = "demo-farmer", query: Optional[str] = None
    ) -> RecommendationPlan:
        logger.info(f"[CoordinatorAgent] Generating recommendation for farmer: {farmer_id}")

        context_bundle = self._collect_backend_context()
        self.latest_plan = AgriTools.calculate_candidate_plans()
        validation = context_bundle["validation"]
        markets = context_bundle["markets"]
        buyers = context_bundle["buyers"]
        signals = context_bundle["signals"]

        logger.info(
            f"[CoordinatorAgent] Tool results retrieved: "
            f"{len(markets)} markets, {len(buyers)} buyers, {len(signals)} signals."
        )
        logger.info(
            f"[CoordinatorAgent] Decision Engine optimization complete: "
            f"Net Realization ₹{self.latest_plan.expectedRealization:,.0f}"
        )

        if not validation.get("valid", False):
            logger.warning(
                f"[CoordinatorAgent] Deterministic validation reported issues: {validation.get('issues', [])}"
            )

        if self.gemini_connected and self.client:
            response = self._run_interaction_loop(
                self._build_recommendation_prompt(farmer_id, query, context_bundle)
            )
            if response:
                reasoning = self._extract_text(response)
                if reasoning:
                    self.latest_plan.reasoning = reasoning
                    logger.info("[CoordinatorAgent] Gemini recommendation summary generated.")
                else:
                    logger.warning(
                        "[CoordinatorAgent] Gemini recommendation response was empty. Using deterministic reasoning."
                    )
            else:
                self._log_gemini_unavailable("recommendation synthesis")
        else:
            self._log_gemini_unavailable("recommendation synthesis")

        if not self.latest_plan.reasoning:
            self.latest_plan.reasoning = (
                "Deterministic plan selected the best available allocations using current market pressure, "
                "buyer demand, and the farmer's cash and storage constraints."
            )

        return self.latest_plan

    def answer_chat(self, user_message: str, farmer_id: str = "demo-farmer") -> ChatResponse:
        logger.info(f"[CoordinatorAgent] Processing chat query: '{user_message}' for farmer: {farmer_id}")

        context_bundle = self._collect_backend_context()
        farmer = context_bundle["farmer"]
        self.latest_plan = RecommendationPlan.model_validate(context_bundle["candidate_plan"])
        validation = context_bundle["validation"]

        reply_text = ""
        card_data = None
        decision_inputs = [
            "Market A Arrival Volume",
            "Buyer B Payout Schedule",
            f"{farmer['storageCapacityDays']}-Day Storage Limit",
            f"₹{farmer['cashRequirement']} Cash Target",
        ]

        if not validation.get("valid", False):
            logger.warning(
                f"[CoordinatorAgent] Plan validation issues detected during chat: {validation.get('issues', [])}"
            )

        if self.gemini_connected and self.client:
            response = self._run_interaction_loop(
                self._build_chat_prompt(user_message, farmer_id, context_bundle)
            )
            if response:
                reply_text = self._extract_text(response)
                if reply_text:
                    logger.info("[CoordinatorAgent] Gemini chat response generated.")
                else:
                    logger.warning("[CoordinatorAgent] Gemini chat response was empty.")
            else:
                logger.error("[CoordinatorAgent] Gemini chat interaction failed; using fallback response.")
        else:
            self._log_gemini_unavailable("chat response generation")

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
