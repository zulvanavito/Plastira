import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Pickup from "@/models/Pickup";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const admin = verifyToken(req);
  if (admin.role !== "admin") {
    return res.status(403).json({ msg: "Akses ditolak. Bukan admin." });
  }

  if (req.method === "PUT") {
    const { id } = req.body;

    const pickup = await Pickup.findById(id);
    if (!pickup) return res.status(404).json({ msg: "Pickup tidak ditemukan" });

    if (pickup.status !== "Pending") {
      return res.status(400).json({ msg: "Pickup sudah diverifikasi" });
    }

    const points = pickup.weightKg * 10;

    pickup.status = "Verified";
    pickup.pointsAwarded = points;
    await pickup.save();

    await User.findByIdAndUpdate(pickup.userId, {
      $inc: { points },
    });

    return res
      .status(200)
      .json({ msg: "Pickup berhasil diverifikasi", points });
  }

  if (req.method === "GET") {
    const pickups = await Pickup.find().populate("userId", "name email");
    return res.status(200).json({ pickups });
  }

  return res.status(405).end(); // Method Not Allowed
}
