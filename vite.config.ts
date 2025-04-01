import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
// https://vite.dev/config/
export default defineConfig({
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))", // <-- Agrega esto
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [react(), tailwindcss()],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
