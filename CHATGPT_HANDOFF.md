# Merre vagy, vándor? — ChatGPT Project Handoff

> Ezt a fájlt töltsd fel a ChatGPT projektbe tudásbázisként, és add meg az alábbi System Promptot is.

---

## SYSTEM PROMPT (ezt másold be a ChatGPT "Project instructions" mezőbe)

```
Te egy tapasztalt full-stack fejlesztő asszisztens vagy, aki segít a "Merre vagy, vándor?" interaktív térképprojekt fejlesztésében.

KOMMUNIKÁCIÓ:
- Magyarul válaszolj, röviden és konkrétan
- Egyszerre egy task / kérdés
- Nincs motivációs szöveg, AI-sounding próza
- Ha bizonytalan vagy egy módosításban — kérj approval-t mielőtt írsz fájlt

TECHNIKAI KORLÁTOK:
- NE futtass lokális build-et (natív modulok miatt Bus error a sandboxban)
- Ha build teszt kell: kérd meg Bélát hogy futtassa saját PowerShell-jén (VS Code: Ctrl+ö)
- Deploy CSAK: kódmódosítás → git commit → git push origin main → Vercel auto-deploy
- Soha ne deploy-olj direktbe Vercel CLI-vel
- A .env.local érzékeny adatokat tartalmaz — soha ne olvasd ki, ne másold kódba

MUNKAMAPPA: C:\Users\kobor\Desktop\automation\websites\merevagyvandor\mere vagy vandor magyarazat filok\
(Ez a mappanév elírással van, ne nevezd át)
```

---

## 1. PROJEKT LEÍRÁS

**Mi ez:** Interaktív világtérkép az erdélyi magyar diaszpórának. Felhasználók pin-eket rakhatnak le szülővárosra / jelenlegi lakóhelyre.

**Célközönség:** Erdélyi magyarok a világ minden táján (Csíksomlyó-centered Facebook csoport: ~1.08M elérés)

**Alapítók:**
- **Kobori Béla MSc** (London) — technikai fejlesztés, jogi keret
- **Balázs Áron** (Erdély, Chillygence Founder) — stratégia, közösségi kapcsolat
- **Szabi** — jogász, GDPR szövegezés

**Jogi üzemeltető:** Erdélyi Vándor Baráti Társaság (bírósági bejegyzés folyamatban)

---

## 2. TECH STACK

| Elem | Részlet |
|------|---------|
| Framework | Next.js 16.0.10 (App Router) + TypeScript |
| CSS | Tailwind CSS v4 |
| Térkép | Mapbox GL JS 3.17 (sötét satellite globe) |
| DB | Supabase (Postgres, eu-west-1 Dublin) |
| Email | Resend |
| Hosting | Vercel |
| Lokális fejlesztés | Windows + VS Code + PowerShell, Node v22.22.0 |

---

## 3. REPO ÉS DEPLOY

- **GitHub:** github.com/icecreambk/merre-vagy-vandor (main branch)
- **Vercel projekt:** merre-vagy-vandor (team: icecreambks-projects)
- **Auto-deploy:** GitHub main → Vercel automatikusan
- **Élő URL:** merre-vagy-vandor-git-main-icecreambks-projects.vercel.app
- **Domainek:** merevagyvandor.hu, vandor.hu (DNS/SSL bekötés folyamatban)

---

## 4. PROJEKT ÁLLAPOT (2026. május 4.)

### ✅ KÉSZ ÉS COMMITOLT

- Next.js + TypeScript + Supabase + Mapbox alap
- Mapbox globe térkép sötét satellite stílussal
- Erdély GeoJSON overlay + Csíksomlyó jelölő
- Row Level Security (RLS) a pins táblán
- 11 km-es koordináta kerekítés privátságra
- Törlési token hash-elve tárolva
- Email visszaigazolás (Resend)
- /adatvedelem (GDPR + UK GDPR)
- /rolunk oldal
- Sticky submit + close gombok (UX fix)
- Dátum bug fix (DATE formátum Postgres-nek)
- **Form 2.0 architektúra IMPLEMENTÁLVA** (lásd lent)
- Commit: `4336dda` + Form 2.0 commitok

### ⏳ PENDING (elvégzendő)

- [ ] Lokális build ellenőrzés (`npm run build`) — Béla futtatja PowerShell-ben
- [ ] End-to-end teszt: pin felrakás → success modal → Form 2 → sorsolás checkbox
- [ ] `git push origin main` → Vercel deploy → Áron látja
- [ ] Sorsolási szabályzat részletes verziója (egyesület bejegyzés után)
- [ ] Email értesítő Form 2 kitöltőknek
- [ ] Sponsor outreach pitch deck
- [ ] Donably integráció (donations) — egyesület bejegyzés után
- [ ] Domain bekötés: merevagyvandor.hu és vandor.hu (DNS/SSL)

### 🔒 KÜLSŐ FÜGGÉS (nem Bélán múlik)

- Egyesület bírósági bejegyzése
- Szabi jogi véleménye
- Bejegyzés után: GDPR oldalon adatkezelő személyének frissítése

---

## 5. ADATBÁZIS ARCHITEKTÚRA

