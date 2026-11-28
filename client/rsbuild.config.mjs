import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

const { publicVars } = loadEnv({ prefixes: ["REACT_APP_"] });
export default defineConfig(({ command }) => {
  const isBuild = command === "build";
  return {
    plugins: [pluginReact(), pluginSass()],
    source: { entry: { index: "./src/index.js" }, define: publicVars },
    html: { template: "./public/index.html" },
    output: {
      distPath: { root: "build" },
      ...(isBuild
        ? {
          copy: [
            {
              from: "public",
              to: ".",
              globOptions: { ignore: ["**/index.html"] },
            },
          ],
        }
        : {}),
    },
    server: {
      port: 3000,
      // Serve public/ directly from disk in dev instead of copying ~484 MB on startup.
      publicDir: isBuild ? false : { name: "public", copyOnBuild: false },
    },
    tools: {
      rspack: {
        // maplibre-gl ships a pre-minified single-line bundle whose dynamic require
        // dumps ~750 KB of minified JS into the terminal on every build.
        ignoreWarnings: [
          {
            module: /maplibre-gl/,
            message:
              /Critical dependency: the request of a dependency is an expression/,
          },
        ],
      },
    },
  };
});
