export interface Pickup {
  _id: string;
  plasticType: string;
  weightKg: number;
  status: "Pending" | "Verified" | "Rejected";
  pointsAwarded: number;
  createdAt: string;
  location: { lat: number; lng: number };
  userId: { _id: string; name: string; email: string };
  rejectionNote?: string;
}
