import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.strapi.io',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: "blogs.wecredit.co.in",
        pathname: '/uploads/**',
      }
      // Add your production Strapi domain here
      // {
      //   protocol: 'https',
      //   hostname: 'your-strapi-domain.com',
      //   pathname: '/uploads/**',
      // },
    ],
    // Allow localhost for development
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
