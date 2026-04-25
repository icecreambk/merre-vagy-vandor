# Email Aaronnak — Javaslatok beépítve

**Tárgy:** Merre vagy, vándor? — átalakítások a javaslataid alapján

---

Szia Áron,

Köszönjük szépen a részletes visszajelzést, nagyon értékeljük. Majdnem mindent beépítettem, amit írtál — az alábbi átalakításokat eszközöltük:

## 1. Oldal felépítés

- **Külön „Rólunk" oldal** készült (`/rolunk`) — bővebb leírással: miért csináljuk, mit csinál a térkép, mi a hosszú távú cél, kik vagyunk (téged is belevettelek mint alapító társat Erdélyből), és egy külön adatvédelmi-etikai blokk. A főoldalról, a térképről és az adatvédelmi oldalról is elérhető.
- **Footer mindenütt átírva**: a „Powered by Kobori AI Systems · London" kikerült, helyette **„Erdélyi Vándor Baráti Társaság (alapítás alatt)"** szerepel. Az egyesület bejegyzése folyamatban van — amíg ez nincs meg, **nem engedjük ki élesbe** az oldalt. A bejegyzés után a jogi adatkezelő személye automatikusan átszáll az egyesületre (erre az adatvédelmi szöveg már fel van készítve).
- **Pin típus gombok** alól kikerült a leírás (ahogy javasoltad, az a bővebb infó a Rólunk oldalra költözött).

## 2. Űrlap bővítés

A jelölő űrlapot teljesen átalakítottam három szekciós szerkezetre:

### „Hol vagy most?"
- Város + ország (változatlan, automatikus kitöltéssel)

### „Honnan jössz?"
- Származási város (opcionális)
- Ország (alapból Románia, módosítható)
- **Dinamikus dátum mező** — a jelölő típusától függően változik a címke:
  - „Kint élek" → *Mikor mentél ki?*
  - „Kijárok" → *Mióta jársz ki?*
  - „Készülök" → *Mikor tervezel kimenni?*

### „Rólad"
- **Nicknév** (ez jelenik meg a térképen) — figyelmeztetéssel, hogy ne a teljes valódi nevét írja ide senki
- Teljes név (opcionális, a térképen **sosem** látszik)
- Email cím (kötelező)
- Születési év (opcionális)
- Végzettség (opcionális, szabadszöveges)
- Foglalkozás (opcionális, szabadszöveges)

Fontos döntés amit meghoztunk: a **valódi név sosem megy ki publikus API-ra**, csak a nicknév. Aki nem ad meg nicknevet, annál „Vándor" jelenik meg a térképen. A születési év, végzettség, foglalkozás kizárólag aggregált közösségi statisztikához kerül felhasználásra — egyéni azonosítás nincs, publikusan ezek sosem látszanak.

## 3. Finanszírozás

- **30 napos automatikus törlés kivéve**. Az adat a hozzájárulás visszavonásáig marad, ahogy javasoltad. Ez logikus: ha valaki odateszi a jelölőjét, az ott is marad, amíg ő másként nem rendelkezik. Van egy technikai 10 éves lejárat az adatbázisban, de ez csak biztonsági háló, nem törlési szabály.
- **Donably integrációt** akkor tudjuk beemelni, ha az egyesület hivatalosan bejegyzett (addig nincs jogalap donatiokat fogadni).
- **Szponzor email funkció** (WizzAir-típus): technikailag előkészítettük, de ehhez **külön, opcionális marketing checkbox** került az űrlapra. Az alap (kötelező) adatvédelmi hozzájárulás önmagában nem jogosít fel minket szponzor-megkeresések küldésére — erre külön, második pipát kell tenni. Így tiszta a GDPR compliance. Amikor elindul, az email soha nem megy át a szponzornak, a megkeresést mi magunk küldjük ki.

## 4. Jogi

- **Adatvédelmi tájékoztató teljesen átdolgozva** az új mezőkkel, új retenciós szabállyal és az egyesület-alapú üzemeltetési struktúrával. Az 1. pontban a bejegyzés alatti állapot külön ki van mondva, tehát jogilag tiszta a felelősségi lánc a bejegyzésig és utána is.
- **Szabit várjuk** a végső GDPR-szövegre (a „Kattiés" mintájára). A mostani verzió szerintem jó kiindulás — ha Szabi hozzányúl, az lesz a végleges.
- **Supabase EU régió** (Dublin) igazolva — semmi nem megy ki EU-n kívülre az adatbázis oldalon. A Resend, Vercel, Mapbox US-alapú, de SCC-alapon legálisan.

## Mit kérünk tőled

1. **Nézd meg amit csináltunk** — ha van egy domain/preview URL szükséged, szólj és csinálok staging deployt (nem éles, csak néző)
2. **Bejegyzés státusz** — hol tart most a bejegyzés, mire van szükséged tőlünk (alapító okirat, alapszabály tervezet, stb. — ha segíthetek, szólj)
3. **Szabi** — ha van kapcsolatod, kiküldenéd neki az adatvédelmi tájékoztatót átnézésre? (adatvedelem URL, amint staging fent van)

Élesítés menete (ahogy javasoltad):
1. Egyesület bírósági bejegyzése
2. Szabi átnézés
3. Utolsó UI ellenőrzés (te + én)
4. Indítás — közösen, közös kommunikációval a 1,08M-os FB csoportba

Várom a visszajelzésed, és köszönjük még egyszer hogy belepörögtél ilyen alapossággal. Ez tényleg jobb lett tőled.

Üdv,
Béla

---
_Csatolva: PROGRESS.md (technikai állapot snapshot)_
