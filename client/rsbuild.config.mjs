import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

const { publicVars } = loadEnv({ prefixes: ["REACT_APP_"] });
export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  source: { entry: { index: "./src/index.js" }, define: publicVars },
  html: { template: "./public/index.html" },
  output: {
    distPath: { root: "build" },
    copy: [
      { from: "public", to: ".", globOptions: { ignore: ["**/index.html"] } },
    ],
  },
  server: { port: 3000, publicDir: false },
});
