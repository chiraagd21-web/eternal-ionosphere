/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    ANTIGRAVITY_API_URL: process.env.VERCEL ? (process.env.backend_URL || '/_/backend') : (process.env.ANTIGRAVITY_API_URL || 'http://localhost:8000'),
    NEXT_PUBLIC_API_URL: process.env.VERCEL ? '/_/backend' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'),
  },
}

module.exports = nextConfig
