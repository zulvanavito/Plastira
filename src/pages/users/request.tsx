import { useState, useEffect, useRef } from "react";
import axios from "axios";
import router from "next/router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/ShadCN/card";
import { Label } from "@/components/ui/ShadCN/label";
import { Input } from "@/components/ui/ShadCN/input";
import { Button } from "@/components/ui/ShadCN/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/ShadCN/select";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Package,
  Weight,
  BrainCircuit,
  Loader,
} from "lucide-react";
import dynamic from "next/dynamic";
import * as tmImage from "@teachablemachine/image";

const Map = dynamic(() => import("@/components/ui/ShadCN/map"), {
  loading: () => (
    <div className="h-full w-full bg-slate-200 animate-pulse rounded-lg"></div>
  ),
  ssr: false,
});

const URL = "https://teachablemachine.withgoogle.com/models/f7lJT9pEh/";

const classMapping: { [key: string]: string } = {
  "Polyethlene Terephthalate (PET)": "PET (Polyethylene Terephthalate)",
  "High Density Polyethylene (HDPE)": "HDPE (High-Density Polyethylene)",
  "Polypropylene (PP)": "PP (Polypropylene)",
  "Low Density Polyethylene (LDPE)": "LDPE (Low-Density Polyethylene)",
  "Other (Lainnya)": "Lainnya",
};

export default function RequestPickupPage() {
  const [plasticType, setPlasticType] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  // Fungsi untuk load model saat komponen pertama kali dirender
  useEffect(() => {
    const loadModel = async () => {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      try {
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
        toast.success("Fitur deteksi foto siap!");
      } catch (error) {
        toast.error("Gagal memuat model deteksi.");
        console.error("Error loading model:", error);
      }
    };
    loadModel();
  }, []);

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

  const handleDetect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    if (!model) {
      toast.error("Model deteksi belum siap, coba sesaat lagi.");
      return;
    }

    const image = event.target.files[0];
    const imageElement = document.createElement("img");
    imageElement.src = window.URL.createObjectURL(image);

    setIsDetecting(true);
    toast.loading("Mendeteksi jenis sampah...");

    imageElement.onload = async () => {
      try {
        const predictions = await model.predict(imageElement);

        // Cari prediksi dengan probabilitas tertinggi
        const topPrediction = predictions.reduce((prev, current) =>
          prev.probability > current.probability ? prev : current
        );

        const detectedType = classMapping[topPrediction.className] || "Lainnya";

        setPlasticType(detectedType);
        toast.dismiss();
        toast.success(
          `Terdeteksi sebagai: ${topPrediction.className} (${(
            topPrediction.probability * 100
          ).toFixed(1)}%)`
        );
      } catch (error) {
        toast.dismiss();
        toast.error("Gagal mendeteksi gambar.");
        console.error("Prediction error:", error);
      } finally {
        setIsDetecting(false);
        window.URL.revokeObjectURL(imageElement.src);
      }
    };
  };

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
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Buat Request Pickup
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Isi detail sampah dan lokasimu di bawah ini.
            </p>
          </div>
          <Link href="/users/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm"
            >
              <ArrowLeft className="mr-2 size-4" /> Kembali ke Dashboard
            </Button>
          </Link>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
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
                      <SelectValue placeholder="Pilih jenis plastik" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PET (Polyethylene Terephthalate)">
                        PET (Polyethylene Terephthalate)
                      </SelectItem>
                      <SelectItem value="HDPE (High-Density Polyethylene)">
                        HDPE (High-Density Polyethylene)
                      </SelectItem>
                      <SelectItem value="PVC (Polyvinyl Chloride)">
                        PVC (Polyvinyl Chloride)
                      </SelectItem>
                      <SelectItem value="LDPE (Low-Density Polyethylene)">
                        LDPE (Low-Density Polyethylene)
                      </SelectItem>
                      <SelectItem value="PP (Polypropylene)">
                        PP (Polypropylene)
                      </SelectItem>
                      <SelectItem value="PS (Polystyrene)">
                        PS (Polystyrene)
                      </SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="file"
                    ref={imageUploadRef}
                    onChange={handleDetect}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm"
                    onClick={() => imageUploadRef.current?.click()}
                    disabled={isDetecting || !model}
                  >
                    {isDetecting ? (
                      <>
                        <Loader className="mr-2 size-4 animate-spin" />
                        Mendeteksi...
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="mr-2 size-4" />
                        Deteksi Otomatis dengan Foto
                      </>
                    )}
                  </Button>
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
              disabled={loading || isDetecting}
            >
              {loading ? "Mengirim..." : "Kirim Request"}
            </Button>
          </div>
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
