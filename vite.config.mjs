import { defineConfig } from "vite";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
    plugins: [{
        name: "copy-algorithm-data",
        generateBundle() {
            const dataDirectory = resolve(process.cwd(), "data");

            for (const file of readdirSync(dataDirectory)) {
                if (file.endsWith(".js")) {
                    this.emitFile({
                        type: "asset",
                        fileName: `data/${file}`,
                        source: readFileSync(resolve(dataDirectory, file))
                    });
                }
            }
        }
    }],
    server: {
        proxy: {
            "/api": "http://localhost:5000"
        }
    },
    preview: {
        proxy: {
            "/api": "http://localhost:5000"
        }
    },
    build: {
        rollupOptions: {
            input: {
                index: resolve(process.cwd(), "index.html"),
                about: resolve(process.cwd(), "about.html"),
                algorithms: resolve(process.cwd(), "algorithms.html"),
                explanation: resolve(process.cwd(), "explanation.html"),
                practice: resolve(process.cwd(), "practice.html"),
                profile: resolve(process.cwd(), "profile.html"),
                signin: resolve(process.cwd(), "signin.html"),
                signup: resolve(process.cwd(), "signup.html"),
                visualizer: resolve(process.cwd(), "visualizer.html")
            }
        }
    }
});