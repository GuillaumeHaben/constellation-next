/** @type {import('next').NextConfig} */
const isProdPages = process.env.NEXT_PUBLIC_GITLAB_PAGES === '1';
const nextConfig = {
    output: 'export',
    images: { unoptimized: true },
    basePath: isProdPages ? '/constellation' : '',       // only use basePath on GitLab Pages
    assetPrefix: isProdPages ? '/constellation/' : '',
    trailingSlash: true,
};

export default nextConfig;
