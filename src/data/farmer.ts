export interface FarmerProfile {
  name: string;
  farmName: string;
  location: string;
  region: string;
  activeCrop: string;
  quantityKg: number;
  harvestTiming: string;
  storageCapacityDays: number;
  cashRequirement: number;
  cashDeadline: string;
  rating: number;
}

export const initialFarmerContext: FarmerProfile = {
  name: "Arjun Patel",
  farmName: "Malur Agro Farm",
  location: "Malur, Kolar District",
  region: "Karnataka, India",
  activeCrop: "Tomato",
  quantityKg: 800,
  harvestTiming: "Tomorrow (Sept 2)",
  storageCapacityDays: 2,
  cashRequirement: 50000,
  cashDeadline: "Friday (Sept 5)",
  rating: 4.9,
};
