import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(() => ({
  plugins: [tailwindcss(), vue()],

  // Base path for GitHub Pages deployment
  // Set to '/<REPO_NAME>/' for GitHub Pages, or '/' for custom domains/other hosting
  // This is automatically set via the VITE_BASE_URL environment variable in CI
  base: process.env.VITE_BASE_URL || "/",

  build: {
    // Output directory for production build
    outDir: "dist",

    // Generate source maps for debugging (optional, can be disabled for smaller builds)
    sourcemap: false,

    // Ensure assets are properly chunked
    rollupOptions: {
      output: {
        // Consistent chunk naming for better caching
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },

  // Preview server configuration (for `npm run preview`)
  preview: {
    port: 4173,
    open: true,
  },
}));
