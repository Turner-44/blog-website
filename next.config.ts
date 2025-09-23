import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
    pageExtensions: ['mdx', 'ts', 'tsx'],
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.becomingmatthew.com',
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

const withMDX = createMDX({
    extension: /\.(md|mdx)$/,
});

export default nextConfig;
