# Merre vagy, vándor? — Folyamat mentés

**Utolsó frissítés:** 2026. április 30.
**Státusz:** ✅ Form 2.0 ARCHITEKTÚRA IMPLEMENTÁLVA. Áron jóváhagyta a 2-lépcsős formát + WizzAir-féle sorsolási inducement. Egyesület bejegyzésére vár → utána éles sorsolás indítás.

---

## 0c. Április 30. — MAI MUNKA: 2-lépcsős form architektúra (BEÉPÍTVE)

### Áron + szakértő döntés
1. Form 1 átépítve **soványra** — gyors pin felrakás (~30 mp): email, város, nicknév, 2 consent
2. Form 2 új — sikeres pin után, **opcionális** (~60-80 mp), 10 kategorikus kérdés
3. **WizzAir / Volánbusz havi sorsolási inducement** a Form 2 végén
4. **Külön Supabase tábla** (`pin_profiles`) — sponzor-érzékeny adatok elválasztva, RLS-szel lezárva

### Implementáció

| Mit | Fájl |
|---|---|
| **Supabase migráció:** `pin_profiles` tábla + 6 index + RLS | Supabase migration `create_pin_profiles_table` |
| **TypeScript típusok:** PinProfile, dropdown opciók (COUNTY_OPTIONS, OCCUPATION_CATEGORY_OPTIONS, stb.) | `types/index.ts` |
| **PinForm.tsx soványítva** — csak email/város/nicknév/2 consent | `components/pin/PinForm.tsx` |
| **API /api/pins** Zod schema soványítva | `app/api/pins/route.ts` |
| **PinProfileForm.tsx** új komponens — 4 szekció progress bar-ral, 10 kérdés, részleges mentés | `components/pin/PinProfileForm.tsx` |
| **POST /api/pins/[id]/profile** új endpoint — removal_token alapú hitelesítés, upsert | `app/api/pins/[id]/profile/route.ts` |
| **PinSuccess.tsx** átalakítva — sweepstakes-box + „Folytatom" / „Kihagyom" CTA-k | `components/pin/PinSuccess.tsx` |
| **PinProfileDone.tsx** új — köszönő képernyő | `components/pin/PinProfileDone.tsx` |
| **app/page.tsx** — új UI state-ek: 'profile', 'profile_done' | `app/page.tsx` |
| **MapComponent popup** — nem hivatkozik már a soványított origin_city/country mezőkre | `components/map/MapComponent.tsx` |
| **/adatvedelem** átírva: 2/A (publikus pin) + 2/B (opcionális profile) + 2/C (technikai) bontás, 11. szekció sorsolási szabályzat | `app/adatvedelem/page.tsx` |
| **CSS** — új komponensek: .success-sweepstakes-box, .profile-progress, .profile-radio-group, .profile-select, .profile-sweepstakes | `app/globals.css` |
| **mentes4.bat** — commit script build ellenőrzéssel | `mentes4.bat` |

### Form 1 — végleges (~30 mp)
- 3 gomb: Kint élek / Kijárok / Készülök
- Város (auto)
- Email *
- Nicknév (opcionális, ez látszik a térképen)
- ☐ GDPR consent *
- ☐ Marketing consent (opcionális)

### Form 2 — végleges (4 szekció, 10 kérdés, ~60-80 mp)

**1/4 — Gyökerek 🌳**
- Erdélyi szülőhely (szabad szöveg, opcionális)
- Megye dropdown (13 erdélyi megye + Nem Erdély + Inkább nem mondom)
- Maradt családod kint? (közeli / távolabbi / nem / inkább nem mondom)

**2/4 — Hazautazás ✈️🚗**
- Hányszor jutsz haza évente? (Még nem / 1-2x / 3-5x / 6+)
- Mivel utazol? (Repülő / Autó / Busz / Vonat / Vegyes)

**3/4 — Pénz és tervek 💸**
- Küldesz haza pénzt? (Rendszeresen / Alkalmanként / Nem / Inkább nem mondom)
- Tervezel hazaköltözést? (1-2 éven belül / valamikor / Nem / Még nem tudom)

**4/4 — Te 👤**
- Életkor-tartomány (18-25 / 26-35 / 36-45 / 46-55 / 56+ / Inkább nem mondom)
- Foglalkozási terület (8 kategória dropdown)
- Honnan ismerted meg a projektet? (FB / közösségi média / barát / sajtó / Áron / egyéb)

**Záró checkbox-ok:**
- ☐ 🎁 Részt veszek a havi sorsolásban (consent_sweepstakes)
- ☐ Sponzori ajánlatok email-en (consent_sponsor_offers)

