import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Pickup from "@/models/Pickup";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";
import { Server as ServerIO } from "socket.io";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: {
      io?: ServerIO;
    };
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await dbConnect();

    const tokenPayload = verifyToken(req);

    const user = await User.findById(tokenPayload.id);
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const { plasticType, weightKg, location } = req.body;

    if (!plasticType || !weightKg || !location?.lat || !location?.lng) {
      return res.status(400).json({ msg: "Semua field harus diisi" });
    }

    const pickup = await Pickup.create({
      userId: user.id,
      plasticType,
      weightKg,
      location,
    });

    const io = res.socket.server.io;
    if (io) {
      const notificationData = {
        message: `Ada permintaan pickup baru dari ${user.name}.`,

        pickupId: pickup._id,
        createdAt: new Date().toISOString(),
      };
      io.emit("new-pickup-request", notificationData);
    }

    res.status(201).json({ msg: "Pickup request terkirim", pickup });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("PICKUP POST ERROR:", err.message);
      return res.status(500).json({ msg: "Server error", error: err.message });
    }
    res.status(500).json({ msg: "Unknown error" });
  }
}
