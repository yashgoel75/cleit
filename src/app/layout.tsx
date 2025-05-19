import type { Metadata } from "next";
import "./globals.css";

import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "cleit",
  description: "",
};

import Provider from "@/app/Providers";

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <Provider>
      <html>
        <body>{props.children}</body>
      </html>
    </Provider>
  );
}
