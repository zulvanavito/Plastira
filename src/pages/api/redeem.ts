import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Voucher from "@/models/Voucher";
import Redemption from "@/models/Redemption";
import { verifyToken } from "@/utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    await dbConnect();
    const tokenPayload = verifyToken(req);
    const { voucherId } = req.body;
    if (!voucherId)
      return res.status(400).json({ msg: "Voucher ID tidak ditemukan." });

    const user = await User.findById(tokenPayload.id);
    const voucher = await Voucher.findById(voucherId);

    if (!user) return res.status(404).json({ msg: "User tidak ditemukan." });
    if (!voucher)
      return res.status(404).json({ msg: "Voucher tidak ditemukan." });
    if (voucher.stock <= 0)
      return res.status(400).json({ msg: "Stok voucher habis." });
    if (user.points < voucher.pointsRequired)
      return res.status(400).json({ msg: "Poin Anda tidak cukup." });

    user.points -= voucher.pointsRequired;
    voucher.stock -= 1;
    await user.save();
    await voucher.save();

    await Redemption.create({
      userId: user._id,
      voucherId: voucher._id,
      pointsSpent: voucher.pointsRequired,
    });

    res
      .status(200)
      .json({ msg: `Selamat! ${voucher.name} berhasil ditukarkan.` });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Server error", error: (err as Error).message });
  }
}
