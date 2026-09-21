import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ryannortham.blog",
  integrations: [mdx(), sitemap()],
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
});
