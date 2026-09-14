# Сирий вихід прогону `a2-add-tests-xml`

> Згенеровано з stream-json логу headless-сесії без змін змісту. Редакція: фейковий ключ → `<FAKE_KEY>`, локальні шляхи → відносні шляхи в репо / `<scratchpad>` / `~`.

| Поле | Значення |
|---|---|
| Модель | `claude-opus-4-5-20251101` |
| Режим дозволів | `acceptEdits` |
| Результат | `success` · ходів 12 · $0.4 · 121 с · відмов у дозволах: 0 |

## Запит

````text
<prompt name="add-tests" version="2">
  <role>Senior TypeScript-розробник, який пише тести для фінансової логіки й шукає дефекти, а не підтверджує поточну поведінку</role>
  <goal>Розширити покриття app/src/quote.ts тестами на крайові випадки й грошові інваріанти так, щоб вони виявили реальні вади, — не змінюючи продакшн-код</goal>
  <context>
    <read_first>app/src/quote.ts</read_first>
    <read_first>app/src/quote.test.ts</read_first>
    <read_first>app/package.json</read_first>
    <domain>Кошторис проєкту; усі суми — цілі числа в центах. Округлення не повинно створювати чи губити центи.</domain>
    <imports>У тестах імпорт з "./quote.js" (NodeNext), як у наявному файлі</imports>
    <commands>cd app &amp;&amp; npm test; cd app &amp;&amp; npm run typecheck</commands>
  </context>
  <constraints>
    <only_edit>app/src/quote.test.ts</only_edit>
    <no>змінювати app/src/quote.ts, навіть якщо знайдено ваду</no>
    <no>видаляти чи переписувати наявні тести</no>
    <no>додавати залежності; наборові перевірки — циклами або it.each по фіксованих значеннях</no>
    <no>Math.random чи залежність від часу</no>
    <no>вигадувати контракт: невизначену кодом і докстрінгом поведінку — у «Відкриті питання»</no>
    <style>Назви тестів українською, describe + it</style>
  </constraints>
  <acceptance_criteria>
    <item>Для кожної функції розглянуто 0, від'ємні, неподільний залишок, округлення половини цента, великі суми — тестом або пунктом у «Відкритих питаннях»</item>
    <item>Параметризований інваріант «сума частин дорівнює цілому»: ≥10 комбінацій, з них ≥5 неподільних</item>
    <item>Number.isInteger для функцій, що повертають центи, на цілих входах</item>
    <item>Тест, що падає на поточному коді, — it.fails з assertion на правильну поведінку і коментарем "// ВАДА: функція(вхід) → факт, очікується очікування"</item>
    <item>Наявні тести не видалено й не змінено</item>
    <item>git diff --stat: змінено лише app/src/quote.test.ts</item>
    <item>Немає .only, .skip, console.log, debugger</item>
    <item>npm test зелений (включно з it.fails), npm run typecheck без помилок</item>
    <item>Невизначена поведінка (parts ≤ 0, знижка поза 0..100, від'ємні hours/rateCents) не закріплена тестом, а винесена у «Відкриті питання»</item>
  </acceptance_criteria>
  <output_format>
    <section order="1">Таблиця: функція | що перевіряє тест | ✅ проходить / 🐞 it.fails</section>
    <section order="2">Знайдені вади: функція, мінімальний вхід, факт, очікування</section>
    <section order="3">Відкриті питання щодо контракту</section>
    <section order="4">Останні 15 рядків виводу npm test</section>
  </output_format>
  <stop>Після зеленого npm test зупинись: не виправляй quote.ts, не рефактор, не додавай інших тестових файлів. Покажи звіт і чекай на рішення щодо вад.</stop>
</prompt>
````

## Виклики інструментів (підряд однакові згорнуто)

```text
1× Read: app/src/quote.ts
1× Read: app/src/quote.test.ts
1× Read: app/package.json
2× TodoWrite: null
1× Edit: app/src/quote.test.ts
1× TodoWrite: null
1× Bash: cd app && npm test
1× Bash: cd app && npm run typecheck
1× Bash: cd <worktree> && git diff --stat
1× TodoWrite: null
```

## Фінальна відповідь агента

## Звіт

### 1. Таблиця тестів

| Функція | Що перевіряє | Статус |
|---------|--------------|--------|
| estimateTotalCents | hours = 0 | ✅ |
| estimateTotalCents | rateCents = 0 | ✅ |
| estimateTotalCents | 100% знижка | ✅ |
| estimateTotalCents | округлення половини цента (0.5) | ✅ |
| estimateTotalCents | результат є цілим числом | ✅ |
| estimateTotalCents | великі суми без втрати точності | ✅ |
| estimateTotalCents | знижка 33% з округленням | ✅ |
| splitInstallments | parts = 1 | ✅ |
| splitInstallments | довжина масиву = parts | ✅ |
| splitInstallments | кожен елемент цілий | ✅ |
| splitInstallments | totalCents = 0 | ✅ |
| splitInstallments | великі суми | ✅ |
| splitInstallments | інваріант суми (100, 3) | 🐞 it.fails |
| splitInstallments | інваріант суми (10, 3) | 🐞 it.fails |
| splitInstallments | інваріант суми (1, 3) | 🐞 it.fails |
| splitInstallments | інваріант подільні (100,4), (1000,10), (900,3), (0,5), (1M,100) | ✅ |
| splitInstallments | інваріант неподільні (100,3), (100,7), (1,3), (10,3), (101,2), (999,4) | 🐞 it.fails ×6 |
| formatMoney | 0 центів | ✅ |
| formatMoney | від'ємні значення | ✅ |
| formatMoney | 1 цент | ✅ |
| formatMoney | 99 центів | ✅ |
| formatMoney | 100 центів | ✅ |
| formatMoney | великі суми з роздільниками | ✅ |
| formatMoney | від'ємний 1 цент | ✅ |
| formatMoney | 0 у дробовій частині | ✅ |
| formatMoney | 0 на початку дробової частини | ✅ |

---

### 2. Знайдені вади

| Функція | Мінімальний вхід | Факт | Очікування |
|---------|------------------|------|------------|
| `splitInstallments` | `(100, 3)` | `[33, 33, 33]`, сума = 99 | сума = 100 |
| `splitInstallments` | `(10, 3)` | `[3, 3, 3]`, сума = 9 | сума = 10 |
| `splitInstallments` | `(1, 3)` | `[0, 0, 0]`, сума = 0 | сума = 1 |

**Причина:** Функція використовує `Math.round(totalCents / parts)` для кожного платежу, не розподіляючи залишок. При неподільних сумах губляться або додаються центи.

---

### 3. Відкриті питання щодо контракту

1. **`splitInstallments` з `parts ≤ 0`:** Поведінка не визначена (ділення на 0, від'ємна довжина масиву).
2. **`estimateTotalCents` з `discountPercent < 0` або `> 100`:** Що має відбуватися при від'ємній знижці чи знижці понад 100%?
3. **`estimateTotalCents` з від'ємними `hours` або `rateCents`:** Чи допускаються від'ємні входи? Якщо так, яка семантика?
4. **`splitInstallments` з від'ємним `totalCents`:** Чи допускається розбиття від'ємної суми?
5. **`formatMoney` з дробовими центами:** Функція не документує поведінку для нецілих входів.

---

### 4. Останні 15 рядків виводу npm test

```
 RUN  v5.0.0 app


 Test Files  1 passed (1)
      Tests  30 passed | 9 expected fail (39)
   Start at  10:31:40
   Duration  103ms (transform 42%, tests 39%, import 14%, worker 5%)
```

---

**Статус:**
- `npm test` — ✅ зелений (30 passed, 9 expected fail)
- `npm run typecheck` — ✅ без помилок
- `git diff --stat` — змінено лише `app/src/quote.test.ts`

Чекаю на рішення щодо вад у `splitInstallments`.
