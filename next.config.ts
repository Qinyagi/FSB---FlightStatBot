import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Vercel deployment
  output: 'export',
  trailingSlash: true,
  distDir: 'out-modal-fix',
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

};

export default nextConfig;