"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  sepolia,
  polygon,
  optimism,
  arbitrum,
  base,
} from "wagmi/chains";

export default getDefaultConfig({
    appName: "Cleit",
    projectId: '1605aa6147cfeaa3bf3b7cda84dc7132',
    chains: [mainnet, sepolia, polygon, optimism, arbitrum, base],
    ssr: false,
  })