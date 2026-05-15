import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    ...legacy({
      targets: ["chrome >= 56"],
      modernPolyfills: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
