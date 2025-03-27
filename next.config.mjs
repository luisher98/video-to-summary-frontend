/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output for Docker
  experimental: {
    // Enable React 19 features
    react: {
      serverComponents: true,
      serverActions: {
        bodySizeLimit: '2mb'
      }
    },
    // Enable optimizations
    optimizePackageImports: ['@/components'],
    turbo: {
      rules: {
        // Opt into Turbopack's static optimization features
        '*.svg': ['@svgr/webpack'],
      }
    },
    // Better error overlay
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB', 'INP'],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
      },
    ],
  },
};

export default config;
