import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetServer & {
    server: NetServer & {
      io?: ServerIO;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const socketHandler = (_req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log("🚀 Socket.IO server is starting...");
    
    // Ambil http server dari response
    const httpServer: NetServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    // Simpan instance io di server biar bisa dipake lagi
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`🔗 New connection: ${socket.id}`);
      socket.on("join-room", (userId: string) => {
        socket.join(userId);
        console.log(`🙋 User ${socket.id} joined room: ${userId}`);
      });
      socket.on("disconnect", () => {
        console.log(`👋 User disconnected: ${socket.id}`);
      });
    });

  } else {
    console.log("✅ Socket.IO server already running.");
  }
  res.end();
};

export default socketHandler;