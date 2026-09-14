/**
 * Розрахунок кошторису для проєкту автоматизації.
 * Усі суми — у центах (цілі числа), щоб уникнути похибок float.
 *
 * Це навчальний модуль-ціль для промптів з `prompts/`.
 * Він НАВМИСНЕ недосконалий — саме це ви і знайдете добре сформульованим
 * промптом з acceptance criteria (Task A).
 */

/**
 * Вхідні дані для розрахунку кошторису.
 */
export interface QuoteInput {
  /** Оцінка робіт у годинах. */
  hours: number;
  /** Ставка за годину, у центах (напр. 5000 = $50.00). */
  rateCents: number;
  /**
   * Знижка у відсотках (0–100).
   * За замовчуванням: 0.
   */
  discountPercent?: number;
}

/**
 * Обчислює ціну проєкту в центах з урахуванням знижки.
 *
 * Розрахунок: `gross = hours * rateCents`, знижка `gross * discountPercent / 100`,
 * результат — `Math.round(gross - знижка)`.
 * Округлення: `Math.round` (половина цента округлюється вгору).
 *
 * Не визначено: від'ємні `hours` або `rateCents` — поточна реалізація
 * обчислює за формулою, результат від'ємний (напр. `hours=-10, rateCents=5000` → `-50000`).
 *
 * Не визначено: `discountPercent < 0` — поточна реалізація збільшує суму
 * (напр. `discountPercent=-10` → сума зростає на 10%).
 *
 * Не визначено: `discountPercent > 100` — поточна реалізація дає від'ємний результат
 * (напр. `discountPercent=150` → `-25000` для суми 50000).
 *
 * @param input - вхідні дані кошторису
 * @param input.hours - оцінка робіт, у годинах
 * @param input.rateCents - ставка за годину, у центах (напр. 5000 = $50.00)
 * @param input.discountPercent - знижка у відсотках (0–100), за замовчуванням 0
 * @returns ціна проєкту в центах (ціле число)
 *
 * @example
 * estimateTotalCents({ hours: 10, rateCents: 5000, discountPercent: 10 })
 * // → 45000
 */
export function estimateTotalCents(input: QuoteInput): number {
  const { hours, rateCents, discountPercent = 0 } = input;
  const gross = hours * rateCents;
  const discount = (gross * discountPercent) / 100;
  return Math.round(gross - discount);
}

/**
 * Розбиває суму на `parts` рівних платежів (у центах).
 *
 * Розподіл залишку: залишок від ділення розподіляється по +1 центу
 * на **перші** платежі. Наприклад, `splitInstallments(100, 3)` → `[34, 33, 33]`.
 *
 * Не визначено: `parts ≤ 0` — поточна реалізація повертає порожній масив `[]`.
 *
 * Не визначено: дробовий `parts` — поточна реалізація відкидає дробову частину
 * (напр. `parts=2.5` → масив довжиною 2).
 *
 * Не визначено: від'ємний `totalCents` — поточна реалізація обчислює за формулою,
 * повертає від'ємні платежі (напр. `splitInstallments(-100, 3)` → `[-33, -33, -34]`).
 *
 * @param totalCents - загальна сума, у центах
 * @param parts - кількість платежів (ціле додатне число)
 * @returns масив платежів довжиною `parts`, кожен у центах (ціле число)
 *
 * @example
 * splitInstallments(10000, 3)
 * // → [3334, 3333, 3333]
 */
export function splitInstallments(totalCents: number, parts: number): number[] {
  const base = Math.floor(totalCents / parts);
  const remainder = totalCents - base * parts;
  return Array.from({ length: parts }, (_, i) => base + (i < remainder ? 1 : 0));
}

/**
 * Форматує центи у рядок виду `"$1,234.50"`.
 *
 * Від'ємні значення: знак мінус перед `$` (напр. `"-$123.45"`).
 *
 * Не визначено: дробові центи — поточна реалізація дає некоректний вивід
 * (напр. `formatMoney(100.5)` → `"$1.0.5"`).
 *
 * @param cents - сума у центах (ціле число)
 * @returns відформатований рядок виду `"$X,XXX.XX"` або `"-$X,XXX.XX"`
 *
 * @example
 * formatMoney(123450)
 * // → "$1,234.50"
 *
 * @example
 * formatMoney(-12345)
 * // → "-$123.45"
 */
export function formatMoney(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100).toLocaleString("en-US");
  const frac = String(abs % 100).padStart(2, "0");
  return `${sign}$${whole}.${frac}`;
}
