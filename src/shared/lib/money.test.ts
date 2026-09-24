import { describe, expect, it } from "vitest";
import {
  formatMoney,
  kopecksToRubles,
  rublesToKopecks,
} from "./money";

describe("money", () => {
  it("переводит копейки в рубли", () => {
    expect(kopecksToRubles(123456)).toBe(1234.56);
  });

  it("переводит рубли в копейки с округлением", () => {
    expect(rublesToKopecks(1234.56)).toBe(123456);
    expect(rublesToKopecks(10.005)).toBe(1001);
  });

  it("форматирует сумму как валюту", () => {
    expect(formatMoney(123456)).toContain("1");
  });
});
