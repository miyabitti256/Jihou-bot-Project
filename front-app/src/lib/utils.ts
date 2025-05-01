import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTokyoDate(): Date {
  const now = new Date(new Date().getTime() - 5 * 60 * 60 * 1000);
  return new Date(now.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }));
}

export function hasDrawnToday(now: Date, lastDraw: Date): boolean {
  return (
    now.getFullYear() === lastDraw.getFullYear() &&
    now.getMonth() === lastDraw.getMonth() &&
    now.getDate() === lastDraw.getDate()
  );
}
