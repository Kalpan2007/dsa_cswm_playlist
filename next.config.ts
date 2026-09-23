import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: deploy the /out folder anywhere (Vercel, Netlify, GitHub Pages)
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
