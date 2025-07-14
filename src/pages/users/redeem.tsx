import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/ShadCN/button";
import { ArrowLeft, Gift, Star, Ticket, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/ShadCN/card";
import { Voucher, RedemptionHistory, UserProfile } from "@/types/types";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/ShadCN/dialog";
import { PaginationControls } from "@/components/ui/Custom/PaginationControls"; // <-- IMPORT KOMPONEN PAGINATION

// Komponen Kartu Voucher (Tidak ada perubahan)
interface VoucherCardProps {
  voucher: Voucher;
  onRedeem: (voucher: Voucher) => void;
  disabled: boolean;
}

const VoucherCard = ({ voucher, onRedeem, disabled }: VoucherCardProps) => (
  <Card className="flex flex-col rounded-2xl shadow-sm transition-all hover:shadow-lg">
    <CardHeader>
      <div className="relative h-40 w-full overflow-hidden rounded-lg bg-slate-200">
        {voucher.imageUrl ? (
          <Image
            src={voucher.imageUrl}
            alt={voucher.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-sky-600">
            <Ticket className="h-16 w-16 text-white/80" />
          </div>
        )}
      </div>
      <CardTitle className="mt-4">{voucher.name}</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-1 flex-col justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {voucher.description}
      </p>
      <div className="mt-4 space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Star size={16} /> Harga:
            </span>
            <span className="text-yellow-500">
              {voucher.pointsRequired} Poin
            </span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Package size={16} /> Stok:
            </span>
            <span>{voucher.stock}</span>
          </div>
        </div>
        <Button
          onClick={() => onRedeem(voucher)}
          disabled={disabled || voucher.stock === 0}
          className="w-full cursor-pointer"
        >
          {voucher.stock === 0
            ? "Stok Habis"
            : disabled
            ? "Menukarkan..."
            : "Tukar Poin"}
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Halaman Utama
export default function RedeemPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [history, setHistory] = useState<RedemptionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const router = useRouter();

  // --- BAGIAN BARU UNTUK PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5; // <-- Kita set 5 item per halaman
  // --- AKHIR BAGIAN BARU ---

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Sesi tidak valid, silakan login kembali.");
      router.push("/login");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    setLoading(true);
    const results = await Promise.allSettled([
      axios.get<{ user: UserProfile }>("/api/user/me", { headers }),
      axios.get<{ vouchers: Voucher[] }>("/api/vouchers"),
      axios.get<{ redemptions: RedemptionHistory[] }>("/api/redemptions/me", {
        headers,
      }),
    ]);

    const userResult = results[0];
    if (userResult.status === "fulfilled") {
      setUser(userResult.value.data.user);
    } else {
      toast.error("Gagal memuat data pengguna.");
    }

    const vouchersResult = results[1];
    if (vouchersResult.status === "fulfilled") {
      setVouchers(vouchersResult.value.data.vouchers);
    } else {
      toast.error("Gagal memuat katalog hadiah.");
    }

    const historyResult = results[2];
    if (historyResult.status === "fulfilled") {
      setHistory(historyResult.value.data.redemptions);
    } else {
      console.error("Gagal memuat riwayat penukaran:", historyResult.reason);
      toast.error("Gagal memuat riwayat penukaran.");
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (voucher: Voucher) => {
    if (user && user.points < voucher.pointsRequired) {
      toast.error("Poin Anda tidak cukup untuk menukar hadiah ini.");
      return;
    }
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedVoucher) return;
    setIsRedeeming(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<{ msg: string }>(
        "/api/redeem",
        { voucherId: selectedVoucher._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.msg);
      await fetchData();
    } catch (error) {
      let errorMessage = "Gagal menukarkan voucher.";
      if (error && typeof error === "object" && "response" in error) {
        const responseData = (
          error as { response?: { data?: { msg?: string } } }
        ).response?.data;
        if (
          responseData &&
          typeof responseData === "object" &&
          "msg" in responseData
        ) {
          errorMessage = responseData.msg || errorMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsRedeeming(false);
      setIsModalOpen(false);
    }
  };

  // --- LOGIKA BARU UNTUK PAGINATION ---
  const paginatedHistory = history.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  // --- AKHIR LOGIKA BARU ---

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="animate-pulse">Memuat data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen w-full justify-center bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                Tukar Poin
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Gunakan poin Anda untuk hadiah menarik.
              </p>
            </div>
            <Link href="/users/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm"
              >
                <ArrowLeft className="mr-2 size-4" /> Kembali
              </Button>
            </Link>
          </header>
          <Card className="mb-8 bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-lg">
            <CardContent className="flex items-center justify-between p-6">
              <p className="text-lg font-medium">Poin Anda Saat Ini:</p>
              <p className="text-4xl font-bold">{user?.points ?? 0}</p>
            </CardContent>
          </Card>
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-slate-800">
              Katalog Hadiah
            </h2>
            {vouchers.length === 0 ? (
              <p className="text-center text-slate-500">
                Belum ada hadiah yang tersedia.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vouchers.map((voucher) => (
                  <VoucherCard
                    key={voucher._id}
                    voucher={voucher}
                    onRedeem={handleOpenModal}
                    disabled={isRedeeming}
                  />
                ))}
              </div>
            )}
          </section>
          <section className="mt-12">
            <h2 className="mb-4 text-2xl text-slate-800 font-semibold">
              Riwayat Penukaran Anda
            </h2>
            <Card>
              <CardContent className="pt-6">
                {history.length === 0 ? (
                  <p className="py-8 text-center text-slate-500">
                    Anda belum pernah menukarkan poin.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {/* --- UBAH BAGIAN INI UNTUK MENGGUNAKAN DATA PAGINASI --- */}
                    {paginatedHistory.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between rounded-lg bg-slate-100 p-4 dark:bg-slate-800"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <Gift className="flex-shrink-0 text-cyan-500" />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {item.name}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {item.description}
                            </p>
                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                              {new Date(item.redeemedAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <span className="flex-shrink-0 font-bold text-yellow-500">
                          -{item.pointsSpent} Poin
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            {/* --- TAMBAHKAN KONTROL PAGINATION DI SINI --- */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </section>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="text-slate-800 bg-white">
          <DialogHeader>
            <DialogTitle>Konfirmasi Penukaran</DialogTitle>
            <DialogDescription>
              Anda akan menukar{" "}
              <strong className="text-yellow-500">
                {selectedVoucher?.pointsRequired} poin
              </strong>{" "}
              untuk mendapatkan{" "}
              <strong className="text-slate-800 dark:text-white">
                {selectedVoucher?.name}
              </strong>
              . Lanjutkan?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer hover:bg-slate-100"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleConfirmRedeem}
              disabled={isRedeeming}
            >
              {isRedeeming ? "Memproses..." : "Ya, Tukarkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
