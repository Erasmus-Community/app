import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import ViteRuby from "vite-plugin-ruby";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [ViteRuby(), react(), tailwindcss()],
});
