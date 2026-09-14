#!/usr/bin/env bash
# Перевірка файлу на чутливі формати за чек-лістом (docs/sanitization-checklist.md, розділ 4).
# Друкує ЛИШЕ категорію, номери рядків і кількість — жодного вмісту файлу, тож
# її безпечно давати агентові як єдиний дозволений інструмент (/sanitize-check).
# usage: bash docs/tools/sensitive-lines.sh <файл>
set -euo pipefail

f=${1:?usage: sensitive-lines.sh <файл>}

# Обмеження шляху (AGENTS.md, правило 3): секретні за назвою файли й символьні
# посилання відхиляються ще до перевірки існування, файли поза репозиторієм — теж.
name=$(basename -- "$f" | tr '[:upper:]' '[:lower:]')
case "$name" in
  .env|.env.*|*.pem|*.key|*key*|*token*|*secret*|*credential*)
    echo "відмовлено: секретний файл за назвою: $f" >&2; exit 3 ;;
esac
[ -L "$f" ] && { echo "відмовлено: символьне посилання: $f" >&2; exit 3; }
[ -f "$f" ] || { echo "не файл: $f" >&2; exit 2; }
root=$(cd "$(dirname -- "$0")" && git rev-parse --show-toplevel 2>/dev/null) \
  || { echo "скрипт має лежати в git-репозиторії" >&2; exit 3; }
root=$(cd "$root" && pwd -P)
real="$(cd "$(dirname -- "$f")" && pwd -P)/$(basename -- "$f")"
case "$real" in
  "$root"/*) ;;
  *) echo "відмовлено: файл поза репозиторієм: $f" >&2; exit 3 ;;
esac

# Рядки з плейсхолдерами санітизації не рахуються (як grep -v у чек-лісті).
ALLOW='<SECRET_OUT_OF_BAND>|\(XX\)|\(00\)'

check() { # $1 — категорія, $2 — розширений regex
  local lines count
  lines=$(grep -nEi -- "$2" "$f" | grep -vE -- "$ALLOW" | cut -d: -f1 | paste -sd, - || true)
  count=$(grep -Ei -- "$2" "$f" | grep -vEc -- "$ALLOW" || true)
  printf '%s | %s | %s\n' "$1" "${lines:-—}" "${count:-0}"
}

echo "категорія | рядки | кількість"
check "секрети"            '(api[_-]?key|token|secret|passw|bearer|\bpat[A-Za-z0-9]*\.|xox[abprs]-|\bsk-|\bfake_|\bapp[A-Za-z0-9]{10,}|://[^ /:]+:[^ @]+@)'
check "connection strings" '(postgres(ql)?|mysql|mongodb(\+srv)?|redis|amqp)://'
check "вебхуки"            '/webhook/'
check "email"              '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
check "телефони UA"        '(\+?380[ ()-]*[0-9]{2}[ )-]*[0-9]{3}|\b0[0-9]{2}[ )-]*[0-9]{3}[ -]?[0-9]{2}[ -]?[0-9]{2}\b)'
check "хендли месенджерів" '((^|[ (])@[A-Za-z0-9_]{5,}|t\.me/)'
echo "(рядки з <SECRET_OUT_OF_BAND>, (XX), (00) не рахуються — переглянь їх окремо)"
