import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

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
      precompress: true,
      strict: true,
    }),
  },
};

export default config;
