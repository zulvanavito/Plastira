import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Pickup from "@/models/Pickup";
import { verifyToken } from "@/utils/auth"; // helper dari sebelumnya

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await dbConnect();

    const user = verifyToken(req); // Ambil user dari token

    const { plasticType, weightKg, location } = req.body;

    if (!plasticType || !weightKg || !location?.lat || !location?.lng) {
      return res.status(400).json({ msg: "Semua field harus diisi" });
    }

    const pickup = await Pickup.create({
      userId: user.id,
      plasticType,
      weightKg,
      location,
    });

    res.status(201).json({ msg: "Pickup request terkirim", pickup });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("PICKUP POST ERROR:", err.message);
      return res.status(500).json({ msg: "Server error", error: err.message });
    }
    res.status(500).json({ msg: "Unknown error" });
  }
}
