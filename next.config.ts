import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    localPatterns: [
      {
        pathname: "/api/image-proxy",
        search: "?url=*",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jantrasoft.online",
      },
      {
        protocol: "https",
        hostname: "jontro-backend.onrender.com",
      },
      {
        protocol: "https",
        hostname: "zhfmyrumuagbkwxoyryc.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ["**/.git/**", "**/.next/**", "**/node_modules/**"],
      };
    }

    return config;
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4005';
    const cleanUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    const apiBase = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

    return [
      {
        source: '/api/:path((?!image-proxy).*)',
        destination: `${apiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
// deployed Thu Apr  9 12:52:10 AM +06 2026
