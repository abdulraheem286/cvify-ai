import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the headless-Chromium packages out of the bundler so the
  // serverless PDF function can load them at runtime.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core", "docx"],
  // Force the Chromium binary files into the /api/pdf serverless function.
  outputFileTracingIncludes: {
    "/api/pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
};

export default nextConfig;
