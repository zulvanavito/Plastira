import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  await dbConnect();
  try {
    // Ambil semua user, pilih hanya nama dan poin, urutkan dari poin tertinggi, dan batasi 100 teratas
    const users = await User.find({})
      .select("name points")
      .sort({ points: -1 })
      .limit(100);

    res.status(200).json({ leaderboard: users });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
}
