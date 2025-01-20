/** @type {import('next').NextConfig} */

module.exports = {
    async rewrites() {
      return [
        {
          source: '/products',
          destination: '/frontend/products',
        },
      ];
    },
  };
