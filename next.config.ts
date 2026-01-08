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
        hostname: 'wecredit-blogs.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wcstaticasset.blob.core.windows.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wecredit-main-website-assets.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
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