### pins tábla (publikus, sovány)
```
id, nickname, email, city, country,
lat, lng, lat_rounded, lng_rounded,
pin_type, consent_marketing,
expires_at, removal_token_hash, status

# Deprecated (frontend nem használja, later drop):
birth_year, education, occupation, origin_city, origin_country, relevant_date
```

### pin_profiles tábla (ÚJ — sponzor-lead, RLS-zárt)
```
pin_id (FK → pins.id, cascade delete)
origin_town, county, family_remained
travel_frequency, travel_mode
remittance_frequency, relocation_plan
age_range, occupation_category, acquisition_source
consent_sponsor_offers, consent_sweepstakes
completion_step (0-4, részleges mentés)
created_at, updated_at (auto trigger)
```

**Fontos:** pin_profiles teljesen el van zárva a publikus API-tól (csak service_role éri el).

---

## 6. FORM 2.0 ARCHITEKTÚRA (Áron jóváhagyta)

### Form 1 — gyors (~30 mp)
- 3 gomb: Kint élek / Kijárok / Készülök
- Város (autocomplete)
- Email *
- Nicknév (opcionális, ez látszik a térképen)
- ☐ GDPR consent *
- ☐ Marketing consent (opcionális)

### Form 2 — opcionális, sikeres pin UTÁN (~60-80 mp)
4 szekció, 10 kérdés, WizzAir-féle sorsolási inducement a végén.

**1/4 Gyökerek:** erdélyi szülőhely (szabad), megye dropdown (13 megye), maradt-e család kint

**2/4 Hazautazás:** hányszor/évente, mivel utazik

**3/4 Pénz és tervek:** pénzküldés, hazaköltözési terv

**4/4 Te:** életkor-tartomány, foglalkozási terület (8 kategória), honnan ismerte meg a projektet

**Záró:** ☐ Részt veszek havi sorsolásban ☐ Sponzori ajánlatok emailen

### Sponzor-mátrix
| Sponzor | Releváns adatok |
|---------|----------------|
| WizzAir / Tarom | megye + utazás + repülő |
| Volánbusz / Flixbus | megye + busz/vonat + gyakoriság |
| Wise / Revolut | pénzküldés + életkor + foglalkozás |
| Költöztető / ingatlan | hazaköltözés + életkor |
| Biztosítás | életkor + utazás + család kint |

---

## 7. KRITIKUS FÁJLOK

```
app/
  page.tsx                    — Főtérkép, UI state-ek (idle/form/success/profile/profile_done)
  api/pins/route.ts           — Pin létrehozás API (Zod validáció, sovány)
  api/pins/[id]/profile/route.ts — Form 2 adat mentés (removal_token auth, upsert)
  adatvedelem/page.tsx        — GDPR tájékoztató (2/A + 2/B + 2/C + sorsolási szabályzat)
  rolunk/page.tsx             — Rólunk oldal
  globals.css                 — Teljes CSS (map, form, sweepstakes komponensek)

components/
  pin/PinForm.tsx             — Form 1 (sovány: email/város/nicknév/2 consent)
  pin/PinSuccess.tsx          — Sikeres pin modal (sweepstakes-box + CTA-k)
  pin/PinProfileForm.tsx      — Form 2 (4 szekció, progress bar, 10 kérdés)
  pin/PinProfileDone.tsx      — Köszönő képernyő Form 2 után
  pin/CityAutocomplete.tsx    — Város autocomplete
  map/MapComponent.tsx        — Térkép + popup
  overlays/AboutOverlay.tsx   — Infó overlay

lib/
  constants.ts                — PIN_EXPIRY_DAYS = 3650, OPERATOR_NAME
  supabase/client.ts          — Supabase kliens
  email/                      — Resend email küldés

types/index.ts                — Pin, PinProfile, dropdown opciók TypeScript típusok

public/geo/                   — GeoJSON fájlok (Erdély outline, stb.)
```

---

## 8. FONTOS DÖNTÉSEK ÉS KONTEXTUS

- **Nicknév** jelenik meg a térképen, nem a valódi név
- **30 napos lejárat ki van kapcsolva** — retenció visszavonásig (expires_at = 10 év, biztonsági háló)
- **Cookie-mentes** — csak Mapbox technikai cookie
- **RLS** — publikus API csak: nickname, város, ország, kerekített koordináta, pin típus
- **Koordináta kerekítés** — ~11 km, privátság miatt
- **Commit script:** mentes4.bat (build ellenőrzéssel)
- **README.md** az adott mappában kissé elavult (még 30 napos lejáratot ír) — nem releváns

---

## 9. HOGYAN SEGÍTS

Ha Béla kód módosítást kér:
1. Kérdezz rá ha valami nem egyértelmű
2. Mutasd meg a konkrét fájlt és sort amit változtatnál
3. Kérj jóváhagyást mielőtt teljes fájlt írsz ki
4. Emlékeztesd hogy commit + push kell utána (mentes4.bat vagy git parancs)
5. Build tesztet Béla futtatja saját PowerShell-jén

Ha Vercel/deploy kérdés van:
- Auto-deploy: push → Vercel automatikusan deploy-ol
- Vercel dashboard: vercel.com → icecreambks-projects team → merre-vagy-vandor projekt
- Runtime logok és build logok a Vercel dashboardon elérhetők
