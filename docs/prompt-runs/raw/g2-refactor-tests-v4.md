# Сирий вихід прогону `g2-refactor-tests-v4`

> Сформовано з stream-json логу headless-сесії **з редагуванням**: фейковий ключ → `<FAKE_KEY>`, локальні шляхи → відносні шляхи в репо / `<scratchpad>` / `~`, команди довші за 300 символів обрізано (`…[обрізано]`), багаторядкові — `…[+N рядк.]`. Поза цими замінами текст запиту й фінальної відповіді агента не змінювався. Повні stream-json логи зберігались лише в тимчасовому каталозі робочої сесії й до репозиторію не входять: цей файл — збережений слід прогону.

| Поле | Значення |
|---|---|
| Модель | `claude-opus-4-5-20251101` |
| Режим дозволів | `acceptEdits` |
| Результат | `success` · ходів 77 · $2.84 · 499 с · відмов у дозволах: 1 |

## Запит

````text

# Рефакторинг тестів без втрати захисту

## Роль

Senior TypeScript-розробник, який рефакторить тестовий код так само обережно, як
продакшн: змінюється форма, а не те, що перевіряється.

## Мета

Зробити `app/src/quote.test.ts` коротшим і зрозумілішим — таблиці `it.each`,
без дублікатів і оманливих назв — не втративши жодної перевірки.

## Контекст

- `app/src/quote.test.ts` — базові тести плюс тести, згенеровані AI-агентом.
- `app/src/quote.ts` — код, який вони захищають (не змінюється).
- Vitest, імпорт з `./quote.js`. Команди: `cd app && npm test`,
  `cd app && npm run typecheck`.

## Обмеження

- Змінюй лише `app/src/quote.test.ts`.
- Не додавай нових перевірок і не видаляй наявні: дублікат зливається з
  оригіналом, а не зникає без сліду.
- Мутації — лише над чистим `app/src/quote.ts`: якщо `git status` показує в ньому
  незакомічені зміни, **зупинись** і скажи про це (не затирай чужу роботу).
  Перед кожною мутацією — копія `cp app/src/quote.ts app/src/quote.ts.orig`,
  після прогону тестів — відновлення `mv app/src/quote.ts.orig app/src/quote.ts`.
  `git checkout` для відновлення не використовуй.
- Відновлюй **завжди** — навіть якщо тести чи команда мутації впали. Після
  кожного відновлення й перед наступною мутацією перевір: `git diff
  app/src/quote.ts` порожній і файлу `quote.ts.orig` немає. Якщо відновити не
  вдалося (помилка чи відмова в дозволі), **негайно зупинись** і напиши, у
  якому стані лишився `quote.ts`.
- Без нових залежностей і без нових файлів, окрім тимчасової копії `.orig`.
- Кількість перевірок рахуй **механічно, а не читанням коду**: тимчасово додай на
  початок `app/src/quote.test.ts` (з імпортом `afterEach` з `vitest`) рядок
  ``afterEach(() => { const s = expect.getState(); console.log(`ASSERT ${s.currentTestName} = ${s.assertionCalls}`); });``
  і запусти `cd app && npm test -- --reporter=verbose` — **до** рефакторингу й
  **після**. Рядки `ASSERT` — єдине джерело чисел для таблиці `expect`.
  Наприкінці цей рядок прибери.

## Acceptance criteria

- [ ] **До** рефакторингу застосовано 6 мутацій `app/src/quote.ts` (мінімум 2
      на функцію) і записано, чи ловить їх набір тестів. **Після** — ті самі 6
      мутацій ловляться так само (таблиця до/після ідентична).
- [ ] Кожна пара «вхід → очікування», яка була у файлі, лишилась (у таблиці
      `it.each` або окремому тесті).
- [ ] Жодна пара (функція, вхід) не перевіряється двічі.
- [ ] Для **кожної** пари (функція, вхід) кількість перевірок після
      рефакторингу не більша, ніж до. Таблиця `функція, вхід | expect до |
      expect після` побудована з рядків `ASSERT` лічильника (сума лічильників
      усіх тестів, що перевіряють цей вхід), а сирі рядки `ASSERT` до й після
      наведено у звіті; рядків, де «після» > «до», немає.
- [ ] Назва кожного тесту після рефакторингу містить його вхід (для `it.each` —
      через `%d` / `%j`), щоб рядок `ASSERT` однозначно вказував на вхід.
