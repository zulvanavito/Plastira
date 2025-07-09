import { useState, useEffect } from "react";
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
import { ArrowLeft, MapPin, Package, Weight } from "lucide-react";
import dynamic from "next/dynamic";

// --- BARU: Dynamic import untuk komponen Map ---
const Map = dynamic(() => import("@/components/ui/map"), {
  loading: () => (
    <div className="h-full w-full bg-slate-200 animate-pulse rounded-lg"></div>
  ),
  ssr: false,
});

export default function RequestPickupPage() {
  const [plasticType, setPlasticType] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toString());
          setLng(position.coords.longitude.toString());
          toast.success("Lokasi otomatis ditemukan!");
          setIsLocating(false);
        },
        () => {
          toast.error("Gagal mendapatkan lokasi. Mohon isi manual.");
          setIsLocating(false);
        }
      );
    } else {
      toast.info("Browser tidak mendukung Geolocation.");
      setIsLocating(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plasticType) {
      toast.error("Silakan pilih jenis plastik.");
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User belum login.");

      await axios.post(
        "/api/pickups",
        {
          plasticType,
          weightKg: parseFloat(weightKg),
          location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Request berhasil dikirim!");
      router.push("/success");
    } catch {
      toast.error("Gagal mengirim request. Periksa kembali datamu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Buat Request Pickup
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Isi detail sampah dan lokasimu di bawah ini.
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="bg-white cursor-pointer text-black">
              <ArrowLeft className="mr-2 size-4" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {/* Kolom Kiri: Form Detail */}
          <div className="space-y-8 lg:col-span-2">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package /> Detail Sampah
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label className="mb-2" htmlFor="plastic-type" required>
                    Jenis Plastik
                  </Label>
                  <Select onValueChange={setPlasticType} value={plasticType}>
                    <SelectTrigger id="plastic-type">
                      <SelectValue placeholder="Pilih jenis plastik"/>
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
                  <Label className="mb-2" htmlFor="weight" required>
                    Berat (kg)
                  </Label>
                  <div className="relative">
                    <Weight
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="Contoh: 1.5"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin /> Lokasi Penjemputan
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label className="mb-2" htmlFor="lat" required>
                    Latitude
                  </Label>
                  <Input
                    id="lat"
                    type="text"
                    placeholder={isLocating ? "Mencari..." : "Latitude"}
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                    disabled={isLocating}
                  />
                </div>
                <div>
                  <Label className="mb-2" htmlFor="lng" required>
                    Longitude
                  </Label>
                  <Input
                    id="lng"
                    type="text"
                    placeholder={isLocating ? "Mencari..." : "Longitude"}
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                    disabled={isLocating}
                  />
                </div>
              </CardContent>
            </Card>
            <Button
              type="submit"
              size="lg"
              className="w-full cursor-pointer"
              disabled={false}
            >
              {loading ? "Mengirim..." : "Kirim Request"}
            </Button>
          </div>

          {/* Kolom Kanan: Peta & Submit */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Preview Lokasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full rounded-lg bg-slate-200">
                  {lat && lng && (
                    <Map lat={parseFloat(lat)} lng={parseFloat(lng)} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
