import mongoose, { Document, Schema, models, model } from "mongoose";

export interface IRedemption extends Document {
  userId: mongoose.Types.ObjectId;
  voucherId: mongoose.Types.ObjectId;
  pointsSpent: number;
  redeemedAt: Date;
}

const RedemptionSchema: Schema<IRedemption> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  voucherId: { type: Schema.Types.ObjectId, ref: "Voucher", required: true },
  pointsSpent: { type: Number, required: true },
  redeemedAt: { type: Date, default: Date.now },
});

export default models.Redemption ||
  model<IRedemption>("Redemption", RedemptionSchema);
