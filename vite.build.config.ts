import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist/cdn",
        lib: {
            name: "ilw-tooltip",
            entry: "ilw-tooltip.ts",
            fileName: "ilw-tooltip",
            formats: ["es"],
        },
        rollupOptions: {
            output: {
                assetFileNames: () => {
                    return "[name][extname]";
                }
            },
        },
    },
    server: {
        hmr: false,
    },
});
