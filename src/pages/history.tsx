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
  rejectionNote?: string;
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
            <Table className="border text-center">
              <TableHeader className="bg-green-50 hover:bg-green-50">
                <TableRow>
                  <TableHead className="text-black text-center">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-black text-center">
                    Jenis
                  </TableHead>
                  <TableHead className="text-black text-center">
                    Berat (kg)
                  </TableHead>
                  <TableHead className="text-black text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-black text-center">
                    Alasan Penolakan
                  </TableHead>
                  <TableHead className="text-black text-center">Poin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pickups.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{p.plasticType}</TableCell>
                    <TableCell>{p.weightKg}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          p.status === "Verified"
                            ? "bg-green-100 text-green-700"
                            : p.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      {p.status === "Rejected" && p.rejectionNote ? (
                        <div className="text-sm">{p.rejectionNote}</div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">—</span>
                      )}
                    </TableCell>

                    <TableCell>{p.pointsAwarded}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Link href="/dashboard">
            <Button
              variant="default"
              className="w-full mb-5 mt-10 bg-rose-100 text-rose-300 hover:bg-rose-200 hover:text-rose-400 cursor-pointer shadow-sm"
            >
              ← Kembali ke Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
