export interface PlanAllocation {
  destinationId: string;
  destinationName: string;
  quantityKg: number;
  pct: number;
  pricePerKg: number;
  expectedRevenue: number;
  transportCost: number;
  netRealization: number;
  badgeText: string;
}

export interface RecommendationPlan {
  situationText: string;
  allocations: PlanAllocation[];
  expectedRealization: number;
  baselineComparison: number; // sell everything local
  pctImprovement: number;
  downsideAvoided: number;
  spoilageEstimatePct: number;
  transportCostTotal: number;
  reasoning: string;
}

export const baselineRecommendation: RecommendationPlan = {
  situationText: "High supply pressure detected in Market A",
  allocations: [
    {
      destinationId: "market-a",
      destinationName: "Market A (Kolar APMC)",
      quantityKg: 400,
      pct: 50,
      pricePerKg: 27.0,
      expectedRevenue: 10800,
      transportCost: 1050,
      netRealization: 9750,
      badgeText: "Immediate Dispatch",
    },
    {
      destinationId: "buyer-b",
      destinationName: "Buyer B (FreshChoice Organics)",
      quantityKg: 200,
      pct: 25,
      pricePerKg: 26.0,
      expectedRevenue: 5200,
      transportCost: 450,
      netRealization: 4750,
      badgeText: "Guaranteed 2-Day Payment",
    },
    {
      destinationId: "hold",
      destinationName: "Hold in Storage (Malur Warehouse)",
      quantityKg: 200,
      pct: 25,
      pricePerKg: 28.5, // projected tomorrow price
      expectedRevenue: 5700,
      transportCost: 0,
      netRealization: 5700,
      badgeText: "Hold 24 Hours",
    },
  ],
  expectedRealization: 21840,
  baselineComparison: 20140, // sell all 800kg at market A with pressure
  pctImprovement: 8.4,
  downsideAvoided: 2400,
  spoilageEstimatePct: 2.5,
  transportCostTotal: 1500,
  reasoning: "Sending the entire quantity to Market A exposes the harvest to current supply pressure. Splitting the shipment improves expected realization while respecting the storage and cash constraints.",
};

export const shockRecommendation: RecommendationPlan = {
  situationText: "CRITICAL supply pressure & price drop detected in Market A (-14.2%)",
  allocations: [
    {
      destinationId: "market-b",
      destinationName: "Market B (Bengaluru Central)",
      quantityKg: 400,
      pct: 50,
      pricePerKg: 25.4,
      expectedRevenue: 10160,
      transportCost: 750,
      netRealization: 9410,
      badgeText: "Re-routed Priority",
    },
    {
      destinationId: "buyer-b",
      destinationName: "Buyer B (FreshChoice Organics)",
      quantityKg: 240,
      pct: 30,
      pricePerKg: 26.0,
      expectedRevenue: 6240,
      transportCost: 540,
      netRealization: 5700,
      badgeText: "Contract Volume Increase",
    },
    {
      destinationId: "market-a",
      destinationName: "Market A (Kolar APMC)",
      quantityKg: 160,
      pct: 20,
      pricePerKg: 21.0,
      expectedRevenue: 3360,
      transportCost: 420,
      netRealization: 2940,
      badgeText: "Reduced Allocation",
    },
  ],
  expectedRealization: 23160,
  baselineComparison: 16800, // if sold all at crashed Market A ₹21/kg
  pctImprovement: 37.8,
  downsideAvoided: 6360,
  spoilageEstimatePct: 1.8,
  transportCostTotal: 1710,
  reasoning: "AgriPilot automatically detected Market A's severe arrival shock (+70%) and price drop. Re-allocating 50% to Market B and 30% to Buyer B safeguards your expected realization and yields ₹23,160.",
};
