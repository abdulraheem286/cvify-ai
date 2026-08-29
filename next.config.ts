import type { NextConfig } from "next";

const FIREBASE_APP_DOMAIN = "cvify-ai-286.firebaseapp.com";

const nextConfig: NextConfig = {
  // Keep the headless-Chromium packages out of the bundler so the
  // serverless PDF function can load them at runtime.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  // Force the Chromium binary files into the /api/pdf serverless function.
  outputFileTracingIncludes: {
    "/api/pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
  // Serve Firebase Auth OAuth handler from our own domain so the Google
  // sign-in screen says "continue to cvifyai.com" instead of the
  // *.firebaseapp.com project URL. Takes effect once
  // NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN points at www.cvifyai.com.
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: `https://${FIREBASE_APP_DOMAIN}/__/auth/:path*`,
      },
      {
        source: "/__/firebase/:path*",
        destination: `https://${FIREBASE_APP_DOMAIN}/__/firebase/:path*`,
      },
    ];
  },
};

export default nextConfig;
