const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...setupDevPlatform(),
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/blog/community/HDP-Work-and-Korean-Community",
        destination: "/blog/community/hdp-work-and-korean-community",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
