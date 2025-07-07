import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import router from "next/router";

interface Pickup {
  _id: string;
  plasticType: string;
  weightKg: number;
  status: string;
  pointsAwarded: number;
  createdAt: string;
  location: {
    lat: number;
    lng: number;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function AdminPickupPage() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get<{ pickups: Pickup[] }>(
        "/api/pickups/verify",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPickups(res.data.pickups);
    } catch {
      toast.error("Gagal ambil data pickup");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/pickups/verify`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Pickup berhasil diverifikasi");
      fetchData();
    } catch {
      toast.error("Gagal verifikasi pickup");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <Card className="w-full max-w-6xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-center my-5">
            Admin - Verifikasi Pickup
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center flex-col">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-green-50">
                  <TableHead className="text-black text-center">User</TableHead>
                  <TableHead className="text-black text-center">
                    Jenis
                  </TableHead>
                  <TableHead className="text-black text-center">
                    Berat
                  </TableHead>
                  <TableHead className="text-black text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-black text-center">Poin</TableHead>
                  <TableHead className="text-black text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pickups.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell className="text-center">
                      {p.userId.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {p.plasticType}
                    </TableCell>
                    <TableCell className="text-center">
                      {p.weightKg} kg
                    </TableCell>
                    <TableCell className="text-center">{p.status}</TableCell>
                    <TableCell className="text-center">
                      {p.pointsAwarded}
                    </TableCell>
                    <TableCell className="space-x-2 text-center">
                      <Button
                        variant="outline"
                        className="bg-white text-black"
                        size="sm"
                        onClick={() => {
                          setSelectedPickup(p);
                          setShowDialog(true);
                        }}
                      >
                        🔍 Detail
                      </Button>
                      {p.status === "Pending" && (
                        <Button size="sm" onClick={() => handleVerify(p._id)}>
                          ✅ Verifikasi
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Button
            variant="default"
            onClick={handleLogout}
            className="mb-5 mt-10 bg-rose-100 text-rose-300 hover:bg-rose-200 hover:text-rose-400 cursor-pointer"
          >
            🚪 Logout
          </Button>
        </CardContent>
      </Card>

      {selectedPickup && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-white text-black shadow-md">
            <DialogHeader>
              <DialogTitle>Detail Pickup</DialogTitle>
              <DialogDescription>
                Info lengkap pickup milik{" "}
                <strong>{selectedPickup.userId.name}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-sm text-grey-50">
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
                <strong>Latitude:</strong> {selectedPickup.location?.lat}
              </p>
              <p>
                <strong>Longitude:</strong> {selectedPickup.location?.lng}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
