import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared"),
      "@": path.resolve(__dirname, "./src"),
      '@ui': path.resolve(__dirname, '../../packages/ui'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: [
            "@tanstack/react-query",
            "date-fns",
            "@supabase/supabase-js",
          ],
        },
      },
    },
  },
});
