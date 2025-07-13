import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    await dbConnect();

    const users = await User.find({ role: "user" })
      .sort({ points: -1 })
      .limit(10)
      .select("name points");

    res.status(200).json({ users });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ msg: "Server error", error: err.message });
    }
    res.status(500).json({ msg: "Unknown error" });
  }
}
