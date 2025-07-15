import Link from "next/link";
import { Button } from "@/components/ui/ShadCN/button";
import { LogIn, UserPlus, Building } from "lucide-react"; // <-- Tambahkan ikon Building
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/kids-in-the-water.jpg"
          alt="Latar belakang lingkungan bersih"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
      </div>

      <div className="container z-10 flex flex-col items-center gap-6 px-4 text-center">
        <div className="animate-fade-in-up flex flex-col items-center gap-6">
          <h1 className="text-4xl font-extrabold tracking-tighter text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            Satu Botol, Sejuta{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
              Harapan.
            </span>
          </h1>

          <p className="max-w-xl text-lg text-gray-200">
            Platform pintar untuk mengubah sampah plastik Anda menjadi poin
            berharga. Bergabunglah dengan gerakan untuk lingkungan yang lebih
            bersih.
          </p>

          <div className="mt-4 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full cursor-pointer">
                <LogIn className="mr-2 size-5" />
                Login User
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full cursor-pointer"
              >
                <UserPlus className="mr-2 size-5" />
                Daftar User
              </Button>
            </Link>

            <Link href="/mitra/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full cursor-pointer bg-transparent text-white border-white hover:bg-white hover:text-black"
              >
                <Building className="mr-2 size-5" />
                Portal Mitra
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
