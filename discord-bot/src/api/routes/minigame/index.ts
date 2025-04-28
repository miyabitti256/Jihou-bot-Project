import { Hono } from "hono";
import { coinflip } from "./coinflip";
import { omikuji } from "./omikuji";

export const minigame = new Hono();

minigame.route("/omikuji", omikuji);
minigame.route("/coinflip", coinflip);
