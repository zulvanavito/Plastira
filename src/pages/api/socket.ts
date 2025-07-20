// Impor http.Server buat tipe yang lebih spesifik
import { Server as HttpServer } from "http";
import { Socket } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";

// Tipe ini sekarang lebih akurat, jadi TypeScript ngerti
type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: HttpServer & {
      io?: ServerIO;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const socketHandler = (
  _req: NextApiRequest,
  res: NextApiResponseWithSocket
) => {
  if (res.socket.server.io) {
    console.log("✅ Socket.IO server already running.");
  } else {
    console.log("🚀 Socket.IO server is starting...");
    // Sekarang udah nggak perlu `as any` lagi, lebih clean
    const io = new ServerIO(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
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
  }
  res.end();
};

export default socketHandler;
