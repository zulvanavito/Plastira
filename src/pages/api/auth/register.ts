import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await dbConnect();

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Semua field wajib diisi" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const allowedAdminEmails = ["admin@gmail.com"];
    const role = allowedAdminEmails.includes(email) ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(201).json({ msg: "Registrasi berhasil", token });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ msg: "Server error", error: err.message });
    }
    res.status(500).json({ msg: "Unknown error" });
  }
}
