import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";

export default function RequestPickupPage() {
  const [plasticType, setPlasticType] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User belum login.");

      await axios.post(
        "/api/pickups",
        {
          plasticType,
          weightKg: parseFloat(weightKg),
          location: {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Request berhasil dikirim!");
      router.push("/dashboard");
    } catch {
      toast.error("Gagal mengirim request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Form Pickup Sampah
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Jenis Plastik</Label>
              <Select onValueChange={setPlasticType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis plastik" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PET">PET</SelectItem>
                  <SelectItem value="HDPE">HDPE</SelectItem>
                  <SelectItem value="PP">PP</SelectItem>
                  <SelectItem value="Other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Berat (kg)</Label>
              <Input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Latitude</Label>
              <Input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Longitude</Label>
              <Input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mengirim..." : "Kirim Request"}
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full mt-2">
                ← Kembali ke Dashboard
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
