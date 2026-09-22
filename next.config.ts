import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: { optimizePackageImports: ['@react-three/drei'] },
  images: { unoptimized: true }
};

export default nextConfig;
