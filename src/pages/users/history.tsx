import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/ShadCN/button";
import { ArrowLeft, Download } from "lucide-react";
import { FilterControls } from "@/components/ui/Custom/FilterControls";
import { PaginationControls } from "@/components/ui/Custom/PaginationControls";
import { HistoryCard } from "@/components/ui/Custom/HistoryCard";
import { DetailModal } from "@/components/ui/Custom/DetailModal";
import { EmptyState } from "@/components/ui/Custom/EmptyState";
import {
  filterPickups,
  ITEMS_PER_PAGE_HISTORY,
  Pickup,
} from "@/utils/historyUtils";
import { handleExportCSV, handleExportExcel } from "@/utils/exportUtils";

export default function HistoryPage() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<{ pickups: Pickup[] }>("/api/pickups/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = res.data.pickups.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPickups(sorted);
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
    (currentPage - 1) * ITEMS_PER_PAGE_HISTORY,
    currentPage * ITEMS_PER_PAGE_HISTORY
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE_HISTORY);

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
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
              className="cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm"
            >
              <ArrowLeft className="mr-2 size-4" />
              Kembali
            </Button>
          </Link>
        </header>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterControls
            currentStatus={filterStatus}
            onFilterChange={handleFilterChange}
          />
          <div className="flex gap-2">
            <Button
              className="cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm"
              variant="outline"
              onClick={() => handleExportCSV(filtered)}
            >
              <Download className="mr-2 size-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm"
              onClick={() => handleExportExcel(filtered)}
            >
              <Download className="mr-2 size-4" />
              Excel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {loading ? (
            <p className="col-span-full text-center text-slate-500">
              Memuat riwayat...
            </p>
          ) : paginatedPickups.length === 0 ? (
            <div className="col-span-full">
              <EmptyState />
            </div>
          ) : (
            paginatedPickups.map((pickup, index) => (
              <HistoryCard
                key={pickup._id}
                pickup={pickup}
                index={index}
                onShowDetail={() => setSelectedPickup(pickup)}
              />
            ))
          )}
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <DetailModal
          pickup={selectedPickup}
          isOpen={!!selectedPickup}
          onClose={() => setSelectedPickup(null)}
        />
      </div>
    </div>
  );
}
