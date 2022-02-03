import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { viteExternalsPlugin } from "vite-plugin-externals";

const externalPlugin = viteExternalsPlugin({
  ...{ electron: "electron", "electron-fetch": "electron-fetch" },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    nodePolyfills({ include: ["stream", "url"] }),
    externalPlugin,
  ],
  define: {
    process: { env: {}, browser: true },
  },
  optimizeDeps: {
    exclude: ["rollup-pluginutils", "rollup-plugin-inject"],
  },
});
