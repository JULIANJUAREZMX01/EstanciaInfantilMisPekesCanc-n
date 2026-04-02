import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  integrations: [
    solidJs(),
    tailwind()
  ],
  vite: {
    plugins: [
      wasm(),
      topLevelAwait()
    ]
  }
});
