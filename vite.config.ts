import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { viteExternalsPlugin } from "vite-plugin-externals";

const externals = {
  electron: "electron",
  "electron-fetch": "electron-fetch",
  stream: "readable-stream",
};

const externalPlugin = viteExternalsPlugin({
  ...externals,
});

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    commonjsOptions: {
      include: /node_modules/,
      transformMixedEsModules: true,
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    nodePolyfills({ include: ["url", "buffer"] }),
    externalPlugin,
  ],
  resolve: {
    preserveSymlinks: true,
    mainFields: ["module", "main", "browser"],
    alias: {
      "~~": resolve(__dirname, "src"),
    },
  },
});
