#!/usr/bin/env bash
set -euo pipefail
legacy="$RUNNER_TEMP/cachaste-legacy47"
mkdir -p "$RUNNER_TEMP/cachaste-upgrade-results"
adb install -r "$legacy/android/app/build/outputs/apk/debug/app-debug.apk"
adb install -r "$legacy/android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk"
adb shell am instrument -w -e class cl.preparatupaes.app.UpgradePersistenceTest -e phase seed cl.preparatupaes.app.test/androidx.test.runner.AndroidJUnitRunner > "$RUNNER_TEMP/cachaste-upgrade-results/47-seed.txt"
cat "$RUNNER_TEMP/cachaste-upgrade-results/47-seed.txt"
grep -Fq 'OK (1 test)' "$RUNNER_TEMP/cachaste-upgrade-results/47-seed.txt"
adb shell am force-stop cl.preparatupaes.app
adb shell am instrument -w -e class cl.preparatupaes.app.UpgradePersistenceTest -e phase reopen cl.preparatupaes.app.test/androidx.test.runner.AndroidJUnitRunner > "$RUNNER_TEMP/cachaste-upgrade-results/47-reopen.txt"
cat "$RUNNER_TEMP/cachaste-upgrade-results/47-reopen.txt"
grep -Fq 'OK (1 test)' "$RUNNER_TEMP/cachaste-upgrade-results/47-reopen.txt"
# -r must preserve package data. Never uninstall or use pm clear between versions.
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
adb install -r android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk
adb shell am instrument -w -e class cl.preparatupaes.app.UpgradePersistenceTest -e phase verify cl.preparatupaes.app.test/androidx.test.runner.AndroidJUnitRunner > "$RUNNER_TEMP/cachaste-upgrade-results/51-verify.txt"
cat "$RUNNER_TEMP/cachaste-upgrade-results/51-verify.txt"
grep -Fq 'OK (1 test)' "$RUNNER_TEMP/cachaste-upgrade-results/51-verify.txt"
