import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  experimental: {
    clientInstrumentationHook: true,
  },
};

export default withPWA(nextConfig);
