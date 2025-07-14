import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import Mitra from "@/models/Mitra";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  await dbConnect();
  const { email, password } = req.body;

  const mitra = await Mitra.findOne({ email });
  if (!mitra)
    return res.status(400).json({ msg: "Email mitra tidak ditemukan." });

  const isMatch = await bcrypt.compare(password, mitra.password);
  if (!isMatch) return res.status(400).json({ msg: "Password salah." });

  const token = jwt.sign(
    { id: mitra._id, role: mitra.role, name: mitra.companyName },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return res.status(200).json({
    msg: "Login mitra berhasil",
    token,
  });
}
