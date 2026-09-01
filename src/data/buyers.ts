export interface BuyerProfile {
  id: string;
  name: string;
  category: string;
  cropRequired: string;
  offeredPricePerKg: number;
  quantityRequiredKg: number;
  distanceKm: number;
  paymentTerms: string;
  reliabilityScore: number; // e.g. 96%
  activeStatus: string;
  transportCostEstimate: number; // total ₹
  verifiedPartner: boolean;
}

export const sampleBuyers: BuyerProfile[] = [
  {
    id: "buyer-b",
    name: "Buyer B (FreshChoice Organics)",
    category: "Organic Retail Chain",
    cropRequired: "Tomato",
    offeredPricePerKg: 26.0,
    quantityRequiredKg: 800,
    distanceKm: 18,
    paymentTerms: "2 days",
    reliabilityScore: 96,
    activeStatus: "Active now",
    transportCostEstimate: 900,
    verifiedPartner: true,
  },
  {
    id: "buyer-a",
    name: "Buyer A (Kolar Processing Corp)",
    category: "Food Processing Plant",
    cropRequired: "Tomato",
    offeredPricePerKg: 27.0,
    quantityRequiredKg: 500,
    distanceKm: 32,
    paymentTerms: "1 day",
    reliabilityScore: 94,
    activeStatus: "Active 8 min ago",
    transportCostEstimate: 1400,
    verifiedPartner: true,
  },
  {
    id: "buyer-c",
    name: "Buyer C (Apex Hotel Consortium)",
    category: "Institutional Buyers",
    cropRequired: "Tomato",
    offeredPricePerKg: 28.5,
    quantityRequiredKg: 300,
    distanceKm: 45,
    paymentTerms: "Immediate Cash",
    reliabilityScore: 98,
    activeStatus: "Active 15 min ago",
    transportCostEstimate: 1800,
    verifiedPartner: true,
  },
];
