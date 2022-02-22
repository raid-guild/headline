import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { viteExternalsPlugin } from "vite-plugin-externals";
import inject from "@rollup/plugin-inject";
const externalPlugin = viteExternalsPlugin({
  ...{
    electron: "electron",
    "electron-fetch": "electron-fetch",
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), externalPlugin],
  // build: {
  //   sourcemap: true,
  //   commonjsOptions: {
  //     include: /node_modules/,
  //     transformMixedEsModules: true,
  //     ignoreTryCatch: false,
  //   },
  // },
  resolve: {
    alias: {
      stream: "stream-browserify",
      url: "url-polyfill",
      // fs: resolve("./node_modules/path-browserify"),
      http: "http-browserify",
      https: "http-browserify",
      process: "process-es6",
      "~~": resolve(__dirname, "src"),
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
