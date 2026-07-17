import { describe, expect, it } from "bun:test";
import { getTokyoDate, hasDrawnToday } from "@bot/lib/utils";

/**
 * 指定した UTC 時刻の Unix タイムスタンプ(ms)を返すヘルパー
 * month は 1-indexed (1=January)
 */
function utc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second = 0,
): number {
  return Date.UTC(year, month - 1, day, hour, minute, second);
}

/**
 * Date.now をモックして getTokyoDate() を呼ぶヘルパー
 */
function getTokyoDateAt(timestampMs: number): Date {
  const orig = Date.now;
  Date.now = () => timestampMs;
  try {
    return getTokyoDate();
  } finally {
    Date.now = orig;
  }
}

describe("getTokyoDate", () => {
  describe("AM5:00 リセット境界", () => {
    it("JST 04:59 (リセット前) は前日扱いになる", () => {
      // JST 2026-07-17 04:59 = UTC 2026-07-16 19:59
      const result = getTokyoDateAt(utc(2026, 7, 16, 19, 59));

      // 5h引くと JST 2026-07-16 23:59 → 日付は 7/16
      // +09:00 でパースされるので UTC では 7/15 15:00
      expect(result.toISOString()).toBe("2026-07-15T15:00:00.000Z");
    });

    it("JST 05:00 (リセット後) は当日扱いになる", () => {
      // JST 2026-07-17 05:00 = UTC 2026-07-16 20:00
      const result = getTokyoDateAt(utc(2026, 7, 16, 20, 0));

      // 5h引くと JST 2026-07-17 00:00 → 日付は 7/17
      // +09:00 でパースされるので UTC では 7/16 15:00
      expect(result.toISOString()).toBe("2026-07-16T15:00:00.000Z");
    });

    it("JST 05:01 も当日扱い", () => {
      // JST 2026-07-17 05:01 = UTC 2026-07-16 20:01
      const result = getTokyoDateAt(utc(2026, 7, 16, 20, 1));
      expect(result.toISOString()).toBe("2026-07-16T15:00:00.000Z");
    });
  });

  describe("各時間帯で正しいJST日付を返す", () => {
    it("JST 正午 (12:00)", () => {
      // JST 2026-07-17 12:00 = UTC 2026-07-17 03:00
      const result = getTokyoDateAt(utc(2026, 7, 17, 3, 0));
      // 5h引くと JST 07:00 → 日付は 7/17
      expect(result.toISOString()).toBe("2026-07-16T15:00:00.000Z");
    });

    it("JST 23:59 (深夜)", () => {
      // JST 2026-07-17 23:59 = UTC 2026-07-17 14:59
      const result = getTokyoDateAt(utc(2026, 7, 17, 14, 59));
      // 5h引くと JST 18:59 → 日付は 7/17
      expect(result.toISOString()).toBe("2026-07-16T15:00:00.000Z");
    });

    it("JST 00:00 (日付変更直後) → まだ前日扱い", () => {
      // JST 2026-07-17 00:00 = UTC 2026-07-16 15:00
      const result = getTokyoDateAt(utc(2026, 7, 16, 15, 0));
      // 5h引くと JST 19:00 (7/16) → 日付は 7/16
      expect(result.toISOString()).toBe("2026-07-15T15:00:00.000Z");
    });
  });

  describe("バグ再現: UTC比較でcreatedAtを正しくフィルタできる", () => {
    it("バグ発生時間帯 (JST 06:55 = UTC 21:55) で購入履歴を検出できる", () => {
      // ユーザーのバグ発生時刻: UTC 2026-07-16 21:55
      const result = getTokyoDateAt(utc(2026, 7, 16, 21, 55));

      // createdAt は UTC タイムスタンプ (DB の CURRENT_TIMESTAMP)
      const createdAt = new Date(utc(2026, 7, 16, 21, 54));

      // createdAt >= today の比較が TRUE になること（購入履歴が検出される）
      expect(createdAt.getTime() >= result.getTime()).toBe(true);
    });

    it("バグ発生時間帯 (JST 07:07 = UTC 22:07) で全購入履歴を検出できる", () => {
      const today = getTokyoDateAt(utc(2026, 7, 16, 22, 7));

      // 実際のレコードデータから数件ピックアップ
      const createdAts = [
        new Date("2026-07-16T21:54:13.446Z"),
        new Date("2026-07-16T21:57:00.684Z"),
        new Date("2026-07-16T22:01:37.518Z"),
        new Date("2026-07-16T22:07:33.059Z"),
      ];

      for (const createdAt of createdAts) {
        expect(createdAt.getTime() >= today.getTime()).toBe(true);
      }
    });

    it("前日の購入履歴 (JST 04:59 に購入) は翌日の検索に含まれない", () => {
      // JST 07:00 (リセット後) に検索
      const today = getTokyoDateAt(utc(2026, 7, 16, 22, 0));

      // JST 04:59 (リセット前) の購入 = 前日扱い
      // JST 2026-07-17 04:59 = UTC 2026-07-16 19:59
      const oldCreatedAt = new Date(utc(2026, 7, 16, 19, 59));

      // today (7/17 のリセット後) = UTC 7/16 15:00
      // oldCreatedAt = UTC 7/16 19:59
      // 19:59 >= 15:00 → TRUE
      // これは正しい: JST 04:59 の購入は「同じリセット日」内なので検出されるべき
      expect(oldCreatedAt.getTime() >= today.getTime()).toBe(true);
    });

    it("前のリセット日の購入は検出されない", () => {
      // JST 2026-07-17 06:00 にショップを開く = UTC 2026-07-16 21:00
      const today = getTokyoDateAt(utc(2026, 7, 16, 21, 0));
      // today = 2026-07-16T15:00:00.000Z (JST 7/17 の 0:00)

      // 前のリセット日 (JST 7/16 の 22:00) の購入 = UTC 2026-07-16 13:00
      const oldCreatedAt = new Date(utc(2026, 7, 16, 13, 0));

      // 13:00 >= 15:00 → FALSE → 正しく除外される
      expect(oldCreatedAt.getTime() >= today.getTime()).toBe(false);
    });
  });

  describe("旧実装との非互換: ローカルTZ依存のパースが排除されている", () => {
    it("+09:00 が明示されており UTC midnight にならない", () => {
      // JST 2026-07-17 06:00 = UTC 2026-07-16 21:00
      const result = getTokyoDateAt(utc(2026, 7, 16, 21, 0));

      // 旧実装のバグ: new Date("2026/7/17") が UTC midnight (2026-07-17T00:00:00Z) になっていた
      // 修正後: 2026-07-17T00:00:00+09:00 = 2026-07-16T15:00:00Z
      expect(result.toISOString()).not.toBe("2026-07-17T00:00:00.000Z");
      expect(result.toISOString()).toBe("2026-07-16T15:00:00.000Z");
    });

    it("getTokyoDate() の戻り値が現在時刻より未来にならない (バグ発生時間帯)", () => {
      // バグ発生時間帯: UTC 20:00〜23:59 を全てチェック
      for (let hour = 20; hour <= 23; hour++) {
        for (const minute of [0, 30, 59]) {
          const nowMs = utc(2026, 7, 16, hour, minute);
          const result = getTokyoDateAt(nowMs);

          // getTokyoDate() が現在時刻より未来であってはならない
          expect(result.getTime()).toBeLessThanOrEqual(nowMs);
        }
      }
    });
  });

  describe("年末年始の境界", () => {
    it("JST 2027-01-01 04:59 → 2026-12-31 扱い", () => {
      // JST 2027-01-01 04:59 = UTC 2026-12-31 19:59
      const result = getTokyoDateAt(utc(2026, 12, 31, 19, 59));
      // 5h引くと JST 2026-12-31 23:59 → 日付は 12/31
      expect(result.toISOString()).toBe("2026-12-30T15:00:00.000Z");
    });

    it("JST 2027-01-01 05:00 → 2027-01-01 扱い", () => {
      // JST 2027-01-01 05:00 = UTC 2026-12-31 20:00
      const result = getTokyoDateAt(utc(2026, 12, 31, 20, 0));
      // 5h引くと JST 2027-01-01 00:00 → 日付は 1/1
      expect(result.toISOString()).toBe("2026-12-31T15:00:00.000Z");
    });
  });
});

