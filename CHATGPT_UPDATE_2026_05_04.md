# Update — 2026. május 4.

## Elvégzett munkák

### 1. Route struktúra átszervezés
- **`/` (főoldal)** — most a landing/marketing oldal (korábban `/landing` volt)
- **`/terkep`** — most a térkép alkalmazás (korábban `/` volt)
- **`/landing`** — redirect → `/` (visszafelé kompatibilitás)

### 2. Landing oldal javítások (`app/page.tsx`)
- CTA gomb: `href="/terkep"` (belső link, nem külső vercel.app URL)
- CTA szöveg: "Tüzd fel magad a térképre"
- "30 nap után törlődik" → **"Bármikor törölhető"** (helyes: expires_at = 10 év)
- Nav logo: `href="/"` (volt: `/landing`)
- Footer linkek: belső `/terkep` hivatkozások

### 3. Térkép oldal (`app/terkep/page.tsx`)
- Új fájl, az eredeti `app/page.tsx` tartalmával
- "Főoldal" visszalink hozzáadva a powered-by sávba

### 4. Deploy
- Commit: `186ca8e` — "feat: restructure routes - landing at /, map at /terkep"
- Vercel deploy: READY (`dpl_8RyzVAMJf4BhmzT7EfdNPQ1LGSFV`)
- Élő URL: merre-vagy-vandor-git-main-icecreambks-projects.vercel.app

---

## Supabase tábla állapot (ellenőrizve 2026-05-04)

| Tábla | Sorok | RLS | Állapot |
|-------|-------|-----|---------|
| `pins` | 6 | ✅ | Minden oszlop OK, expires_at default = 10 év |
| `pin_profiles` | 2 | ✅ | Form 2.0 összes oszlopa megvan, FK OK |
| `support_interest` | 0 | ✅ | Üres, Donably-hoz lesz |

---

## Aktuális route struktúra

```
/               → landing oldal (marketing)
/terkep         → térkép alkalmazás
/landing        → redirect → /
/rolunk         → Rólunk oldal
/adatvedelem    → GDPR tájékoztató
/api/pins       → Pin létrehozás + lekérdezés
/api/pins/[id]/profile → Form 2 mentés
/api/remove     → Pin törlés tokennel
```

---

## Következő feladatok

- [ ] Domain vásárlás: vandor.hu és/vagy merevagyvandor.hu
- [ ] DNS bekötés Vercelhez
- [ ] End-to-end teszt: pin felrakás → Form 2 → sorsolás checkbox
- [ ] Sorsolási szabályzat részletes verziója (egyesület bejegyzés után)
- [ ] Sponsor pitch deck
- [ ] Donably integráció (egyesület bejegyzés után)
