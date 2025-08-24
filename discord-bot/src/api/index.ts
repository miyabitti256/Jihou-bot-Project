import { type Context, Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { auth } from "./routes/auth";
import { guilds } from "./routes/guilds";
import { minigame } from "./routes/minigame";
import { users } from "./routes/users";
import { jwtAuthWithAuthorizationMiddleware } from "@lib/auth-middleware";
import { hybridAuthMiddleware } from "@lib/jwt-auth";

const app = new Hono().basePath("/api");

// セキュリティヘッダーの追加
app.use("*", secureHeaders({
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
}));
// 認証エンドポイントは旧APIキー認証を使用（NextAuthで保護済み）
app.route("/auth", auth);

// ユーザーデータ関連APIは強化された認可チェックを使用
app.use("/users/*", jwtAuthWithAuthorizationMiddleware);
app.use("/minigame/*", jwtAuthWithAuthorizationMiddleware);

// その他のAPIは既存のハイブリッド認証を使用
app.use("/*", hybridAuthMiddleware);
app.get("/health", (c: Context) => c.json({ status: "ok" }));

app.route("/guilds", guilds);
app.route("/users", users);
app.route("/minigame", minigame);

export default app;
