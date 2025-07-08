interface Pickup {
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

export const filterPickupsByStatus = (
  pickups: Pickup[],
  status: string
): Pickup[] => {
  if (status === "All") {
    return pickups;
  }
  return pickups.filter((p) => p.status === status);
};
