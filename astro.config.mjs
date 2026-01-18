import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://georgerodier.com/",
  integrations: [react()],
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontshare(),
        name: "Pally",
        cssVariable: "--font-synonym",
        fallbacks: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    ],
  },
});
