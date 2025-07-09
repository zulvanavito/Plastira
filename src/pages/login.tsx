import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<{ token: string }>("/api/auth/login", {
        email,
        password,
      });
      const token = res.data.token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;
      toast.success("Login berhasil");

      if (role === "admin") {
        router.push("/admin/pickups");
      } else {
        router.push("/dashboard");
      }
    } catch {
      toast.error("Login gagal, cek kembali email dan password Anda.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="relative flex h-full w-full max-w-4xl flex-row rounded-xl shadow-2xl">
        {/* --- FORM SEKARANG DI KIRI --- */}
        <div className="flex h-[600px] w-full items-center justify-center rounded-l-xl bg-white p-8 dark:bg-gray-800 md:w-1/2">
          <Card className="w-full max-w-md border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl text-center font-bold text-gray-800 dark:text-white">
                Masuk ke Akunmu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
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

                <Button type="submit" className="w-full cursor-pointer">
                  <LogIn className="mr-2 size-5" />
                  Masuk
                </Button>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  Belum Punya Akun?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-[#23A4DA] hover:underline"
                  >
                    Daftar di sini
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

        {/* --- VISUAL SEKARANG DI KANAN --- */}
        <div className="relative hidden h-[600px] w-1/2 flex-col justify-between overflow-hidden rounded-r-xl bg-gradient-to-br from-[#23A4DA] to-[#0A4E6A] p-8 text-white md:flex">
          <h2 className="z-10 text-3xl font-bold">
            Selamat Datang Kembali, Pahlawan Lingkungan!
          </h2>
          <p className="z-10 text-base">
            Setiap login Anda adalah satu langkah lebih dekat menuju bumi yang
            lebih hijau.
          </p>
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/20"></div>
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/20"></div>
        </div>
      </div>
    </div>
  );
}
