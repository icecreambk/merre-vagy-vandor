@echo off
REM ─── Merre vagy, vandor? — negyedik mentes (2026-04-30 — 2-lepcsoss form architektura) ───
cd /d "%~dp0"

echo.
echo ═══════════════════════════════════════════════════
echo  Merre vagy, vandor? — Form 1 + Form 2 architektura
echo ═══════════════════════════════════════════════════
echo.

if exist ".git\index.lock" (
    echo [1/5] Stale lock file torlese...
    del /f /q ".git\index.lock"
)

echo [2/5] Lokalis build ellenorzes (npm run build)...
call npm run build
if errorlevel 1 (
    echo.
    echo ═══════════════════════════════════════════════════
    echo  ✗ BUILD HIBA — javitsuk mielott commit-olunk
    echo ═══════════════════════════════════════════════════
    pause
    exit /b 1
)

echo.
echo [3/5] Valtoztatasok hozzaadasa...
git add -A
if errorlevel 1 goto :err

echo.
echo [4/5] Aktualis allapot:
git status --short
echo.

echo [5/5] Commit keszitese...
git commit -m "feat: 2-step form architecture (Form 1 slim + Form 2 sponsor survey + sweepstakes)" -m "BREAKING: Form 1 (PinForm) most csak email/varos/nicknev/2 consent (~30 mp)" -m "- Form 2 (PinProfileForm) uj komponens: 4 szekcio progress bar-ral, 10 kerdes" -m "- Mind dropdown/radio kerdes (1 szabad szoveg) - sponsor-ready strukturalt adat" -m "- Reszleges valasz mentes (completion_step tracking)" -m "- WizzAir/Volanbusz havi sorsolasi inducement a Form 2 vegen" -m "- Kulon sponsor opt-in checkbox (consent_sponsor_offers)" -m "- pin_profiles uj Supabase tabla, RLS-szel teljesen elzarva (csak service_role)" -m "- POST /api/pins/[id]/profile endpoint, removal_token alapu hitelesitessel" -m "- PinSuccess.tsx atalakitva: sweepstakes-box + Folytatom/Kihagyom CTA-k" -m "- PinProfileDone.tsx uj komponens: koszono kepernyo" -m "- /adatvedelem oldal: 2/A, 2/B, 2/C bontas + 11. szekcio sorsolasi szabalyzat" -m "- types/index.ts: PinProfile + dropdown opciok teljes konstans-keszlet" -m "- pins tabla soványitva (origin_city/country, birth_year, education, occupation, relevant_date csak DB szinten marad meg deprecated)"
if errorlevel 1 goto :err

echo.
echo ═══════════════════════════════════════════════════
echo  ✓ Commit kesz!
echo ═══════════════════════════════════════════════════
echo.
git log -1 --oneline
echo.
echo TIPP: Ha mehet Aronnak, futtasd: git push origin main
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
