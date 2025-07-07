import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Pickup from "@/models/Pickup";
import { verifyToken } from "@/utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    await dbConnect();

    const user = verifyToken(req); // token harus ada id
    if (!user?.id) return res.status(401).json({ msg: "Unauthorized" });

    const pickups = await Pickup.find({ userId: user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ pickups });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ msg: "Server error", error: err.message });
    }
    res.status(500).json({ msg: "Unknown error" });
  }
}
