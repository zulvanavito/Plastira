import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Tambahin bagian ini
  eslint: {
    // Warning: Ini bakal ngebolehin build sukses walaupun ada error ESLint.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;