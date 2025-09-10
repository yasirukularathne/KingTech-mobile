/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    config.externals = {
      ...config.externals,
      'html-to-text': 'html-to-text'
    };
    
    return config;
  },
  transpilePackages: ['html-to-text']
}

module.exports = nextConfig