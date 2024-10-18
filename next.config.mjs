/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.mlstatic.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "**.vtexassets.com",
        port: ""
      }
    ]
  }
};

export default nextConfig;
