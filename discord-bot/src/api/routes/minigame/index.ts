import { Hono } from "hono";
import { omikuji } from "./omikuji";
import { coinflip } from "./coinflip";

export const minigame = new Hono();

minigame.route("/omikuji", omikuji);
minigame.route("/coinflip", coinflip);
