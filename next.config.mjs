/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
	source: '/tmpartsapi/:path*',
	destination: `https://api.tmparts.ru/api/:path*`,
      },
    ]
  },
};

export default nextConfig;