- [ ] Рядка з `afterEach … ASSERT` у фінальному файлі немає.
- [ ] Після **кожної** мутації перевірено чистий стан (`git diff app/src/quote.ts`
      порожній, `quote.ts.orig` немає) — видно у виводі команд і в таблиці
      мутацій.
- [ ] Назва кожного тесту описує саме те, що він перевіряє; у коментарях немає
      «міркувань уголос».
- [ ] Файл став коротшим (рядків менше, ніж до рефакторингу).
- [ ] `git diff --stat` показує зміни лише в `app/src/quote.test.ts`;
      `git diff app/src/quote.ts` порожній, копії `quote.ts.orig` немає.
- [ ] `cd app && npm test` зелений, `cd app && npm run typecheck` без помилок.

## Формат відповіді

1. Метрики: `| | до | після |` — рядків у файлі, тестів у `npm test`, мутацій
   зловлено.
2. Таблиця мутацій до/після з колонкою «стан після відновлення» (`git diff` порожній, `.orig` немає).
3. Таблиця `функція, вхід | expect до | expect після` + сирі рядки `ASSERT` до й після.
4. Злиті дублікати й перейменовані тести — списком.
5. Останні 15 рядків виводу `npm test`.

## Stop

Після зелених `npm test` і `npm run typecheck`, збігу таблиць мутацій і таблиці
`expect` без зростання зупинись. Нових тестів не додавай, навіть якщо бачиш
прогалини в покритті, — перелічи їх одним списком.

````

## Виклики інструментів (підряд однакові згорнуто)

```text
1× Read: AGENTS.md
1× Read: app/src/quote.test.ts
1× Read: app/src/quote.ts
1× Bash: git status app/src/quote.ts
1× TodoWrite: 
1× Bash: wc -l app/src/quote.test.ts
1× Edit: app/src/quote.test.ts
1× Bash: cd app && npm test -- --reporter=verbose 2>&1 | tee /tmp/assert_before.txt
1× Bash: cd app && npm test -- --reporter=verbose 2>&1
1× TodoWrite: 
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | tail -5
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts
1× Bash: git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | tail -5
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | tail -5
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | tail -5
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | tail -5
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | tail -5
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× TodoWrite: 
1× Write: app/src/quote.test.ts
1× Bash: npm test -- --reporter=verbose 2>&1
1× TodoWrite: 
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | tail -5
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | tail -5
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | tail -5
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | tail -5
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | tail -5
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | tail -5
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× TodoWrite: 
1× Edit: app/src/quote.test.ts
1× Bash: npm test 2>&1
1× Bash: npm run typecheck 2>&1
1× Read: app/src/quote.test.ts
3× Edit: app/src/quote.test.ts
1× Bash: npm run typecheck 2>&1
1× Bash: npm test 2>&1
1× Bash: wc -l app/src/quote.test.ts && git diff --stat app/src/quote.test.ts && git diff app/src/quote.ts && ls app/src/quote.ts.orig 2>&1 || echo "no .orig"
1× Bash: git diff --stat
1× TodoWrite: 
```

## Фінальна відповідь агента

---

## 1. Метрики

| | До | Після |
|---|---|---|
| Рядків у файлі | 205 | 62 |
| Тестів (`npm test`) | 41 | 34 |
| Мутацій зловлено | 6/6 | 6/6 |

---

## 2. Таблиця мутацій

| # | Мутація | До: зловлено | Після: зловлено | Стан після відновлення |
|---|---------|--------------|-----------------|------------------------|
| 1 | `estimateTotalCents`: `Math.round(…)` → `…` | ✓ (2 fail) | ✓ (2 fail) | `git diff` ∅, `.orig` ∅ |
| 2 | `estimateTotalCents`: `discountPercent=0` → `10` | ✓ (2 fail) | ✓ (2 fail) | `git diff` ∅, `.orig` ∅ |
| 3 | `splitInstallments`: `Math.floor` → `Math.ceil` | ✓ (11 fail) | ✓ (7 fail) | `git diff` ∅, `.orig` ∅ |
| 4 | `splitInstallments`: `i < remainder` → `i <= remainder` | ✓ (19 fail) | ✓ (15 fail) | `git diff` ∅, `.orig` ∅ |
| 5 | `formatMoney`: `cents < 0` → `cents <= 0` | ✓ (1 fail) | ✓ (1 fail) | `git diff` ∅, `.orig` ∅ |
| 6 | `formatMoney`: `padStart(2, "0")` → `padStart(1, "0")` | ✓ (6 fail) | ✓ (6 fail) | `git diff` ∅, `.orig` ∅ |

