@echo off
REM ─── Merre vagy, vandor? — harmadik mentes (2026-04-25 este — lead-gen pivot dokumentacio) ───
cd /d "%~dp0"

echo.
echo ═══════════════════════════════════════════════════
echo  Merre vagy, vandor? — Lead-gen pivot dokumentacio
echo ═══════════════════════════════════════════════════
echo.

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
git commit -m "docs: Form 2.0 lead-gen pivot javaslat (2-lepcoss arhitektura)" -m "- email_aaronnak_2.md: teljes javaslat Aaronnak strategiai dontesre" -m "- PROGRESS.md: Form 2.0 architektura + 9 kerdes + sponsor-matrix dokumentalva" -m "- 2-lepcoss form javaslat: gyors pin (~30mp) + opcionalis sponsor survey (~60-80mp)" -m "- pin_profiles kulon Supabase tabla javasolva GDPR-tisztasagra" -m "- Decision pending: Aaron visszajelzese kell az implementacio elotti vagy utani sorrendrol" -m "- Lead-gen szakerto visszajelzes alapjan: rovidebb form + strukturalt sponsor-ready adat"
if errorlevel 1 goto :err

echo.
echo ═══════════════════════════════════════════════════
echo  ✓ Mentes sikeres!
echo ═══════════════════════════════════════════════════
echo.
git log -1 --oneline
echo.
echo TIPP: Push-olhato (csak dokumentacio modosul, kod nem). Holnap folytatjuk.
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
