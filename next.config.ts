import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Keep optimised images for only 60 s in dev so swapping files is instant.
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
