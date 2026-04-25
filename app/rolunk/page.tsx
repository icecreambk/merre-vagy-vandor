import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rólunk — Merre vagy, vándor?',
  description: 'Megismerni a projektet, amely összegyűjti a szétszóródott erdélyi magyarokat szerte a világon.',
  openGraph: {
    title: 'Rólunk — Merre vagy, vándor?',
    description: 'Erdélyi közösségi világtérkép — közös hang, közös hely.',
    type: 'website',
  },
}

export default function RolunkPage() {
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

        .page {
          position: relative; z-index: 1;
          max-width: 820px;
          margin: 0 auto;
          padding: 120px 24px 60px;
        }
        .eyebrow {
          font-size: 12px; color: var(--gold-dim);
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 18px;
          border: 1px solid var(--border); border-radius: 20px;
          padding: 5px 14px; display: inline-block;
          background: var(--gold-faint);
        }
        h1 {
          font-size: clamp(34px, 6vw, 56px);
          color: var(--gold); line-height: 1.15;
          margin-bottom: 20px;
        }
        .lead {
          font-size: clamp(16px, 2vw, 19px);
          color: var(--text-dim);
          line-height: 1.7; margin-bottom: 36px;
          font-style: italic;
          max-width: 640px;
        }
        .divider {
          width: 48px; height: 2px;
          background: var(--gold); margin: 32px 0 24px; border-radius: 2px;
        }
        h2 {
          font-size: clamp(22px, 3vw, 30px);
          color: #fff; margin-bottom: 16px;
          line-height: 1.25;
        }
        h3 {
          font-size: 17px; color: var(--gold);
          margin-top: 28px; margin-bottom: 10px;
        }
        p {
          font-size: 15px;
          color: var(--text-dim);
          line-height: 1.75;
          margin-bottom: 14px;
        }
        p strong { color: var(--text); }
        .quote {
          border-left: 3px solid var(--gold);
          padding: 14px 20px;
          background: var(--gold-faint);
          margin: 22px 0;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: var(--text);
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 14px;
          margin: 24px 0;
        }
        .card {
          background: rgba(14,14,31,0.7);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 22px 20px;
        }
        .card-icon { font-size: 26px; margin-bottom: 10px; }
        .card-title { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 6px; }
        .card-text { font-size: 13px; color: var(--text-dim); line-height: 1.6; }

        .cta-row {
          display: flex; gap: 12px; flex-wrap: wrap;
          margin-top: 28px;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--gold); color: #0a0a14;
          text-decoration: none; border-radius: 12px;
          padding: 13px 24px; font-size: 15px; font-weight: 700;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover { background: #f0d060; transform: translateY(-1px); }
        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: var(--gold);
          text-decoration: none; border: 1px solid var(--border);
          border-radius: 12px; padding: 13px 24px;
          font-size: 15px; font-weight: 600;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-outline:hover { background: var(--gold-faint); border-color: var(--gold); }

        footer {
          position: relative; z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 24px; text-align: center;
          font-size: 12px; color: var(--text-dim);
        }
        footer a { color: var(--gold-dim); text-decoration: none; }
        footer a:hover { text-decoration: underline; }

        @media (max-width: 600px) {
          nav { padding: 14px 16px; }
          .nav-links { gap: 14px; font-size: 13px; }
          .page { padding: 100px 18px 50px; }
        }
      `}</style>

      <nav>
        <a href="/landing" className="nav-logo">Merre vagy, vándor?</a>
        <ul className="nav-links">
          <li><a href="/rolunk">Rólunk</a></li>
          <li><a href="/landing#contact">Kapcsolat</a></li>
          <li><a href="/adatvedelem">Adatvédelem</a></li>
        </ul>
      </nav>

      <div className="page">
        <span className="eyebrow">🏔️ A projekt története</span>
        <h1>Rólunk</h1>
        <p className="lead">
          Elmentünk a nagyvilágba — ki munkáért, ki jobb életért, ki kalandért.
          De ki tudja ma pontosan, hányan vagyunk, és hol élünk?
          Ez a projekt ezt a kérdést próbálja megválaszolni.
        </p>

        <div className="divider"></div>

        <h2>Miért csináljuk?</h2>
        <p>
          Erdélyből az elmúlt évtizedekben <strong>százezrek</strong> indultak útnak.
          London, München, Budapest, Torontó, New York, Tel-Aviv — szinte nincs olyan nagyváros,
          ahol ne dolgozna vagy élne legalább egy erdélyi magyar család. Mégsem tudjuk, hogy
          <strong> hányan vagyunk</strong>, és <strong>hol</strong>. A hivatalos statisztikák nem látnak bennünket,
          a saját közösségünk pedig csak találgat.
        </p>
        <p>
          Ez a térkép erre a kérdésre próbál meg <strong>közösségi választ</strong> adni. Nem kutatás,
          nem politika, nem panasz — csak egy egyszerű módja annak, hogy megmutassuk magunkat
          egymásnak. Pontról pontra, városról városra, kontinensről kontinensre.
        </p>

        <div className="quote">
          „Nem tűntünk el — csak messzire kerültünk. Erdély nem egy hely, hanem valami,
          amit magunkkal viszünk, bárhol is élünk a világban."
        </div>

        <h2>Mit csinál ez a térkép?</h2>
        <p>
          A térkép három kérdésre ad vizuális választ: <strong>hol élnek, hová járnak dolgozni,
          és hova készülnek kimenni</strong> az erdélyi magyarok. Bárki egyetlen kattintással
          feltehet egy jelölőt a saját helyére — és máris láthatóvá válik, hogy nincs egyedül.
        </p>

        <div className="card-grid">
          <div className="card">
            <div className="card-icon">🚩</div>
            <div className="card-title">Kint él</div>
            <div className="card-text">Azok, akik ma már nem Erdélyben élnek — hanem Londonban, Berlinben, Budapesten, Torontóban vagy bárhol máshol.</div>
          </div>
          <div className="card">
            <div className="card-icon">🟡</div>
            <div className="card-title">Kijár dolgozni</div>
            <div className="card-text">Azok, akik otthon élnek, de hetente vagy havonta külföldre járnak dolgozni — ingázó vándorok.</div>
          </div>
          <div className="card">
            <div className="card-icon">🟢</div>
            <div className="card-title">Készül kimenni</div>
            <div className="card-text">Azok, akik most tervezik a kilépést — munkaszerződést várnak, albérletet keresnek, vagy csak még nem indultak el.</div>
          </div>
        </div>

        <h2>Mi a célunk hosszú távon?</h2>
        <p>
          A térkép csak a kezdet. Ami mögötte épül, az egy <strong>közösségi hálózat</strong> —
          erdélyiek a nagyvilágban, akik egymás létezéséről tudnak, és ha eljön az idő,
          közösen is szólhatnak. Munkakeresőknek, induló vállalkozóknak, barátot kereső
          fiataloknak, idősebb hazatérőknek — bárkinek, akinek jól jön, hogy van egy társasága
          ott, ahol ő is él.
        </p>
        <p>
          <strong>Ingyenes</strong>, <strong>nonprofit</strong>, <strong>reklám nélkül</strong>,
          és örökre az is marad. Ha egyszer szponzor vagy támogató jön, az nem a te adataidra
          fog fizetni — hanem arra, hogy ez a projekt fenntartható legyen.
        </p>

        <h2>Kik vagyunk?</h2>
        <p>
          A projekt mögött az <strong>Erdélyi Vándor Baráti Társaság</strong> áll — egy most alakuló
          civil közösség, amely azoknak az erdélyieknek készül, akik messze vannak, de nem
          akarnak teljesen elszakadni. Alapító tagok: Kobori Béla (London) és Aaron Balázs (Erdély).
        </p>
        <p>
          A Társaság <strong>bejegyzése folyamatban</strong> van. Amíg ez le nem zárul,
          a projekt egy „alapítás alatt" státuszban fut — éles feliratkozást akkor indítunk,
          amikor az egyesület hivatalosan is működik.
        </p>

        <h2>Adatvédelem és etika</h2>
        <p>
          Az adataidra úgy vigyázunk, ahogy saját magunkéra. <strong>Nem adunk el adatot.
          Nem küldünk kéretlen reklámot. Nem adjuk át harmadik félnek.</strong> A térképen
          soha nem jelenik meg a neved, emailcímed vagy pontos lakhelyed — csak az általad
          megadott nicknév és a városod szintű helyzet (körülbelül 11 km pontossággal).
        </p>
        <p>
          A részletes, GDPR-megfelelő <a href="/adatvedelem" style={{ color: 'var(--gold)' }}>adatvédelmi tájékoztatóban</a>{' '}
          minden le van írva — olvasd el, mielőtt feliratkozol. Ha bármikor le szeretnél kerülni
          a térképről, egyetlen kattintással megteheted.
        </p>

        <div className="cta-row">
          <a href="/" className="btn-primary">
            🗺️ Megnyitom a térképet
          </a>
          <a href="https://www.facebook.com/groups/963074126669000" target="_blank" rel="noopener" className="btn-outline">
            📘 Facebook csoport
          </a>
          <a href="/adatvedelem" className="btn-outline">
            🔒 Adatvédelem
          </a>
        </div>
      </div>

      <footer>
        <p>© 2026 Merre vagy, vándor? · <a href="/">Térkép</a> · <a href="/adatvedelem">Adatvédelem</a></p>
        <p style={{ marginTop: 6, fontSize: 11 }}>Üzemeltető: <strong style={{ color: 'var(--gold-dim)' }}>Erdélyi Vándor Baráti Társaság</strong> <span style={{ opacity: 0.6 }}>(alapítás alatt)</span></p>
      </footer>
    </>
  )
}
