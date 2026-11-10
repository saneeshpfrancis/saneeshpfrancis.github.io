import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Automatically syncs simulations from `src/data/simulator` to `public/simulator`
 * (for dev and build) and `dist/simulator` (for production output).
 */
function syncSimulators(): Plugin {
  const sync = () => {
    const src = path.resolve(__dirname, "src/data/simulator");
    const pubDest = path.resolve(__dirname, "public/simulator");
    const distDest = path.resolve(__dirname, "dist/simulator");

    if (fs.existsSync(src)) {
      fs.cpSync(src, pubDest, { recursive: true, force: true });
      if (fs.existsSync(path.resolve(__dirname, "dist"))) {
        fs.cpSync(src, distDest, { recursive: true, force: true });
      }
    }
  };

  return {
    name: "sync-simulators",
    buildStart() {
      sync();
    },
    closeBundle() {
      sync();
    },
    configureServer(server) {
      sync();
      const simDir = path.resolve(__dirname, "src/data/simulator");
      server.watcher.add(simDir);
      server.watcher.on("all", (_event, file) => {
        if (typeof file === "string" && file.startsWith(simDir)) {
          sync();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), syncSimulators()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

