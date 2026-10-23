#!/usr/bin/env bash
set -u
task_output=android/app/build/outputs/didactic-screens
mkdir -p "$task_output"
adb shell getprop > "$task_output/device-properties.txt"
emulator -version > "$task_output/emulator-version.txt" 2>&1
adb logcat -c
adb logcat -v threadtime -s CachasteQa:I AndroidRuntime:E chromium:E > "$task_output/native-diagnostics.log" 2>&1 &
task_log_pid=$!
adb shell settings put secure show_ime_with_hard_keyboard 0
(while true; do
  date -u
  free -m
  adb pull /data/local/tmp/cachaste-didactic-screens/. "$task_output/" > /dev/null 2>&1 || true
  sleep 5
done) > "$task_output/host-memory.log" 2>&1 &
task_capture_pid=$!
gradle -p android --no-daemon --max-workers=2 '-Dorg.gradle.jvmargs=-Xmx1024m -Dfile.encoding=UTF-8' :app:connectedDebugAndroidTest
task_result=$?
adb get-state > "$task_output/device-state.txt" 2>&1 || true
adb pull /data/local/tmp/cachaste-didactic-screens/. "$task_output/" || true
kill "$task_capture_pid" "$task_log_pid" 2>/dev/null || true
if [ "$task_result" -ne 0 ]; then
  tail -n 80 "$task_output/native-diagnostics.log"
  tail -n 20 "$task_output/host-memory.log"
  sudo dmesg | tail -n 50 || true
fi
exit "$task_result"
