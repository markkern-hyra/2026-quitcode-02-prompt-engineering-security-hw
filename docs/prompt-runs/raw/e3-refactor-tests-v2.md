# Сирий вихід прогону `e3-refactor-tests-v2`

> Згенеровано з stream-json логу headless-сесії без змін змісту. Редакція: фейковий ключ → `<FAKE_KEY>`, локальні шляхи → відносні шляхи в репо / `<scratchpad>` / `~`. Команди довші за 300 символів обрізано з позначкою `…[обрізано]`, багаторядкові — `…[+N рядк.]`; повні — у stream-json логах.

| Поле | Значення |
|---|---|
| Модель | `claude-opus-4-5-20251101` |
| Режим дозволів | `acceptEdits` |
| Результат | `success` · ходів 79 · $3.2 · 499 с · відмов у дозволах: 0 |

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
- Без нових залежностей і без нових файлів, окрім тимчасової копії `.orig`.

## Acceptance criteria

- [ ] **До** рефакторингу застосовано 6 мутацій `app/src/quote.ts` (мінімум 2
      на функцію) і записано, чи ловить їх набір тестів. **Після** — ті самі 6
      мутацій ловляться так само (таблиця до/після ідентична).
- [ ] Кожна пара «вхід → очікування», яка була у файлі, лишилась (у таблиці
      `it.each` або окремому тесті).
- [ ] Жодна пара (функція, вхід) не перевіряється двічі.
- [ ] Для **кожної** пари (функція, вхід) кількість перевірок `expect` після
      рефакторингу не більша, ніж до (для рядка `it.each` рахується кількість
      `expect` у тілі тесту, що до нього застосовується) — показано таблицю
      `функція, вхід | expect до | expect після`; рядків, де «після» > «до», немає.
- [ ] Назва кожного тесту описує саме те, що він перевіряє; у коментарях немає
      «міркувань уголос».
- [ ] Файл став коротшим (рядків менше, ніж до рефакторингу).
- [ ] `git diff --stat` показує зміни лише в `app/src/quote.test.ts`;
      `git diff app/src/quote.ts` порожній, копії `quote.ts.orig` немає.
- [ ] `cd app && npm test` зелений, `cd app && npm run typecheck` без помилок.

## Формат відповіді

1. Метрики: `| | до | після |` — рядків у файлі, тестів у `npm test`, мутацій
   зловлено.
