import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname:
                    'becomingmatthew-blog-bucket.s3.us-east-1.amazonaws.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
