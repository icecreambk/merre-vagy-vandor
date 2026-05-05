# Update — 2026. május 5.

## Elvégzett munkák

### 1. Nav logo eltávolítva a landing oldalról
- A "Merre vagy, vándor?" felirat törlve a nav-ból (landing oldal)
- Nav linkek (`Rólunk · Kapcsolat · Adatvédelem`) középre igazítva
- `/rolunk` és `/adatvedelem` nav logójának `href="/landing"` → `href="/"` javítva

### 2. Mobile scroll fix
- `overflow-x: hidden` + `overflow-y: auto` a body-n → iOS Safari mobilon scrollozható aloldalak

### 3. Map legend pozíció fix
- Mobilon a legend `top: 70px`-ről `top: 112px`-re tolva → nem fed rá a TitleOverlay-re

### 4. Eyebrow badge kisebb
- Landing hero badge: font 12px → 10px, padding csökkentve

### 5. Feedback rendszer (új feature)
- **Supabase tábla:** `feedback` (opinion, device, improvement, source, created_at, RLS)
- **API route:** `POST /api/feedback` — Supabase insert + Resend email értesítő
- **FeedbackButton komponens:** jobb alsó sarok, lebegő gomb, 3 kérdéses modal
- **Hozzáadva:** landing (`/`) és térkép (`/terkep`) oldalakhoz
- **Email értesítő:** `merevagyvandor@gmail.com` kap emailt minden visszajelzésnél
- **Küldő:** `onboarding@resend.dev` (ideiglenes, domain bekötés után cseréljük)
- **Build fix:** Supabase/Resend inicializálás handler-en belülre mozgatva (build-time env var hiba javítva)

### 6. iOS safe area fix
- Feedback gomb: `bottom: calc(24px + env(safe-area-inset-bottom, 0px))` — nem vágja le az iPhone nav bar

---

## Aktuális deploy állapot

| Commit | Üzenet | Állapot |
|--------|--------|---------|
| `26dd741` | fix: smaller eyebrow badge | ❌ ERROR (build) |
| `88170d3` | fix: feedback email | ❌ ERROR (build) |
| `aadd638` | feat: feedback email via Resend | ❌ ERROR (build) |
| `b08b9bd` | feat: feedback button + API | ❌ ERROR (build) |
| `a8329fd` | fix: remove nav logo | ✅ READY (utolsó élő) |

**Build hiba oka:** Supabase client modul szinten inicializálva → build-time `supabaseKey is required` hiba  
**Fix:** `createClient` és `new Resend()` a POST handler-en belülre mozgatva → commit folyamatban

---

## Feedback visszajelzések megtekintése
- Supabase dashboard → Table Editor → `feedback` tábla
- URL: supabase.com/dashboard/project/heqeeafuokjdwbqaxzju/editor

---

## Következő teendők
- [ ] Build ellenőrzés a legújabb commit után (Béla futtatja)
- [ ] Domain vásárlás: vandor.hu / merevagyvandor.hu
- [ ] DNS bekötés Vercelhez
- [ ] Első 50-100 pin manuális seedelés (ismerősök, Áron kapcsolatai)
- [ ] Áron visszajelzése a preview URL-ről
- [ ] Domain megléte után: `from` email → `vandor@merevagyvandor.hu`
