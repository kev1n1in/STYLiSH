import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: "home.html",
        product: "index.html",
      },
    },
    outDir: "dist",
  },
  server: {
    open: "/home.html",
  },
});
