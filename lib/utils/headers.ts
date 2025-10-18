export const securityHeaders = [
  {
    source: '/(.*)',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self';",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cloudfront.net https://*.amplifyapp.com;",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
          `img-src 'self' data: blob: ${process.env.NEXT_PUBLIC_BASE_URL} https://${process.env.NEXT_PUBLIC_S3_CDN_HOST_NAME} https://*.cloudfront.net  /_next/image;`,
          "font-src 'self' https://fonts.gstatic.com;",
          "connect-src 'self' https://*.amplifyapp.com https://*.cloudfront.net;",
          "frame-ancestors 'none'; object-src 'none';",
        ].join(' '),
      },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ],
  },
];
