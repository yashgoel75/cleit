import type { Metadata } from "next";
import "./globals.css";

import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Cleit",
  description: "",
  manifest: "/manifest.webmanifest",
  themeColor: "#000000",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
      <html>
        <body>{props.children}</body>
      </html>
  );
}
