/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  experimental: {
    instrumentationHook: true,
  },
}

export default nextConfig
