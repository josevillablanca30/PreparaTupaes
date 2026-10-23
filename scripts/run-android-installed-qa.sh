#!/usr/bin/env bash
set -u
task_output=android/app/build/outputs/didactic-screens
mkdir -p "$task_output"
adb logcat -c
adb logcat -v threadtime -s CachasteQa:I AndroidRuntime:E chromium:E > "$task_output/native-diagnostics.log" 2>&1 &
task_log_pid=$!
gradle -p android --no-daemon --max-workers=2 '-Dorg.gradle.jvmargs=-Xmx1024m -Dfile.encoding=UTF-8' :app:connectedDebugAndroidTest
task_result=$?
adb get-state > "$task_output/device-state.txt" 2>&1 || true
adb pull /data/local/tmp/cachaste-didactic-screens/. "$task_output/" || true
kill "$task_log_pid" 2>/dev/null || true
if [ "$task_result" -ne 0 ]; then
  tail -n 80 "$task_output/native-diagnostics.log"
fi
exit "$task_result"
