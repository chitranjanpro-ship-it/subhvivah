import path from "path";
import fs from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { mochaPlugins } from "@getmocha/vite-plugins";

export default defineConfig({
  base: process.env.DEPLOY_TARGET === "GH_PAGES" ? "/subhvivah/" : "/",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
	  plugins: [
	    ...mochaPlugins(process.env as any),
	    react(),
	    ...(process.env.ENABLE_CF_DEV === "1"
	      ? [
	          (() => {
	            const auxPath = path.resolve(__dirname, "mocha/emails-service/wrangler.json");
	            if (fs.existsSync(auxPath)) {
	              return cloudflare({ auxiliaryWorkers: [{ configPath: auxPath }] });
	            }
	            return cloudflare();
	          })(),
	        ]
	      : []),
	  ],
	  server: {
	    allowedHosts: true,
	  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
