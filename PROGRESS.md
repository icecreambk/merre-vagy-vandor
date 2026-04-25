# Merre vagy, vándor? — Folyamat mentés

**Utolsó frissítés:** 2026. április 24.
**Státusz:** Aaron-féle változtatások beépítve, egyesület bejegyzésére vár → utána élesítés

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

### 3.1 Rajtunk múlik
- [ ] Lokális `npm run build` ellenőrzés (TypeScript + lint)
- [ ] Mobil nézet végigtesztelése az új űrlappal
- [ ] `valasz_aaronnak.md` → elküldeni Aronnak
- [ ] Szabi végső GDPR ellenőrzés

### 3.2 Külső függés
- [ ] **Egyesület bejegyzés** (Erdélyi Vándor Baráti Társaság) — bírósági bejegyzés folyamatban
- [ ] Bejegyzés után: adatkezelő személyének hivatalos váltása a GDPR oldalon (szöveg már erre van felkészítve)
- [ ] Szabi jogi véleménye és átírása ha szükséges

### 3.3 Későbbi fázisokra
- [ ] Donably integráció (donations)
- [ ] Szponzor email capability (külön opt-in alapon)
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
