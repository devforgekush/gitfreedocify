import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for better deployment
  output: 'standalone',
  
  // Image optimization settings
  images: {
    unoptimized: true, // Required for Netlify deployment
  },
  
  // Environment variables that should be available at build time
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;
