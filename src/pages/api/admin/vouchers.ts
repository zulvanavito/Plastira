// src/pages/api/admin/vouchers.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Voucher from "@/models/Voucher";
import { verifyToken } from "@/utils/auth";
import formidable, { File } from "formidable";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR = path.join(process.cwd(), "/public/uploads/vouchers");

const ensureUploadDirExists = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
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
        await ensureUploadDirExists();

        const form = formidable({});

        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error("Formidable Error:", err);
            return res.status(500).json({ msg: "Gagal memproses form data" });
          }

          const imageFile = files.image?.[0] as File | undefined;

          let imageUrl: string | undefined;

          if (imageFile) {
            const newFileName = `${Date.now()}_${imageFile.originalFilename}`;
            const newFilePath = path.join(UPLOAD_DIR, newFileName);

            // --- PERUBAHAN DI SINI ---
            await fs.copyFile(imageFile.filepath, newFilePath);
            // --- BATAS PERUBAHAN ---

            imageUrl = `/uploads/vouchers/${newFileName}`;
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
        await ensureUploadDirExists();
        const form = formidable({});

        form.parse(req, async (err, fields, files) => {
          if (err) {
            return res.status(500).json({ msg: "Gagal memproses form" });
          }

          const { id, name, description, pointsRequired, stock } = fields;
          const imageFile = files.image?.[0] as File | undefined;

          const voucher = await Voucher.findById(id?.[0]);
          if (!voucher) {
            return res.status(404).json({ msg: "Voucher tidak ditemukan." });
          }

          voucher.name = name?.[0] || voucher.name;
          voucher.description = description?.[0] || voucher.description;
          voucher.pointsRequired =
            Number(pointsRequired?.[0]) || voucher.pointsRequired;
          voucher.stock = Number(stock?.[0]) || voucher.stock;

          if (imageFile) {
            if (voucher.imageUrl) {
              const oldImagePath = path.join(
                process.cwd(),
                "/public",
                voucher.imageUrl
              );
              try {
                await fs.unlink(oldImagePath);
              } catch (e) {
                console.log(
                  "Gagal menghapus gambar lama, mungkin sudah tidak ada:",
                  e
                );
              }
            }

            const newFileName = `${Date.now()}_${imageFile.originalFilename}`;
            const newFilePath = path.join(UPLOAD_DIR, newFileName);

            await fs.copyFile(imageFile.filepath, newFilePath);

            voucher.imageUrl = `/uploads/vouchers/${newFileName}`;
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
          const imagePath = path.join(
            process.cwd(),
            "/public",
            voucher.imageUrl
          );
          try {
            await fs.unlink(imagePath);
          } catch (e) {
            console.warn(`Gagal menghapus file gambar: ${imagePath}`, e);
          }
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
