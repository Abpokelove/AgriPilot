export interface HarvestItem {
  id: string;
  cropName: string;
  variety: string;
  quantityKg: number;
  harvestDate: string;
  storageLimitDays: number;
  status: "READY" | "GROWING" | "HARVESTED" | "DISPATCHED";
  estimatedValue: number;
  fieldLocation: string;
}

export const initialHarvestList: HarvestItem[] = [
  {
    id: "h-1",
    cropName: "Tomato",
    variety: "Sahu Hybrid Grade A",
    quantityKg: 800,
    harvestDate: "Tomorrow",
    storageLimitDays: 2,
    status: "READY",
    estimatedValue: 21600,
    fieldLocation: "Plot 3A - Malur North",
  },
  {
    id: "h-2",
    cropName: "Onion",
    variety: "Nasik Red Heavy",
    quantityKg: 500,
    harvestDate: "In 5 days",
    storageLimitDays: 7,
    status: "GROWING",
    estimatedValue: 14500,
    fieldLocation: "Plot 1B - Malur East",
  },
  {
    id: "h-3",
    cropName: "Chilli",
    variety: "Guntur Teja",
    quantityKg: 250,
    harvestDate: "Today",
    storageLimitDays: 4,
    status: "READY",
    estimatedValue: 18750,
    fieldLocation: "Plot 2C - Greenhouse",
  },
];
