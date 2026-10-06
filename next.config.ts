import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The site ships its illustrations as local SVGs in /public/images.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
