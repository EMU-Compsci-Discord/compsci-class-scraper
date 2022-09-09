import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";

import manifest from "./manifest.json";
import { version } from "./package.json";

export default defineConfig({
  plugins: [
    crx({
      manifest: { ...manifest, version },
    }),
  ],
});
