#!/usr/bin/env python3
"""Validate the manifest dumped from the actual AAB by official bundletool."""
import json
import sys
import xml.etree.ElementTree as ET

ANDROID = '{http://schemas.android.com/apk/res/android}'

def verify(path):
    root = ET.parse(path).getroot()
    sdk = root.find('uses-sdk')
    app = root.find('application')
    result = {
        'package': root.get('package'),
        'versionName': root.get(ANDROID + 'versionName'),
        'versionCode': root.get(ANDROID + 'versionCode'),
        'targetSdk': None if sdk is None else sdk.get(ANDROID + 'targetSdkVersion'),
    }
    expected = {'package': 'cl.preparatupaes.app', 'versionName': '1.5.0-rc7', 'versionCode': '34', 'targetSdk': '36'}
    if result != expected:
        raise ValueError('Identidad del AAB incorrecta: ' + json.dumps(result))
    if app is None or app.get(ANDROID + 'debuggable', 'false') != 'false':
        raise ValueError('Release debuggable o sin application')
    if app.get(ANDROID + 'testOnly', 'false') != 'false':
        raise ValueError('Release testOnly')
    return {**result, 'debuggable': False, 'testOnly': False, 'verified': True}

if __name__ == '__main__':
    print(json.dumps(verify(sys.argv[1])))
