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
        source: '/api/services',
        destination: `${apiBase}/services`,
      },
      {
        source: '/api/leads',
        destination: `${apiBase}/leads`,
      },
      {
        source: '/api/settings',
        destination: `${apiBase}/settings`,
      },
      {
        source: '/api/auth/:path*',
        destination: `${apiBase}/auth/:path*`,
      },
      {
        source: '/api/admin/:path*',
        destination: `${apiBase}/admin/:path*`,
      },
      {
        source: '/api/blog/:path*',
        destination: `${apiBase}/blog/:path*`,
      },
      {
        source: '/api/work/:path*',
        destination: `${apiBase}/work/:path*`,
      },
      {
        source: '/api/careers/:path*',
        destination: `${apiBase}/careers/:path*`,
      },
      {
        source: '/api/testimonials/:path*',
        destination: `${apiBase}/testimonials/:path*`,
      },
      {
        source: '/api/team/:path*',
        destination: `${apiBase}/team/:path*`,
      },
      {
        source: '/api/stats/:path*',
        destination: `${apiBase}/stats/:path*`,
      },
      {
        source: '/api/upload/:path*',
        destination: `${apiBase}/upload/:path*`,
      },
      {
        source: '/api/reports/:path*',
        destination: `${apiBase}/reports/:path*`,
      },
      {
        source: '/api/migrate/:path*',
        destination: `${apiBase}/migrate/:path*`,
      },
      {
        source: '/api/finance/:path*',
        destination: `${apiBase}/finance/:path*`,
      },
    ];
  },
};

export default nextConfig;
// deployed Thu Apr  9 12:52:10 AM +06 2026
