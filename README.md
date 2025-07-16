# Plastira - Jadilah Pahlawan Lingkungan!

<p align="center">
  <img src="public/img/teks_icon.png" alt="Plastira Logo" width="150"/>
</p>

<p align="center">
  <strong>Ubah Sampah Plastik Menjadi Kebaikan.</strong><br/>
  Platform digital yang menghubungkan masyarakat dengan sistem pengelolaan sampah, mengubah sampah plastik menjadi poin berharga, dan mendukung ekonomi sirkular.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

---

## 🚀 Tentang Proyek

**Plastira** itu aplikasi web MVP yang _literally_ bikin _impact_ gede buat ngatasin masalah sampah di masyarakat, terutama sampah plastik. Bayangin aja, kamu bisa ngirim sampah, dapet poin, dan semua prosesnya transparan plus ada data analitiknya buat admin. Sekarang, Plastira makin _canggih_ karena ngelibatin juga **mitra perusahaan/instansi** buat ikutan gerakan ekonomi sirkular. _It's a full ecosystem, fam!_

Proyek ini hasil submisi buat **IDCamp 2024 Developer Challenge #2 x SheHacks**, terinspirasi dari _use case_ kerennya startup **Komodo Water**.

## ✨ Fitur Utama

Aplikasi ini punya tiga peran _kunci_ biar semua _flow_ berjalan mulus: **User**, **Admin**, dan **Mitra**.

### Untuk User:

- **🔐 Autentikasi Super Aman**: Registrasi dan login yang _reliable_, biar data kamu aman sentosa.
- **📊 Dashboard Interaktif & Personal**: Pantau poin, _activity summary_, dan grafik tren pickup bulanan kamu. _See your impact in real-time!_
- **📍 Request Pickup Gampang**: Form request penjemputan dengan deteksi lokasi otomatis via Geolocation API. Anti _ribet_!
- **🤖 Deteksi Sampah AI**: Bingung jenis plastik kamu apa? Pake fitur deteksi otomatis pakai kamera! _It's like magic, but tech!_
- **📜 Riwayat Transaksi Lengkap**: Semua histori transaksi kamu ada di sini, lengkap dengan filter status, paginasi, dan detail modal. _No more guessing!_
- **🔔 Notifikasi Real-time**: Dapatkan update status pickup kamu langsung, biar kamu selalu _up-to-date_ tanpa buka aplikasi terus.
- **🏆 Papan Peringkat & Lencana Kece**: Bersaing sehat sama user lain dan kumpulin lencana pencapaian. Jadi _top contributor_ lingkungan itu _goals_ banget!
- **🎁 Tukar Poin**: Poin yang terkumpul bisa kamu tukar dengan berbagai voucher dan hadiah menarik dari para mitra kami. _Rewards for being a hero!_

### Untuk Admin:

- **📈 Dashboard Analitik _Powerful_**: Lihat statistik kunci (total pickup, status, total poin) dan visualisasi data super jelas pakai Bar Chart & Pie Chart. _Data-driven decisions, for sure!_
- **🗺️ Peta Sebaran (GIS) & Peta Panas (Heatmap)**: Lihat semua lokasi pickup dari user di peta interaktif, bisa difilter. Plus, ada heatmap buat lihat area mana yang paling banyak sampahnya. _Strategic moves only!_
- **✅ Verifikasi & Manajemen Pickup Efisien**: Admin bisa dengan mudah verifikasi, menolak (plus kasih alasan), dan cek detail setiap request pickup. _Control in your hands!_
- **📑 Export Data Praktis**: Ekspor semua data pickup ke format CSV dan Excel dengan sekali klik. Buat laporan jadi _seamless_.
- **🎫 Manajemen Voucher Lengkap**: Tambah, edit, atau nonaktifkan voucher sponsorship. Kontrol penuh atas hadiah yang tersedia!

### Untuk Mitra (Perusahaan & Instansi):

- **🤝 Portal Khusus Mitra**: Login dan registrasi terpisah buat perusahaan atau instansi yang mau join.
- **📊 Laporan Dampak Transparan**: Pantau berapa banyak plastik yang sudah terkumpul berkat sponsorship kamu, jumlah voucher yang ditukar, dan berapa banyak warga yang terbantu. _See your CSR impact clearly!_
- **🌟 Kesempatan Sponsorship**: Jadi bagian dari solusi nyata dan dukung ekonomi sirkular Plastira dengan voucher-voucher keren. _Win-win solution!_

## 🛠️ Dibangun Dengan (Tech Stack)

Plastira dibangun dengan teknologi _kekinian_ yang ngejamin performa dan pengalaman pengguna yang _smooth_.

- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **Database**: MongoDB dengan Mongoose
- **Visualisasi Data**: Chart.js, React-ChartJS-2
- **Peta**: Leaflet, React-Leaflet, **Leaflet.heat**
- **Styling & Komponen**: shadcn/ui, lucide-react
- **Notifikasi**: **Sonner**
- **AI Deteksi Sampah**: **@teachablemachine/image**, **@tensorflow/tfjs**
- **Real-time Communication**: **Socket.io** (client & server)
- **Animasi & Transisi**: **Framer Motion**

## 🏁 Memulai (Getting Started)

Pengen coba proyek ini di laptop kamu? _Easy peasy_, ikutin langkah-langkah di bawah:

### Prasyarat

Pastikan kamu udah install Node.js dan npm (atau yarn/pnpm) di device kamu.

### Instalasi

1.  **Clone repository ini:**
    ```bash
    git clone [https://github.com/zulvanavito/Plastira.git](https://github.com/zulvanavito/Plastira.git)
    cd Plastira
    ```
2.  **Install semua dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment Variables:**
    Buat file baru bernama `.env.local` di root proyek dan isi dengan variabel berikut. Jangan lupa ganti isinya dengan info punya kamu ya!
    ```env
    MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/nama_database"
    JWT_SECRET="iniadalahkuncirahasiajwt" # Bikin yang panjang dan random ya!
    ```
4.  **Jalankan server development:**
    ```bash
    npm run dev
    ```
5.  Buka [http://localhost:3000](http://localhost:3000) di browser favorit kamu. _Voila!_

---

## 🌐 Link Deploy & Repo

Langsung cek Plastira yang udah dideploy di sini:
[https://plastira-285d6y89x-zulvana-avitos-projects.vercel.app/](https://plastira-285d6y89x-zulvana-avitos-projects.vercel.app/)

---
