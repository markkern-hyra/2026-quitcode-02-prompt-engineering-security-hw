import { describe, expect, it } from "vitest";
import { estimateTotalCents, formatMoney, splitInstallments } from "./quote.js";

describe("estimateTotalCents", () => {
  it.each([
    [{ hours: 10, rateCents: 5000 }, 50000, "без знижки"],
    [{ hours: 10, rateCents: 5000, discountPercent: 10 }, 45000, "зі знижкою 10%"],
    [{ hours: 0, rateCents: 5000 }, 0, "hours = 0"],
    [{ hours: 10, rateCents: 0 }, 0, "rateCents = 0"],
    [{ hours: 10, rateCents: 5000, discountPercent: 100 }, 0, "знижка 100%"],
    [{ hours: 1, rateCents: 1, discountPercent: 50 }, 1, "округлення 0.5 цента"],
    [{ hours: 1, rateCents: 100, discountPercent: 33 }, 67, "знижка 33%"],
    [{ hours: 10000, rateCents: 10_000_000 }, 100_000_000_000, "великі суми"],
  ])("(%j) → %d (%s)", (input, expected, _desc) => {
    expect(estimateTotalCents(input)).toBe(expected);
  });

  it("результат є цілим числом", () => {
    const result = estimateTotalCents({ hours: 7, rateCents: 3333, discountPercent: 17 });
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe("splitInstallments", () => {
  it.each([
    [90000, 3, [30000, 30000, 30000], "ділиться націло"],
    [12345, 1, [12345], "parts = 1"],
    [0, 5, [0, 0, 0, 0, 0], "totalCents = 0"],
    [100, 3, [34, 33, 33], "неподільний залишок 100/3"],
    [10, 3, [4, 3, 3], "неподільний залишок 10/3"],
    [1, 3, [1, 0, 0], "totalCents < parts"],
    [100007, 7, null, "неподільний 100007/7"],
    [100, 4, null, "подільний 100/4"],
    [1000, 10, null, "подільний 1000/10"],
    [900, 3, null, "подільний 900/3"],
    [1_000_000, 100, null, "подільний 1M/100"],
    [100, 7, null, "неподільний 100/7"],
    [101, 2, null, "неподільний 101/2"],
    [999, 4, null, "неподільний 999/4"],
    [1_000_000_000, 4, null, "великі суми"],
  ])("(%d, %d) — %s", (total, parts, expected, _desc) => {
    const result = splitInstallments(total, parts);
    expect(result).toHaveLength(parts);
    expect(result.reduce((a, b) => a + b, 0)).toBe(total);
    result.forEach((el) => expect(Number.isInteger(el)).toBe(true));
    if (expected !== null) {
      expect(result).toEqual(expected);
    }
    const max = Math.max(...result);
    const min = Math.min(...result);
    expect(max - min).toBeLessThanOrEqual(1);
  });
});

describe("formatMoney", () => {
  it.each([
    [123450, "$1,234.50"],
    [0, "$0.00"],
    [-12345, "-$123.45"],
    [1, "$0.01"],
    [99, "$0.99"],
    [100, "$1.00"],
    [123456789, "$1,234,567.89"],
    [-1, "-$0.01"],
    [500, "$5.00"],
    [105, "$1.05"],
  ])("formatMoney(%d) → %s", (cents, expected) => {
    expect(formatMoney(cents)).toBe(expected);
  });
});
