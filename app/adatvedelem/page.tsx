import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adatvédelmi tájékoztató — Merre vagy, vándor?',
  description: 'A Merre vagy, vándor? közösségi térkép GDPR-megfelelő adatvédelmi tájékoztatója.',
  robots: { index: true, follow: true },
}

export default function AdatvedelemPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #e8c547;
          --gold-dim: rgba(232,197,71,0.7);
          --gold-faint: rgba(232,197,71,0.12);
          --bg: #060612;
          --border: rgba(232,197,71,0.18);
          --text: rgba(255,255,255,0.88);
          --text-dim: rgba(255,255,255,0.55);
        }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: Georgia, serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 75% 8%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 40% 55%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 85% 40%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 25% 75%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 85%, rgba(255,255,255,0.4) 0%, transparent 100%);
          pointer-events: none;
          z-index: 0;
        }
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: rgba(6,6,18,0.85);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
        }
        .nav-logo { font-size: 18px; color: var(--gold); text-decoration: none; }
        .nav-links { display: flex; gap: 24px; list-style: none; }
        .nav-links a { color: var(--text-dim); text-decoration: none; font-size: 14px; transition: color 0.2s; }
        .nav-links a:hover { color: var(--text); }

        .container {
          position: relative; z-index: 1;
          max-width: 820px;
          margin: 0 auto;
          padding: 110px 24px 80px;
        }
        .doc-eyebrow {
          font-size: 12px; color: var(--gold-dim);
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 16px;
        }
        h1 {
          font-size: clamp(30px, 6vw, 46px);
          color: var(--gold); line-height: 1.15;
          margin-bottom: 10px;
          text-shadow: 0 2px 30px rgba(232,197,71,0.18);
        }
        .doc-meta {
          font-size: 13px; color: var(--text-dim);
          margin-bottom: 36px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .intro {
          background: rgba(14,14,31,0.7);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 22px 24px;
          margin-bottom: 40px;
          font-size: 15px;
          line-height: 1.7;
        }
        .intro strong { color: var(--gold-dim); }
        h2 {
          font-size: clamp(22px, 3.5vw, 28px);
          color: #fff;
          margin-top: 48px;
          margin-bottom: 10px;
          line-height: 1.25;
        }
        h2::before {
          content: '';
          display: block;
          width: 36px; height: 2px;
          background: var(--gold);
          border-radius: 2px;
          margin-bottom: 14px;
        }
        h3 {
          font-size: 17px;
          color: var(--gold-dim);
          margin-top: 26px;
          margin-bottom: 10px;
        }
        p, li {
          font-size: 15px;
          color: var(--text);
          line-height: 1.75;
          margin-bottom: 14px;
        }
        .dim { color: var(--text-dim); }
        strong { color: #fff; }
        a { color: var(--gold); text-decoration: underline; text-decoration-color: var(--border); text-underline-offset: 3px; }
        a:hover { text-decoration-color: var(--gold); }
        ul { padding-left: 20px; margin-bottom: 16px; }
        ul li { margin-bottom: 8px; }
        .data-card {
          background: rgba(14,14,31,0.5);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 18px 22px;
          margin-top: 16px;
          margin-bottom: 16px;
        }
        .data-card strong { color: var(--gold-dim); }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 18px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        th, td {
          text-align: left;
          padding: 12px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          vertical-align: top;
        }
        th {
          color: var(--gold-dim);
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        td { color: var(--text); }
        td.dim-cell { color: var(--text-dim); font-size: 13px; }
        .contact-block {
          background: rgba(14,14,31,0.7);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 24px 26px;
          margin-top: 22px;
        }
        .contact-block p { margin-bottom: 6px; }
        footer {
          position: relative; z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 24px; text-align: center;
          font-size: 12px; color: var(--text-dim);
        }
        footer a { color: var(--gold-dim); text-decoration: none; }
        @media (max-width: 600px) {
          nav { padding: 14px 16px; }
          .nav-links { gap: 14px; }
          .container { padding: 96px 18px 60px; }
          .intro { padding: 18px 18px; }
          table { font-size: 13px; }
          th, td { padding: 10px 8px; }
        }
      `}</style>

      <nav>
        <a href="/landing" className="nav-logo">Merre vagy, vándor?</a>
        <ul className="nav-links">
          <li><a href="/landing">Főoldal</a></li>
          <li><a href="/rolunk">Rólunk</a></li>
          <li><a href="/">Térkép</a></li>
        </ul>
      </nav>

      <div className="container">
        <div className="doc-eyebrow">Jogi dokumentum</div>
        <h1>Adatvédelmi tájékoztató</h1>
        <p className="doc-meta">
          Hatályos: 2026. április 22. napjától · Utolsó frissítés: 2026. április 24.
        </p>

        <div className="intro">
          <p>
            A <strong>Merre vagy, vándor?</strong> egy ingyenes, nonprofit közösségi térkép, amelyet
            erdélyi magyarok hoznak létre saját maguk elhelyezésével a világtérképen.
            Ez a tájékoztató elmagyarázza, milyen személyes adatokat kezelünk, milyen célból,
            milyen jogalapon, és milyen jogaid vannak ezzel kapcsolatban.
          </p>
          <p style={{marginTop: '12px'}}>
            A tájékoztató az <strong>Európai Unió Általános Adatvédelmi Rendelete (GDPR – Regulation (EU) 2016/679)</strong> és
            az <strong>Egyesült Királyság Data Protection Act 2018 (UK GDPR)</strong> rendelkezéseivel összhangban készült.
          </p>
        </div>

        <h2>1. Az adatkezelő adatai</h2>
        <div className="contact-block">
          <p>
            <strong>Üzemeltető (adatkezelő):</strong> Erdélyi Vándor Baráti Társaság{' '}
            <span className="dim">(alapítás alatt)</span>
          </p>
          <p className="dim" style={{marginTop: '8px'}}>
            A projekt mögött álló közösségi egyesület <strong>bejegyzés alatt áll</strong>.
            A hivatalos bírósági bejegyzésig az adatkezelői felelősséget az egyesület
            alapító tagjai személyesen viselik, a bejegyzést követően minden adatkezelési
            felelősség automatikusan átszáll a bejegyzett egyesületre. Erről a változásról
            a felhasználókat külön is tájékoztatjuk, a hozzájárulás érvényben marad.
          </p>
          <p style={{marginTop: '14px'}}>
            <strong>Jelenleg felelős természetes személy (alapító):</strong> Kobori Béla MSc
          </p>
          <p><strong>Jogi forma:</strong> Bela Kobori se. (Sole Entrepreneur, Egyesült Királyság)</p>
          <p><strong>Adószám:</strong> 4226551304</p>
          <p><strong>Székhely:</strong> 21 Langdon Drive, London NW9 8NS, United Kingdom</p>
          <p style={{marginTop: '10px'}}>
            <strong>Alapító társ:</strong> Balázs Áron <span className="dim">(Erdély)</span>
          </p>
          <p style={{marginTop: '10px'}}><strong>Kapcsolat email:</strong> <a href="mailto:merevagyvandor@gmail.com">merevagyvandor@gmail.com</a></p>
          <p style={{marginTop: '10px'}} className="dim">
            Adatvédelmi tisztviselő kinevezésére a GDPR 37. cikke alapján nem vagyunk kötelesek,
            de az adatvédelmi kérdésekkel közvetlenül a fenti email címen kereshetsz minket.
          </p>
        </div>

        <h2>2. Milyen személyes adatokat kezelünk</h2>
        <p>
          Amikor jelölőt (pin-t) helyezel a térképen, az alábbi adatokat gyűjtjük és tároljuk.
          Az adatok körét a közösség kérésére bővítettük, hogy a diaszpóra-statisztika
          pontosabb képet tudjon adni (pl. honnan jönnek, mikor mentek, milyen végzettséggel) —
          <strong> minden bővített mező opcionális</strong>, üresen is hagyhatók.
        </p>
        <div className="data-card">
          <p><strong>Kötelező adatok (a jelölő létrehozásához):</strong></p>
          <ul>
            <li><strong>Email cím</strong> – a jelölő kezeléséhez, törlési lehetőség biztosításához, és (ha külön hozzájárulsz) ritka közösségi értesítésekhez</li>
            <li><strong>Mostani város és ország</strong> – a jelölő térképen való megjelenítéséhez</li>
            <li><strong>Földrajzi koordináták</strong> – pontos és kerekített formában egyaránt (részleteket lásd lent)</li>
            <li><strong>Jelölő típusa</strong> – „Kint élek", „Kijárok dolgozni", vagy „Készülök kimenni"</li>
          </ul>
          <p style={{marginTop: '12px'}}><strong>Opcionális, nyilvános adatok (a térképen megjelennek):</strong></p>
          <ul>
            <li><strong>Nicknév</strong> – ez jelenik meg a térképen a jelölőd mellett. Ha nem adsz meg nicknevet, a rendszer „Vándor" néven jeleníti meg. <strong>Javasoljuk, hogy ne a teljes valódi nevedet írd ide</strong>, mert ez mindenki számára látható.</li>
            <li><strong>Származási város és ország</strong> – pl. „Székelyudvarhely, Románia". A jelölő popup-ban jelenik meg, hogy az olvasó lássa, honnan származol.</li>
          </ul>
          <p style={{marginTop: '12px'}}><strong>Opcionális, nem nyilvános adatok (csak statisztikához, publikus térképen sosem jelennek meg):</strong></p>
          <ul>
            <li><strong>Teljes név</strong> – csak belső nyilvántartás, a térképen <strong>sosem</strong> látszik</li>
            <li><strong>Vonatkozó dátum</strong> – mikor mentél ki / mióta jársz ki / mikor tervezel kimenni</li>
            <li><strong>Születési év</strong> – korösszetételi statisztikához (nem teljes születési dátum, csak év)</li>
            <li><strong>Végzettség</strong> – szabadszöveges (pl. „közgazdász", „szakmunkás")</li>
            <li><strong>Foglalkozás</strong> – szabadszöveges (pl. „szoftverfejlesztő", „pincér")</li>
          </ul>
          <p style={{marginTop: '12px'}}><strong>Külön, opcionális hozzájárulás – marketing / hírlevél:</strong></p>
          <ul>
            <li><strong>Marketing-hozzájárulás flag</strong> – csak akkor jelöljük ezt meg, ha Te a formban külön kipipálod. Ezt bármikor, egyetlen kattintással visszavonhatod.</li>
          </ul>
          <p style={{marginTop: '12px'}}><strong>Automatikusan gyűjtött technikai adatok:</strong></p>
          <ul>
            <li><strong>Létrehozás dátuma</strong> és technikai lejárati dátum (jelenleg hosszú távú: kb. 10 év, csak biztonsági háló — lásd 5. pont)</li>
            <li><strong>Jelölő státusz</strong> (aktív / elrejtett / törölt)</li>
            <li><strong>Törlési token hash-je</strong> – ami lehetővé teszi, hogy saját magad is törölhesd a jelölőd</li>
            <li><strong>Szerveroldali log-ok</strong> – IP cím, böngésző azonosító, kérés időpontja (csak rövid ideig, biztonsági és hibakeresési célból)</li>
          </ul>
        </div>

        <h3>Koordináták kezelése – fontos adatvédelmi megjegyzés</h3>
        <p>
          A rendszer két koordináta-verziót tárol: egy <strong>pontos</strong> és egy <strong>kerekített</strong> változatot.
          A publikus térképen <strong>kizárólag a kerekített koordináta jelenik meg</strong>, amelynek felbontása
          körülbelül <strong>11 km</strong> (0,1 fok pontosság). A pontos koordinátára technikai okokból van szükségünk
          (pl. újraszámítás, jövőbeli hibajavítás), de publikus API-n keresztül sosem osztjuk meg.
        </p>

        <h2>3. Az adatkezelés célja</h2>
        <p>
          Az adatokat kizárólag a következő célokra használjuk:
        </p>
        <ul>
          <li>A közösségi térképen való megjelenítés – <strong>kizárólag a nicknév, a kerekített koordináta, a mostani város/ország, a jelölő típusa és opcionálisan a származási város/ország jelenik meg</strong>. A teljes név, email, születési év, végzettség, foglalkozás a térképen <strong>sosem</strong> látszik.</li>
          <li>Összesített, anonimizált közösségi statisztika készítése (pl. „X országban hány erdélyi él", „milyen a korösszetétel", „milyen szakmák dominálnak") – ezek az adatok publikusan csak aggregált formában jelenhetnek meg, egyéni azonosítás nélkül.</li>
          <li>A törlési token használatával a felhasználó általi törlés biztosítása, illetve a hozzájárulás visszavonásának lehetővé tétele.</li>
          <li>Közösségi kommunikáció és értesítések – <strong>csak akkor, ha az érintett külön, opcionális marketing-hozzájárulást adott</strong> az űrlapon. A kötelező adatvédelmi hozzájárulás önmagában <strong>nem</strong> jogosít fel minket hírlevelek küldésére.</li>
          <li>A jövőben: lehetséges, hogy harmadik fél szponzorok (pl. közlekedési, utazási cégek) általi célzott, csoportos ajánlatok közvetítése – <strong>kizárólag akkor, ha a marketing-hozzájárulás külön ezt is fedi</strong>, és akkor is úgy, hogy az email címedet sosem adjuk át a szponzornak (a megkeresést mi magunk küldjük ki).</li>
          <li>Jogsértő vagy visszaélésszerű használat megelőzése és kezelése.</li>
        </ul>
        <p>
          <strong>Az email címedet soha nem értékesítjük harmadik félnek,</strong> és marketing hozzájárulás
          nélkül <strong>soha nem küldünk</strong> hírlevelet vagy szponzorált üzenetet. Automatizált
          profilalkotást nem végzünk.
        </p>

        <h2>4. Az adatkezelés jogalapja</h2>
        <ul>
          <li><strong>GDPR 6. cikk (1) bekezdés a) pont – hozzájárulás:</strong> Te a jelölő leadásakor egy külön jelölőnégyzet (checkbox) kipipálásával <strong>kifejezett, önkéntes hozzájárulást</strong> adsz a nyilvános és nem nyilvános mezők kezeléséhez. Ez a hozzájárulás bármikor, díjmentesen visszavonható (lásd 8. pont).</li>
          <li><strong>GDPR 6. cikk (1) bekezdés a) pont – külön marketing-hozzájárulás:</strong> A hírlevél / közösségi értesítés / szponzorált megkeresés kizárólag <strong>külön, második kipipálással</strong> adott hozzájárulás alapján lehetséges. Ezt szintén bármikor, egyetlen kattintással visszavonhatod, és ez nem érinti az alap-jelölő működését.</li>
          <li><strong>GDPR 6. cikk (1) bekezdés f) pont – jogos érdek:</strong> A rendszer technikai működéséhez szükséges minimális log-ok (pl. IP cím) esetében jogos érdekünk fűződik a szolgáltatás biztonságához és visszaélés-megelőzéshez.</li>
        </ul>

        <h2>5. Mennyi ideig tároljuk az adatokat</h2>
        <p>
          A projekt nonprofit, közösségi statisztikai jellegéből fakadóan az adatokat —
          a korábbi 30 napos automatikus törléssel ellentétben — <strong>a hozzájárulás
          visszavonásáig</strong> őrizzük meg, hogy a térkép és a közösségi statisztika
          folyamatos képet adjon. Ez a korábbi gyakorlat módosítása, a közösségi
          visszajelzések és a használat stabilitása alapján.
        </p>
        <ul>
          <li><strong>Jelölő adatok (nicknév, email, város, ország, koordináták, opcionális demográfiai mezők):</strong> a hozzájárulás visszavonásáig, vagy ameddig a jelölőd „aktív" státuszban van. Te bármikor, egyetlen kattintással törölheted a jelölődet, vagy kérheted email-en az összes adatod törlését — a kérést haladéktalanul, de legkésőbb 30 napon belül teljesítjük.</li>
          <li><strong>Technikai lejárati dátum (biztonsági háló):</strong> ~10 év — ez kizárólag adatbázis-technikai mechanizmus arra az esetre, ha az üzemeltető bármilyen okból megszűnne és a közösségi törlési folyamat nem működne. A gyakorlatban a jelölők aktívak maradnak, amíg Te másként nem rendelkezel.</li>
          <li><strong>Marketing-hozzájárulás:</strong> csak addig, amíg a hozzájárulást vissza nem vonod. Visszavonás után a marketing-flag véglegesen „false"-ra kerül, a hírlevélből kiiratkozol.</li>
          <li><strong>Szerveroldali technikai log-ok:</strong> legfeljebb 14 nap, ezután felülíródnak.</li>
          <li><strong>Hibaüzenetek és monitoring adatok:</strong> 30 napig, összesített, nem személyes formában.</li>
        </ul>
        <p className="dim">
          <strong>Mit jelent ez a gyakorlatban?</strong> Ha leteszed a jelölőd és nem csinálsz semmit,
          az ott marad — úgy, ahogy Te is ott vagy. Ha úgy döntesz, hogy nem szeretnéd többé,
          egy kattintással elvihető a térképről, és az adat visszavonhatatlanul törlődik.
        </p>

        <h2>6. Adatfeldolgozók és adattovábbítás</h2>
        <p>
          Adataidat az alábbi technikai szolgáltatók (adatfeldolgozók) tárolják vagy dolgozzák fel,
          saját adatvédelmi szabályzatukkal összhangban. Velük mint adatkezelők megfelelő
          adatfeldolgozási szerződést kötöttünk (DPA, Data Processing Agreement):
        </p>
        <table>
          <thead>
            <tr>
              <th>Szolgáltató</th>
              <th>Adatkezelés helye</th>
              <th>Mely adatokhoz fér hozzá</th>
              <th>Jogi biztosíték</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Supabase Inc.</strong><br/><a href="https://supabase.com/privacy" target="_blank" rel="noopener">Adatvédelem</a></td>
              <td>AWS <strong>eu-west-1</strong> (Dublin, Írország) – EU-n belül</td>
              <td>Minden jelölő adat tárolása</td>
              <td>EU-n belül, nincs nemzetközi adattovábbítás</td>
            </tr>
            <tr>
              <td><strong>Resend, Inc.</strong><br/><a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener">Adatvédelem</a></td>
              <td>Egyesült Államok</td>
              <td>Email cím és név (visszaigazoló email kiküldéséhez)</td>
              <td>Standard Contractual Clauses (SCC) – GDPR 46. cikk</td>
            </tr>
            <tr>
              <td><strong>Vercel Inc.</strong><br/><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">Adatvédelem</a></td>
              <td>Egyesült Államok (HQ), EU edge hálózat</td>
              <td>Hosting, technikai log-ok (IP, user-agent)</td>
              <td>Standard Contractual Clauses (SCC) – GDPR 46. cikk</td>
            </tr>
            <tr>
              <td><strong>Mapbox, Inc.</strong><br/><a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener">Adatvédelem</a></td>
              <td>Egyesült Államok</td>
              <td>Térkép-csempék betöltésekor a böngésző IP-je és user-agent-je (mi nem tároljuk)</td>
              <td>Standard Contractual Clauses (SCC) – GDPR 46. cikk</td>
            </tr>
            <tr>
              <td><strong>Rackhost Kft.</strong><br/><a href="https://www.rackhost.hu/adatvedelem" target="_blank" rel="noopener">Adatvédelem</a></td>
              <td>Magyarország – EU-n belül</td>
              <td>Domain DNS üzemeltetése (nem kezel személyes adatot)</td>
              <td>EU-n belül</td>
            </tr>
          </tbody>
        </table>
        <p className="dim">
          A fenti szolgáltatók saját adatvédelmi gyakorlatáért az adott cég felel.
          A linkelt adatvédelmi szabályzatokat a döntésed meghozatala előtt érdemes áttekintened.
        </p>

        <h2>7. Sütik (cookie-k) használata</h2>
        <p>
          A Merre vagy, vándor? weboldal <strong>saját célú sütiket nem használ</strong>, analitikai vagy
          reklámkövető kódot nem futtat. A térkép működéséhez használt <strong>Mapbox</strong> szolgáltatás
          a saját infrastruktúrájához technikai sütiket tölthet be (pl. session azonosító), amelyeket a
          Mapbox saját szabályzata szerint kezel. Ezeket te böngésző szinten letilthatod.
        </p>

        <h2>8. Jogaid az adataiddal kapcsolatban</h2>
        <p>
          Mint érintett, a GDPR és UK GDPR alapján a következő jogok illetnek meg. Ezeket bármikor,
          <strong> díjmentesen</strong> gyakorolhatod a <a href="mailto:merevagyvandor@gmail.com">merevagyvandor@gmail.com</a> címre küldött emailben:
        </p>
        <ul>
          <li><strong>Hozzáférés joga (GDPR 15. cikk):</strong> Tájékoztatást kérhetsz arról, milyen adatokat kezelünk rólad, és ezek másolatát megkaphatod.</li>
          <li><strong>Helyesbítéshez való jog (GDPR 16. cikk):</strong> Ha pontatlan adatot látsz magadról, kérheted annak helyesbítését.</li>
          <li><strong>Törléshez való jog / „elfeledtetéshez való jog" (GDPR 17. cikk):</strong> Kérheted adataid azonnali, végleges törlését. Ez 30 napnál hamarabb is megtörténik, ha kéred.</li>
          <li><strong>Adatkezelés korlátozásához való jog (GDPR 18. cikk):</strong> Kérheted, hogy ideiglenesen ne kezeljük az adataidat.</li>
          <li><strong>Adathordozhatósághoz való jog (GDPR 20. cikk):</strong> Kérésre strukturált, géppel olvasható formátumban (JSON) megkapod az adataidat.</li>
          <li><strong>Tiltakozáshoz való jog (GDPR 21. cikk):</strong> Tiltakozhatsz a jogos érdeken alapuló adatkezelés ellen.</li>
          <li><strong>Hozzájárulás visszavonása (GDPR 7. cikk (3)):</strong> A korábban adott hozzájárulásodat bármikor visszavonhatod, ami a jelölőd törlésével jár.</li>
        </ul>
        <p>
          Kérésedre válaszunkat <strong>legkésőbb 30 napon belül</strong> küldjük meg, a GDPR 12. cikke szerint.
        </p>

        <h2>9. Panasztételi jog</h2>
        <p>
          Ha úgy érzed, az adatkezelésünk nem felel meg a jogszabályoknak, az alábbi hatóságokhoz fordulhatsz:
        </p>
        <div className="data-card">
          <p><strong>Magyarország – NAIH</strong></p>
          <p>Nemzeti Adatvédelmi és Információszabadság Hatóság</p>
          <p className="dim">1055 Budapest, Falk Miksa utca 9-11.</p>
          <p className="dim">Telefon: +36 (1) 391-1400</p>
          <p className="dim">Web: <a href="https://www.naih.hu" target="_blank" rel="noopener">www.naih.hu</a></p>
        </div>
        <div className="data-card">
          <p><strong>Egyesült Királyság – ICO</strong> (mivel az adatkezelő UK-s vállalkozás)</p>
          <p>Information Commissioner's Office</p>
          <p className="dim">Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</p>
          <p className="dim">Telefon: +44 303 123 1113</p>
          <p className="dim">Web: <a href="https://ico.org.uk" target="_blank" rel="noopener">ico.org.uk</a></p>
        </div>
        <p className="dim">
          Természetesen — és ezt javasoljuk első lépésnek — lehetőség szerint előbb minket keress
          meg a fent megadott email címen. A legtöbb probléma néhány órán belül megoldható.
        </p>

        <h2>10. Adatbiztonság</h2>
        <p>
          Az adatbiztonság érdekében az alábbi technikai és szervezési intézkedéseket tettük:
        </p>
        <ul>
          <li>HTTPS (TLS 1.3) titkosítás a weboldal és az API közötti teljes kommunikációban</li>
          <li>Az adatbázis Row Level Security (RLS) szabályokkal védve, a publikus API csak a kerekített koordinátákhoz fér hozzá</li>
          <li>A törlési token <strong>hash-elve</strong> van tárolva — a nyers token csak a user böngészőjében létezik</li>
          <li>Rendszeres biztonsági frissítések (függőségi frissítések, Supabase és Vercel platform)</li>
          <li>A szerveroldali titkos kulcsok (API keys) környezeti változókban tárolva, nyilvános repóban nem</li>
        </ul>

        <h2>11. Automatizált döntéshozatal</h2>
        <p>
          A rendszer <strong>nem végez</strong> automatizált döntéshozatalt vagy profilalkotást az érintettekkel kapcsolatban
          (GDPR 22. cikk). A jelölők nem kerülnek rangsorolásra, nem kapnak pontszámot,
          nem kerülnek célzott reklámozási csoportokba. Az egyetlen automatikus művelet az
          aggregált statisztikák generálása (pl. „hány erdélyi van az adott országban"), ami
          egyéni azonosítást nem tartalmaz.
        </p>

        <h2>12. A tájékoztató módosítása</h2>
        <p>
          Fenntartjuk a jogot, hogy ezt a tájékoztatót időről időre frissítsük
          (pl. jogszabályi változás, új adatfeldolgozó bevonása esetén). A jelentős változásokat
          az oldal tetején jelezzük, és ha az érintetted valamely korábbi hozzájárulási nyilatkozatát
          érinti, emailben is értesítünk. A mindenkor hatályos verzió ezen az oldalon mindig elérhető.
        </p>

        <h2>13. Kapcsolat</h2>
        <div className="contact-block">
          <p>Adatvédelmi kérdéseiddel, kéréseiddel bátran fordulj hozzánk:</p>
          <p style={{marginTop: '10px'}}>
            <strong>Email:</strong> <a href="mailto:merevagyvandor@gmail.com">merevagyvandor@gmail.com</a>
          </p>
          <p className="dim" style={{marginTop: '10px'}}>
            Válaszunkra legkésőbb 30 napon belül számíthatsz, de törekszünk rá, hogy 48 órán belül reagáljunk.
          </p>
        </div>
      </div>

      <footer>
        <p>
          © 2026 Merre vagy, vándor? · <a href="/landing">Főoldal</a> · <a href="/rolunk">Rólunk</a> · <a href="/">Térkép</a>
        </p>
        <p style={{marginTop: '8px', opacity: 0.65}}>
          Üzemeltető: Erdélyi Vándor Baráti Társaság <em>(alapítás alatt)</em>
        </p>
      </footer>
    </>
  )
}
