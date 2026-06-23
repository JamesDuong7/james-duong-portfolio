import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    // Web3Forms requires client-side submission; map the server env var for the contact form.
    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: process.env.WEB3FORMS_ACCESS_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
