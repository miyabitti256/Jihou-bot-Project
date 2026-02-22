import { apiKeyAuthMiddleware, apiKeyWithUserAuthMiddleware } from "@lib/auth";
import { defaultRateLimiter, mutationRateLimiter } from "@lib/rate-limiter";
import { type Context, Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { guilds } from "./routes/guilds";
import { minigame } from "./routes/minigame";
import { users } from "./routes/users";

const app = new Hono().basePath("/api");

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

// ヘルスチェックは認証不要
app.get("/health", (c: Context) => c.json({ status: "ok" }));

// ユーザーデータ関連APIはユーザーID認可チェック付き
app.use("/users/*", apiKeyWithUserAuthMiddleware);
app.use("/minigame/*", apiKeyWithUserAuthMiddleware);

// その他のAPIはAPIキー認証のみ
app.use("/*", apiKeyAuthMiddleware);

// レート制限（認証の後に適用）
app.use("/minigame/*", defaultRateLimiter);
app.use("/users/*", defaultRateLimiter);
app.use("/guilds/*", mutationRateLimiter);

app.route("/guilds", guilds);
app.route("/users", users);
app.route("/minigame", minigame);

export default app;

