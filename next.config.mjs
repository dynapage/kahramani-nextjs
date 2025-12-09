/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Better Safari compatibility
  swcMinify: true,
  
  // Optimize for Safari mobile
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apikahramani-e8eddtdchububue6.southindia-01.azurewebsites.net',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
        pathname: '/**',
      },
    ],
    // Formats that work well in Safari
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Important headers for Safari and mobile browsers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Enable compression
          {
            key: 'Accept-Encoding',
            value: 'gzip, deflate, br'
          },
        ],
      },
      // Cache static assets
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Ensure proper redirects for trailing slashes
  trailingSlash: false,
  
  // Suppress hydration warnings in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
