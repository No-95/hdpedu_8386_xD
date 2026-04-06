const { withOpenNext } = require("@opennextjs/cloudflare");

/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = withOpenNext(nextConfig);
