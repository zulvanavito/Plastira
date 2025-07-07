import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await dbConnect();
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Semua field harus diisi" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email sudah dipakai" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({
      msg: "Register berhasil",
      user: { name: user.name, email: user.email },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("REGISTER ERROR:", err.message);
      return res.status(500).json({ msg: "Server error", error: err.message });
    }
    res.status(500).json({ msg: "Terjadi kesalahan tak dikenal" });
  }
}
