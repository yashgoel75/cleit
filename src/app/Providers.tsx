"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import config from "../rainbowKitConfig";
import { WagmiProvider } from "wagmi";
import { type ReactNode } from "react";
export default function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
          <RainbowKitProvider>
              {props.children}
          </RainbowKitProvider>
    </WagmiProvider>
  );
}
