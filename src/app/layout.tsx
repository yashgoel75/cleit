import type { Metadata } from "next";
import "./globals.css";

import Providers from "./Providers";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "cleit",
  description: "",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body>{props.children}</body>
        </Providers>
    </html>
  );
}
