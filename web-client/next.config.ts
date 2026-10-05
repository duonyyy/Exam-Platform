import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // ---------------------------------------------------------------------------
  // Reverse Proxy to Laravel Backend:
  // Proxies /api/backend/:path* -> Backend Laravel REST API (/api/v1/:path*)
  // Lợi ích: Trình duyệt xem request là First-Party, triệt tiêu lỗi CORS và Cookie bị chặn
  // ---------------------------------------------------------------------------
  async rewrites() {
    const backendUrl = process.env.INTERNAL_BACKEND_URL || 'http://localhost:8000/api/v1';
    return [
      {
        source: '/api/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
