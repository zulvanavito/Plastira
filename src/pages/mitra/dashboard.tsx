import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/ShadCN/card";
import { Button } from "@/components/ui/ShadCN/button";
import { IVoucher } from "@/models/Voucher";
import { Leaf, Users, Gift, LogOut } from "lucide-react";

interface MitraStats {
  plasticCollectedKg: number;
  totalRedemptions: number;
  citizensHelped: number;
}

export default function MitraDashboardPage() {
  const [stats, setStats] = useState<MitraStats | null>(null);
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/mitra/login");
        return;
      }
      try {
        const { data } = await axios.get<{
          stats: MitraStats;
          vouchers: IVoucher[];
        }>("/api/mitra/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data.stats);
        setVouchers(data.vouchers);
      } catch {
        toast.error("Gagal memuat dashboard. Sesi mungkin berakhir.");
        router.push("/mitra/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout berhasil!");
    router.push("/mitra/login");
  };

  if (loading)
    return <p className="text-slate-800">Memuat data dashboard...</p>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Mitra</h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className=" cursor-pointer hover:bg-[#23A4DA] hover:text-white"
        >
          <LogOut className="mr-2 size-4" /> Logout
        </Button>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">
          Laporan Dampak Anda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<Leaf />}
            title="Plastik Terkumpul"
            value={`${stats?.plasticCollectedKg.toFixed(2) || 0} kg`}
          />
          <StatCard
            icon={<Gift />}
            title="Voucher Ditukar"
            value={`${stats?.totalRedemptions || 0} kali`}
          />
          <StatCard
            icon={<Users />}
            title="Warga Terbantu"
            value={`${stats?.citizensHelped || 0} orang`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">
          Voucher Aktif Anda
        </h2>
        <Card>
          <CardContent className="pt-6">
            {vouchers.length > 0 ? (
              <ul className="space-y-3">
                {vouchers.map((v) => (
                  <li
                    key={v._id}
                    className="p-3 bg-slate-100 rounded-md flex justify-between"
                  >
                    <span className="font-semibold">{v.name}</span>
                    <span className="text-slate-500">
                      {v.pointsRequired} Poin
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-slate-500 py-4">
                Anda belum memiliki voucher sponsorship aktif.
              </p>
            )}
            <Button
              className="mt-4 w-full"
              onClick={() =>
                toast.info("Fitur tambah voucher sedang dalam pengembangan!")
              }
            >
              + Tambah Sponsorship Baru
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

const StatCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);
