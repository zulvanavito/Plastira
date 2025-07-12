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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/register", { name, email, password });
      toast.success("Registrasi berhasil! Silakan login.");
      router.push("/login");
    } catch {
      toast.error("Registrasi gagal. Email mungkin sudah terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="relative flex h-full w-full max-w-4xl flex-row rounded-xl shadow-2xl">
        {/* --- Sisi Kiri: Visual --- */}
        <div className="relative hidden h-[650px] w-1/2 flex-col justify-between overflow-hidden rounded-l-xl bg-gradient-to-br from-[#23A4DA] to-[#0A4E6A] p-8 text-white md:flex">
          <h2 className="z-10 text-3xl font-bold">
            Bergabunglah dengan Gerakan Perubahan.
          </h2>
          <p className="z-10 text-base">
            Satu langkah kecil darimu, satu harapan besar untuk bumi kita.
          </p>
          <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-white/20"></div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/20"></div>
        </div>

        {/* --- Sisi Kanan: Form Registrasi --- */}
        <div className="flex h-auto w-full items-center justify-center rounded-xl bg-white p-8 dark:bg-gray-800 md:h-[650px] md:w-1/2 md:rounded-l-none md:rounded-r-xl">
          <Card className="w-full max-w-md border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl text-center font-bold text-gray-800 dark:text-white">
                Buat Akun Baru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label className="text-sm mb-2" htmlFor="name" required>
                    Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm mb-2" htmlFor="email" required>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm mb-2" htmlFor="password" required>
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

                <div>
                  <Label
                    className="text-sm mb-2"
                    htmlFor="confirm-password"
                    required
                  >
                    Konfirmasi Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  <UserPlus className="mr-2 size-5" />
                  {loading ? "Mendaftar..." : "Daftar"}
                </Button>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  Sudah Punya Akun?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[#23A4DA] hover:underline"
                  >
                    Masuk di sini
                  </Link>
                </p>
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="w-full mt-2 cursor-pointer"
                  >
                    ← Kembali ke Beranda
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
