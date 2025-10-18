import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Vercel deployment (API routes work in serverless)
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;