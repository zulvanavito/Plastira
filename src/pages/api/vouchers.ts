import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Voucher from "@/models/Voucher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    await dbConnect();
    const vouchers = await Voucher.find({ isActive: true })
      .sort({ pointsRequired: 1 })
      .populate("sponsoredBy", "companyName");

    res.status(200).json({ vouchers });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
}
