import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

export const verifyToken = (req: NextApiRequest) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new Error("Token tidak ditemukan");

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Format token tidak valid");

  return jwt.verify(token, process.env.JWT_SECRET!);
};
