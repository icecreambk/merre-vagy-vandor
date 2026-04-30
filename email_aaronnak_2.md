# Email Aaronnak — Űrlap újragondolás (lead-gen szempont)

**Címzett:** aaron@chillygence.ro
**Tárgy:** Merre vagy, vándor? — űrlap újragondolás (lead-gen + sponzor szempont)

---

Szia Áron,

Egy gyors, fontos update — szeretném ha velem tartanál egy gondolatkísérletben, mielőtt a következő körben módosítok bármit.

## Mi történt

A változtatások amiket a tegnapi visszajelzéseid alapján beépítettem (3-szekciós űrlap, nicknév, születési év, végzettség, foglalkozás stb.) **fent vannak a Vercel linken**, megnézheted: `https://merre-vagy-vandor.vercel.app`

Aztán **megmutattam egy lead-gen szakértő ismerősömnek**, aki két dolgot mondott:

1. **Az űrlap túl hosszú** — ahogy van most, várhatóan 30-50%-os drop-off lesz a kitöltésnél
2. **Az adat amit gyűjtünk nem optimális egy sponzor briefingnek** — a végzettség és foglalkozás szabad szövegként nem szegmentálható, a kor pontos évvel privát-szempontból érzékeny, és hiányoznak azok a kérdések, amik **közvetlenül megfelelnek annak amit te is felvetettél** (WizzAir-típus, hazautazási gyakoriság, hazaküldött pénz)

Tehát a szakértő **megerősítette a te eredeti sponzor-instinktusod**, csak rámutatott, hogy a jelenlegi formával **nem fogjuk tudni eladni** a sponzor-szándékot.

## Mit javaslok ehelyett

**Két lépcsős űrlap-architektúra**, ami egyszerre szolgál mindkét célt:

### Form 1 — „Tedd fel a pin-ed" (gyors, 30 mp)

**Csak a feltétlenül szükséges:**
- Pin típus (Kint élek / Kijárok / Készülök) — már megvan
- Város (auto kitöltés)
- Email
- Nicknév (opcionális, ez látszik a térképen)
- GDPR checkbox

**3 input mező, 1 checkbox. Ennyi.** Cél: maximális konverzió a pin-felrakásra.

### Form 2 — „Segíts hogy fent maradjon" (sikeres pin után, opcionális)

A sikeres pin **után** ugrik fel egy második képernyő:

> ✓ A pinned felkerült! Te lettél a 1.247-edik vándor 🎯
>
> A projekt fenntartásához sponzori partnerségekre lesz szükség. Ha most válaszolsz pár gyors kérdésre, megmutathatjuk a leendő partnereknek, ki a közösség — így olyan ajánlatokat hozhatunk neked, amik tényleg az erdélyieknek szólnak.
>
> [Folytatom →] *Inkább most kihagyom*

Aki rákattint, kap **9 kérdést, mind dropdown / radio**, **60-80 mp** alatt:

**1/4 — Gyökerek**
- Erdélyi szülőhely (szabad szöveg, opcionális)
- Megye (Hargita, Maros, Kovászna, Kolozs, Szatmár, Bihar, Brassó, Beszterce, Fehér, Szeben, Szilágy, Máramaros, Krassó-Szörény, *Nem Erdély*)
- Maradt családod kint? (Igen közeli / Igen távolabbi / Nem)

**2/4 — Hazautazás**
- Hányszor jutsz haza évente? (Még nem / 1-2x / 3-5x / 6+x)
- Mivel utazol? (Repülő / Autó / Busz / Vonat / Vegyes)

**3/4 — Pénz és tervek**
- Küldesz haza pénzt? (Rendszeresen / Alkalmanként / Nem)
- Tervezel hazaköltözést? (Igen 1-2 éven belül / Igen valamikor / Nem / Még nem tudom)

**4/4 — Te**
- Életkor-tartomány (18-25 / 26-35 / 36-45 / 46-55 / 56+)
- Foglalkozási terület (8 kategória dropdown — IT, egészségügy, oktatás, kereskedelem-vendéglátás, pénzügy, építőipar, diák, egyéb)
- Honnan ismerted meg a projektet? (FB / barát / sajtó / Áron / egyéb) — *ez nekünk, virális elemzéshez*

