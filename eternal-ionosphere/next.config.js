/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  env: {
    ANTIGRAVITY_API_URL: process.env.ANTIGRAVITY_API_URL || 'http://localhost:8000',
  },
}

module.exports = nextConfig