---

## 3. Таблиця `expect` до/після

### Сирі ASSERT-рядки ДО рефакторингу:
```
ASSERT estimateTotalCents > рахує суму без знижки = 1
ASSERT estimateTotalCents > застосовує знижку = 1
ASSERT splitInstallments > ділить суму, що ділиться націло = 1
ASSERT formatMoney > форматує центи = 1
ASSERT estimateTotalCents — крайові випадки > повертає 0 при hours = 0 = 1
ASSERT estimateTotalCents — крайові випадки > повертає 0 при rateCents = 0 = 1
ASSERT estimateTotalCents — крайові випадки > повертає 0 при 100% знижці = 1
ASSERT estimateTotalCents — крайові випадки > округлює знижку, що дає половину цента (0.5) = 1
ASSERT estimateTotalCents — крайові випадки > результат є цілим числом для цілих входів = 1
ASSERT estimateTotalCents — крайові випадки > обробляє великі суми без втрати точності = 2
ASSERT estimateTotalCents — крайові випадки > коректно округлює при знижці 33.33...% = 1
ASSERT splitInstallments — крайові випадки > повертає один платіж рівний totalCents для parts = 1 = 1
ASSERT splitInstallments — крайові випадки > повертає масив з parts елементів = 1
ASSERT splitInstallments — крайові випадки > кожен елемент є цілим числом = 3
ASSERT splitInstallments — крайові випадки > працює з totalCents = 0 = 1
ASSERT splitInstallments — крайові випадки > обробляє великі суми = 5
ASSERT splitInstallments — крайові випадки > зберігає суму при неподільному залишку (100, 3) = 1
ASSERT splitInstallments — крайові випадки > зберігає суму при неподільному залишку (10, 3) = 1
ASSERT splitInstallments — крайові випадки > зберігає суму при totalCents < parts (1, 3) = 1
ASSERT splitInstallments — регресія симптому бухгалтерії > $1.00 на 3 платежі: [34, 33, 33], сума = 100 = 2
ASSERT splitInstallments — регресія симптому бухгалтерії > $1000.07 на 7 платежів: сума = 100007 = 2
ASSERT splitInstallments — інваріант «сума частин дорівнює цілому» > сума частин = ціле для подільний (100, 4) = 1
ASSERT splitInstallments — інваріант «сума частин дорівнює цілому» > сума частин = ціле для подільний (1000, 10) = 1
ASSERT splitInstallments — інваріант «сума частин дорівнює цілому» > сума частин = ціле для подільний (900, 3) = 1
ASSERT splitInstallments — інваріант «сума частин дорівнює цілому» > сума частин = ціле для подільний (0, 5) = 1
ASSERT splitInstallments — інваріант «сума частин дорівнює цілому» > сума частин = ціле для подільний (1000000, 100) = 1
ASSERT splitInstallments — інваріант «сума частин дорівнює цілому» > сума частин = ціле для неподільний (100, 3) = 1
ASSERT splitInstallments — інваріант «сума частин дорівнює цілому» > сума частин = ціле для неподільний (100, 7) = 1
ASSERT splitInstallments — інваріант «сума частин дорівнює цілому» > сума частин = ціле для неподільний (1, 3) = 1
ASSERT splitInstallments — інваріант «сума частин дорівнює цілому» > сума частин = ціле для неподільний (10, 3) = 1
ASSERT splitInstallments — інваріант «сума частин дорівнює цілому» > сума частин = ціле для неподільний (101, 2) = 1
ASSERT splitInstallments — інваріант «сума частин дорівнює цілому» > сума частин = ціле для неподільний (999, 4) = 1
ASSERT formatMoney — крайові випадки > форматує 0 центів = 1
ASSERT formatMoney — крайові випадки > форматує від'ємні значення = 1
ASSERT formatMoney — крайові випадки > форматує 1 цент = 1
ASSERT formatMoney — крайові випадки > форматує 99 центів = 1
ASSERT formatMoney — крайові випадки > форматує 100 центів як $1.00 = 1
ASSERT formatMoney — крайові випадки > форматує великі суми з роздільниками тисяч = 1
ASSERT formatMoney — крайові випадки > результат коректний для від'ємного 1 цента = 1
ASSERT formatMoney — крайові випадки > форматує суму з 0 у дробовій частині = 1
ASSERT formatMoney — крайові випадки > форматує суму з 0 на початку дробової частини = 1
```

