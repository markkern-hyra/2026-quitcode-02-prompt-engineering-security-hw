import { describe, expect, it } from "vitest";
import { estimateTotalCents, formatMoney, splitInstallments } from "./quote.js";

// Базові (happy path) тести. Навмисно неповні — розширення покриття
// це і є ваш перший промпт з cookbook (Task A).

describe("estimateTotalCents", () => {
  it("рахує суму без знижки", () => {
    expect(estimateTotalCents({ hours: 10, rateCents: 5000 })).toBe(50000);
  });

  it("застосовує знижку", () => {
    expect(estimateTotalCents({ hours: 10, rateCents: 5000, discountPercent: 10 })).toBe(45000);
  });
});

describe("splitInstallments", () => {
  it("ділить суму, що ділиться націло", () => {
    expect(splitInstallments(90000, 3)).toEqual([30000, 30000, 30000]);
  });
});

describe("formatMoney", () => {
  it("форматує центи", () => {
    expect(formatMoney(123450)).toBe("$1,234.50");
  });
});

// ============================================================================
// Додаткові тести для крайових випадків і грошових інваріантів
// ============================================================================

describe("estimateTotalCents — крайові випадки", () => {
  it("повертає 0 при hours = 0", () => {
    expect(estimateTotalCents({ hours: 0, rateCents: 5000 })).toBe(0);
  });

  it("повертає 0 при rateCents = 0", () => {
    expect(estimateTotalCents({ hours: 10, rateCents: 0 })).toBe(0);
  });

  it("повертає 0 при 100% знижці", () => {
    expect(estimateTotalCents({ hours: 10, rateCents: 5000, discountPercent: 100 })).toBe(0);
  });

  it("округлює знижку, що дає половину цента (0.5)", () => {
    // gross = 1 * 1 = 1 цент, знижка 50% → 0.5 → round → 1
    // result = 1 - 0.5 = 0.5 → round → 1? Перевіримо:
    // discount = 1 * 50 / 100 = 0.5
    // gross - discount = 0.5 → Math.round(0.5) = 1
    expect(estimateTotalCents({ hours: 1, rateCents: 1, discountPercent: 50 })).toBe(1);
  });

  it("результат є цілим числом для цілих входів", () => {
    const result = estimateTotalCents({ hours: 7, rateCents: 3333, discountPercent: 17 });
    expect(Number.isInteger(result)).toBe(true);
  });

  it("обробляє великі суми без втрати точності", () => {
    // 10000 годин * $100000.00 (10_000_000 центів) = 100_000_000_000 центів ($1 млрд)
    const result = estimateTotalCents({ hours: 10000, rateCents: 10_000_000 });
    expect(result).toBe(100_000_000_000);
    expect(Number.isInteger(result)).toBe(true);
  });

  it("коректно округлює при знижці 33.33...%", () => {
    // gross = 100, знижка = 100 * 33 / 100 = 33
    // result = 100 - 33 = 67
    const result = estimateTotalCents({ hours: 1, rateCents: 100, discountPercent: 33 });
    expect(result).toBe(67);
  });
});

