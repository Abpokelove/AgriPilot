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
    title: "Kolar APMC Yard arrivals increased by 31%",
    category: "MARKET",
    description: "Kolar APMC recorded sudden inflow of 1,240 tonnes of produce from neighboring districts.",
    impact: "Moderate downward pressure on spot price",
  },
  {
    id: "act-2",
    timestamp: "09:43 AM",
    title: "AgriPilot recalculated expected realization",
    category: "DECISION",
    description: "Algorithm evaluated allocation options across regional mandis and direct buyers.",
    impact: "Optimization score: 94/100",
  },
  {
    id: "act-3",
    timestamp: "09:44 AM",
    title: "Alternative buyer contract identified (Buyer B)",
    category: "BUYER",
    description: "FreshChoice Organics issued active buying order for 800 kg grade A produce at ₹26/kg.",
    impact: "Provides cash stability for Friday requirement",
  },
  {
    id: "act-4",
    timestamp: "09:45 AM",
    title: "Recommendation plan updated",
    category: "DECISION",
    description: "Plan generated: 400 kg Kolar APMC Yard, 200 kg Buyer B, 200 kg Warehouse Hold.",
    impact: "+8.4% realization compared to single mandi sell-all",
  },
  {
    id: "act-5",
    timestamp: "09:46 AM",
    title: "Farmer notification dispatched",
    category: "SYSTEM",
    description: "SMS and app push notification delivered to farmer profile.",
    impact: "Delivered in 0.4 seconds",
  },
];

export const shockActivityLog: ActivityLog = {
  id: "act-shock-1",
  timestamp: "Just Now",
  title: "⚡ CRITICAL SUPPLY SURGE: Kolar APMC arrivals jumped +70%",
  category: "ALERT",
  description: "Massive inflow spike detected at Kolar APMC Yard (2,108 tonnes). Spot price dropped to ₹21.0/kg.",
  impact: "AgriPilot auto-rerouted allocation: Kolar APMC (20%), Bengaluru K R Market (50%), Buyer B (30%). Realization protected at ₹23,160.",
  isShockEvent: true,
};
