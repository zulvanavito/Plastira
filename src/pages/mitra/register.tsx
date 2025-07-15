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
import { UserPlus, Loader } from "lucide-react";

export default function MitraRegisterPage() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [industry, setIndustry] = useState("");
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
      <div className="relative flex h-full w-full max-w-4xl flex-row rounded-xl shadow-2xl">
        <div className="relative hidden h-[750px] w-1/2 flex-col justify-between overflow-hidden rounded-l-xl bg-gradient-to-br from-[#23A4DA] to-[#0A4E6A] p-8 text-white md:flex">
          <h2 className="z-10 text-3xl font-bold">
            Menjadi Bagian dari Solusi.
          </h2>
          <p className="z-10 text-base">
            Daftarkan perusahaan atau instansi Anda dan jadilah sponsor untuk
            mendukung gerakan lingkungan yang lebih besar.
          </p>
          <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-white/20"></div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/20"></div>
        </div>

        <div className="flex h-auto w-full items-center justify-center rounded-xl bg-white p-8 dark:bg-gray-800 md:h-[750px] md:w-1/2 md:rounded-l-none md:rounded-r-xl">
          <Card className="w-full max-w-md border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl text-center font-bold text-gray-800 dark:text-white">
                Pendaftaran Akun Mitra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label
                    className="text-sm mb-2"
                    htmlFor="companyName"
                    required
                  >
                    Nama Perusahaan/Instansi
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Nama resmi perusahaan"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm mb-2" htmlFor="industry" required>
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
                  <Label className="text-sm mb-2" htmlFor="email" required>
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
                  <Label className="text-sm mb-2" htmlFor="password" required>
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 8 karakter"
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
                    placeholder="Ulangi password"
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
                  {loading ? (
                    <>
                      <Loader className="mr-2 size-5 animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 size-5" />
                      Daftar Akun Mitra
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  Sudah Punya Akun Mitra?{" "}
                  <Link
                    href="/mitra/login"
                    className="font-semibold text-[#23A4DA] hover:underline"
                  >
                    Masuk di sini
                  </Link>
                </p>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  Bukan mitra?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-[#23A4DA] hover:underline"
                  >
                    Daftar sebagai Pengguna
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
