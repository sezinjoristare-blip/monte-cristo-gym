import {
  fileURLToPath,
} from "node:url";

import react
  from "@vitejs/plugin-react";

import {
  defineConfig,
} from "vite";


const projectRoot =
  fileURLToPath(
    new URL(
      ".",
      import.meta.url
    )
  );


export default defineConfig({
  root:
    projectRoot,

  envDir:
    projectRoot,

  plugins: [
    react(),
  ],

  server: {
    port:
      5173,

    strictPort:
      true,
  },
});