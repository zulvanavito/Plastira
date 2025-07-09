import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Box,
  CheckCircle,
  Info,
  Star,
  Weight,
  XCircle,
  Loader,
  Send,
  Search,
} from "lucide-react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { filterPickups, ITEMS_PER_PAGE, Pickup } from "@/utils/historyUtils";

const Map = dynamic(() => import("@/components/ui/map"), {
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-lg bg-slate-200"></div>
  ),
  ssr: false,
});

export default function HistoryPage() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<{ pickups: Pickup[] }>("/api/pickups/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPickups(res.data.pickups);
      } catch {
        toast.error("Gagal ambil data pickup");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = filterPickups(pickups, filterStatus);
  const paginatedPickups = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleShowDetail = (pickup: Pickup) => {
    setSelectedPickup(pickup);
    setShowDetail(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Riwayat Pickup
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Semua transaksi pickup Anda tercatat di sini.
            </p>
          </div>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-slate-800 cursor-pointer"
            >
              <ArrowLeft className="mr-2 size-4" />
              Kembali
            </Button>
          </Link>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          <FilterButton
            status="All"
            currentStatus={filterStatus}
            setStatus={setFilterStatus}
            setCurrentPage={setCurrentPage}
          />
          <FilterButton
            status="Verified"
            currentStatus={filterStatus}
            setStatus={setFilterStatus}
            setCurrentPage={setCurrentPage}
          />
          <FilterButton
            status="Pending"
            currentStatus={filterStatus}
            setStatus={setFilterStatus}
            setCurrentPage={setCurrentPage}
          />
          <FilterButton
            status="Rejected"
            currentStatus={filterStatus}
            setStatus={setFilterStatus}
            setCurrentPage={setCurrentPage}
          />
        </div>

        {/* --- PERUBAHAN DI SINI: Layout diubah jadi Grid --- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {loading ? (
            <p className="col-span-2 text-center text-slate-500">
              Memuat riwayat...
            </p>
          ) : paginatedPickups.length === 0 ? (
            <div className="col-span-2">
              <EmptyState />
            </div>
          ) : (
            paginatedPickups.map((pickup, index) => (
              <HistoryItemCard
                key={pickup._id}
                pickup={pickup}
                index={index}
                onShowDetail={() => handleShowDetail(pickup)}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <Button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              variant="outline"
            >
              Sebelumnya
            </Button>
            <span className="text-sm text-slate-600">
              Halaman {currentPage} dari {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Selanjutnya
            </Button>
          </div>
        )}
      </div>

      {selectedPickup && (
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-lg bg-white text-black">
            <DialogHeader>
              <DialogTitle>Detail Pickup</DialogTitle>
              <DialogDescription>
                Informasi lengkap untuk transaksi pada{" "}
                {new Date(selectedPickup.createdAt).toLocaleDateString(
                  "id-ID",
                  { day: "2-digit", month: "long", year: "numeric" }
                )}
                .
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="h-48 w-full rounded-lg bg-slate-200 overflow-hidden">
                <Map
                  lat={selectedPickup.location.lat}
                  lng={selectedPickup.location.lng}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label="Status"
                  value={selectedPickup.status}
                  icon={<Info size={16} />}
                />
                <InfoItem
                  label="Jenis Plastik"
                  value={selectedPickup.plasticType}
                  icon={<Box size={16} />}
                />
                <InfoItem
                  label="Berat"
                  value={`${selectedPickup.weightKg} kg`}
                  icon={<Weight size={16} />}
                />
                <InfoItem
                  label="Poin Diterima"
                  value={`${selectedPickup.pointsAwarded}`}
                  icon={<Star size={16} />}
                />
              </div>
              {selectedPickup.status === "Rejected" &&
                selectedPickup.rejectionNote && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-300 flex items-center gap-2">
                    <Info size={16} />
                    <div>
                      <span className="font-semibold">Alasan Penolakan:</span>{" "}
                      {selectedPickup.rejectionNote}
                    </div>
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

const FilterButton = ({
  status,
  currentStatus,
  setStatus,
  setCurrentPage,
}: {
  status: string;
  currentStatus: string;
  setStatus: (s: string) => void;
  setCurrentPage: (n: number) => void;
}) => (
  <Button
    variant={status === currentStatus ? "default" : "outline"}
    size="sm"
    onClick={() => {
      setStatus(status);
      setCurrentPage(1);
    }}
    className={clsx(
      status === currentStatus && "bg-[#23A4DA] hover:bg-[#72ceef]"
    )}
  >
    {status}
  </Button>
);

const HistoryItemCard = ({
  pickup,
  index,
  onShowDetail,
}: {
  pickup: Pickup;
  index: number;
  onShowDetail: () => void;
}) => {
  const statusInfo = {
    Verified: { icon: <CheckCircle />, color: "text-green-500" },
    Rejected: { icon: <XCircle />, color: "text-red-500" },
    Pending: { icon: <Loader />, color: "text-yellow-500" },
  };

  return (
    <Card
      className="animate-fade-in-up rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="flex-1">
            <div
              className={`flex items-center gap-2 text-sm font-bold ${
                statusInfo[pickup.status].color
              }`}
            >
              {statusInfo[pickup.status].icon}
              <span>{pickup.status}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Jenis Plastik</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">
              {pickup.plasticType}
            </p>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right">
            <span className="text-xl font-bold text-[#23A4DA]">
              {pickup.pointsAwarded} Poin
            </span>
            <p className="text-xs text-slate-500 mt-1">
              {new Date(pickup.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 w-full text-sm cursor-pointer bg-white text-slate-800 hover:bg-slate-100 border-1 shadow-sm border-slate-100"
          onClick={onShowDetail}
        >
          Lihat Detail
        </Button>
      </CardContent>
    </Card>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-2">
    <div className="text-slate-500">{icon}</div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
    <Search size={48} className="text-slate-400" />
    <h3 className="mt-4 text-xl font-semibold text-slate-700 dark:text-white">
      Tidak Ada Data
    </h3>
    <p className="mt-1 text-slate-500 dark:text-slate-400">
      Coba ganti filter atau buat request pickup baru.
    </p>
    <Link href="/request" className="mt-6">
      <Button>
        <Send className="mr-2 size-4" />
        Buat Request Baru
      </Button>
    </Link>
  </div>
);