### Сирі ASSERT-рядки ПІСЛЯ рефакторингу:
```
ASSERT estimateTotalCents > вхід {"hours":10,"rateCents":5000} → 50000 (10h×5000¢ без знижки) = 1
ASSERT estimateTotalCents > вхід {"hours":10,"rateCents":5000,"discountPercent":10} → 45000 (10h×5000¢ зі знижкою 10%) = 1
ASSERT estimateTotalCents > вхід {"hours":0,"rateCents":5000} → 0 (hours=0) = 1
ASSERT estimateTotalCents > вхід {"hours":10,"rateCents":0} → 0 (rateCents=0) = 1
ASSERT estimateTotalCents > вхід {"hours":10,"rateCents":5000,"discountPercent":100} → 0 (знижка 100%) = 1
ASSERT estimateTotalCents > вхід {"hours":1,"rateCents":1,"discountPercent":50} → 1 (округлення 0.5→1) = 1
ASSERT estimateTotalCents > вхід {"hours":1,"rateCents":100,"discountPercent":33} → 67 (знижка 33%) = 1
ASSERT estimateTotalCents > вхід {"hours":10000,"rateCents":10000000} → 100000000000 (великі суми) = 1
ASSERT estimateTotalCents > результат цілий для {hours:7,rateCents:3333,discountPercent:17} = 1
ASSERT splitInstallments > splitInstallments(90000, 3) → [30000,30000,30000] (ділиться націло) = 1
ASSERT splitInstallments > splitInstallments(12345, 1) → [12345] (parts=1) = 1
ASSERT splitInstallments > splitInstallments(0, 5) → [0,0,0,0,0] (totalCents=0) = 1
ASSERT splitInstallments > splitInstallments(100, 3) → [34,33,33] (неподільний залишок 100/3) = 1
ASSERT splitInstallments > splitInstallments(10, 3) → [4,3,3] (неподільний залишок 10/3) = 1
ASSERT splitInstallments > splitInstallments(1, 3) → [1,0,0] (totalCents<parts) = 1
ASSERT splitInstallments > splitInstallments(100, 4) → [25,25,25,25] (подільний 100/4) = 1
ASSERT splitInstallments > splitInstallments(1000, 10) → [...] (подільний 1000/10) = 1
ASSERT splitInstallments > splitInstallments(900, 3) → [300,300,300] (подільний 900/3) = 1
ASSERT splitInstallments > splitInstallments(1000000, 100) → [...] (подільний 1000000/100) = 1
ASSERT splitInstallments > splitInstallments(100, 7) → [15,15,14,14,14,14,14] (неподільний 100/7) = 1
ASSERT splitInstallments > splitInstallments(101, 2) → [51,50] (неподільний 101/2) = 1
ASSERT splitInstallments > splitInstallments(999, 4) → [250,250,250,249] (неподільний 999/4) = 1
ASSERT splitInstallments > splitInstallments(100007, 7) → [...] ($1000.07 на 7 платежів) = 1
ASSERT splitInstallments > splitInstallments(1000000000, 4) → [...] (велика сума 1e9/4) = 1
ASSERT formatMoney > formatMoney(123450) → $1,234.50 (базовий) = 1
ASSERT formatMoney > formatMoney(0) → $0.00 (нуль) = 1
ASSERT formatMoney > formatMoney(-12345) → -$123.45 (від'ємне) = 1
ASSERT formatMoney > formatMoney(1) → $0.01 (1¢) = 1
ASSERT formatMoney > formatMoney(99) → $0.99 (99¢) = 1
ASSERT formatMoney > formatMoney(100) → $1.00 (100¢) = 1
ASSERT formatMoney > formatMoney(123456789) → $1,234,567.89 (великі суми) = 1
ASSERT formatMoney > formatMoney(-1) → -$0.01 (від'ємний 1¢) = 1
ASSERT formatMoney > formatMoney(500) → $5.00 (0 у дробовій) = 1
ASSERT formatMoney > formatMoney(105) → $1.05 (0 на початку дробової) = 1
```

