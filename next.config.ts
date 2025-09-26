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
      bodySizeLimit: '2mb',
    },
    mdxRs: true,
  },
};

createMDX({
  extension: /\.(md|mdx)$/,
});

export default nextConfig;
