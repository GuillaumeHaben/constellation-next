import process from 'node:process';

/** @type {import('next').NextConfig} */
const isProdPages = process.env.NEXT_PUBLIC_GITLAB_PAGES === '1';
const PROJECT_NAME = 'constellation';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isProdPages ? `/${PROJECT_NAME}` : '',
  assetPrefix: isProdPages ? `/${PROJECT_NAME}/` : '',
  trailingSlash: true,
};

export default nextConfig;
