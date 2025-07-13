import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/ShadCN/button";
import { ArrowLeft, Crown, Medal, Trophy } from "lucide-react";
import { Card } from "@/components/ui/ShadCN/card";

interface LeaderboardUser {
  _id: string;
  name: string;
  points: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get<{ leaderboard: LeaderboardUser[] }>(
          "/api/leaderboard"
        );
        // Pastikan API mengembalikan array, jika tidak, set ke array kosong
        if (Array.isArray(res.data.leaderboard)) {
          setLeaderboard(res.data.leaderboard);
        } else {
          setLeaderboard([]); // Fallback ke array kosong jika data tidak valid
          toast.error("Gagal memuat data peringkat dengan format yang benar.");
        }
      } catch {
        toast.error("Gagal memuat papan peringkat");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Papan Peringkat
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Lihat para pahlawan lingkungan dengan poin tertinggi!
            </p>
          </div>
          <Link href="/users/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-slate-800 cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm"
            >
              <ArrowLeft className="mr-2 size-4" />
              Kembali
            </Button>
          </Link>
        </header>

        {loading ? (
          <p className="text-center text-slate-500">Memuat peringkat...</p>
        ) : (
          <div className="space-y-4">
            {leaderboard.length === 0 ? (
              <p className="text-center text-slate-500">
                Belum ada data peringkat.
              </p>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {leaderboard.map((user, index) => (
                  <LeaderboardItem
                    key={user._id}
                    user={user}
                    rank={index + 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Komponen untuk setiap item di leaderboard
const LeaderboardItem = ({
  user,
  rank,
}: {
  user: LeaderboardUser;
  rank: number;
}) => {
  const rankIcons = [
    <Crown key="rank-1" className="text-yellow-400" />,
    <Medal key="rank-2" className="text-slate-400" />,
    <Trophy key="rank-3" className="text-amber-600" />,
  ];

  const rankColors = [
    "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-600",
    "border-slate-400 bg-slate-100 dark:bg-slate-700/20 dark:border-slate-600",
    "border-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700",
  ];

  return (
    <Card
      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border-2 ${
        rank < 4 ? rankColors[rank - 1] : "border-transparent"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-lg font-bold w-8 text-center text-slate-600 dark:text-slate-300">
          {rank < 4 ? rankIcons[rank - 1] : rank}
        </div>
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          {user.name}
        </p>
      </div>
      <p className="text-lg font-bold text-[#23A4DA]">{user.points} Poin</p>
    </Card>
  );
};
