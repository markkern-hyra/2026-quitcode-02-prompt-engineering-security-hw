# Сирий вихід прогону `g3-review-tests-v3`

> Сформовано з stream-json логу headless-сесії **з редагуванням**: фейковий ключ → `<FAKE_KEY>`, локальні шляхи → відносні шляхи в репо / `<scratchpad>` / `~`, команди довші за 300 символів обрізано (`…[обрізано]`), багаторядкові — `…[+N рядк.]`. Поза цими замінами текст запиту й фінальної відповіді агента не змінювався. Повні stream-json логи зберігались лише в тимчасовому каталозі робочої сесії й до репозиторію не входять: цей файл — збережений слід прогону.

| Поле | Значення |
|---|---|
| Модель | `claude-opus-4-5-20251101` |
| Режим дозволів | `acceptEdits` |
| Результат | `success` · ходів 50 · $2.26 · 542 с · відмов у дозволах: 2 |

## Запит

````text

# Рев'ю тестів: чи ловлять вони дефекти

## Роль

Рев'юер тестів, який не довіряє зеленому CI: перевіряє, що тести падають, коли
код зламано, а не лише проходять, коли він цілий.

## Мета

Оцінити, чи `app/src/quote.test.ts` справді захищає `app/src/quote.ts`: знайти
мутації коду, які тести пропускають, і дефекти в самих тестах.

## Контекст

- Код: `app/src/quote.ts` — три функції; усі суми — цілі центи; залишок у
  `splitInstallments` іде на перші платежі.
- Тести: `app/src/quote.test.ts` — частину згенеровано AI-агентом.
- Команда: `cd app && npm test`.

## Обмеження

- Мутації вноси тимчасово, **по одній**, і лише над чистим `app/src/quote.ts`:
  якщо `git status` показує в ньому незакомічені зміни, **зупинись** і скажи про
  це. Перед кожною мутацією — `cp app/src/quote.ts app/src/quote.ts.orig`, після
  прогону тестів — `mv app/src/quote.ts.orig app/src/quote.ts`; `git checkout`
  для відновлення не використовуй. Наприкінці `git status` має бути чистим.
- Відновлюй **завжди** — навіть якщо тести чи команда мутації впали. Після
  кожного відновлення й перед наступною мутацією перевір: `git diff
  app/src/quote.ts` порожній і файлу `quote.ts.orig` немає. Якщо відновити не
  вдалося (помилка чи відмова в дозволі), **негайно зупинись** і напиши, у
  якому стані лишився `quote.ts`.
- Не виправляй ні код, ні тести — результат цього промпту лише звіт.
- Не коментуй форматування. Назви й коментарі — лише якщо вони вводять в оману
  (не відповідають тому, що перевіряє тест).
- Максимум 10 знахідок, відсортованих за серйозністю.

## Acceptance criteria

- [ ] Застосовано щонайменше 8 мутацій, мінімум 2 на кожну функцію (напр.
      `Math.round` → `Math.floor`, прибрати знижку, зламати розподіл
      залишку, змінити `padStart`, знак); для кожної записано, чи впав хоч
      один тест (так/ні) і який.
- [ ] Для кожної мутації, що вижила, запропоновано конкретний тест: вхід і
      очікуваний результат, який її вб'є.
- [ ] Названо тести, що вводять в оману: назва чи коментар не відповідає
      перевірці, дублікати, тавтологічні перевірки — з `файл:рядок`.
- [ ] Для щонайменше 3 очікуваних значень у тестах показано незалежний
      розрахунок (перевірка, що очікування не «підігнане» під реалізацію).
- [ ] Після **кожної** мутації перевірено чистий стан (`git diff
      app/src/quote.ts` порожній, `quote.ts.orig` немає) — видно у виводі
      команд і в таблиці мутацій.
- [ ] Наприкінці `git status` чистий — жодна мутація не лишилась.
- [ ] Якщо проблем немає — так і написано, без вигаданих зауважень.

## Формат відповіді

1. Таблиця мутацій: `# | функція | мутація | тести впали? | який тест зловив | стан після відновлення`.
2. Знахідки: `СЕРЙОЗНІСТЬ | файл:рядок | проблема | пропозиція`.
3. Підсумок: mutation score (вбиті / усього) і 1–3 найважливіші дії.

## Stop

Після таблиці мутацій і знахідок зупинись. Тести й код не виправляй — це
окремий запит.

````

## Виклики інструментів (підряд однакові згорнуто)

```text
1× Read: app/src/quote.ts
1× Read: app/src/quote.test.ts
1× Bash: git status app/src/quote.ts
1× TodoWrite: 
1× Bash: cd app && cp src/quote.ts src/quote.ts.orig && sed -i '' 's/Math\.round(gross - discount)/Math.floor(gross - discount)/' src/quote.ts && npm test 2>&1; mv src/quote.ts.orig src/quote.ts && echo "=== Відновлено ===" && git diff src/quote.ts && ls src/quote.ts.orig 2>&1 || true
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Bash: sed -i '' 's/Math\.round(gross - discount)/Math.floor(gross - discount)/' app/src/quote.ts
1× Edit: app/src/quote.ts
1× Bash: npm test --prefix app 2>&1
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts
1× Bash: git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "quote.ts.orig немає"
1× TodoWrite: 
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test --prefix app 2>&1
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "quote.ts.orig немає"
1× TodoWrite: 
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test --prefix app 2>&1
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "quote.ts.orig немає"
1× TodoWrite: 
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test --prefix app 2>&1
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "quote.ts.orig немає"
1× TodoWrite: 
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test --prefix app 2>&1
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "quote.ts.orig немає"
1× TodoWrite: 
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test --prefix app 2>&1
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "quote.ts.orig немає"
1× TodoWrite: 
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test --prefix app 2>&1
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "quote.ts.orig немає"
1× TodoWrite: 
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test --prefix app 2>&1
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "quote.ts.orig немає"
1× TodoWrite: 
1× Bash: git status app/src/quote.ts
1× TodoWrite: 
```