### Sponzor-mátrix
- **WizzAir / Tarom** → megye + család kint + utazási gyakoriság + repülő mód
- **Volánbusz / Flixbus** → megye + busz/vonat + gyakoriság
- **Wise / Revolut** → pénzküldés + életkor + foglalkozás
- **Költöztető / ingatlan** → hazaköltözés + életkor + foglalkozás
- **Biztosítás** → életkor + utazási gyakoriság + család kint

### Adatbázis architektúra (most)

```
pins (publikus, sovány)
├── id, nickname, email, city, country, lat/lng,
├── lat_rounded/lng_rounded, pin_type, consent_marketing,
├── expires_at, removal_token_hash, status
└── (deprecated columns megmaradtak: birth_year, education, occupation,
     origin_city/country, relevant_date — frontend nem használja, később drop)

pin_profiles (sponzor-lead, RLS-zárt)
├── pin_id (FK → pins.id, cascade delete)
├── origin_town, county, family_remained
├── travel_frequency, travel_mode
├── remittance_frequency, relocation_plan
├── age_range, occupation_category, acquisition_source
├── consent_sponsor_offers, consent_sweepstakes
├── completion_step (0-4 — részleges mentés tracking)
└── created_at, updated_at (auto trigger)
```

### Pending (HOLNAPI / KÉSŐBBI)
- [ ] **Lokális build ellenőrzés Windows-on** (`npm run build`) — a `mentes4.bat` ezt automatikusan futtatja commit előtt
- [ ] **End-to-end teszt** — pin felrakás → success modal → Form 2 → sorsolás checkbox → success
- [ ] **Push origin main** — Vercel auto-deploy → Áron látja
- [ ] Sorsolási szabályzat részletes verziója (egyesület bejegyzés után)
- [ ] Email értesítő a Form 2 kitöltőknek (köszönő + sorsolási tájékoztató)
- [ ] Sponsor outreach materials — pitch deck a kategorikus adatokkal

**Lokális commit státusz mai munka után:** UNCOMMITTED — a `mentes4.bat` script ezt fogja commit-olni.

---

## 0a. Április 25. délután — Mai munka (BEÉPÍTVE, COMMIT-OLT, PUSH-OLT)

