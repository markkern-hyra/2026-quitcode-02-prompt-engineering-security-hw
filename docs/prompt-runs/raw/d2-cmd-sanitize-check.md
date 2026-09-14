# Сирий вихід прогону `d2-cmd-sanitize-check`

> Згенеровано з stream-json логу headless-сесії без змін змісту. Редакція: фейковий ключ → `<FAKE_KEY>`, локальні шляхи → відносні шляхи в репо / `<scratchpad>` / `~`.

| Поле | Значення |
|---|---|
| Модель | `claude-opus-4-5-20251101` |
| Режим дозволів | `default` |
| Результат | `success` · ходів 14 · $0.31 · 56 с · відмов у дозволах: 0 |

## Запит

````text
/sanitize-check materials/client-brief.md
````

## Виклики інструментів (підряд однакові згорнуто)

```text
1× Read: docs/sanitization-checklist.md
1× Bash: grep -nEi '(api[_-]?key|token|secret|passw|bearer|\bpat[A-Za-z0-9]*\.|xox[abprs]-|\bsk-|\bfake_|://[^ /:]+:[^ @]+@)' materials/client-brief.md 2>/dev/null | cut
1× Bash: grep -nEi '(postgres(ql)?|mysql|mongodb(\+srv)?|redis|amqp)://' materials/client-brief.md 2>/dev/null | cut -d: -f1 | paste -sd, -
1× Bash: grep -nEi '/webhook/' materials/client-brief.md 2>/dev/null | cut -d: -f1 | paste -sd, -
1× Bash: grep -nEi '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' materials/client-brief.md 2>/dev/null | cut -d: -f1 | paste -sd, -
1× Bash: grep -nEi '\+?380[ ()-]*[0-9]{2}[ )-]*[0-9]{3}' materials/client-brief.md 2>/dev/null | cut -d: -f1 | paste -sd, -
1× Bash: grep -nEi '((^|[ (])@[A-Za-z0-9_]{5,}|t\.me/)' materials/client-brief.md 2>/dev/null | cut -d: -f1 | paste -sd, -
1× Bash: grep -cEi '(api[_-]?key|token|secret|passw|bearer|\bpat[A-Za-z0-9]*\.|xox[abprs]-|\bsk-|\bfake_|://[^ /:]+:[^ @]+@)' materials/client-brief.md 2>/dev/null || ec
1× Bash: grep -cEi '(postgres(ql)?|mysql|mongodb(\+srv)?|redis|amqp)://' materials/client-brief.md 2>/dev/null || echo 0
1× Bash: grep -cEi '/webhook/' materials/client-brief.md 2>/dev/null || echo 0
1× Bash: grep -cEi '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' materials/client-brief.md 2>/dev/null || echo 0
1× Bash: grep -cEi '\+?380[ ()-]*[0-9]{2}[ )-]*[0-9]{3}' materials/client-brief.md 2>/dev/null || echo 0
1× Bash: grep -cEi '((^|[ (])@[A-Za-z0-9_]{5,}|t\.me/)' materials/client-brief.md 2>/dev/null || echo 0
```

## Фінальна відповідь агента

## Результати автоматичної перевірки `materials/client-brief.md`

### 1. Таблиця знахідок

| Категорія | Рядки | Кількість | Рівень |
|-----------|-------|-----------|--------|
| Секрети (API keys, tokens, passwords) | 37, 38, 39, 41 | 4 | 🔴 |
| Connection strings | 41 | 1 | 🔴 |
| Вебхуки | 40 | 1 | 🔴 |
| Email | 17, 41 | 2 | 🔴 PII |
| Телефони UA | 18, 47, 48, 49 | 4 | 🔴 PII |
| Хендли месенджерів | 19 | 1 | 🔴 PII |

---

### 2. Вердикт

**Найвища категорія:** 🔴 (секрети інтеграцій + PII)

**Куди можна в поточному вигляді:** **нікуди** — ні в публічну модель, ні в Claude Team, ні в API.

**Що зробити перед відправкою:**
1. Секрети (рядки 37–41) → замінити на `<SECRET_OUT_OF_BAND>` + назва змінної
2. PII (рядки 17–19, 47–49) → плейсхолдери `[CONTACT_1]`, `[CONTACT_1_EMAIL]`, маска телефону `+380 (XX) XXX-XX-XX`
3. Після маскування — повторна перевірка цією ж командою

---

### 3. Чек-лист ручного проходу (те, чого grep не бачить)

Автоматичний крок **не виявляє**:
- **Імена / ПІБ** — прочитати вручну, замінити на `[CONTACT_1]`, `[CONTACT_2]`
- **Назви компаній** (клієнта, партнерів, конкурентів) — замінити на `[CLIENT_1]`
- **Фізичні адреси** — прибрати або узагальнити (`м. Тестове`)
- **Комерційні умови** — ставки, маржа, собівартість, дедлайни пропозицій → `<INTERNAL>` або видалити
- **Внутрішні хости / назви баз / таблиць** — узагальнити
- **Вигрузки реальних даних** — замінити синтетикою

**Обов'язково:**
- [ ] Прочитати документ повністю, кожному блоку поставити 🔴/🟡/🟢
- [ ] Перевірити, що після маскування задача й критерії приймання зрозумілі без оригіналу
- [ ] Повторити grep-перевірку після маскування — вивід має бути порожнім
