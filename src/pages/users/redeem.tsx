import { useEffect, useState, useCallback } from "react";
import axios from "axios"; // Hanya perlu impor ini
import { toast } from "sonner";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/ShadCN/button";
import { ArrowLeft, Gift, Star, Ticket } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/ShadCN/card";
import { Voucher, RedemptionHistory, UserProfile } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/ShadCN/dialog";

// Komponen Kartu Voucher
interface VoucherCardProps {
  voucher: Voucher;
  onRedeem: (voucher: Voucher) => void;
  disabled: boolean;
}

const VoucherCard = ({ voucher, onRedeem, disabled }: VoucherCardProps) => (
  <Card className="flex flex-col rounded-2xl shadow-sm transition-all hover:shadow-lg">
    <CardHeader>
      <div className="relative h-40 w-full overflow-hidden rounded-lg">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-sky-600">
          <Ticket className="h-16 w-16 text-white/80" />
        </div>
      </div>
      <CardTitle className="mt-4">{voucher.name}</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-1 flex-col justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {voucher.description}
      </p>
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between font-semibold">
          <span className="text-slate-600 dark:text-slate-300">Harga:</span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={18} />
            <span>{voucher.pointsRequired} Poin</span>
          </div>
        </div>
        <Button
          onClick={() => onRedeem(voucher)}
          disabled={disabled}
          className="w-full cursor-pointer"
        >
          {disabled ? "Menukarkan..." : "Tukar Poin"}
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

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Sesi tidak valid, silakan login kembali.");
      router.push("/login");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      setLoading(true);
      const [userRes, vouchersRes, historyRes] = await Promise.all([
        axios.get<{ user: UserProfile }>("/api/user/me", { headers }),
        axios.get<{ vouchers: Voucher[] }>("/api/vouchers"),
        axios.get<{ redemptions: RedemptionHistory[] }>("/api/redemptions/me", {
          headers,
        }),
      ]);
      setUser(userRes.data.user);
      setVouchers(vouchersRes.data.vouchers);
      setHistory(historyRes.data.redemptions);
    } catch {
      toast.error("Gagal memuat data. Coba muat ulang halaman.");
    } finally {
      setLoading(false);
    }
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
      // --- PENANGANAN ERROR VERSI FINAL ---
      let errorMessage = "Gagal menukarkan voucher.";

      if (error && typeof error === "object" && "response" in error) {
        // Jika 'error' adalah objek dan memiliki properti 'response'
        const responseData = (
          error as { response?: { data?: { msg?: string } } }
        ).response?.data;
        if (responseData && responseData.msg) {
          errorMessage = responseData.msg;
        }
      }

      toast.error(errorMessage);
      console.error("Redemption failed:", error);
      // --- BATAS AKHIR PENANGANAN ERROR ---
    } finally {
      setIsRedeeming(false);
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen w-full justify-center bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          {/* Header */}
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
                <ArrowLeft className="mr-2 size-4 " /> Kembali
              </Button>
            </Link>
          </header>

          {/* Kartu Poin */}
          <Card className="mb-8 bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-lg">
            <CardContent className="flex items-center justify-between p-6">
              <p className="text-lg font-medium">Poin Anda Saat Ini:</p>
              <p className="text-4xl font-bold">{user?.points ?? 0}</p>
            </CardContent>
          </Card>

          {/* Katalog */}
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

          {/* Riwayat */}
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold text-slate-800">
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
                    {history.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between rounded-lg bg-slate-100 p-4 dark:bg-slate-800"
                      >
                        <div className="flex items-center gap-4">
                          <Gift className="text-cyan-500" />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {item.voucher.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
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
                        <span className="font-bold text-yellow-500">
                          -{item.pointsSpent} Poin
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
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
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleConfirmRedeem} disabled={isRedeeming}>
              {isRedeeming ? "Memproses..." : "Ya, Tukarkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
