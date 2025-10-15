import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['mdx', 'ts', 'tsx'],
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_S3_CDN_HOST_NAME as string,
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
    mdxRs: true,
  },
  env: {
    BLOG_POSTS_TABLE_NAME: process.env.BLOG_POSTS_TABLE_NAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    NEXT_PUBLIC_S3_CDN_HOST_NAME: process.env.NEXT_PUBLIC_S3_CDN_HOST_NAME,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    REGION_AWS: process.env.REGION_AWS,
    NEXTAUTH_URL: process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/signin',
  },
};

createMDX({
  extension: /\.(md|mdx)$/,
});

export default nextConfig;
