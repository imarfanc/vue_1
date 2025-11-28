import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [tailwindcss(), mdx(), vue()],
});
