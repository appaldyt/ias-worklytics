/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // No API rewrite needed - nginx handles routing to backend
  // Frontend and backend served from same domain
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  }
}

module.exports = nextConfig