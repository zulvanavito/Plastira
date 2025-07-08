import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

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
      toast.error("Login gagal");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Masuk ke Akunmu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
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
              Masuk
            </Button>
            <p className="text-center text-sm">
              Belum Punya Akun?{" "}
              <Link href="/register" className="text-blue-500 underline">
                Daftar
              </Link>{" "}
            </p>
            <Link href="/">
              <Button variant="ghost" className="w-full mt-2">
                ← Kembali ke Beranda
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
