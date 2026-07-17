import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTokyoDate(dateInput?: Date | string | number): Date {
  // JST 05:00 リセット: 5時間引いてからJST日付を求める
  const base = dateInput ? new Date(dateInput) : new Date();
  const shifted = new Date(base.getTime() - 5 * 60 * 60 * 1000);
  const jstDateStr = shifted.toLocaleDateString("en-CA", {
    timeZone: "Asia/Tokyo",
  });
  return new Date(`${jstDateStr}T00:00:00+09:00`);
}

export function hasDrawnToday(now: Date, lastDraw: Date): boolean {
  const getJstDateString = (d: Date) =>
    d.toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" });

  return getJstDateString(now) === getJstDateString(lastDraw);
}
