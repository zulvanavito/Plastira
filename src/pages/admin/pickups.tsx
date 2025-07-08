import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import dynamic from "next/dynamic";
import { handleExportCSV, handleExportExcel } from "@/utils/exportUtils";
import { handleVerify } from "@/utils/verifyUtils";
import { handleReject } from "@/utils/rejectUtils";
import { filterPickupsByStatus } from "@/utils/filterUtils"; // <-- BARU: Import fungsi filter
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ScriptableContext,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import clsx from "clsx";
import router from "next/router";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Map = dynamic(() => import("@/components/ui/map"), {
  loading: () => <p className="text-center">Memuat peta...</p>,
  ssr: false,
});

interface Pickup {
  _id: string;
  plasticType: string;
  weightKg: number;
  status: "Pending" | "Verified" | "Rejected";
  pointsAwarded: number;
  createdAt: string;
  location: { lat: number; lng: number };
  userId: { _id: string; name: string; email: string };
  rejectionNote?: string;
}

interface Stats {
  total: number;
  verified: number;
  rejected: number;
  pending: number;
  pointsTotal: number;
}

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

  /* --------------------------- Data Fetcher --------------------------- */
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get<{ pickups: Pickup[]; stats: Stats }>(
        "/api/pickups/verify",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPickups(res.data.pickups);
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

  // --- BARU: Gunakan fungsi dari file terpisah ---
  const filteredPickups = filterPickupsByStatus(pickups, filterStatus);

  /* --------------------------- Render --------------------------- */
  const statCard = (title: string, value: number, color: string) => (
    <Card className="border-l-4" style={{ borderColor: color }}>
      <CardContent className="py-3 text-center">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold" style={{ color }}>
          {value}
        </p>
      </CardContent>
    </Card>
  );

  const chartData = {
    labels: ["Verified", "Pending", "Rejected"],
    datasets: [
      {
        label: "Total Berdasarkan Status",
        data: [stats.verified, stats.pending, stats.rejected],
        backgroundColor: ["#4ade80", "#facc15", "#f87171"],
        borderColor: ["#4ade80", "#facc15", "#f87171"],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      delay: (context: ScriptableContext<"bar">) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default") {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center min-h-screen gap-6 bg-gray-50 px-4 pb-20">
      {/* Heading */}
      <div className="text-center mt-6">
        <h1 className="text-3xl font-bold mb-2 text-bl text-black">
          Panel Admin
        </h1>
        <p className="text-gray-500 max-w-xl">
          Kelola permintaan pickup, verifikasi, atau tolak sesuai kondisi di
          lapangan.
        </p>
      </div>

      {/* Statistic Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-6xl">
        {statCard("Total Pickup", stats.total, "#38bdf8")}
        {statCard("Verified", stats.verified, "#4ade80")}
        {statCard("Pending", stats.pending, "#facc15")}
        {statCard("Rejected", stats.rejected, "#f87171")}
        {statCard("Total Poin", stats.pointsTotal, "#818cf8")}
      </div>

      <Card className="w-full max-w-6xl my-10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Statistik Pickup - Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl text-center font-medium mb-4">
                Bar Chart
              </h3>
              <Bar data={chartData} options={barChartOptions} />
            </div>
            <div>
              <h3 className="text-xl text-center font-medium mb-4">
                Pie Chart
              </h3>
              <div className="relative mx-auto h-64 w-64">
                <Pie
                  data={chartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="w-full max-w-6xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Verifikasi Pickup
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <Select onValueChange={setFilterStatus} defaultValue="All">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter berdasarkan status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Semua Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-green-50 hover:bg-green-5">
                    {["User", "Jenis", "Berat", "Status", "Poin", "Aksi"].map(
                      (h) => (
                        <TableHead key={h} className="text-center text-black">
                          {h}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPickups.map((p) => (
                    <TableRow
                      key={p._id}
                      className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <TableCell className="text-center">
                        {p.userId.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {p.plasticType}
                      </TableCell>
                      <TableCell className="text-center">
                        {p.weightKg} kg
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={clsx(
                            "inline-block rounded-full px-3 py-1 text-sm font-semibold",
                            {
                              "bg-yellow-100 text-yellow-700":
                                p.status === "Pending",
                              "bg-green-100 text-green-700":
                                p.status === "Verified",
                              "bg-red-100 text-red-700":
                                p.status === "Rejected",
                            }
                          )}
                        >
                          {p.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {p.pointsAwarded}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedPickup(p);
                              setShowDetail(true);
                            }}
                            className="bg-white text-black outline shadow-sm hover:bg-slate-100"
                          >
                            🔍
                          </Button>
                          {p.status === "Pending" && (
                            <>
                              <Button
                                className="bg-lime-100 text-lime-500 hover:bg-lime-200 hover:text-lime-700 shadow-sm"
                                size="sm"
                                onClick={() => handleVerify(p._id, fetchData)}
                              >
                                ✅
                              </Button>

                              <Button
                                className="bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 shadow-sm"
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedPickup(p);
                                  setShowReject(true);
                                }}
                              >
                                ❌
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}

          {/* Logout & Export Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => handleExportCSV(pickups)}
              className="mt-8 rounded-full bg-lime-100 text-lime-500 hover:bg-lime-200 hover:text-lime-700 px-6"
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExportExcel(pickups)}
              className="mt-8 rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200 hover:text-orange-700 px-6"
            >
              Export Excel
            </Button>
            <Button
              onClick={handleLogout}
              className="mt-8 rounded-full bg-rose-100 text-rose-500 hover:bg-rose-200 hover:text-rose-700 px-6"
            >
              🚪 Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {selectedPickup && (
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="bg-white text-black">
            <DialogHeader>
              <DialogTitle>Detail Pickup</DialogTitle>
              <DialogDescription>
                Info lengkap milik <strong>{selectedPickup.userId.name}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Email:</strong> {selectedPickup.userId.email}
              </p>
              <p>
                <strong>Jenis Plastik:</strong> {selectedPickup.plasticType}
              </p>
              <p>
                <strong>Berat:</strong> {selectedPickup.weightKg} kg
              </p>
              <p>
                <strong>Status:</strong> {selectedPickup.status}
              </p>
              <p>
                <strong>Poin:</strong> {selectedPickup.pointsAwarded}
              </p>
              <p>
                <strong>Tanggal:</strong>{" "}
                {new Date(selectedPickup.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Lat/Lng:</strong> {selectedPickup.location.lat},{" "}
                {selectedPickup.location.lng}
              </p>
              {selectedPickup.rejectionNote && (
                <p className="text-red-600">
                  <strong>Alasan Penolakan:</strong>{" "}
                  {selectedPickup.rejectionNote}
                </p>
              )}
              <div className="mt-4 w-full h-72">
                <Map
                  lat={selectedPickup.location.lat}
                  lng={selectedPickup.location.lng}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Dialog */}
      {selectedPickup && (
        <Dialog open={showReject} onOpenChange={setShowReject}>
          <DialogContent className="bg-white text-black">
            <DialogHeader>
              <DialogTitle>Tolak Pickup</DialogTitle>
              <DialogDescription>
                Masukkan alasan penolakan untuk request ini.
              </DialogDescription>
            </DialogHeader>

            <Textarea
              placeholder="Masukkan alasan penolakan"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <Button
              className="bg-rose-100 text-rose-500 hover:bg-rose-200 hover:text-rose-700 mt-2"
              size="sm"
              variant="destructive"
              onClick={() =>
                handleReject(
                  selectedPickup,
                  rejectReason,
                  fetchData,
                  setShowReject,
                  setRejectReason
                )
              }
            >
              ❌ Tolak
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
