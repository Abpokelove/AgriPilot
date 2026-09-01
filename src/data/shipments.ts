export interface ShipmentItem {
  id: string;
  cropName: string;
  destination: string;
  quantityKg: number;
  status: "IN TRANSIT" | "DELIVERED" | "PICKUP PENDING" | "SCHEDULED";
  etaMinutes: number;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  dispatchTime: string;
  expectedDelivery: string;
  timeline: { title: string; time: string; completed: boolean }[];
}

export const sampleShipments: ShipmentItem[] = [
  {
    id: "SH-9042",
    cropName: "Tomato",
    destination: "Buyer B (FreshChoice Organics)",
    quantityKg: 600,
    status: "IN TRANSIT",
    etaMinutes: 42,
    vehicleNumber: "TN 74 XX 1234",
    driverName: "Ramesh K.",
    driverPhone: "+91 98451 22910",
    dispatchTime: "08:30 AM",
    expectedDelivery: "09:45 AM",
    timeline: [
      { title: "Order Confirmed", time: "07:45 AM", completed: true },
      { title: "Pickup Completed", time: "08:30 AM", completed: true },
      { title: "In Transit (Highway NH-75)", time: "08:45 AM", completed: true },
      { title: "Arriving at Destination Yard", time: "09:35 AM", completed: false },
      { title: "Delivered & Payment Triggered", time: "09:45 AM", completed: false },
    ],
  },
  {
    id: "SH-9038",
    cropName: "Chilli",
    destination: "Market A (Kolar APMC)",
    quantityKg: 250,
    status: "DELIVERED",
    etaMinutes: 0,
    vehicleNumber: "KA 07 Y 8821",
    driverName: "Suresh P.",
    driverPhone: "+91 97412 11094",
    dispatchTime: "Yesterday 04:00 PM",
    expectedDelivery: "Yesterday 05:15 PM",
    timeline: [
      { title: "Order Confirmed", time: "03:15 PM", completed: true },
      { title: "Pickup Completed", time: "04:00 PM", completed: true },
      { title: "In Transit", time: "04:20 PM", completed: true },
      { title: "Arriving", time: "05:00 PM", completed: true },
      { title: "Delivered & Settlement Received", time: "05:15 PM", completed: true },
    ],
  },
];
