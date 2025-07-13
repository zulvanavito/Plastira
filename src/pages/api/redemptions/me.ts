import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Redemption, { IRedemption } from "@/models/Redemption";
import { IVoucher } from "@/models/Voucher";
import { verifyToken } from "@/utils/auth";

type PopulatedRedemption = Omit<IRedemption, "voucherId"> & {
  voucherId: Pick<IVoucher, "name">;
};

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
    if (!user?.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const redemptions = (await Redemption.find({ userId: user.id })
      .sort({ redeemedAt: -1 })
      .populate("voucherId", "name")) as PopulatedRedemption[];

    const transformedRedemptions = redemptions.map((r) => ({
      _id: r._id,
      voucher: {
        name: r.voucherId.name,
      },
      pointsSpent: r.pointsSpent,
      redeemedAt: r.redeemedAt,
    }));

    res.status(200).json({ redemptions: transformedRedemptions });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Server error", error: (err as Error).message });
  }
}

