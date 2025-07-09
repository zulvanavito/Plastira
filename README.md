# Komodo Smart Water 💧

<p align="center">
  <img src="https://user-images.githubusercontent.com/1234567/ (GANTI DENGAN URL LOGO PROYEK LO)" alt="Komodo Smart Water Logo" width="150"/>
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

**Komodo Smart Water** adalah sebuah aplikasi web MVP (*Minimum Viable Product*) yang dirancang untuk menjawab tantangan pengelolaan sampah di masyarakat, khususnya sampah plastik. Aplikasi ini memfasilitasi proses penjemputan sampah dari pengguna, memberikan penghargaan berupa poin (*loyalty program*), dan menyediakan data analitik bagi admin untuk memonitor aktivitas.

[cite_start]Proyek ini dibangun sebagai submisi untuk **IDCamp 2024 Developer Challenge #2 x SheHacks**, dengan mengambil *use case* dari startup **Komodo Water**[cite: 53, 58, 62].

## ✨ Fitur Utama

Aplikasi ini memiliki dua peran utama: **User** dan **Admin**.

### Untuk User:
- **🔐 Autentikasi**: Sistem registrasi dan login yang aman.
- **📊 Dashboard Interaktif**: Menampilkan total poin, ringkasan aktivitas, serta grafik tren pickup bulanan.
- **📍 Request Pickup**: Form permintaan penjemputan dengan deteksi lokasi otomatis menggunakan Geolocation API.
- **📜 Riwayat Transaksi**: Halaman riwayat dengan fitur filter berdasarkan status, paginasi, dan modal detail untuk setiap transaksi.
- **🗺️ Notifikasi Real-time (Konsep)**: Konsep untuk notifikasi status pickup secara langsung (menggunakan WebSockets).

### Untuk Admin:
- **📈 Dashboard Analitik**: Menampilkan statistik kunci (total pickup, status, total poin) dan visualisasi data melalui Bar Chart & Pie Chart.
- **🗺️ Peta Sebaran (GIS)**: Peta interaktif yang menampilkan semua lokasi pickup dari user, dengan marker yang bisa di-filter.
- **✅ Verifikasi & Manajemen**: Admin dapat melakukan verifikasi, menolak (dengan alasan), dan melihat detail setiap request pickup.
- **📑 Export Data**: Fitur untuk mengekspor data pickup ke format CSV dan Excel.
- **📇 Tampilan Kartu**: Daftar pickup disajikan dalam bentuk kartu yang modern dan responsif, lengkap dengan paginasi.

## 🛠️ Dibangun Dengan (Tech Stack)

- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **Database**: MongoDB dengan Mongoose
- **Visualisasi Data**: Chart.js, React-ChartJS-2
- **Peta**: Leaflet, React-Leaflet
- **Styling & Komponen**: shadcn/ui, lucide-react
- **Notifikasi**: Sonner
- **Animasi & Transisi**: Framer Motion

## 🏁 Memulai (Getting Started)

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut.

### Prasyarat

Pastikan lo punya Node.js dan npm (atau yarn/pnpm) yang terinstal di mesin lo.

### Instalasi

1.  **Clone repository ini:**
    ```bash
    git clone [https://github.com/username/nama-repo.git](https://github.com/username/nama-repo.git)
    cd nama-repo
    ```
2.  **Install semua dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment Variables:**
    Buat file baru bernama `.env.local` di root proyek dan isi dengan variabel berikut.
    ```env
    MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/nama_database"
    JWT_SECRET="iniadalahkuncirahasiajwtlo"
    ```
4.  **Jalankan server development:**
    ```bash
    npm run dev
    ```
5.  Buka [http://localhost:3000](http://localhost:3000) di browser lo.

---

Saran gue, ganti bagian URL logo dan URL repo Git-nya ya. *README* ini udah cukup lengkap buat ngasih gambaran proyek lo secara keseluruhan. Mantap!