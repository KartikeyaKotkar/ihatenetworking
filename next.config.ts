import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev opened via LAN IP (e.g. http://192.168.1.158:3000): Next blocks
  // cross-origin dev assets by default, which silently kills hydration
  // (pages render but calculators never respond). Allow the LAN host.
  // If your machine IP changes, add it here and restart `next dev`.
  allowedDevOrigins: ["192.168.1.158"],
};

export default nextConfig;
