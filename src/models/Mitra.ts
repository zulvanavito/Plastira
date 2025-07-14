import { Document, Schema, models, model } from "mongoose";

export interface IMitra extends Document {
  companyName: string;
  email: string;
  password: string;
  role: "mitra";
  industry: string;
  createdAt: Date;
}

const MitraSchema: Schema = new Schema<IMitra>({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["mitra"], default: "mitra" },
  industry: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Mitra || model<IMitra>("Mitra", MitraSchema);
