import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/ShadCN/card";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/ShadCN/button";

interface User {
  name: string;
  points: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await axios.get<{ users: User[] }>("/api/leaderboard");
        setUsers(data.users);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Papan Peringkat
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Lihat siapa pahlawan lingkungan dengan poin tertinggi!
          </p>
        </header>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy /> Top 10 Pahlawan Lingkungan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Memuat...</p>
            ) : (
              <ol className="space-y-4">
                {users.map((user, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-slate-100 p-4 dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold">#{index + 1}</span>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <span className="font-bold text-lg text-yellow-500">
                      {user.points} Poin
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
        <div className="mt-8 text-center">
          <Link href="/users/dashboard">
            <Button className="cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm" variant="outline">Kembali ke Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
