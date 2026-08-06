/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/admin/dashboard/partner",
        destination: "/admin/partners",
        permanent: true,
      },
      {
        source: "/admin/dashboard/partners",
        destination: "/admin/partners",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;