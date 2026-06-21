@echo off
setlocal
chcp 65001 >nul

echo ==========================================
echo התקנת ספריות Python לניתוח אתרוגים
echo ==========================================

echo.
REM אופציונלי: יצירת סביבה וירטואלית
REM python -m venv .venv
REM call .venv\Scripts\activate

python -m pip install --upgrade pip
python -m pip install opencv-python numpy scikit-image colormath torch torchvision torchaudio ultralytics matplotlib

echo.
echo מריץ בדיקת ייבוא ספריות...
python - << "PYTEST"
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

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo יש ספריות שלא נטענו. ראה פלט למעלה.
  exit /b 1
)

echo.
echo ההתקנה הסתיימה בהצלחה!
pause
endlocal
