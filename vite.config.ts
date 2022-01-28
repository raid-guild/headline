import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    process: { env: {}, browser: true },
  },
  resolve: {
    alias: {
      util: resolve("rollup-plugin-node-polyfills"),

      process: resolve("process-es6"),
    },
  },
});
