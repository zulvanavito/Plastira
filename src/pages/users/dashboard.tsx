import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/ShadCN/card";
import { Button } from "@/components/ui/ShadCN/button";
import { toast } from "sonner";
import {
  LogOut,
  Star,
  Send,
  History,
  ChevronRight,
  CheckCircle,
  XCircle,
  Loader,
  Trash2,
  Trophy,
  Gift,
} from "lucide-react";
import Link from "next/link";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { lineChartOptions, pieChartOptions } from "@/utils/chartConfig";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { nanoid } from "nanoid";

// UI Components
import {
  NotificationBell,
  AppNotification,
} from "@/components/ui/Custom/NotificationBell";
import { RecentPickupCard } from "@/components/ui/Custom/RecentPickupCard";
import { DetailModal } from "@/components/ui/Custom/DetailModal";
import { BadgeDisplay } from "@/components/ui/Custom/BadgeDisplay";

// Types
import { Pickup as FullPickupType } from "@/utils/historyUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface User {
  id: string;
  name: string;
  points: number;
  badges: string[];
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [pickups, setPickups] = useState<FullPickupType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedPickup, setSelectedPickup] = useState<FullPickupType | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const [userResponse, pickupsResponse] = await Promise.all([
          axios.get<{ user: User }>("/api/user/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<{ pickups: FullPickupType[] }>("/api/pickups/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userResponse.data.user);
        const sortedPickups = pickupsResponse.data.pickups.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPickups(sortedPickups);
      } catch {
        toast.error("Sesi berakhir, silakan login kembali.");
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = io({
      path: "/api/socket",
    });

    socket.on("connect", () => {
      console.log("User connected to socket server.");
      try {
        const decoded: { id: string } = jwtDecode(token);
        socket.emit("join-room", decoded.id);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    });

    socket.on("pickup-status-update", (data) => {
      const newNotif: AppNotification = {
        id: nanoid(),
        message: data.message,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      if (data.status === "Verified") {
        toast.success(data.message);
      } else {
        toast.error(data.message, {
          description: data.reason ? `Alasan: ${data.reason}` : "",
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout berhasil!");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-center">Memuat Dashboard...</p>
      </div>
    );
  }
  if (!user) return null;

  const approvedCount = pickups.filter((p) => p.status === "Verified").length;
  const rejectedCount = pickups.filter((p) => p.status === "Rejected").length;
  const pendingCount = pickups.filter((p) => p.status === "Pending").length;

  const processChartData = () => {
    const labels: string[] = [];
    const data: number[] = [];
    const monthlyPickups: Record<string, number> = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      labels.push(
        d.toLocaleString("id-ID", { month: "short", year: "numeric" })
      );
    }

    pickups.forEach((p) => {
      const pickupDate = new Date(p.createdAt);
      if (pickupDate >= sixMonthsAgo) {
        const monthYear = pickupDate.toLocaleString("id-ID", {
          month: "short",
          year: "numeric",
        });
        monthlyPickups[monthYear] = (monthlyPickups[monthYear] || 0) + 1;
      }
    });

    labels.forEach((label) => {
      data.push(monthlyPickups[label] || 0);
    });

    return { labels, data };
  };

  const recentPickups = pickups.slice(0, 3);
  const { labels: lineChartLabels, data: lineChartDataPoints } =
    processChartData();

  const lineChartData = {
    labels: lineChartLabels,
    datasets: [
      {
        label: "Pickup",
        data: lineChartDataPoints,
        borderColor: "#23A4DA",
        backgroundColor: "rgba(35, 164, 218, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: ["Approved", "Rejected", "Pending"],
    datasets: [
      {
        data: [approvedCount, rejectedCount, pendingCount],
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Halo, {user.name}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Selamat datang di dashboard Anda.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-[#00A7ED] hover:text-white shadow-sm cursor-pointer"
            >
              <LogOut className="mr-2 size-4 cursor-pointer" />
              Logout
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <ActionCard
              href="/users/request"
              title="Buat Request Pickup Baru"
              description="Kumpulkan sampah plastikmu dan dapatkan poin."
              icon={<Send />}
              primary
            />
          </div>
          <div className="md:col-span-2">
            <Card className="h-full rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                  Aktivitas Terbaru
                </h3>
                <Link href="/users/history">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#23A4DA] cursor-pointer"
                  >
                    Lihat Semua
                    <ChevronRight className="ml-1 size-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {recentPickups.length > 0 ? (
                  recentPickups.map((pickup) => (
                    <RecentPickupCard
                      key={pickup._id}
                      pickup={pickup}
                      onClick={() => setSelectedPickup(pickup)}
                    />
                  ))
                ) : (
                  <p className="text-center text-sm text-slate-500 py-4">
                    Kamu belum punya request pickup.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <BadgeDisplay badges={user.badges} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <ActionCard
              href="/users/leaderboard"
              title="Papan Peringkat"
              description="Lihat peringkatmu di antara pahlawan lain."
              icon={<Trophy />}
            />
          </div>
          <div className="md:col-span-1">
            <ActionCard
              href="/users/redeem"
              title="Tukar Poin"
              description="Lihat & tukar hadiah menarik."
              icon={<Gift />} // Ganti dengan ikon yang sesuai
            />
          </div>
          <StatCard title="Total Poin" value={user.points} icon={<Star />} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800 h-full">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
                Aktivitas 6 Bulan Terakhir
              </h3>
              <div className="h-64">
                <Line
                  options={lineChartOptions as ChartOptions<"line">}
                  data={lineChartData}
                />
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800 h-full">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
                Komposisi Status
              </h3>
              <div className="h-64 flex justify-center items-center">
                <Pie options={pieChartOptions} data={pieChartData} />
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <ActionCard
              href="/users/history"
              title="Riwayat Pickup"
              description="Lihat semua transaksimu."
              icon={<History />}
            />
          </div>
          <div className="md:col-span-2">
            <Card className="h-full rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                Ringkasan Aktivitas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <MiniStat
                  title="Total Pickups"
                  value={pickups.length}
                  icon={<Trash2 />}
                />
                <MiniStat
                  title="Approved"
                  value={approvedCount}
                  icon={<CheckCircle className="text-green-500" />}
                />
                <MiniStat
                  title="Rejected"
                  value={rejectedCount}
                  icon={<XCircle className="text-red-500" />}
                />
                <MiniStat
                  title="Pending"
                  value={pendingCount}
                  icon={<Loader className="text-yellow-500" />}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
      <DetailModal
        pickup={selectedPickup}
        isOpen={!!selectedPickup}
        onClose={() => setSelectedPickup(null)}
      />
    </div>
  );
}

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => (
  <Card className="rounded-2xl bg-gradient-to-br from-[#23A4DA] to-[#0A4E6A] p-6 text-white shadow-lg">
    <div className="flex items-start justify-between">
      <p className="text-lg font-semibold">{title}</p>
      {icon}
    </div>
    <p className="mt-2 text-5xl font-bold">{value}</p>
  </Card>
);
const ActionCard = ({
  href,
  title,
  description,
  icon,
  primary = false,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  primary?: boolean;
}) => (
  <Link href={href} className="flex h-full">
    <Card
      className={`group w-full rounded-2xl bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-slate-800`}
    >
      <CardContent className="flex h-full flex-col justify-between p-6">
        <div>
          <div
            className={`mb-4 w-fit rounded-lg p-3 ${
              primary
                ? "bg-cyan-100 text-[#23A4DA]"
                : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {icon}
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
        <div className="mt-4 flex items-center text-sm font-semibold text-[#23A4DA]">
          <span>Lanjutkan</span>
          <ChevronRight className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

const MiniStat = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => (
  <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-700">
    <div className="flex items-center text-slate-500 dark:text-slate-400">
      {icon}
      <span className="ml-2 text-sm font-medium">{title}</span>
    </div>
    <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">
      {value}
    </p>
  </div>
);
