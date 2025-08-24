import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval and unsafe-inline
              "style-src 'self' 'unsafe-inline'", // Tailwind CSS requires unsafe-inline
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://discord.com https://discordapp.com https://*.vercel.app https://*.fly.dev",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          // セキュリティヘッダー
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Strict Transport Security (HTTPS強制)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // パーミッション制御
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=()',
              'usb=()',
            ].join(', '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