| Mit csináltunk | Miért | Státusz |
|---|---|---|
| `npm run build` lokálisan zöld | Vercel deploy biztos lefut | ✅ |
| Aaron-féle commit ellenőrzés (`3dff903`) | Tegnapi munka mentve gitbe | ✅ |
| **Sticky submit + cancel gomb** a PinForm alján | Desktop-on a forma túl magas volt, nem lehetett submitolni | ✅ `app/globals.css` |
| **Sticky close (×) gomb** scroll közben is látható | UX | ✅ `app/globals.css` |
| `.pin-form` belső scroll + arany scrollbar | Forma magasság > viewport esetén is használható | ✅ `app/globals.css` |
| **Dátum bug fix:** `<input type="month">` → Postgres DATE | `2020-01` formátumot Postgres elutasította (`code 22007`); mostantól backend `2020-01-01`-é alakítja | ✅ `app/api/pins/route.ts` |
| Pin létrehozás teszt → 200 OK | Teljes flow lement (Budapest pin, „bela" nicknév) | ✅ |
| Commit `4336dda` (mentes2.bat) | Mai UX + dátum fix mentve | ✅ |
| `git push origin main` | Mindkét commit (Aaron + UX fix) felment GitHub-ra → Vercel auto-deploy | ✅ |
| Aaron Vercel link: `https://merre-vagy-vandor.vercel.app` | Áron meg tudja nézni mostantól | ✅ |

---

## 0b. Április 25. este — STRATÉGIAI PIVOT JAVASLATA (DOKUMENTÁLVA, NEM IMPLEMENTÁLVA)

### Mi történt
Lead-gen szakértői visszajelzés érkezett a jelenlegi formára:
1. **Túl hosszú** — 30-50%-os várt drop-off
2. **Nem sponzor-ready** — szabad szöveges végzettség / foglalkozás nem szegmentálható, hiányoznak az utazási / pénzügyi viselkedési kérdések amik egy WizzAir vagy Wise brief-jét kielégítenék

A szakértő **megerősítette** Aaron eredeti sponzor-instinktusát (WizzAir, donations), csak rámutatott hogy **a jelenlegi formával nem fogjuk tudni eladni** a sponzor-szándékot.

### A javasolt új architektúra: 2-lépcsős űrlap

**Form 1 — „Tedd fel a pin-ed" (gyors, ~30 mp):**
- Pin típus (3 gomb)
- Város (auto)
- Email *
- Nicknév (opcionális, ez látszik a térképen)
- GDPR checkbox *
- Marketing checkbox (opcionális, közösségi)

**Cél: max konverzió a pin-felrakásra. 3 mező, 2 checkbox.**

**Form 2 — „Segíts hogy fent maradjon" (a sikeres pin UTÁN, opcionális, ~60-80 mp):**

A success modálon belépő képernyő:
> ✓ A pinned felkerült! Te lettél a 1.247-edik vándor 🎯
>
> A projekt fenntartásához sponzori partnerségekre lesz szükség...
>
> [Folytatom →] *Inkább most kihagyom*

**9 kérdés, mind dropdown / radio (kivéve egy szabad szöveg), 4 szekcióban:**

**1/4 — Gyökerek**
1. Erdélyi szülőhely (szabad szöveg, opcionális)
2. Megye dropdown (Hargita, Maros, Kovászna, Kolozs, Szatmár, Bihar, Brassó, Beszterce, Fehér, Szeben, Szilágy, Máramaros, Krassó-Szörény, *Nem Erdély*)
3. Maradt családod kint? (Igen közeli / Igen távolabbi / Nem)

**2/4 — Hazautazás**
4. Hányszor jutsz haza évente? (Még nem / 1-2x / 3-5x / 6+x)
5. Mivel utazol? (Repülő / Autó / Busz / Vonat / Vegyes)

**3/4 — Pénz és tervek**
6. Küldesz haza pénzt? (Rendszeresen / Alkalmanként / Nem)
7. Tervezel hazaköltözést? (1-2 éven belül / valamikor / Nem / Még nem tudom)

**4/4 — Te**
8. Életkor-tartomány (18-25 / 26-35 / 36-45 / 46-55 / 56+)
9. Foglalkozási terület (8 kategória dropdown)
10. Honnan ismerted meg a projektet? (FB / barát / sajtó / Áron / egyéb) — *marketing-attribúció, nem sponzornak*

**Záró:** külön opt-in checkbox a sponzori ajánlatokra („Igen, érdekelnek az erdélyieknek szóló partnerajánlatok. Évente max 4-5 email.")

Minden kérdésnél „inkább nem mondom" opció.

### Sponzor-mátrix — melyik kérdés melyik sponzort szolgálja

| Sponzor típus | Releváns kérdések |
|---|---|
| **Repülőtársaságok** (WizzAir, Tarom) | Megye + család kint + hány utazás + repülő mód |
| **Busz/vonat** (Volánbusz, Flixbus) | Megye + utazási mód = busz/vonat + gyakoriság |
| **Fintech** (Wise, Revolut) | Pénzküldés + életkor + foglalkozás |
| **Költöztető / ingatlan** | Hazaköltözés + életkor + foglalkozás |
| **Biztosítás** | Életkor + utazási gyakoriság + család kint |
| **Recruiting / állás** | Foglalkozási terület + életkor + költözési hajlam |

### Adatbázis architektúra változás

**Két Supabase tábla** (jelenleg csak egy van, `pins`):

```
pins (publikus, sovány)
└── id, nickname, email, city, country,
    lat/lng, lat_rounded/lng_rounded, pin_type,
    consent_marketing, expires_at, removal_token_hash, status

pin_profiles (sponzor-lead, lezárva — ÚJ)
└── pin_id (FK → pins.id, kaszkád törlés)
    + a 9 fenti kérdés válasza
    + consent_sponsor_offers BOOLEAN (külön opt-in)
    + acquisition_source TEXT
    + created_at, updated_at
```

**RLS:** a `pin_profiles` táblát teljesen elzárjuk a publikus API-tól (csak `service_role` éri el).

### Miért jobb (5 pont)

1. **Magasabb konverzió a pin-felrakásra** — kevesebb mező → több pin → nagyobb sajtó/FB-sztori
2. **Sponzor-ready strukturált adat** — minden kérdés egy konkrét sponzor-funkciónak felel meg
3. **Pszichológiai pillanat** — a sikeres pin után a felhasználó dopamin-állapotban van, akkor a legkönnyebb még 1 percet kérni
4. **GDPR-tisztább** — sponzor-érzékeny adat strukturálisan elválasztva
5. **Részleges válasz is mentődik** — aki 3 kérdésre felel és bezárja, attól is értékes adat marad

### Mit nem kérdezünk (szándékosan)

- ❌ Pontos jövedelem (drop-off magnet)
- ❌ Egy átlagos hazautazás költségvetése (túl direkt)
- ❌ Családi állapot, gyerekek (invaziv, sponzor-marginal)
- ❌ Konkrét születési év (tartomány elég)
- ❌ Pontos foglalkozás (kategória elég)
- ❌ Külföldi képzettség honosítva (túl specifikus)

### Email Aaronnak

`email_aaronnak_2.md` fájlban — a teljes javaslat + 6 konkrét döntési kérdés:

1. Egyetértesz az architektúrával?
2. A 9 kérdés rendben?
3. Megye dropdown 13 megye OK, vagy egyszerűbb (Székelyföld / Partium / stb.)?
4. „Maradt családod kint" — túl személyes?
5. Sponzor prioritás — Tier 1?
6. Időzítés — most átépítsük, vagy később?

### A javasolt időzítés

**Mostanra építsük át** (még a launch előtt):
- Sponzor-prezentációhoz mindenképp ez a struktúra kell
- Az 1,08M-os FB launch egy lövés, az első élmény fontos
- Migráció pár óra, **nem hét**

**Várnunk akkor érdemes** ha Aaron csak közösségi térképet akar most. Akkor marad a jelenlegi forma, és Form 2.0 a 2. iteráció.

### Decision pending

⏸ Aaron visszajelzésére várunk — utána tudjuk eldönteni hogy implementáljuk-e Form 2.0-t a launch ELŐTT vagy UTÁN.

---

## 1. Mi történt eddig

### 1.1 Alaprendszer (kész, működik)
- Next.js 16 + TypeScript + React 19 alap
- Supabase Postgres (eu-west-1 Dublin, EU-n belül)
- Mapbox térkép globe projekcióval
- Vercel hosting
- Domain: vandor.hu (Rackhost)
- Row Level Security (RLS) a pins táblán
- 11 km-es koordináta kerekítés privátságra
- Törlési token hash-elve tárolva
- Reverse geocoding (város/ország automatikusan)

### 1.2 Jogi keret (alap kész, finomhangolás Szabival)
- Saját /adatvedelem oldal (GDPR + UK GDPR összhangban)
- Saját /rolunk oldal (kik vagyunk, mit csinálunk, miért)
- Cookie-mentes (csak Mapbox technikai)
- SCC-alapú adatfeldolgozói viszonyok dokumentálva
- Szabi (jogász, a „Kattiés" szöveg írója) fogja finomhangolni

### 1.3 Aaron javaslatai — ÁTALAKÍTÁSOK BEÉPÍTVE (2026-04-24)

| Aaron javaslata | Státusz | Fájl |
|---|---|---|
| Külön /rolunk oldal bővebb leírással | ✅ Kész | `app/rolunk/page.tsx` |
| Footer: „Kobori AI" → „Erdélyi Vándor Baráti Társaság (alapítás alatt)" | ✅ Kész | minden oldal footer |
| Pin típus gombok leírás eltávolítása | ✅ Kész | `components/pin/PinForm.tsx` |
| Űrlap bővítés: nicknév, szül.év, végzettség, foglalkozás, honnan jön, mikor ment/jár/tervez | ✅ Kész | `PinForm.tsx` + Supabase migráció |
| Nicknév legyen ami a térképen látszik (valódi név privát) | ✅ Kész | `api/pins/route.ts` + `MapComponent.tsx` |
| 30 napos automatikus törlés kivétele | ✅ Kész | `constants.ts`, retenció = visszavonásig |
| Külön marketing consent (email-hírlevél-szponzor) | ✅ Kész | `PinForm.tsx` két külön checkbox |
| Donably (donations) | ⏳ Egyesület bejegyzés után |
| WizzAir-szerű szponzor email | ⏳ Tervben, külön opt-in után |

---

## 2. Jelenlegi architektúra

### 2.1 Adatmodell (pins tábla)
```
Kötelező / nyilvános:
- email, city, country, lat_rounded, lng_rounded, pin_type

Opcionális nyilvános (térkép popup):
- nickname (ez a „név" publikusan)
- origin_city, origin_country

Opcionális nem-nyilvános (csak statisztika):
- name (valódi név, csak belső)
- relevant_date, birth_year, education, occupation

Technikai:
- lat, lng (pontos, nem publikus)
- removal_token_hash
- expires_at (10 év biztonsági háló, nem törlési szabály)
- consent_marketing (külön flag)
- status (active / hidden / deleted)
```

### 2.2 Publikus API vs. privát adat
- GET `/api/pins` csak: nickname (vagy „Vándor"), város, ország, kerekített koordináta, pin típus, származási hely
- Teljes név, email, születési év, végzettség, foglalkozás, pontos koordináta **sosem** megy publikus végpontra

---

## 3. Mi hiányzik még éles indulásig

### 3.1 Rajtunk múlik (HOLNAPI MUNKA)

**Először: `mentes2.bat` futtatása** — a mai UX + dátum fix-et commit-olja gitbe.

Aztán végigmegyünk:
- [ ] **Mobil nézet végigtesztelés** (F12 → Ctrl+Shift+M → iPhone 14 Pro)
  - Új 3-szekciós űrlap olvasható-e
  - Sticky submit gomb mobilon is működik-e
  - Térkép popup nicknév + honnan sor
- [ ] **Másik 2 pin típus tesztelése** (Kijár, Készül) → datum mező címke változik-e
- [ ] **Több teszt-pin** ugyanabban a városban → cluster (sárga/narancs/piros) megjelenése
- [ ] **`/rolunk` átolvasás** — szövegezés rendben?
- [ ] **`/adatvedelem` átolvasás** — szövegezés rendben? (utána Szabi végső átnézésre megy)
- [ ] **Email confirmation / removal token email** működik-e (lib/email/) — vagy egyelőre csak a tokenes URL látszik a sikeres modálon?
- [ ] **Aaron email piszkozat** átnézés (Gmail Drafts) → ha jó, küldés
- [ ] **`mentes2.bat` újra** — végső commit ellenőrzések után

### 3.2 Külső függés (NEM RAJTUNK MÚLIK)
- [ ] **Egyesület bejegyzés** (Erdélyi Vándor Baráti Társaság) — bírósági bejegyzés folyamatban
- [ ] Bejegyzés után: adatkezelő személyének hivatalos váltása a GDPR oldalon (szöveg már erre van felkészítve)
- [ ] Szabi jogi véleménye és átírása ha szükséges
- [ ] **Csak ezután:** `git push` → Vercel automatikus deploy → vandor.hu élesítés

### 3.3 Későbbi fázisokra
- [ ] Donably integráció (donations) — egyesület bejegyzés után
- [ ] Szponzor email capability (külön opt-in alapon — már elő van készítve a `consent_marketing` flag)
- [ ] Email értesítő bejegyzés után a felhasználóknak (ha lesz már valaki)

---

## 4. Alapítók és szerepek

- **Kobori Béla MSc** (London) — alapító, technikai fejlesztés, jogi keret
- **Balázs Áron** (Erdély) — alapító, Chillygence Founder/Consultant, stratégia és közösségi kapcsolat
- **Szabi** — jogász, GDPR szövegezés finomhangolása
- **Erdélyi Vándor Baráti Társaság** (alapítás alatt) — a projekt leendő jogi üzemeltetője

---

## 5. Kritikus fájlok (hol van mi)

```
app/
  adatvedelem/page.tsx    — GDPR tájékoztató (Aaron utáni verzió)
  rolunk/page.tsx         — Rólunk oldal (új)
  landing/page.tsx        — Főoldal / belépő
  page.tsx                — Térkép
  api/pins/route.ts       — API (új mezőkkel)

components/
  pin/PinForm.tsx         — Űrlap (3 szekció, 2 consent)
  pin/CityAutocomplete.tsx
  pin/PinSuccess.tsx
  map/MapComponent.tsx    — Térkép + popup (nicknév + honnan)
  overlays/AboutOverlay.tsx

lib/
  constants.ts            — PIN_EXPIRY_DAYS = 3650, OPERATOR_NAME
  supabase/client.ts

types/index.ts            — Pin, PinInput, PinGeoJSON új mezőkkel

app/globals.css           — Új: .pin-form-section, .field-row, stb.

valasz_aaronnak.md        — Válaszlevél Aaronnak
```

---

## 6. Supabase migráció (már lefutott)

```sql
-- Migration: pins_add_extended_profile_fields
ALTER TABLE public.pins
  ADD COLUMN IF NOT EXISTS nickname TEXT,
  ADD COLUMN IF NOT EXISTS birth_year INTEGER,
  ADD COLUMN IF NOT EXISTS education TEXT,
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  ADD COLUMN IF NOT EXISTS origin_city TEXT,
  ADD COLUMN IF NOT EXISTS origin_country TEXT DEFAULT 'Románia',
  ADD COLUMN IF NOT EXISTS relevant_date DATE,
  ADD COLUMN IF NOT EXISTS consent_marketing BOOLEAN DEFAULT FALSE;
```

---

_Ez a dokumentum a projekt jelenlegi állapotának pillanatképe. Ha új változás történik, ide kell frissíteni._
