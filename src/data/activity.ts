export interface ActivityLog {
  id: string;
  timestamp: string;
  title: string;
  category: "MARKET" | "SYSTEM" | "BUYER" | "DECISION" | "ALERT";
  description: string;
  impact: string;
  isShockEvent?: boolean;
}

export const initialActivityLogs: ActivityLog[] = [
  {
    id: "act-1",
    timestamp: "09:42 AM",
    title: "Market A arrivals increased by 31%",
    category: "MARKET",
    description: "Kolar APMC recorded sudden inflow of 1,240 tonnes of tomatoes from neighboring districts.",
    impact: "Moderate downward pressure on spot price",
  },
  {
    id: "act-2",
    timestamp: "09:43 AM",
    title: "AgriPilot recalculated expected realization",
    category: "DECISION",
    description: "Algorithm evaluated 4 allocation combinations across 3 markets and 2 direct buyers.",
    impact: "Optimization score: 94/100",
  },
  {
    id: "act-3",
    timestamp: "09:44 AM",
    title: "Alternative buyer identified (Buyer B)",
    category: "BUYER",
    description: "FreshChoice Organics issued active buying order for 800 kg grade A tomatoes at ₹26/kg.",
    impact: "Provides cash stability for Friday requirement",
  },
  {
    id: "act-4",
    timestamp: "09:45 AM",
    title: "Recommendation updated",
    category: "DECISION",
    description: "Plan generated: 400 kg Market A, 200 kg Buyer B, 200 kg Hold.",
    impact: "+8.4% realization compared to local sell-all",
  },
  {
    id: "act-5",
    timestamp: "09:46 AM",
    title: "Farmer notification dispatched",
    category: "SYSTEM",
    description: "SMS and app push notification delivered to Arjun Patel.",
    impact: "Delivered in 0.4 seconds",
  },
];

export const shockActivityLog: ActivityLog = {
  id: "act-shock-1",
  timestamp: "Just Now",
  title: "⚡ CRITICAL SUPPLY SURGE: Market A arrivals jumped +70%",
  category: "ALERT",
  description: "Massive inflow spike detected at Market A (2,108 tonnes). Spot price crashed from ₹27.0/kg to ₹21.0/kg.",
  impact: "AgriPilot auto-rerouted allocation: Market A (20%), Market B (50%), Buyer B (30%). Realization protected at ₹23,160 (+₹1,320 gain over static plan).",
  isShockEvent: true,
};
