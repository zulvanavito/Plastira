import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import router from "next/router";
import dynamic from "next/dynamic";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Komponen & Utilitas
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RejectModal } from "@/components/ui/RejectModal";
import { DetailModal } from "@/components/ui/DetailModal";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { FilterControls } from "@/components/ui/FilterControls";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { handleExportCSV, handleExportExcel } from "@/utils/exportUtils";
import { handleVerify } from "@/utils/verifyUtils";
import { handleReject } from "@/utils/rejectUtils";
import { filterPickups, Pickup } from "@/utils/historyUtils";
import { LogOut, Download } from "lucide-react";
import { Stats } from "@/types/types";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import {
  NotificationBell,
  AppNotification,
} from "@/components/ui/NotificationBell";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AllPickupsMap = dynamic(
  () =>
    import("@/components/ui/AllPickupsMap").then((mod) => mod.AllPickupsMap),
  {
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-lg bg-slate-200"></div>
    ),
    ssr: false,
  }
);

const ITEMS_PER_PAGE = 6;

export default function AdminPickupPage() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    verified: 0,
    rejected: 0,
    pending: 0,
    pointsTotal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get<{ pickups: Pickup[]; stats: Stats }>(
        "/api/pickups/verify",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sortedPickups = res.data.pickups.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPickups(sortedPickups);
      setStats(res.data.stats);
    } catch {
      toast.error("Gagal mengambil data pickup");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = filterPickups(pickups, filterStatus);
  const paginatedPickups = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout Berhasil!");
    router.push("/login");
  };
  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const chartData = {
    labels: ["Verified", "Pending", "Rejected"],
    datasets: [
      {
        data: [stats.verified, stats.pending, stats.rejected],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };
  const barChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
  };

  useEffect(() => {
    const socket = io({
      path: "/api/socket",
    });

    socket.on("connect", () => {
      console.log("Admin connected to socket server.");
    });

    socket.on("new-pickup-request", (data) => {
      console.log("New pickup request received:", data);
      toast.info(data.message);

      const newNotif: AppNotification = {
        id: nanoid(),
        message: data.message,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      fetchData();
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchData]);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Kelola dan monitor semua aktivitas pickup.
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
              className="bg-white"
            >
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total Pickup" value={stats.total} color="blue" />
          <StatCard title="Verified" value={stats.verified} color="green" />
          <StatCard title="Pending" value={stats.pending} color="yellow" />
          <StatCard title="Rejected" value={stats.rejected} color="red" />
          <StatCard
            title="Total Poin"
            value={stats.pointsTotal}
            color="indigo"
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Statistik Status Pickup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar data={chartData} options={barChartOptions} />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Komposisi Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Pie data={chartData} options={pieChartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold">Daftar Pickup</h3>
            <div className="flex flex-wrap items-center gap-2">
              <FilterControls
                currentStatus={filterStatus}
                onFilterChange={handleFilterChange}
              />
              <Button
                variant="outline"
                onClick={() => handleExportExcel(pickups)}
              >
                <Download className="mr-2 size-4" />
                Excel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportCSV(pickups)}
              >
                <Download className="mr-2 size-4" />
                CSV
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="col-span-full text-center py-10">Loading...</p>
            ) : paginatedPickups.length === 0 ? (
              <p className="col-span-full text-center py-10">Tidak ada data.</p>
            ) : (
              paginatedPickups.map((p, index) => (
                <HistoryCard
                  key={p._id}
                  pickup={p}
                  index={index}
                  isAdmin={true}
                  onShowDetail={() => {
                    setSelectedPickup(p);
                    setShowDetail(true);
                  }}
                  onVerify={() => handleVerify(p._id, fetchData)}
                  onReject={() => {
                    setSelectedPickup(p);
                    setShowReject(true);
                  }}
                />
              ))
            )}
          </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Card>

        <Card className="mt-8 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Peta Sebaran Lokasi Pickup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full rounded-lg">
              <AllPickupsMap pickups={filtered} />
            </div>
          </CardContent>
        </Card>

        <DetailModal
          pickup={selectedPickup}
          isOpen={showDetail}
          onClose={() => {
            setSelectedPickup(null);
            setShowDetail(false);
          }}
          isAdmin={true}
        />
        <RejectModal
          isOpen={showReject}
          onClose={() => setShowReject(false)}
          reason={rejectReason}
          setReason={setRejectReason}
          onConfirm={() =>
            handleReject(
              selectedPickup,
              rejectReason,
              fetchData,
              setShowReject,
              setRejectReason
            )
          }
        />
      </div>
    </div>
  );
}

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => {
  const colorClasses: Record<string, string> = {
    blue: "border-blue-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
    red: "border-red-500",
    indigo: "border-indigo-500",
  };

  return (
    <Card className={`rounded-2xl shadow-sm border-l-4 ${colorClasses[color]}`}>
      <CardContent className="p-4">
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-white">
          {value}
        </p>
      </CardContent>
    </Card>
  );
};
