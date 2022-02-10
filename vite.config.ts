import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { viteExternalsPlugin } from "vite-plugin-externals";

const externalPlugin = viteExternalsPlugin({
  ...{
    electron: "electron",
    "electron-fetch": "electron-fetch",
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: "terser",
  },
  plugins: [react(), tsconfigPaths(), externalPlugin],
  resolve: {
    alias: {
      stream: resolve("./node_modules/stream-browserify"),
      url: resolve("./node_modules/url-polyfill"),
      fs: resolve("./node_modules/path-browserify"),
    },
  },
});
