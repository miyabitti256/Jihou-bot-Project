import { Hono, type Context, type Next } from "hono";
import { users } from "./routes/users";
import { minigame } from "./routes/minigame";
import { guilds } from "./routes/guilds";
import { chat } from "./routes/chat";

const app = new Hono().basePath("/api");

const authMiddleware = async (c: Context, next: Next) => {
  const clientIp =
    c.req.header("x-forwarded-for") ||
    c.req.header("x-real-ip") ||
    c.env?.remoteAddr ||
    "127.0.0.1";

  const isLocalRequest =
    clientIp === "127.0.0.1" ||
    clientIp === "localhost" ||
    clientIp === "::1" ||
    clientIp.includes("127.0.0.1");

  if (isLocalRequest) {
    await next();
    return;
  }

  const apiKey = c.req.header("X-API-Key");
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return c.json(
      {
        status: "error",
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized - Invalid API Key",
          details: null,
        },
      },
      401,
    );
  }

  await next();
};
app.use("/*", authMiddleware);
app.get("/health", (c: Context) => c.json({ status: "ok" }));

app.route("/guilds", guilds);
app.route("/users", users);
app.route("/minigame", minigame);
app.route("/chat", chat);

export default app;
