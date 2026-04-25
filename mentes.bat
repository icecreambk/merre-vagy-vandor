@echo off
REM ─── Merre vagy, vándor? — projekt mentés git-be ───
cd /d "%~dp0"

echo.
echo ═══════════════════════════════════════════════════
echo  Merre vagy, vandor? — commit minden valtoztatas
echo ═══════════════════════════════════════════════════
echo.

REM Leszedjuk a stale lock filet ha van
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
git commit -m "Aaron javaslatok beepitve: bovitett urlap, egyesulet-alapu uzemeltetes, retencios valtoztatas" -m "- PinForm: 3 szekcio (Hol vagy most / Honnan / Rolad), nicknev, szul.ev, vegzettseg, foglalkozas, szarmazasi hely, datum" -m "- Kulon opcionalis marketing consent checkbox" -m "- Pin tipus gombok leirasa eltavolitva (atment /rolunk oldalra)" -m "- /rolunk oldal letrehozva (bovitett kozossegi leiras)" -m "- /adatvedelem: uj mezok, retencio visszavonasig, Erdelyi Vandor Barati Tarsasag (alapitas alatt) mint uzemelteto" -m "- Terkep popup: nicknev + honnan sor, HTML escape" -m "- Footer mindenutt: Erdelyi Vandor Barati Tarsasag" -m "- Supabase migracio: nickname, birth_year, education, occupation, origin_city/country, relevant_date, consent_marketing oszlopok" -m "- PIN_EXPIRY_DAYS 30 -> 3650 (10 ev csak technikai biztonsagi halo)"
if errorlevel 1 goto :err

echo.
echo ═══════════════════════════════════════════════════
echo  ✓ Mentes sikeres!
echo ═══════════════════════════════════════════════════
echo.
git log -1 --oneline
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
