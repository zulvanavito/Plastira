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

const socketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log("🚀 Socket.IO server is starting...");
    const io = new ServerIO(res.socket.server as NetServer, {
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
  } else {
    console.log("✅ Socket.IO server already running.");
  }
  res.end();
};

export default socketHandler;
