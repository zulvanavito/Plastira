import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import { verifyToken } from "@/utils/auth";
import Voucher from "@/models/Voucher";
import Redemption from "@/models/Redemption";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    await dbConnect();
    const tokenPayload = verifyToken(req);
    if (tokenPayload.role !== "mitra") {
      return res.status(403).json({ msg: "Akses ditolak." });
    }

    // 1. Cari semua voucher yang disponsori oleh mitra ini
    const sponsoredVouchers = await Voucher.find({
      sponsoredBy: tokenPayload.id,
    });
    const sponsoredVoucherIds = sponsoredVouchers.map((v) => v._id);

    // 2. Cari semua history penukaran untuk voucher-voucher tersebut
    const redemptions = await Redemption.find({
      voucherId: { $in: sponsoredVoucherIds },
    });

    // 3. Hitung statistik
    const totalPointsSpent = redemptions.reduce(
      (sum, r) => sum + r.pointsSpent,
      0
    );
    const totalRedemptions = redemptions.length;

    // Asumsi: 10 poin = 1 kg sampah (dari logika verifikasi pickup)
    const plasticCollectedKg = totalPointsSpent / 10;

    // Hitung berapa user unik yang redeem
    const uniqueUserIds = new Set(redemptions.map((r) => r.userId.toString()));
    const citizensHelped = uniqueUserIds.size;

    res.status(200).json({
      stats: {
        plasticCollectedKg,
        totalRedemptions,
        citizensHelped,
      },
      vouchers: sponsoredVouchers,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown server error.";
    res
      .status(500)
      .json({
        msg: "Gagal mengambil data dashboard mitra.",
        error: errorMessage,
      });
  }
}
