import { apiKeyAuthMiddleware, apiKeyWithUserAuthMiddleware } from "@lib/auth";
import { defaultRateLimiter, mutationRateLimiter } from "@lib/rate-limiter";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import type { AppEnv } from "./env";
import { guilds } from "./routes/guilds";
import { minigame } from "./routes/minigame";
import { users } from "./routes/users";

const app = new Hono<AppEnv>().basePath("/api");

// セキュリティヘッダーの追加
app.use(
  "*",
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      frameAncestors: ["'none'"],
    },
    strictTransportSecurity: "max-age=31536000; includeSubDomains; preload",
    xFrameOptions: "DENY",
    xContentTypeOptions: "nosniff",
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
      payment: [],
      usb: [],
    },
  }),
);

// ユーザーデータ関連APIはユーザーID認可チェック付き
app.use("/users/*", apiKeyWithUserAuthMiddleware);
app.use("/minigame/*", apiKeyWithUserAuthMiddleware);

// その他のAPIはAPIキー認証のみ
app.use("/*", apiKeyAuthMiddleware);

// レート制限（認証の後に適用）
app.use("/minigame/*", defaultRateLimiter);
app.use("/users/*", defaultRateLimiter);
app.use("/guilds/*", mutationRateLimiter);

// ルートマウントをチェーン化して型をキャプチャ
const routes = app
  .get("/health", (c) => c.json({ status: "ok" }))
  .route("/guilds", guilds)
  .route("/users", users)
  .route("/minigame", minigame);

export type AppType = typeof routes;
export default app;
