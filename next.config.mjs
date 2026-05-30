// When hosting under a sub-path (e.g. GitHub Project Pages at
// https://<user>.github.io/<repo>/), set PAGES_BASE_PATH=/<repo>. Leave it
// empty for a root domain (custom domain or Vercel).
const basePath = process.env.PAGES_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: {
    // Static export can't use the Next image optimizer; assets are remote
    // (Wayback Machine), so serve them as-is.
    unoptimized: true,
  },
};

export default nextConfig;
