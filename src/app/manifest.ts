import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cleit",
    short_name: "cleit",
    description: "",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      { src: "/cleit512.png", sizes: "512x512", type: "image/png" },
      { src: "/cleit192.png", sizes: "192x192", type: "image/png" },
    ],
  };
}
