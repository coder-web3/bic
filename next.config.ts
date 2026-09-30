import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.1.39',
    '192.168.1.39:3001',
    '192.168.1.*',
    '192.168.*.*',
    '10.*.*.*',
    'localhost',
    'localhost:3001',
    '127.0.0.1',
    '127.0.0.1:3001',
    '0.0.0.0',
    '*.local'
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
};

export default nextConfig;
