import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Voucher from "@/models/Voucher";
import { verifyToken } from "@/utils/auth";
import formidable, { File } from "formidable";
import { put, del } from "@vercel/blob";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const tokenPayload = verifyToken(req);
    if (tokenPayload.role !== "admin") {
      return res.status(403).json({ msg: "Akses ditolak. Anda bukan admin." });
    }
  } catch {
    return res.status(401).json({ msg: "Token tidak valid atau tidak ada." });
  }

  const form = formidable({});

  switch (req.method) {
    case "GET":
      try {
        const vouchers = await Voucher.find({}).sort({ createdAt: -1 });
        res.status(200).json({ vouchers });
      } catch {
        res.status(500).json({ msg: "Gagal mengambil data voucher" });
      }
      break;

    case "POST":
      try {
        form.parse(req, async (err, fields, files) => {
          if (err) {
            return res.status(500).json({ msg: "Gagal memproses form data" });
          }

          const imageFile = files.image?.[0] as File | undefined;
          let imageUrl: string | undefined;

          if (imageFile) {
            const fileBuffer = fs.readFileSync(imageFile.filepath);

 voucher-new
            const blob = await put(
              `vouchers/${Date.now()}-${imageFile.originalFilename}`,
              fileBuffer,
              {
                access: "public",
              }
            );

          
            await fs.copyFile(imageFile.filepath, newFilePath);
           
 main

            imageUrl = blob.url;
          }

          const newVoucherData = {
            name: fields.name?.[0],
            description: fields.description?.[0],
            pointsRequired: Number(fields.pointsRequired?.[0]),
            stock: Number(fields.stock?.[0]),
            imageUrl: imageUrl,
            isActive: true,
          };

          const newVoucher = new Voucher(newVoucherData);
          await newVoucher.save();

          res
            .status(201)
            .json({ msg: "Voucher berhasil dibuat", voucher: newVoucher });
        });
      } catch (error) {
        console.error("POST Voucher Error:", error);
        res.status(500).json({ msg: "Gagal membuat voucher" });
      }
      break;

    case "PUT":
      try {
        form.parse(req, async (err, fields, files) => {
          if (err) {
            return res.status(500).json({ msg: "Gagal memproses form" });
          }

          const { id } = fields;
          const imageFile = files.image?.[0] as File | undefined;

          const voucher = await Voucher.findById(id?.[0]);
          if (!voucher) {
            return res.status(404).json({ msg: "Voucher tidak ditemukan." });
          }

          if (fields.name) voucher.name = fields.name[0];
          if (fields.description) voucher.description = fields.description[0];
          if (fields.pointsRequired)
            voucher.pointsRequired = Number(fields.pointsRequired[0]);
          if (fields.stock) voucher.stock = Number(fields.stock[0]);

          if (imageFile) {
            if (voucher.imageUrl) {
              await del(voucher.imageUrl).catch((e) =>
                console.warn("Gagal hapus gambar lama:", e)
              );
            }

 voucher-new
            const fileBuffer = fs.readFileSync(imageFile.filepath);

            const blob = await put(
              `vouchers/${Date.now()}-${imageFile.originalFilename}`,
              fileBuffer,
              {
                access: "public",
              }
            );

            voucher.imageUrl = blob.url;

            const newFileName = `${Date.now()}_${imageFile.originalFilename}`;
            const newFilePath = path.join(UPLOAD_DIR, newFileName);

            await fs.copyFile(imageFile.filepath, newFilePath);

            voucher.imageUrl = `/uploads/vouchers/${newFileName}`;
 main
          }

          await voucher.save();
          res.status(200).json({ msg: "Voucher berhasil diperbarui", voucher });
        });
      } catch {
        res.status(500).json({ msg: "Gagal memperbarui voucher" });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.query;

        if (!id || typeof id !== "string") {
          return res.status(400).json({ msg: "Voucher ID diperlukan." });
        }

        const voucher = await Voucher.findById(id);
        if (!voucher) {
          return res.status(404).json({ msg: "Voucher tidak ditemukan." });
        }

        if (voucher.imageUrl) {
          await del(voucher.imageUrl).catch((e) =>
            console.warn(`Gagal hapus file dari Blob: ${voucher.imageUrl}`, e)
          );
        }

        await Voucher.findByIdAndDelete(id);

        res.status(200).json({ msg: "Voucher berhasil dihapus." });
      } catch {
        res.status(500).json({ msg: "Gagal menghapus voucher" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
