import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/ShadCN/card";
import { Label } from "@/components/ui/ShadCN/label";
import { Input } from "@/components/ui/ShadCN/input";
import { Button } from "@/components/ui/ShadCN/button";
import { toast } from "sonner";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function MitraRegisterPage() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/mitra/register", {
        companyName,
        email,
        password,
        industry,
      });
      toast.success("Registrasi Mitra Berhasil! Silakan login.");
      router.push("/mitra/login");
    } catch (error) {
      let errorMessage = "Registrasi gagal.";

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
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold text-gray-800 dark:text-white">
            Daftar sebagai Mitra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label className="mb-3" htmlFor="companyName" required>
                Nama Perusahaan/Instansi
              </Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Contoh: PT Sejahtera Abadi"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="mb-3" htmlFor="industry" required>
                Industri
              </Label>
              <Input
                id="industry"
                type="text"
                placeholder="Contoh: F&B, Hotel, Retail"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="mb-3" htmlFor="email" required>
                Email Kontak
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="kontak@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="mb-3" htmlFor="password" required>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <UserPlus className="mr-2 size-5" />
              {loading ? "Mendaftar..." : "Daftar Akun Mitra"}
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Sudah punya akun?{" "}
              <Link
                href="/mitra/login"
                className="font-semibold text-[#23A4DA] hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
