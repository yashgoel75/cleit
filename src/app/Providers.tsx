"use client";

import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import config from "@/rainbowKitConfig";
import { WagmiProvider } from "wagmi";
import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient()) ;
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {props.children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
