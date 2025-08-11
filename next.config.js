/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL("https://avatars.githubusercontent.com/u/87940040?v=4"),
    ],
  },
};

module.exports = nextConfig;
