import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Pickup {
  _id: string;
  plasticType: string;
  weightKg: number;
  status: string;
  pointsAwarded: number;
  createdAt: string;
}

export default function HistoryPage() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<{ pickups: Pickup[] }>("/api/pickups/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <Card className="w-full max-w-4xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">Riwayat Pickup</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : !pickups || pickups.length === 0 ? (
            <p className="text-center text-gray-500">Belum ada data pickup.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black">Tanggal</TableHead>
                  <TableHead className="text-black">Jenis</TableHead>
                  <TableHead className="text-black">Berat (kg)</TableHead>
                  <TableHead className="text-black">Status</TableHead>
                  <TableHead className="text-black">Poin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pickups.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell className="text-black">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-black">
                      {p.plasticType}
                    </TableCell>
                    <TableCell className="text-black">{p.weightKg}</TableCell>
                    <TableCell className="text-black">{p.status}</TableCell>
                    <TableCell className="text-black">
                      {p.pointsAwarded}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full mt-10 border bg-slate-50">
              ← Kembali ke Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
