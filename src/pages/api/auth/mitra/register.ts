import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Mitra from "@/models/Mitra";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await dbConnect();

    const { companyName, email, password, industry } = req.body;

    if (!companyName || !email || !password || !industry) {
      return res.status(400).json({ msg: "Semua field wajib diisi" });
    }

    const existing = await Mitra.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await Mitra.create({
      companyName,
      email,
      password: hashed,
      industry,
    });

    res.status(201).json({ msg: "Registrasi mitra berhasil!" });
  } catch (err: unknown) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: "Terjadi kesalahan saat registrasi" });
  }
}