**Záró:** külön opt-in checkbox a sponzori ajánlatokra („Igen, érdekelnek a kifejezetten az erdélyieknek szóló partnerajánlatok — utazás, pénzküldés, biztosítás. Évente max 4-5 email, bármikor visszavonható.")

Minden kérdésnél van **„inkább nem mondom"** opció — sehol nem érzi ostromnak.

## Miért jobb ez

1. **Magasabb konverzió a pin-felrakásra** — kevesebb mező = kevesebb drop-off = több pin a térképen = nagyobb sztori a sajtónak és FB-nak
2. **Sponzor-ready adat strukturáltan** — minden kérdés egy konkrét sponzor-funkciónak felel meg:
   - WizzAir / Tarom → „megye + család + utazási gyakoriság + repülő mód"
   - Volánbusz / Flixbus → „megye + busz/vonat + gyakoriság"
   - Wise / Revolut → „pénzküldés + életkor + foglalkozás"
   - Költöztető / ingatlan → „hazaköltözés + életkor"
   - Biztosítás → „életkor + utazási gyakoriság"
3. **Pszichológiai pillanat** — a sikeres pin **után** a felhasználó dopamin-állapotban van („feltettem magam!"). Ekkor a legkönnyebb még 1 percet kérni
4. **GDPR-tisztább** — a sponzor-érzékeny adat **külön Supabase táblába** kerül (`pin_profiles`), külön RLS-szel és külön retencióval — strukturálisan elválasztva a publikus pin-adattól
5. **Részleges válasz is mentődik** — aki 3 kérdésre felel és bezárja, attól is értékes adat marad

## Architektúra változás technikailag

**Két Supabase tábla:**

```
pins (publikus, sovány)
└── id, nickname, email, city, country,
    lat/lng, lat_rounded/lng_rounded, pin_type,
    consent_marketing, expires_at, removal_token_hash, status

pin_profiles (sponzor-lead, lezárva)
└── pin_id (FK → pins.id)
    + a 9 fenti kérdés válasza
    + consent_sponsor_offers (külön opt-in)
    + acquisition_source
```

A `pin_profiles` táblát teljesen elzárjuk a publikus API-tól (csak `service_role` éri el), míg a `pins` továbbra is publikus a térképhez. **Auditor / Szabi erre azt fogja mondani: így kell csinálni.**

## Mit kérek tőled

1. **Egyetértesz az architektúrával?** A 2-lépcsős forma + külön sponzor-tábla — ez a stratégiai irány OK?
2. **A 9 kérdés** — van olyan ami szerinted maradjon ki? Vagy hiányzik valami amit egy konkrét sponzor brief biztos kérni fog?
3. **Megye dropdown** — a 13 történelmi erdélyi megye OK, vagy egyszerűsítsük (Székelyföld / Partium / Mezőség / Bánság / Egyéb)?
4. **„Maradt családod kint?"** kérdés — túl személyesnek érződik szerinted?
5. **Sponzor prioritás** — melyik a Tier 1, amit először megkeresnénk a bejegyzés után? Az alapján kicsit hangsúlyozhatjuk át a kérdéseket
6. **Időzítés** — most átépítsük (még a launch előtt), vagy az első verziót indítsuk el a jelenlegi formával és a 2-es változatot a 2. iterációra hagyjuk?

## A javaslatom időzítésre

**Mostanra építsük át**, mert:
- A jelenlegi forma nehéz pin-rakásra (Szabi átnézést se érdemes várni a régi formára)
- Az 1,08M-os FB launch egy lövés — az első élmény fontos
- Sponzor-prezentációhoz mindenképp ez a struktúra kell
- A migráció pár óra munka, **nem hét**

**Várnunk akkor érdemes** ha úgy érzed nincs sponzor-szándékod még, és csak közösségi térképet akarsz. Akkor maradhat a jelenlegi forma. De a te eredeti elképzelésed alapján (WizzAir, donations) a 2-lépcsős verzió a jövőbiztos.

Várom a véleményed. Holnap vagy hétfőn akármikor 15-20 perc beszélgetés is jöhet erről.

Üdv,
Béla

---
_PROGRESS.md: a teljes technikai státusz a repo-ban naprakészen — bármikor be tudod nézni._