2. Таблиця мутацій до/після.
3. Таблиця `функція, вхід | expect до | expect після`.
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
1× Bash: git status --short app/src/quote.ts
1× TodoWrite: 
1× Bash: wc -l app/src/quote.test.ts
1× Bash: cd app && npm test 2>&1 | tail -30
1× TodoWrite: 
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | grep -E "(FAIL|PASS|Tests)"
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && cp app/src/quote.ts app/src/quote.ts.orig
1× Read: app/src/quote.ts
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | grep -E "(FAIL|PASS|Tests)"
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && cp app/src/quote.ts app/src/quote.ts.orig
1× Read: app/src/quote.ts
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | grep -E "(FAIL|PASS|Tests)"
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && cp app/src/quote.ts app/src/quote.ts.orig
1× Read: app/src/quote.ts
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | grep -E "(FAIL|PASS|Tests)"
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && cp app/src/quote.ts app/src/quote.ts.orig
1× Read: app/src/quote.ts
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | grep -E "(FAIL|PASS|Tests)"
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && cp app/src/quote.ts app/src/quote.ts.orig
1× Read: app/src/quote.ts
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | grep -E "(FAIL|PASS|Tests)"
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts
1× TodoWrite: 
1× Write: app/src/quote.test.ts
1× Bash: npm test 2>&1
1× Bash: wc -l app/src/quote.test.ts
1× Read: app/src/quote.test.ts
1× Write: app/src/quote.test.ts
1× Bash: npm test 2>&1
1× Bash: wc -l app/src/quote.test.ts
1× Write: app/src/quote.test.ts
1× Bash: npm test 2>&1
1× TodoWrite: 
1× Bash: cp app/src/quote.ts app/src/quote.ts.orig
1× Read: app/src/quote.ts
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | grep -E "(FAIL|PASS|Tests)"
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && cp app/src/quote.ts app/src/quote.ts.orig
1× Read: app/src/quote.ts
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | grep -E "(FAIL|PASS|Tests)"
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && cp app/src/quote.ts app/src/quote.ts.orig
1× Read: app/src/quote.ts
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | grep -E "(FAIL|PASS|Tests)"
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && cp app/src/quote.ts app/src/quote.ts.orig
1× Read: app/src/quote.ts
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | grep -E "(FAIL|PASS|Tests)"
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && cp app/src/quote.ts app/src/quote.ts.orig
1× Read: app/src/quote.ts
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | grep -E "(FAIL|PASS|Tests)"
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts && cp app/src/quote.ts app/src/quote.ts.orig
1× Read: app/src/quote.ts
1× Edit: app/src/quote.ts
1× Bash: npm test 2>&1 | grep -E "(FAIL|PASS|Tests)"
1× Bash: mv app/src/quote.ts.orig app/src/quote.ts
1× TodoWrite: 
1× Bash: wc -l app/src/quote.test.ts && npm test 2>&1 | tail -15
1× Bash: npm run typecheck 2>&1
1× Bash: git diff --stat app/src/quote.ts && echo "---" && git diff app/src/quote.ts && echo "---" && ls -la app/src/quote.ts.orig 2>&1
1× Bash: git diff --stat -- app/src/quote.ts && echo "---" && git diff -- app/src/quote.ts
1× Bash: ls -la app/src/quote.ts.orig 2>&1 || echo "No .orig file"
1× Bash: git diff --stat -- app/src/quote.test.ts
1× Bash: git status --short
1× TodoWrite: 
1× Read: app/src/quote.test.ts
```

## Фінальна відповідь агента

Файл має 99 рядків (насправді 100 з порожнім). Тепер складу підсумкову таблицю.

---

## 1. Метрики

| | до | після |
|---|---|---|
| Рядків у файлі | 205 | 99 |
| Тестів у npm test | 41 | 34 |
| Мутацій зловлено | 6/6 | 6/6 |

---

## 2. Таблиця мутацій до/після

| # | Мутація | До | Після |
|---|---------|----|----|
| 1 | `hours * rateCents` → `hours + rateCents` | ЗЛОВЛЕНО (6 fail) | ЗЛОВЛЕНО (6 fail) |
| 2 | `gross - discount` → `gross + discount` | ЗЛОВЛЕНО (4 fail) | ЗЛОВЛЕНО (4 fail) |
| 3 | `Math.floor` → `Math.ceil` (splitInstallments) | ЗЛОВЛЕНО (11 fail) | ЗЛОВЛЕНО (7 fail) |
| 4 | `i < remainder` → `i <= remainder` | ЗЛОВЛЕНО (19 fail) | ЗЛОВЛЕНО (15 fail) |
| 5 | `sign = cents < 0 ? "-" : ""` → `sign = ""` | ЗЛОВЛЕНО (2 fail) | ЗЛОВЛЕНО (2 fail) |
| 6 | `.padStart(2, "0")` → `.padStart(2, "1")` | ЗЛОВЛЕНО (6 fail) | ЗЛОВЛЕНО (6 fail) |

Усі мутації зловлено і до, і після рефакторингу.

---

## 3. Таблиця expect до/після

| функція | вхід | expect до | expect після |
|---------|------|-----------|--------------|
| estimateTotalCents | h=10, r=5000 | 1 | 1 |
| estimateTotalCents | h=10, r=5000, d=10 | 1 | 1 |
| estimateTotalCents | h=0, r=5000 | 1 | 1 |
| estimateTotalCents | h=10, r=0 | 1 | 1 |
| estimateTotalCents | h=10, r=5000, d=100 | 1 | 1 |
| estimateTotalCents | h=1, r=1, d=50 | 1 | 1 |
| estimateTotalCents | h=7, r=3333, d=17 | 1 | 1 |
| estimateTotalCents | h=10000, r=10_000_000 | 2 | 2 |
| estimateTotalCents | h=1, r=100, d=33 | 1 | 1 |
| splitInstallments | 90000, 3 | 1 | 1 |
| splitInstallments | 12345, 1 | 1 | 1 |
| splitInstallments | 100, 4 | 2 | 2 |
| splitInstallments | 100, 3 | 6 (explicit+length+3×int+sum) | 6 |
| splitInstallments | 0, 5 | 2 | 2 |
| splitInstallments | 1_000_000_000, 4 | 6 | 6 |
| splitInstallments | 1_000_000, 100 | 1 | 1 |
| splitInstallments | 100, 7 | 1 | 1 |
| splitInstallments | 1, 3 | 1 | 1 |
| splitInstallments | 10, 3 | 1 | 1 |
| splitInstallments | 101, 2 | 1 | 1 |
| splitInstallments | 999, 4 | 1 | 1 |
| splitInstallments | 100007, 7 | 2 | 2 |
| splitInstallments | 1000, 10 | 1 | 1 |
| splitInstallments | 900, 3 | 1 | 1 |
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

Жоден рядок не має «після» > «до».

---

## 4. Злиті дублікати й перейменовані тести

**Злиті дублікати:**
- `splitInstallments(100, 3)` — 3 окремі тести (sum у різних describe) злито в один тест з 6 expect
- `splitInstallments(10, 3)` — 2 тести (sum) злито в один
- `splitInstallments(1, 3)` — 2 тести (sum) злито в один
- `splitInstallments(0, 5)` — 2 тести (explicit + sum у forEach) злито в один
- `splitInstallments(1_000_000_000, 4)` — 3 тести (length + integers + sum) злито в один

**Перейменовані тести:**
- Усі назви тестів тепер описують саме те, що перевіряється (входи і тип перевірки)
- Прибрано коментарі з «міркуваннями уголос» (рядки 47-51 оригіналу)
- Прибрано describe-блоки з назвами, що не додають цінності («крайові випадки», «регресія симптому бухгалтерії», «інваріант...»)

---

## 5. Останні 15 рядків npm test

```
> test
> vitest run


 RUN  v5.0.0 <tmp>/.../app


 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  15:17:08
   Duration  99ms (transform 59%, tests 23%, import 15%, worker 3%)
```

---

## Прогалини в покритті (не додаю нових тестів)

- Немає тестів для від'ємних `hours` або `rateCents`
- Немає тестів для `discountPercent` > 100 або < 0
- Немає тестів для `parts = 0` у `splitInstallments`
- Немає тестів для дробових (float) значень на вході
