@echo off
REM ─── Merre vagy, vandor? — masodik mentes (2026-04-25 UX + bug fixek) ───
cd /d "%~dp0"

echo.
echo ═══════════════════════════════════════════════════
echo  Merre vagy, vandor? — UX + bug fix commit
echo ═══════════════════════════════════════════════════
echo.

REM Stale lock file torlese ha van
if exist ".git\index.lock" (
    echo [1/4] Stale lock file torlese...
    del /f /q ".git\index.lock"
)

echo [2/4] Valtoztatasok hozzaadasa...
git add -A
if errorlevel 1 goto :err

echo.
echo [3/4] Aktualis allapot:
git status --short
echo.

echo [4/4] Commit keszitese...
git commit -m "fix: PinForm desktop UX + relevant_date format" -m "- PinForm: desktop-on max-height + belso scroll (eddig levagta a submit gombot)" -m "- Sticky submit/cancel gombok az aljon (gradient fade alattuk)" -m "- Sticky close (X) gomb a jobb felso sarokban scroll kozben" -m "- Aranyszinu custom scrollbar" -m "- API: <input type=month> YYYY-MM formatumat YYYY-MM-01-re alakitja DATE oszlophoz" -m "- Postgres 22007 invalid date syntax hiba megszuntetve" -m "- PROGRESS.md frissitve a mai munkaval"
if errorlevel 1 goto :err

echo.
echo ═══════════════════════════════════════════════════
echo  ✓ Mentes sikeres!
echo ═══════════════════════════════════════════════════
echo.
git log -1 --oneline
echo.
echo TIPP: Push-ra MEG NE menj — egyesulet bejegyzeseig csak local commit.
echo.
pause
exit /b 0

:err
echo.
echo ═══════════════════════════════════════════════════
echo  ✗ HIBA — nezd at a kimenetet
echo ═══════════════════════════════════════════════════
pause
exit /b 1
