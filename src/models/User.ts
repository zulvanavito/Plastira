import { Document, Schema, models, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  points: number;
  createdAt: Date;
  badges: string[];
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  badges: [{ type: String }],
});

export default models.User || model<IUser>("User", UserSchema);
