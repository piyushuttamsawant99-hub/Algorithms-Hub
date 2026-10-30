import { defineConfig } from "vite";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
    plugins: [{
        name: "copy-algorithm-data",
        generateBundle() {
            const dataDirectory = resolve(process.cwd(), "data");

            if (readdirSync(dataDirectory).includes("explanations.js")) {
                this.emitFile({
                    type: "asset",
                    fileName: "data/explanations.js",
                    source: readFileSync(resolve(dataDirectory, "explanations.js"))
                });
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