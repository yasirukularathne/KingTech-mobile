/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["html-to-text", "entities"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
