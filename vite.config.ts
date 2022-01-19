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
      util: require.resolve("rollup-plugin-node-polyfills"),

      process: require.resolve("process-es6"),
    },
  },
});
