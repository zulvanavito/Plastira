import mongoose, { Document, Schema, models, model } from "mongoose";

export interface IRedemption extends Document {
  userId: mongoose.Types.ObjectId;
  voucherId: mongoose.Types.ObjectId;
  pointsSpent: number;
  redeemedAt: Date;
  voucherName: string;
  voucherDescription: string;
}

const RedemptionSchema: Schema<IRedemption> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  voucherId: { type: Schema.Types.ObjectId, ref: "Voucher", required: true },
  pointsSpent: { type: Number, required: true },
  redeemedAt: { type: Date, default: Date.now },
  voucherName: { type: String, required: true },
  voucherDescription: { type: String, required: true },
});

export default models.Redemption ||
  model<IRedemption>("Redemption", RedemptionSchema);
