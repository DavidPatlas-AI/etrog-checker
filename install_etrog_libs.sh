#!/usr/bin/env bash
set -e
printf "==========================================\n"
printf " התקנת ספריות Python לניתוח אתרוגים\n"
printf "==========================================\n"

# אופציונלי: יצירת venv
# python3 -m venv .venv
# source .venv/bin/activate

python3 -m pip install --upgrade pip
python3 -m pip install opencv-python numpy scikit-image colormath torch torchvision torchaudio ultralytics matplotlib

printf "\nמריץ בדיקת ייבוא ספריות...\n"
python3 - << 'PYTEST'
import sys
mods = [
    ("cv2","opencv-python"),
    ("numpy","numpy"),
    ("skimage","scikit-image"),
    ("colormath","colormath"),
    ("torch","torch"),
    ("torchvision","torchvision"),
    ("torchaudio","torchaudio"),
    ("ultralytics","ultralytics"),
    ("matplotlib","matplotlib"),
]
failed = []
for m,_ in mods:
    try:
        __import__(m)
        print(f"OK {m}")
    except Exception as e:
        print(f"FAIL {m}: {e}")
        failed.append(m)
print("---")
if failed:
    print("סיום: חלק מהייבואים נכשלו:", failed)
    sys.exit(1)
else:
    print("סיום: הכל תקין")
PYTEST

printf "\n✅ ההתקנה הסתיימה!\n"
