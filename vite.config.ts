import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";

import manifest from "./manifest.json";
import { version } from "./package.json";

export default defineConfig({
  build: {
    polyfillModulePreload: false,
    target: "esnext",
  },
  plugins: [
    crx({
      manifest: { ...manifest, version },
    }),
  ],
});
