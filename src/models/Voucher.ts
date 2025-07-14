import mongoose, { Document, Schema, models, model } from "mongoose";

export interface IVoucher extends Document {
  _id: string;
  name: string;
  description: string;
  pointsRequired: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
  sponsoredBy?: mongoose.Types.ObjectId;
}

const VoucherSchema: Schema<IVoucher> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pointsRequired: { type: Number, required: true },
  stock: { type: Number, default: 999 },
  isActive: { type: Boolean, default: true },
  imageUrl: { type: String, required: false },
  sponsoredBy: { type: Schema.Types.ObjectId, ref: "Mitra", required: false },
});

export default models.Voucher || model<IVoucher>("Voucher", VoucherSchema);