## Фінальна відповідь агента

---

# Звіт рев'ю тестів

## 1. Таблиця мутацій

| # | Функція | Мутація | Тести впали? | Який тест зловив | Стан після відновлення |
|---|---------|---------|--------------|------------------|------------------------|
| 1 | `estimateTotalCents` | `Math.round` → `Math.floor` | ТАК | «округлює знижку, що дає половину цента (0.5)» | ✓ чистий (diff порожній, orig немає) |
| 2 | `estimateTotalCents` | прибрати знижку (`gross` замість `gross - discount`) | ТАК | «застосовує знижку», «повертає 0 при 100% знижці», «коректно округлює при знижці 33.33...%» | ✓ чистий |
| 3 | `estimateTotalCents` | змінити знак (`gross + discount` замість `gross - discount`) | ТАК | «застосовує знижку», «повертає 0 при 100% знижці», «округлює знижку...», «коректно округлює при знижці 33.33...%» | ✓ чистий |
| 4 | `splitInstallments` | `Math.floor` → `Math.ceil` | ТАК | «зберігає суму при неподільному залишку», «$1.00 на 3 платежі», інваріанти | ✓ чистий |
| 5 | `splitInstallments` | залишок на останні платежі (`i >= parts - remainder`) | ТАК | «$1.00 на 3 платежі: [34, 33, 33]» | ✓ чистий |
| 6 | `splitInstallments` | прибрати +1 (`base + 0` замість `base + 1`) | ТАК | «зберігає суму при неподільному залишку», «$1.00 на 3 платежі», інваріанти | ✓ чистий |
| 7 | `formatMoney` | `padStart(2, "0")` → `padStart(1, "0")` | ТАК | «форматує 0 центів», «форматує 1 цент», «форматує 100 центів як $1.00», «від'ємний 1 цент», «0 у дробовій частині», «0 на початку дробової» | ✓ чистий |
| 8 | `formatMoney` | прибрати sign (`$` замість `${sign}$`) | ТАК | «форматує від'ємні значення», «від'ємного 1 цента» | ✓ чистий |

**Mutation score: 8/8 = 100%** — усі мутації вбиті.

---

## 2. Незалежна верифікація очікуваних значень

### 2.1 `estimateTotalCents({ hours: 10, rateCents: 5000, discountPercent: 10 })` → 45000

**Розрахунок:**
- gross = 10 × 5000 = 50000 центів
- discount = 50000 × 10 / 100 = 5000 центів
- result = Math.round(50000 - 5000) = 45000 ✓

### 2.2 `splitInstallments(100, 3)` → [34, 33, 33]

**Розрахунок:**
- base = Math.floor(100 / 3) = 33
- remainder = 100 - 33 × 3 = 100 - 99 = 1
- Перший елемент (i=0 < 1): 33 + 1 = 34
- Елементи i=1, i=2 (≥ 1): 33 + 0 = 33
- Результат: [34, 33, 33], сума = 100 ✓

### 2.3 `formatMoney(123450)` → "$1,234.50"

**Розрахунок:**
- sign = "" (додатне)
- abs = 123450
- whole = Math.floor(123450 / 100) = 1234, з локалізацією: "1,234"
- frac = 123450 % 100 = 50, padStart(2, "0") = "50"
- Результат: "$1,234.50" ✓

---

## 3. Знахідки

| Серйозність | Файл:рядок | Проблема | Пропозиція |
|-------------|------------|----------|------------|
| **НИЗЬКА** | `quote.test.ts:46-52` | Коментар у тесті помилковий: написано `result = 0.5 → Math.round(0.5) = 1`, але насправді результат `gross - discount = 1 - 0.5 = 0.5`, і `Math.round(0.5) = 1` — коментар плутає проміжне з фінальним | Виправити коментар: "gross - discount = 0.5 → Math.round → 1" |
| **НИЗЬКА** | `quote.test.ts:99-105` та `quote.test.ts:150` | Дублікат: тест "зберігає суму при неподільному залишку (100, 3)" у рядку 99-105 повторюється в інваріантах (рядок 150: `{ total: 100, parts: 3, divisible: false }`) | Видалити один з дублів, щоб уникнути надлишкового покриття |
| **НИЗЬКА** | `quote.test.ts:107-113` та `quote.test.ts:153` | Дублікат: тест (10, 3) дублюється в інваріантах | Видалити один з дублів |
| **НИЗЬКА** | `quote.test.ts:115-121` та `quote.test.ts:152` | Дублікат: тест (1, 3) дублюється в інваріантах | Видалити один з дублів |

---

## 4. Підсумок

**Mutation score: 8/8 (100%)** — тести надійно ловлять дефекти в усіх трьох функціях.

**Найважливіші дії:**
1. Виправити коментар у тесті `quote.test.ts:46-52`, який неточно описує розрахунок
2. Прибрати дублікати тестів між блоками «крайові випадки» та «інваріанти» (3 дублікати: (100,3), (10,3), (1,3))
3. Проблем із логікою тестів немає — усі мутації вбито, очікувані значення перевірено незалежним розрахунком
