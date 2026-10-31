#!/usr/bin/env bash
set -euo pipefail
# Network mirrors can stall apt or the browser CDN. Keep the same Playwright tests
# and use the runner's installed Chrome when that download cannot finish.
if timeout 180s npx playwright install --with-deps chromium; then
  exit 0
fi
task_chrome_path="$(command -v google-chrome || command -v chromium || true)"
if [ -z "$task_chrome_path" ] || [ -z "${GITHUB_ENV:-}" ]; then
  echo 'No se pudo preparar Chromium y el entorno no tiene un Chrome alternativo.' >&2
  exit 1
fi
printf 'PLAYWRIGHT_CHROMIUM_EXECUTABLE=%s\n' "$task_chrome_path" >> "$GITHUB_ENV"
echo "Se ejecutará la misma batería Playwright con Chrome instalado: $task_chrome_path"
