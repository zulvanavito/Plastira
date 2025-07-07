import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import { verifyToken } from "@/utils/auth";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    await dbConnect();
    const decoded = verifyToken(req);
    const user = await User.findById(decoded.id).select("name role points");

    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    res.status(200).json({ user });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ msg: "Server error", error: err.message });
    }
    res.status(500).json({ msg: "Unknown error" });
  }
}
