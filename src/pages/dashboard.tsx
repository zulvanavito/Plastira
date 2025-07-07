import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface User {
  name: string;
  role: string;
  points: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await axios.get<{ user: User }>("/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md text-center shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Halo, {user.name} 👋</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            Total Plastic Points:{" "}
            <span className="font-semibold text-green-600">{user.points}</span>
          </p>

          <div className="space-y-2">
            <Button onClick={() => router.push("/request")} className="w-full">
              🚮 Kirim Pickup Request
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/history")}
              className="w-full"
            >
              📄 Lihat Riwayat Pickup
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full"
            >
              🚪 Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
