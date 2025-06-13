import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist",
        lib: {
            name: "ilw-tooltip",
            entry: "ilw-tooltip.js",
            fileName: "ilw-tooltip",
            formats: ["es", "cjs", "umd"],
        },
        rollupOptions: {
            output: {
                assetFileNames: (chunkInfo) => {
                    if (chunkInfo.name === "style.css") return "ilw-tooltip.css";
                },
            },
        },
    },
    server: {
        hmr: false,
    },
});
