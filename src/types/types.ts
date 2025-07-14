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

export interface Stats {
  total: number;
  verified: number;
  rejected: number;
  pending: number;
  pointsTotal: number;
}
export interface Voucher {
  _id: string;
  name: string;
  description: string;
  pointsRequired: number;
  imageUrl?: string;
  stock: number;
  sponsoredBy?: {
    _id: string;
    companyName: string;
  };
}

export interface RedemptionHistory {
  _id: string;
  name: string;
  description: string;
  pointsSpent: number;
  redeemedAt: string;
}

export interface UserProfile {
  name: string;
  points: number;
}
