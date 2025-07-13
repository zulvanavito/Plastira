import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Voucher, { IVoucher } from "@/models/Voucher"; // <-- Impor IVoucher
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

    if (!voucherId) {
      return res.status(400).json({ msg: "Voucher ID tidak ditemukan." });
    }

    const user = await User.findById(tokenPayload.id);
    // --- PERBAIKAN UTAMA DI SINI ---
    // Kita secara eksplisit memberitahu TypeScript bahwa hasil dari query ini adalah IVoucher
    const voucher: IVoucher | null = await Voucher.findById(voucherId);

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan." });
    }
    if (!voucher) {
      return res.status(404).json({ msg: "Voucher tidak ditemukan." });
    }
    // Sekarang TypeScript tahu properti di bawah ini ada
    if (voucher.stock <= 0) {
      return res.status(400).json({ msg: "Stok voucher habis." });
    }
    if (user.points < voucher.pointsRequired) {
      return res.status(400).json({ msg: "Poin Anda tidak cukup." });
    }

    // Menggunakan .updateOne() untuk operasi yang lebih efisien
    await User.updateOne(
      { _id: user._id },
      { $inc: { points: -voucher.pointsRequired } }
    );
    await Voucher.updateOne({ _id: voucher._id }, { $inc: { stock: -1 } });

    // Membuat riwayat penukaran dengan data yang benar
    await Redemption.create({
      userId: user._id,
      voucherId: voucher._id,
      pointsSpent: voucher.pointsRequired,
      name: voucher.name,
      description: voucher.description,
    });

    res
      .status(200)
      .json({ msg: `Selamat! ${voucher.name} berhasil ditukarkan.` });
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan yang tidak diketahui.";
    console.error("API Error /api/redeem:", errorMessage);
    res.status(500).json({ msg: "Server error", error: errorMessage });
  }
}
