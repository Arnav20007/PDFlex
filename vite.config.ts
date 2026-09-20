import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import handler from "./api/convert";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env.CLOUDCONVERT_API_KEY = env.CLOUDCONVERT_API_KEY;

  return {
    plugins: [
      react(),
      {
        name: "api-serverless-dev-middleware",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith("/api/convert")) {
              try {
                if (req.method === "POST") {
                  let rawBody = "";
                  req.on("data", (chunk) => {
                    rawBody += chunk;
                  });
                  req.on("end", async () => {
                    try {
                      (req as any).body = rawBody ? JSON.parse(rawBody) : {};
                    } catch {
                      (req as any).body = {};
                    }
                    await handler(req, res);
                  });
                } else {
                  await handler(req, res);
                }
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: err.message }));
              }
            } else {
              next();
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        "/api/compress": "http://127.0.0.1:8000",
        "/api/pdf-to-docx": "http://127.0.0.1:8000",
        "/api/pdf-to-txt": "http://127.0.0.1:8000",
        "/api/pdf-to-images": "http://127.0.0.1:8000",
      },
    },
  };
});