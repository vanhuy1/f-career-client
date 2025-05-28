import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'github.com',
      'githubusercontent.com',
      'cloudinary.com',
      'res.cloudinary.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'storage.googleapis.com',
    ],
  },
};

export default nextConfig;
