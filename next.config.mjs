/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["html-to-text", "entities"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    serverActions: {
      // Keep conservative to stay within Vercel function limits
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
