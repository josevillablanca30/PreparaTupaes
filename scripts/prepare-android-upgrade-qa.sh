#!/usr/bin/env bash
set -euo pipefail
# Rebuild the exact version-47 source recorded with the accepted AAB. Same disposable debug signer as version 51.
legacy="$RUNNER_TEMP/cachaste-legacy47"
git worktree add --detach "$legacy" 13ae26d3f752ccc6f3de97086dee07cb938ac3fc
ln -s "$GITHUB_WORKSPACE/node_modules" "$legacy/node_modules"
(cd "$legacy" && node scripts/build.mjs)
mkdir -p "$legacy/android/app/src/main/assets" "$legacy/android/app/src/commercialAccessQa/java/cl/preparatupaes/app"
cp -R "$legacy/dist/." "$legacy/android/app/src/main/assets/"
cp android/app/src/commercialAccessQa/java/cl/preparatupaes/app/UpgradePersistenceTest.java "$legacy/android/app/src/commercialAccessQa/java/cl/preparatupaes/app/"
printf 'sdk.dir=%s\n' "$ANDROID_HOME" > "$legacy/android/local.properties"
gradle -p "$legacy/android" :app:assembleDebug :app:assembleDebugAndroidTest -PcachasteCommercialAccessQa
gradle -p android :app:assembleDebug :app:assembleDebugAndroidTest -PcachasteCommercialAccessQa
