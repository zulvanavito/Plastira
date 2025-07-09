export interface Pickup {
  _id: string;
  plasticType: string;
  weightKg: number;
  status: "Pending" | "Verified" | "Rejected";
  pointsAwarded: number;
  createdAt: string;
  rejectionNote?: string;
  location: { lat: number; lng: number };
  userId: { _id: string; name: string; email: string };
}

export const filterPickups = (pickups: Pickup[], status: string): Pickup[] => {
  if (status === "All") {
    return pickups;
  }
  return pickups.filter((p) => p.status === status);
};

export const ITEMS_PER_PAGE_HISTORY = 4;
export const ITEMS_PER_PAGE_ADMIN = 6;
