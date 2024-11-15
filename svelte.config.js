import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { minifyHtml } from "vite-plugin-html";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "404.html",
      paths: {
        base: process.env.BASE_PATH || "",
      },
      files: {
        assets: "static",
      },
      precompress: false,
      strict: true,
    }),
  },
  vite: {
  plugins: [
    minifyHtml({
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      minifyCSS: true,
      minifyJS: true,
    }),
  ],
  }
};

export default config;
