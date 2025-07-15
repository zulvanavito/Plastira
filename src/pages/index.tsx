import Link from "next/link";
import { Button } from "@/components/ui/ShadCN/button";
import {
  LogIn,
  UserPlus,
  Building,
  Recycle,
  Truck,
  Star,
  Gift,
  LayoutDashboard,
  Trophy,
  Sparkles,
  Handshake,
} from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/ShadCN/card";
import { motion } from "framer-motion";

const FeatureCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow h-full">
    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
      <div className="bg-cyan-100 dark:bg-cyan-900/50 p-3 rounded-lg text-[#23A4DA]">
        {icon}
      </div>
      <CardTitle className="text-slate-800 dark:text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-slate-600 dark:text-slate-300">
      {children}
    </CardContent>
  </Card>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Home() {
  return (
    <>
      {/* --- SEKSI HERO --- */}
      <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/kids-in-the-water.jpg"
            alt="Latar belakang lingkungan bersih"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
            priority
          />
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
        </div>
        <motion.div
          className="container z-10 flex flex-col items-center gap-6 px-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* ... Konten Hero Section tetap sama ... */}
          <div className="flex flex-col items-center gap-6">
            <motion.h1
              className="text-4xl font-extrabold tracking-tighter text-white drop-shadow-lg md:text-5xl lg:text-6xl"
              variants={itemVariants}
            >
              Satu Botol, Sejuta{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
                Harapan.
              </span>
            </motion.h1>

            <motion.p
              className="max-w-xl text-lg text-gray-200"
              variants={itemVariants}
            >
              Platform pintar untuk mengubah sampah plastik Anda menjadi poin
              berharga. Bergabunglah dengan gerakan untuk lingkungan yang lebih
              bersih.
            </motion.p>

            <motion.div
              className="mt-4 flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
              variants={itemVariants}
            >
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
                  className="w-full cursor-pointer border-white bg-transparent text-white hover:bg-white hover:text-black"
                >
                  <Building className="mr-2 size-5" />
                  Portal Mitra
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* --- SEKSI BARU DENGAN FULL SCREEN & ANIMASI --- */}
      <div className="w-full bg-white text-slate-800 dark:bg-slate-950 dark:text-white">
        {/* --- SEKSI CARA KERJA (FULL SCREEN) --- */}
        <section className="min-h-screen w-full flex flex-col justify-center">
          <div className="container mx-auto px-4 py-16 text-center">
            <motion.h2
              className="text-3xl font-bold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              Bagaimana Plastira Bekerja?
            </motion.h2>
            <motion.p
              className="mx-auto mt-2 max-w-2xl text-slate-600 dark:text-slate-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Hanya dengan 4 langkah mudah, sampah plastik Anda menjadi lebih
              bernilai.
            </motion.p>
            <motion.div
              className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={itemVariants}>
                <FeatureCard icon={<Recycle />} title="1. Kumpulkan & Request">
                  Kumpulkan sampah plastik Anda, lalu buat permintaan
                  penjemputan melalui aplikasi.
                </FeatureCard>
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard icon={<Truck />} title="2. Jemput & Verifikasi">
                  Tim kami akan menjemput sampah di lokasi Anda dan
                  memverifikasinya.
                </FeatureCard>
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard icon={<Star />} title="3. Dapatkan Poin">
                  Setelah terverifikasi, poin akan otomatis masuk ke akun Anda
                  sesuai berat sampah.
                </FeatureCard>
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard icon={<Gift />} title="4. Tukar Hadiah">
                  Tukarkan poin Anda dengan berbagai voucher dan hadiah menarik
                  dari mitra kami.
                </FeatureCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- SEKSI FITUR UNGGULAN (FULL SCREEN) --- */}
        <section className="min-h-screen bg-slate-50 dark:bg-slate-900 w-full flex flex-col justify-center">
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-center text-3xl font-bold">
              Lebih dari Sekadar Aplikasi Sampah
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600 dark:text-slate-400">
              Kami membangun ekosistem digital untuk memaksimalkan dampak
              positif Anda.
            </p>
            <motion.div
              className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<LayoutDashboard />}
                  title="Dashboard Interaktif"
                >
                  Pantau progres, poin, dan riwayat Anda dengan mudah.
                  Visualisasi data membantu Anda melihat dampak nyata yang telah
                  Anda buat.
                </FeatureCard>
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Trophy />}
                  title="Papan Peringkat & Lencana"
                >
                  Bersaing sehat dengan pengguna lain dan kumpulkan lencana
                  pencapaian. Jadilah pahlawan lingkungan nomor satu!
                </FeatureCard>
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard icon={<Sparkles />} title="Deteksi Sampah AI">
                  Bingung jenis plastik Anda? Gunakan fitur deteksi otomatis
                  menggunakan kamera untuk mengidentifikasi jenis sampah dengan
                  cepat.
                </FeatureCard>
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard icon={<Handshake />} title="Portal Mitra CSR">
                  Perusahaan dapat bergabung menjadi sponsor, memantau laporan
                  dampak CSR, dan menjadi bagian dari ekonomi sirkular.
                </FeatureCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="min-h-screen bg-slate-100 dark:bg-slate-900 w-full flex flex-col justify-center">
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold">
              Siap Menjadi Pahlawan Lingkungan?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-400">
              Daftar sekarang dan mulailah perjalanan Anda menuju lingkungan
              yang lebih bersih dan berkelanjutan.
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button size="lg" className="cursor-pointer">
                  <UserPlus className="mr-2 size-5" />
                  Daftar Sekarang, Gratis!
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="min-h-screen w-full flex flex-col justify-center">
          <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center">
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 p-10 text-white w-full max-w-4xl"
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold">
                Untuk Perusahaan & Instansi
              </h2>
              <p className="mx-auto mt-4 max-w-2xl">
                Jadilah bagian dari solusi. Salurkan program CSR Anda secara
                efektif dan transparan melalui Plastira. Dapatkan laporan dampak
                yang terukur dan tingkatkan citra perusahaan Anda sebagai
                entitas yang peduli lingkungan.
              </p>
              <div className="mt-8">
                <Link href="/mitra/login">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="cursor-pointer bg-white text-sky-600 hover:bg-slate-200"
                  >
                    <Building className="mr-2 size-5" />
                    Masuk ke Portal Mitra
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
