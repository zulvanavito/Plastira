import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Redemption from "@/models/Redemption";
import { verifyToken } from "@/utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method Not Allowed" });
  }

  try {
    await dbConnect();
    const user = verifyToken(req);
    if (!user?.id) return res.status(401).json({ msg: "Unauthorized" });

    const redemptions = await Redemption.find({ userId: user.id })
      .sort({ redeemedAt: -1 })
      .lean();

    const transformedRedemptions = redemptions.map((r) => ({
      _id: r._id ? r._id.toString() : "",
      name: r.voucherName,
      description: r.voucherDescription,
      pointsSpent: r.pointsSpent,
      redeemedAt: (r.redeemedAt as Date).toISOString(),
    }));

    res.status(200).json({ redemptions: transformedRedemptions });
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan yang tidak diketahui.";
    res.status(500).json({ msg: "Server error", error: errorMessage });
  }
}
