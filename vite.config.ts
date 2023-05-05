import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";

import manifest from "./manifest.json";
import { version } from "./package.json";

export default defineConfig({
  build: {
    polyfillModulePreload: false,
    target: "esnext",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "assets/[name].js",
      },
    },
  },
  plugins: [
    crx({
      manifest: { ...manifest, version },
    }),
  ],
});
