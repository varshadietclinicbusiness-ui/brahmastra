import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Point at the sources so edits to components and CSS hot-reload.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@brahmastra/headless/format", replacement: r("../../packages/headless/src/format.ts") },
      { find: "@brahmastra/headless", replacement: r("../../packages/headless/src/index.ts") },
      { find: /^@brahmastra\/ui$/, replacement: r("../../packages/headless/src/index.ts") },
    ],
  },
  publicDir: r("../../docs/assets/photos"),
});
