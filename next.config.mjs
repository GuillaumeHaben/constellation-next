/** @type {import('next').NextConfig} */
const isProdPages = process.env.NEXT_PUBLIC_GITLAB_PAGES === '1';
const PROJECT_NAME = 'constellation';

const nextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    console.log('[DEBUG] Next.config rewrites() called');
    console.log('[DEBUG] Env Vars:', {
      DOCKER_RUNTIME: process.env.DOCKER_RUNTIME,
      INTERNAL_API_URL: process.env.INTERNAL_API_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      HOSTNAME: process.env.HOSTNAME
    });

    // Definitive check: Are we in Docker?
    if (process.env.DOCKER_RUNTIME) {
      console.log(' [NEXT.JS CONFIG] Detected Docker Runtime. Using internal Strapi URL.');
      const strapiUrl = 'http://strapi:1337';
      return [
        { source: '/api/:path*', destination: `${strapiUrl}/api/:path*` },
        { source: '/uploads/:path*', destination: `${strapiUrl}/uploads/:path*` },
      ];
    }

    // Fallback for Local Dev (localhost)
    // Checks NEXT_PUBLIC_API_URL or defaults to 127.0.0.1
    const strapiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337';
    console.log(` [NEXT.JS CONFIG] Local Dev Detected. Using: ${strapiUrl}`);

    return [
      { source: '/api/:path*', destination: `${strapiUrl}/api/:path*` },
      { source: '/uploads/:path*', destination: `${strapiUrl}/uploads/:path*` },
    ];
  },
  // basePath: isProdPages ? `/${PROJECT_NAME}` : '',
  // assetPrefix: isProdPages ? `/${PROJECT_NAME}/` : '',
  trailingSlash: true,
};

export default nextConfig;
