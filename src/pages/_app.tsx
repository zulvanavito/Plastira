import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Plastira - Jadilah Pahlawan Lingkungan!</title>
        <meta
          name="description"
          content="Plastira adalah platform yang menghubungkan masyarakat dengan petugas kebersihan untuk pengelolaan sampah yang lebih baik."
        />
        <link rel="icon" href="/img/logo.png" />
      </Head>

      <Component {...pageProps} />
      <Toaster richColors position="top-center" />
    </>
  );
}