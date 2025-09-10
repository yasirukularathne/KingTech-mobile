/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['html-to-text'],
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig