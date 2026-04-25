# Válasz Aaronnak — státusz + javaslatok értékelése

Szia Aaron!

Köszi a részletes észrevételeket — sokat gondolkodtam rajtuk, és nagyon fasza, hogy ilyen mélységben nézed az egészet. Mielőtt bármit elkezdenénk módosítani, leírom, **mi van most készen**, és **mit jelentene technikailag + jogilag**, ha belevágnánk a javaslataidba. Szeretném, hogy ez alapján közösen döntsünk, mert pár pont komolyabb következménnyel jár, mint elsőre látszik.

---

## 1. Mi van jelenleg készen

**Technikai állapot:**
- Domain: `vandor.hu` — transzfer folyamatban Rackhosthoz (12–48 óra múlva él)
- Stack: Next.js 16 + Supabase (EU — Dublin) + Mapbox + Vercel, minden EU/GDPR-kompatibilis régióban
- Működő webapp: világtérkép, 3 pin típus (🚩 kint él / 🟡 kijár / 🟢 készül), város autocomplete, statisztika-panel, Leaderboard, FB-csoport link
- Landing oldal: hero + stats + „Rólunk" szekció + kapcsolat
- Űrlap mezők: város, ország, név (nem kötelező), email, pin típus + GDPR beleegyezés checkbox
- Adatvédelem: 30 napos automatikus törlés, 11 km-es koordináta-kerekítés (a pontos helyet nem mutatjuk), hashelt eltávolítási token

**GDPR — IGEN, már megvan**, most írtam:
- Önálló `/adatvedelem` oldal, 13 szakasszal, magyarul, EU + UK GDPR-re hangolva
- Adatkezelő: Kobori Béla MSc (UK sole trader), kapcsolat: `merevagyvandor@gmail.com`
- Feldolgozók listája (Supabase / Vercel / Resend / Mapbox / Rackhost), SCC hivatkozásokkal
- Érintett jogai (hozzáférés, törlés, stb.), panasz hatóságok (NAIH + ICO)
- A feliratkozási űrlapon kötelező checkbox + kattintható link az Adatvédelmi tájékoztatóra
- Ezt Szabi még átnézheti és finomíthatja — **alap megvan**, de módosítás szükséges, ha a javaslataid közül bármit is megvalósítunk (lásd lent)

**Amit MOST kell/lehet élesíteni**: a domain transzfer lefutása után egyetlen deploy kérdése az egész.

---

## 2. Mit jelentene az egyes javaslataid megvalósítása

### 2.1 „Powered by Kobori AI Systems" → „Erdélyi Vándor Baráti Társaság"

**Megbeszéltük — az egyesületet most jegyezzük be**, és **addig nem indítjuk élesben a projektet**. Ez tiszta helyzet, így az egész platform az egyesület nevén indul — jogi adatkezelő, bankszámla, szerződések Supabase/Vercel/Rackhost/Mapbox felé, minden.

Amíg az egyesület bejegyzése fut (kb. 2–6 hét Romániában), a webappon már szerepelhet hogy „A projekt üzemeltetője az Erdélyi Vándor Baráti Társaság (alapítás alatt)" — átírtam a láblécet. Az adatvédelmi tájékoztatóban ezt egyértelműsítjük.

### 2.2 Külön „Rólunk" oldal + tartalombővítés + mostani sarokban lévő infó kiemelése

**Ez egyszerű**, bármikor megcsinálható. Javaslom:
- Új `/rolunk` oldal, részletes projektleírással
- Landing + térkép oldalról látványosabb link rá
- A pin típusok rövid leírását innen el is vihetjük (ahogy javasoltad, 2.3-ban)

Erre nincs jogi akadály.

### 2.3 Pin típusok alatti rövid leírások elvétele

**OK, egyszerű változtatás**. Feltéve hogy a Rólunk oldalon jól elmagyarázzuk — különben a felhasználó nem érti mit jelent a 3 szín.

### 2.4 Bővített űrlap mezők (szül.év, végzettség, foglalkozás, kiindulási város, kimenetel időpontja, nicknév stb.)

