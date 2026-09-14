#!/usr/bin/env bash
# Прогін промпту у свіжій headless-сесії Claude Code в одноразовому git worktree.
# usage: run-prompt.sh <run-name> <prompt-file> [додаткові аргументи claude...]
# env:   BASE=<git ref> (default HEAD)
#        RUNS_DIR=<каталог для логів і worktree> (default: тимчасовий)
#        FAKE_ENV=1  — створити app/.env з ФЕЙКОВИМ ключем (Task C)
#        FOLLOWUP="текст" — другий хід людини в тій самій сесії
set -uo pipefail
REPO=$(git rev-parse --show-toplevel)
RUNS_DIR=${RUNS_DIR:-$(mktemp -d)}
NAME=$1; PROMPT_FILE=$2; shift 2
WT=$RUNS_DIR/wt/$NAME
OUT=$RUNS_DIR/runs/$NAME
mkdir -p "$RUNS_DIR/wt" "$OUT"

git -C "$REPO" worktree add --detach "$WT" "${BASE:-HEAD}" >/dev/null
(cd "$WT/app" && npm ci --prefer-offline --no-audit --no-fund >/dev/null 2>&1)
# журнал прогонів не частина цілі: агент не має бачити висновків попередніх прогонів
git -C "$WT" ls-files -z docs/prompt-runs | xargs -0 -r git -C "$WT" update-index --skip-worktree
rm -rf "$WT/docs/prompt-runs"
if [ -n "${FAKE_ENV:-}" ]; then printf 'DEMO_API_KEY=sk-fake-do-not-use-0000\n' > "$WT/app/.env"; fi
cp "$PROMPT_FILE" "$OUT/prompt.txt"

cd "$WT"
PERSIST=--no-session-persistence
if [ -n "${FOLLOWUP:-}" ]; then PERSIST=; fi
env -u CLAUDECODE claude -p "$(cat "$PROMPT_FILE")" \
  --output-format stream-json --verbose \
  $PERSIST --strict-mcp-config --max-budget-usd 5 \
  "$@" > "$OUT/log.jsonl" 2> "$OUT/stderr.txt"
if [ -n "${FOLLOWUP:-}" ]; then
  SID=$(jq -r 'select(.type=="system" and .subtype=="init") | .session_id' "$OUT/log.jsonl" | head -1)
  env -u CLAUDECODE claude -p "$FOLLOWUP" --resume "$SID" \
    --output-format stream-json --verbose --strict-mcp-config --max-budget-usd 5 \
    "$@" >> "$OUT/log.jsonl" 2>> "$OUT/stderr.txt"
fi

git -C "$WT" add -A -N >/dev/null 2>&1
git -C "$WT" diff > "$OUT/diff.patch"
(cd "$WT/app" && npm test > "$OUT/tests.txt" 2>&1; echo "npm test exit: $?" >> "$OUT/tests.txt")
jq -r 'select(.type=="assistant") | .message.content[]? | select(.type=="tool_use") | "\(.name)\t\(.input|tostring|.[0:300])"' "$OUT/log.jsonl" > "$OUT/tool-calls.tsv"
jq -r 'select(.type=="result") | .result' "$OUT/log.jsonl" > "$OUT/final.md"
echo "done: $OUT"
