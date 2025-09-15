import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.hv6.dev',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Link',
            value: '<https://cdn.hv6.dev/images/logos/lighting_thunderbolt_red.jpg?height=32&width=32>; rel="icon"; type="image/jpeg"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