describe("splitInstallments — крайові випадки", () => {
  it("повертає один платіж рівний totalCents для parts = 1", () => {
    expect(splitInstallments(12345, 1)).toEqual([12345]);
  });

  it("повертає масив з parts елементів", () => {
    const result = splitInstallments(100, 4);
    expect(result).toHaveLength(4);
  });

  it("кожен елемент є цілим числом", () => {
    const result = splitInstallments(100, 3);
    result.forEach((el) => expect(Number.isInteger(el)).toBe(true));
  });

  it("працює з totalCents = 0", () => {
    expect(splitInstallments(0, 5)).toEqual([0, 0, 0, 0, 0]);
  });

  it("обробляє великі суми", () => {
    const result = splitInstallments(1_000_000_000, 4);
    expect(result).toHaveLength(4);
    result.forEach((el) => expect(Number.isInteger(el)).toBe(true));
  });

  // ВАДА: splitInstallments(100, 3) → [33, 33, 33], сума = 99, очікується 100
  it.fails("зберігає суму при неподільному залишку (100, 3)", () => {
    const total = 100;
    const parts = 3;
    const result = splitInstallments(total, parts);
    const sum = result.reduce((a, b) => a + b, 0);
    expect(sum).toBe(total);
  });

  // ВАДА: splitInstallments(10, 3) → [3, 3, 3], сума = 9, очікується 10
  it.fails("зберігає суму при неподільному залишку (10, 3)", () => {
    const total = 10;
    const parts = 3;
    const result = splitInstallments(total, parts);
    const sum = result.reduce((a, b) => a + b, 0);
    expect(sum).toBe(total);
  });

  // ВАДА: splitInstallments(1, 3) → [0, 0, 0], сума = 0, очікується 1
  it.fails("зберігає суму при totalCents < parts (1, 3)", () => {
    const total = 1;
    const parts = 3;
    const result = splitInstallments(total, parts);
    const sum = result.reduce((a, b) => a + b, 0);
    expect(sum).toBe(total);
  });
});

describe("splitInstallments — інваріант «сума частин дорівнює цілому»", () => {
  const testCases: Array<{ total: number; parts: number; divisible: boolean }> = [
    // Подільні
    { total: 100, parts: 4, divisible: true },
    { total: 1000, parts: 10, divisible: true },
    { total: 900, parts: 3, divisible: true },
    { total: 0, parts: 5, divisible: true },
    { total: 1_000_000, parts: 100, divisible: true },
    // Неподільні (≥5)
    { total: 100, parts: 3, divisible: false },
    { total: 100, parts: 7, divisible: false },
    { total: 1, parts: 3, divisible: false },
    { total: 10, parts: 3, divisible: false },
    { total: 101, parts: 2, divisible: false },
    { total: 999, parts: 4, divisible: false },
  ];

  testCases.forEach(({ total, parts, divisible }) => {
    const label = divisible ? "подільний" : "неподільний";
    if (divisible) {
      it(`сума частин = ціле для ${label} (${total}, ${parts})`, () => {
        const result = splitInstallments(total, parts);
        const sum = result.reduce((a, b) => a + b, 0);
        expect(sum).toBe(total);
      });
    } else {
      // Для неподільних — це вада, тому it.fails
      // ВАДА: splitInstallments(total, parts) → сума ≠ total
      it.fails(`сума частин = ціле для ${label} (${total}, ${parts})`, () => {
        const result = splitInstallments(total, parts);
        const sum = result.reduce((a, b) => a + b, 0);
        expect(sum).toBe(total);
      });
    }
  });
});

describe("formatMoney — крайові випадки", () => {
  it("форматує 0 центів", () => {
    expect(formatMoney(0)).toBe("$0.00");
  });

  it("форматує від'ємні значення", () => {
    expect(formatMoney(-12345)).toBe("-$123.45");
  });

  it("форматує 1 цент", () => {
    expect(formatMoney(1)).toBe("$0.01");
  });

  it("форматує 99 центів", () => {
    expect(formatMoney(99)).toBe("$0.99");
  });

  it("форматує 100 центів як $1.00", () => {
    expect(formatMoney(100)).toBe("$1.00");
  });

  it("форматує великі суми з роздільниками тисяч", () => {
    expect(formatMoney(123456789)).toBe("$1,234,567.89");
  });

  it("результат коректний для від'ємного 1 цента", () => {
    expect(formatMoney(-1)).toBe("-$0.01");
  });

  it("форматує суму з 0 у дробовій частині", () => {
    expect(formatMoney(500)).toBe("$5.00");
  });

  it("форматує суму з 0 на початку дробової частини", () => {
    expect(formatMoney(105)).toBe("$1.05");
  });
});