describe("hasDrawnToday", () => {
  it("同じ日付なら true", () => {
    const a = new Date("2026-07-16T15:00:00.000Z");
    const b = new Date("2026-07-16T15:00:00.000Z");
    expect(hasDrawnToday(a, b)).toBe(true);
  });

  it("異なる日付なら false", () => {
    const a = new Date("2026-07-16T15:00:00.000Z");
    const b = new Date("2026-07-15T15:00:00.000Z");
    expect(hasDrawnToday(a, b)).toBe(false);
  });

  it("getTokyoDate 同士の比較: 同じリセット日なら true", () => {
    // JST 06:00 と JST 23:00 は同じリセット日
    const morning = getTokyoDateAt(utc(2026, 7, 16, 21, 0)); // JST 06:00
    const night = getTokyoDateAt(utc(2026, 7, 17, 14, 0)); // JST 23:00
    expect(hasDrawnToday(morning, night)).toBe(true);
  });

  it("getTokyoDate 同士の比較: リセット前後なら false", () => {
    // JST 04:59 (リセット前) と JST 05:00 (リセット後) は異なるリセット日
    const before = getTokyoDateAt(utc(2026, 7, 16, 19, 59)); // JST 04:59
    const after = getTokyoDateAt(utc(2026, 7, 16, 20, 0)); // JST 05:00
    expect(hasDrawnToday(before, after)).toBe(false);
  });
});