**Ez a javaslat-csomag legnagyobb horderejű pontja.** Néhány dolgot végig kell gondolnunk:

**a) Adatvédelem szempontjából:**
- Jelenleg „alacsony kockázatú" adatkezelést csinálunk (email + város + ország). A javasolt mezők együtt — **szül.év + végzettség + foglalkozás + kiindulási város + cél város + időpont** — már **profilnak minősülnek**. Egy kisvárosban ez elég egy konkrét személy azonosítására név nélkül is.
- Ez már **magasabb kockázati kategória** → kötelező **Data Protection Impact Assessment (DPIA)** készítése a GDPR 35. cikk alapján. Szabi ezt is tudja.
- A mostani adatvédelmi tájékoztatót **újra kell írni**, mert más adatokat fog tartalmazni.
- **Cél tisztázása kötelező**: mi a jogalap ezeknek a mezőknek a gyűjtésére? Csak „közösségi cél"? Vagy szponzoroknak szűrhető adatbázis? Ez **más GDPR jogalap**.

**b) UX szempontjából:**
- Most 4 mező van → könnyű kitölteni, magas konverzió.
- 8–10 mezővel a feliratkozási arány **tapasztalatok szerint 40–60%-kal esik**. Mérhető jelenség.
- **Javaslom**: **progresszív profilírozás** — alap feliratkozás marad rövid (kulcs-adatokkal), a többi mezőt az email visszaigazolásban vagy egy „egészítsd ki a profilodat" oldalon kérünk opcionálisan. Így nem veszítünk feliratkozókat, de mégis kiépül az adatbázis.

