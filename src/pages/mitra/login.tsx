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
import { Building } from "lucide-react";
import Link from "next/link";

export default function MitraLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Frontend mengirim data ke API backend
      const res = await axios.post<{ token: string }>("/api/auth/mitra/login", {
        email,
        password,
      });
      // 2. Jika sukses, simpan token
      localStorage.setItem("token", res.data.token);
      toast.success("Login Mitra Berhasil!");

      router.push("/mitra/dashboard");
    } catch {
      toast.error("Login gagal, cek kembali email dan password Anda.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Portal Mitra Plastira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-4" required>
                Email Perusahaan
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" required className="mb-4">
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
            <Button type="submit" className="w-full">
              <Building className="mr-2 size-5" />
              Masuk sebagai Mitra
            </Button>
            <p className="text-center text-sm text-gray-600">
              Belum jadi mitra? {""}{" "}
              <Link
                href="/mitra/register"
                className="font-semibold text-[#23A4DA] hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
