export interface MarketSnapshot {
  id: string;
  name: string;
  location: string;
  distanceKm: number;
  pricePerKg: number;
  priceChangePct: number;
  arrivalsTonnes: number;
  supplyPressure: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  transportCostPerKg: number;
  updatedTimeAgo: string;
  sparkline: number[];
  historicalPressure: { time: string; price: number; arrivals: number }[];
}

export const baselineMarkets: MarketSnapshot[] = [
  {
    id: "market-a",
    name: "Market A (Kolar APMC)",
    location: "Kolar APMC Yard",
    distanceKm: 24,
    pricePerKg: 27.0,
    priceChangePct: 8.2,
    arrivalsTonnes: 1240,
    supplyPressure: "HIGH",
    transportCostPerKg: 2.62, // ₹2,100 total for 800kg approx
    updatedTimeAgo: "3 min ago",
    sparkline: [24.5, 25.0, 25.8, 26.2, 27.0],
    historicalPressure: [
      { time: "04:00", price: 28.5, arrivals: 750 },
      { time: "06:00", price: 28.0, arrivals: 900 },
      { time: "08:00", price: 27.5, arrivals: 1100 },
      { time: "10:00", price: 27.0, arrivals: 1240 },
    ],
  },
  {
    id: "market-b",
    name: "Market B (Bengaluru Central)",
    location: "K R Market Yard",
    distanceKm: 42,
    pricePerKg: 25.0,
    priceChangePct: 2.1,
    arrivalsTonnes: 820,
    supplyPressure: "MEDIUM",
    transportCostPerKg: 1.87, // ₹1,500 total
    updatedTimeAgo: "5 min ago",
    sparkline: [24.0, 24.2, 24.8, 25.0, 25.0],
    historicalPressure: [
      { time: "04:00", price: 24.5, arrivals: 700 },
      { time: "06:00", price: 24.8, arrivals: 750 },
      { time: "08:00", price: 25.0, arrivals: 800 },
      { time: "10:00", price: 25.0, arrivals: 820 },
    ],
  },
  {
    id: "market-c",
    name: "Market C (Hosur Wholesale)",
    location: "Hosur Border Terminal",
    distanceKm: 38,
    pricePerKg: 23.0,
    priceChangePct: -4.7,
    arrivalsTonnes: 1450,
    supplyPressure: "HIGH",
    transportCostPerKg: 2.25,
    updatedTimeAgo: "8 min ago",
    sparkline: [25.5, 24.8, 24.0, 23.5, 23.0],
    historicalPressure: [
      { time: "04:00", price: 25.0, arrivals: 1100 },
      { time: "06:00", price: 24.2, arrivals: 1250 },
      { time: "08:00", price: 23.6, arrivals: 1380 },
      { time: "10:00", price: 23.0, arrivals: 1450 },
    ],
  },
  {
    id: "market-d",
    name: "Market D (Tumakuru Hub)",
    location: "Tumakuru Grain & Produce",
    distanceKm: 65,
    pricePerKg: 28.5,
    priceChangePct: 4.5,
    arrivalsTonnes: 610,
    supplyPressure: "LOW",
    transportCostPerKg: 3.80,
    updatedTimeAgo: "12 min ago",
    sparkline: [26.0, 26.8, 27.5, 28.0, 28.5],
    historicalPressure: [
      { time: "04:00", price: 26.5, arrivals: 500 },
      { time: "06:00", price: 27.2, arrivals: 540 },
      { time: "08:00", price: 28.0, arrivals: 580 },
      { time: "10:00", price: 28.5, arrivals: 610 },
    ],
  },
];

// Market Shock State: Market A arrivals increase by +70% (1,240 -> 2,108 tonnes), price drops to ₹21.0/kg, CRITICAL pressure.
export const shockMarkets: MarketSnapshot[] = [
  {
    ...baselineMarkets[0],
    pricePerKg: 21.0,
    priceChangePct: -14.2,
    arrivalsTonnes: 2108, // +70%
    supplyPressure: "CRITICAL",
    updatedTimeAgo: "Just now (SHOCK DETECTED)",
    sparkline: [27.0, 26.0, 24.5, 22.5, 21.0],
    historicalPressure: [
      ...baselineMarkets[0].historicalPressure,
      { time: "10:15", price: 21.0, arrivals: 2108 },
    ],
  },
  {
    ...baselineMarkets[1],
    pricePerKg: 25.4, // Slight diversion demand increase
    priceChangePct: 3.8,
    arrivalsTonnes: 890,
    supplyPressure: "MEDIUM",
    updatedTimeAgo: "1 min ago",
  },
  baselineMarkets[2],
  baselineMarkets[3],
];
