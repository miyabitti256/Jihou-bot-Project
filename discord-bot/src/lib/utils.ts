export function getTokyoDate(): Date {
  const now = new Date(new Date().getTime() - 5 * 60 * 60 * 1000);
  return new Date(now.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }));
}

export function hasDrawnToday(now: Date, lastDrawDate: Date): boolean {
  return (
    now.getFullYear() === lastDrawDate.getFullYear() &&
    now.getMonth() === lastDrawDate.getMonth() &&
    now.getDate() === lastDrawDate.getDate()
  );
}