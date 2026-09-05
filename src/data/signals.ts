export interface ExternalSignal {
  id: string;
  type: "ROAD ALERT" | "FESTIVAL DEMAND" | "APMC UPDATE" | "WEATHER ALERT";
  title: string;
  source: string;
  timestamp: string;
  impactText: string;
  severity: "INFO" | "WARNING" | "CRITICAL" | "POSITIVE";
}

export const sampleExternalSignals: ExternalSignal[] = [
  {
    id: "sig-1",
    type: "ROAD ALERT",
    title: "Highway Disruption Near Kolar APMC",
    source: "Karnataka Traffic Intelligence",
    timestamp: "18 min ago",
    impactText: "+18 min transport delay on NH-75 route to Kolar APMC",
    severity: "WARNING",
  },
  {
    id: "sig-2",
    type: "FESTIVAL DEMAND",
    title: "Ganesh Chaturthi Demand Spike",
    source: "Bengaluru Retail Traders Guild",
    timestamp: "1 hour ago",
    impactText: "Expected +15% increase in tomato demand across city centers over next 48 hours",
    severity: "POSITIVE",
  },
  {
    id: "sig-3",
    type: "APMC UPDATE",
    title: "Market Operating Hours Extended",
    source: "APMC Yard Director Board",
    timestamp: "2 hours ago",
    impactText: "Kolar Yard accepting arrivals until 06:00 PM today instead of 04:00 PM",
    severity: "INFO",
  },
];
