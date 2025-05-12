import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['github.com'], // chỉ hostname
    // hoặc nếu bạn muốn linh hoạt hơn:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'github.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
};

export default nextConfig;
