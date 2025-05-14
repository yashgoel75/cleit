import type { Metadata } from "next";
import "./globals.css";

import Providers from "./Providers";
import rainbowKitConfig from "@/rainbowKitConfig";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "cleit",
  description: "",
};

export default function RootLayout(props: {children: ReactNode}) {
  return (
    <html lang="en">
      <body
      >
        {props.children}
      </body>
    </html>
  );
}
