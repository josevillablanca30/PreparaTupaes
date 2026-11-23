#!/usr/bin/env bash
set -eu
mailbox=$(sed -n 's/.*mailto:\([^"<>]*\)@gmail.com.*/\1/p' web/public/cuenta.html | head -1)
test -n "$mailbox"
mkdir -p evidencia
adb install android/app/build/outputs/apk/debug/app-debug.apk
adb install android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk
adb shell run-as cl.preparatupaes.app mkdir -p files
adb shell -T run-as cl.preparatupaes.app sh -c "'cat > files/qa-login'" < "$RUNNER_TEMP/student-test-password"
rm -f "$RUNNER_TEMP/student-test-password"
adb shell am instrument -w -e qaEmail "${mailbox}+cachaste.qa.20261123@gmail.com" -e class cl.preparatupaes.app.StudentJourneyTest cl.preparatupaes.app.test/androidx.test.runner.AndroidJUnitRunner > "$RUNNER_TEMP/journey.txt"
for f in planes ingreso actividad reingreso; do
  if adb shell run-as cl.preparatupaes.app test -s "files/$f.png"; then
    adb exec-out run-as cl.preparatupaes.app cat "files/$f.png" > "evidencia/$f.png"
  fi
done
cat "$RUNNER_TEMP/journey.txt"
grep -Fq 'OK (1 test)' "$RUNNER_TEMP/journey.txt"
