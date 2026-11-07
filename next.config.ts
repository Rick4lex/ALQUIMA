import type {NextConfig} from 'next';

const isExport = process.env.GITHUB_ACTIONS === 'true' || process.env.NEXT_EXPORT === 'true';
const basePath = process.env.PAGES_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: isExport ? 'export' : 'standalone',
  ...(basePath ? { basePath } : {}),
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: isExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dyeppbrfl/**',
      }
    ],
  },
};

export default nextConfig;
