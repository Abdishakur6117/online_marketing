import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // This will enable JSX in .js files too
      include: ["**/*.jsx", "**/*.js", "**/*.ts", "**/*.tsx"],
    }),
    tailwindcss(),
  ],
  // Optional: Add these resolve aliases for cleaner imports
  resolve: {
    alias: {
      "@": "/src",
      "@services": "/src/services",
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000", // backend address (Express)
    },
  },
});