**c) Nicknév a térképen** → jó ötlet önmagában. De figyelj: szabad szöveg mezőbe bárki beírhatja a teljes nevét, és az publikusan jelenik meg → PII a térképen. **Figyelmeztető szöveg + legalább alapszintű validáció kell** („ne írd be a teljes nevedet").

### 2.5 30 napos törlés megszüntetése

**Ez problémás a mostani feliratkozóknál**, mert **konkrétan 30 napot ígértünk nekik**. Ha ezt utólag megváltoztatjuk:
- A már feliratkozottaknak **új beleegyezést kell kérni** (GDPR Art 7)
- Hosszabb megőrzéshez **dokumentált jogos érdek** vagy **konkrét új beleegyezés** szükséges

**Javaslat**: **most** írjuk át a tájékoztatót, **mielőtt az első feliratkozó jön**, pl. így: „adataidat addig tároljuk, amíg hozzájárulásodat vissza nem vonod — bármikor törölheted". Ez jogilag rendben, és nem kell visszamenőleg újra beleegyezést szedni.

### 2.6 Donably támogatási oldal

**Jó ötlet**, de működéséhez kell:
- Bejegyzett jogi személy (UK sole trader már működne — az én nevemre, de adóköteles bevétel lesz; egyesület sokkal jobb — civil szervezeti kedvezmények)
- Bankszámla az entitás nevére
- Könyvelés-adózás megoldása (kinek a számláján landol, ki számol el vele)

**Javaslom**: mindezt kösd az egyesületi bejegyzéshez — **előbb legyen legális cég/egyesület**, aztán jöhet a Donably. Külön a sole trader nevén csinálni átmeneti megoldás, de adózási szempontból nem optimális.

### 2.7 WizzAir-típusú szponzor + email hírlevél

**Figyelem — ez a legnagyobb kockázat a listádon.** A felhasználók látják most: *„Az email címedet soha nem adjuk el és reklámot nem küldünk"* (az űrlapon + Adatvédelmi tájékoztatóban).

Ha bármilyen szponzori/marketing emailt akarunk küldeni — nem eladni, csak küldeni —:
- **Külön, explicit opt-in checkbox** szükséges (nem lehet előre bepipálva) — GDPR Art 7, EU ePrivacy Directive, UK PECR
- **Visszamenőlegesen nem megy** → a korábban feliratkozottaknak **új hozzájárulást kell kérnünk** (lemorzsolódás kb. 30–50%)
- Minden kiküldött emailben **egy kattintásos leiratkozás** kötelező
- „Saját reklámunk" és „szponzor reklámja" **két különböző jogalap** — erről külön kell tájékoztatni

**Javaslat**: **most** rakjuk be egy külön, opcionális checkboxot az űrlapra (pl. „Szeretnék tájékoztatást / közösségi híreket kapni a projektről"), külön az alap GDPR consenttől. Így aki „igent" pipál, az később használható szponzori együttműködéshez. Aki nem pipál, azt békén hagyjuk, de térképen fent van.

### 2.8 Szabi GDPR tájékoztató

**Teljesen jó**. Én most megírtam egy alap verziót (`/adatvedelem` oldal), Szabi ezen tud dolgozni — javítani, egyszerűsíteni, Kattiéhoz hasonló formába hozni. UK-re is adaptálható lesz (lényegében ugyanaz, UK GDPR + Data Protection Act 2018, csak kontakt + pár szöveg változik).

**Mielőtt Szabi elkezdi**, el kell dönteni:
1. Csak **közösségi cél** marad, vagy **szponzor-képes adatbázis** is lesz? (2.7 pont)
2. Bővített mezők: **kötelező**, **opcionális**, vagy **semmi**? (2.4 pont)
3. Megőrzési idő: **30 nap**, **visszavonásig**, vagy **határozatlan**? (2.5 pont)
4. Adatkezelő ki lesz a launchkor: **Kobori Béla MSc** (addig) vagy várunk az egyesületre? (2.1 pont)

Ezek nélkül Szabi nem tud dolgozni — minden más a jogalapból folyik.

---

## 3. Prioritás — hogyan látom a lépéseket

Két lehetőség van:

**A) Gyors launch mostani minimál verzióval, bővítés utána**
- Előny: hamar élesedik a térkép, közösségi lendület, feliratkozások indulnak
- Hátrány: a mostani feliratkozóknak **később újra kell beleegyezést szedni** a bővítésekhez (szponzor email, új mezők visszamenőleg)

**B) Várunk a nagy verzióra, egyszerre megyünk élesbe**
- Előny: egy időben minden kész, nincs legal double-work, szponzor-ready adatbázis
- Hátrány: 1–2 hónap csúszás (egyesületi bejegyzés + DPIA + Szabi GDPR + új űrlap + progresszív profil), addig nincs forgalom

**Mivel megbeszéltük hogy az egyesület bejegyzésére várunk és addig nem indítunk élesben — tehát B) kivárunk, egyben launcholjuk.** Ez tiszta helyzet: mindenki az egyesület jogán iratkozik fel, nincs retroaktív beleegyezés-szedés, Donably azonnal indul, szponzorok felé is tiszta papír van.

**Addig** a mostani webappon már átvezetem Aaron javaslatait (új űrlap, bővített Rólunk, nicknév, egyesület mint üzemeltető), hogy látható legyen milyen lesz az élesben induló verzió. Teszt-üzemmódban futhat, de élesen csak akkor lövi be adatokat, ha Szabi GDPR tájékoztatója megvan és az egyesület bejegyzése megtörtént.

---

## 4. Amit kérek tőled

1. **Mikorra látod reálisnak az Erdélyi Vándor Baráti Társaság bejegyzését?** (Romániában 2–6 hét szokott lenni.)
2. **Szabi mikor tud a GDPR tájékoztatóra ráülni?** Hozzá tudom küldeni a mostani verziómat alapnak.
3. **Szponzor-irány**: tényleg akarjuk, vagy inkább tiszta közösségi projekt maradjon és donációból éljen? Ettől függ minden.
4. **A/B döntés** a fenti 3. pontból: gyors launch minimummal, vagy kivárás nagy verzióra?

Nagyon örülök, hogy ilyen mélyen beleállsz — csináljuk jól és hosszútávra. Várom a választ.

Üdv,
Béla
