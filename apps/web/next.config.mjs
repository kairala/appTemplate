import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  output: "export",
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
