import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: "user" | "admin" | "mitra";
  iat?: number;
  exp?: number;
}

export const verifyToken = (req: NextApiRequest): TokenPayload => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("Token tidak ditemukan");

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Token kosong");

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  return decoded as TokenPayload;
};