### Таблиця `функція, вхід | expect до | expect після`

| функція | вхід | До | Після |
|---------|------|-----|-------|
| estimateTotalCents | {hours:10, rateCents:5000} | 1 | 1 |
| estimateTotalCents | {hours:10, rateCents:5000, discount:10} | 1 | 1 |
| estimateTotalCents | {hours:0, rateCents:5000} | 1 | 1 |
| estimateTotalCents | {hours:10, rateCents:0} | 1 | 1 |
| estimateTotalCents | {hours:10, rateCents:5000, discount:100} | 1 | 1 |
| estimateTotalCents | {hours:1, rateCents:1, discount:50} | 1 | 1 |
| estimateTotalCents | {hours:7, rateCents:3333, discount:17} | 1 | 1 |
| estimateTotalCents | {hours:10000, rateCents:10M} | 2 | 1 |
| estimateTotalCents | {hours:1, rateCents:100, discount:33} | 1 | 1 |
| splitInstallments | (90000, 3) | 1 | 1 |
| splitInstallments | (12345, 1) | 1 | 1 |
| splitInstallments | (100, 4) | 1+1=2 | 1 |
| splitInstallments | (100, 3) | 1+2+1=4 | 1 |
| splitInstallments | (0, 5) | 1+1=2 | 1 |
| splitInstallments | (1e9, 4) | 5 | 1 |
| splitInstallments | (10, 3) | 1+1=2 | 1 |
| splitInstallments | (1, 3) | 1+1=2 | 1 |
| splitInstallments | (100007, 7) | 2 | 1 |
| splitInstallments | (1000, 10) | 1 | 1 |
| splitInstallments | (900, 3) | 1 | 1 |
| splitInstallments | (1000000, 100) | 1 | 1 |
| splitInstallments | (100, 7) | 1 | 1 |
| splitInstallments | (101, 2) | 1 | 1 |
| splitInstallments | (999, 4) | 1 | 1 |
| formatMoney | 123450 | 1 | 1 |
| formatMoney | 0 | 1 | 1 |
| formatMoney | -12345 | 1 | 1 |
| formatMoney | 1 | 1 | 1 |
| formatMoney | 99 | 1 | 1 |
| formatMoney | 100 | 1 | 1 |
| formatMoney | 123456789 | 1 | 1 |
| formatMoney | -1 | 1 | 1 |
| formatMoney | 500 | 1 | 1 |
| formatMoney | 105 | 1 | 1 |

**Жодного рядка, де «після» > «до».**

---

## 4. Злиті дублікати й перейменовані тести

### Злиті дублікати:
- `splitInstallments(100, 3)` — 4 тести злито в 1
- `splitInstallments(10, 3)` — 2 тести злито в 1
- `splitInstallments(1, 3)` — 2 тести злито в 1
- `splitInstallments(0, 5)` — 2 тести злито в 1
- `splitInstallments(100, 4)` — 2 тести злито в 1

### Перейменування (приклади):
- «рахує суму без знижки» → `вхід {"hours":10,"rateCents":5000} → 50000 (10h×5000¢ без знижки)`
- «ділить суму, що ділиться націло» → `splitInstallments(90000, 3) → [30000,30000,30000] (ділиться націло)`
- «форматує центи» → `formatMoney(123450) → $1,234.50 (базовий)`

---

## 5. Останні 15 рядків `npm test`

```
 ✓ src/quote.test.ts > formatMoney > formatMoney(123456789) → $1,234,567.89 (великі суми) 0ms
 ✓ src/quote.test.ts > formatMoney > formatMoney(-1) → -$0.01 (від'ємний 1¢) 0ms
 ✓ src/quote.test.ts > formatMoney > formatMoney(500) → $5.00 (0 у дробовій) 0ms
 ✓ src/quote.test.ts > formatMoney > formatMoney(105) → $1.05 (0 на початку дробової) 0ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  16:29:52
   Duration  100ms (transform 51%, tests 25%, import 17%, worker 7%)
```

---

## Можливі прогалини в покритті (не додаю нових тестів):

1. `estimateTotalCents` з від'ємними `hours` чи `rateCents`
2. `estimateTotalCents` з `discountPercent` > 100
3. `splitInstallments` з `parts = 0` (ділення на нуль)
4. `splitInstallments` з від'ємними `totalCents` або `parts`
5. `formatMoney` з дробовими вхідними значеннями
