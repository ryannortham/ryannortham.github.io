import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ryannortham.dev",
  integrations: [mdx(), sitemap({ filter: (page) => !new URL(page).pathname.startsWith("/hermes-calendar/") })],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
});
