import mongoose, { Document, Schema, models, model } from "mongoose";

export interface IPickup extends Document {
  userId: mongoose.Types.ObjectId;
  plasticType: string;
  weightKg: number;
  status: "Pending" | "Verified";
  location: {
    lat: number;
    lng: number;
  };
  pointsAwarded: number;
  createdAt: Date;
  verifiedAt?: Date;
  rejectionNote?: string;
}

const PickupSchema: Schema<IPickup> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  plasticType: { type: String, required: true },
  weightKg: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending",
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  pointsAwarded: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
  rejectionNote: {
    type: String,
    default: "-",
  },
});

export default models.Pickup || model<IPickup>("Pickup", PickupSchema);
