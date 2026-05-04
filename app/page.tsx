export default function LandingPage() {
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
          --text: rgba(255,255,255,0.82);
          --text-dim: rgba(255,255,255,0.45);
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
            radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 75% 8%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 40% 55%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 85% 40%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 25% 75%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 85%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 92% 65%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 5% 45%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 50% 30%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 30% 90%, rgba(255,255,255,0.4) 0%, transparent 100%);
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
        .hero {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 100px 24px 60px;
        }
        .hero-eyebrow {
          font-size: 12px; color: var(--gold-dim);
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 20px;
          border: 1px solid var(--border); border-radius: 20px;
          padding: 5px 14px; display: inline-block;
          background: var(--gold-faint);
        }
        .hero-title {
          font-size: clamp(36px, 8vw, 72px);
          color: var(--gold); line-height: 1.1;
          margin-bottom: 16px;
          text-shadow: 0 2px 40px rgba(232,197,71,0.2);
        }
        .hero-sub {
          font-size: clamp(15px, 2.5vw, 19px);
          color: var(--text-dim); max-width: 520px;
          line-height: 1.65; margin-bottom: 48px;
          font-style: italic;
        }
        .live-stats {
          display: flex; gap: 12px;
          justify-content: center; flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .stat-pill {
          background: var(--gold-faint);
          border: 1px solid var(--border);
          border-radius: 12px; padding: 14px 24px;
          text-align: center; min-width: 110px;
        }
        .stat-pill-num {
          font-size: 28px; font-weight: 700;
          color: var(--gold); display: block; line-height: 1;
        }
        .stat-pill-label {
          font-size: 11px; color: var(--text-dim);
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-top: 4px; display: block;
        }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--gold); color: #0a0a14;
          text-decoration: none; border-radius: 14px;
          padding: 16px 36px; font-size: 16px; font-weight: 700;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 32px rgba(232,197,71,0.25);
          margin-bottom: 14px;
        }
        .cta-btn:hover { background: #f0d060; transform: translateY(-2px); }
        .cta-sub { font-size: 12px; color: var(--text-dim); }
        .pin-types {
          display: flex; gap: 10px;
          justify-content: center; flex-wrap: wrap;
          margin-top: 56px;
        }
        .pin-type {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 10px 16px;
          font-size: 13px; color: var(--text-dim);
        }
        .pin-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .pin-dot--red { background: #ef4444; }
        .pin-dot--yellow { background: #e8c547; }
        .pin-dot--green { background: #22c55e; }
        section {
          position: relative; z-index: 1;
          max-width: 780px; margin: 0 auto;
          padding: 80px 24px;
        }
        .section-label {
          font-size: 11px; color: var(--gold-dim);
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: clamp(26px, 4vw, 38px);
          color: #fff; margin-bottom: 20px; line-height: 1.2;
        }
        .section-divider {
          width: 48px; height: 2px;
          background: var(--gold); margin-bottom: 28px; border-radius: 2px;
        }
        .section-text {
          font-size: 15px; color: var(--text-dim);
          line-height: 1.8; margin-bottom: 16px;
        }
        .section-text strong { color: var(--text); }
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px; margin-top: 32px;
        }
        .card {
          background: rgba(14,14,31,0.7);
          border: 1px solid var(--border);
          border-radius: 14px; padding: 24px 20px;
        }
        .card-icon { font-size: 28px; margin-bottom: 12px; }
        .card-title { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 8px; }
        .card-text { font-size: 13px; color: var(--text-dim); line-height: 1.6; }
        .contact-box {
          background: rgba(14,14,31,0.7);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 36px 32px; text-align: center;
        }
        .contact-box p { font-size: 15px; color: var(--text-dim); line-height: 1.7; margin-bottom: 24px; }
        .btn-fb {
          display: inline-flex; align-items: center; gap: 8px;
          background: #1877f2; color: #fff; text-decoration: none;
          border-radius: 10px; padding: 12px 24px;
          font-size: 14px; font-weight: 600;
          transition: background 0.2s; margin: 6px;
        }
        .btn-fb:hover { background: #166fe5; }
        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: var(--gold);
          text-decoration: none; border: 1px solid var(--border);
          border-radius: 10px; padding: 12px 24px;
          font-size: 14px; font-weight: 600;
          transition: background 0.2s, border-color 0.2s; margin: 6px;
        }
        .btn-outline:hover { background: var(--gold-faint); border-color: var(--gold); }
        footer {
          position: relative; z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 24px; text-align: center;
          font-size: 12px; color: var(--text-dim);
        }
        footer a { color: var(--gold-dim); text-decoration: none; }
        .sep {
          position: relative; z-index: 1;
          height: 1px; background: rgba(255,255,255,0.06);
          max-width: 780px; margin: 0 auto;
        }
        @media (max-width: 600px) {
          nav { padding: 14px 16px; }
          .nav-links { gap: 16px; }
          .hero { padding: 90px 20px 48px; }
          .stat-pill { min-width: 90px; padding: 12px 16px; }
          .stat-pill-num { font-size: 22px; }
          .cta-btn { width: 100%; justify-content: center; }
          .contact-box { padding: 28px 20px; }
          section { padding: 60px 20px; }
        }
      `}</style>

      <nav>
        <a href="/" className="nav-logo">Merre vagy, vándor?</a>
        <ul className="nav-links">
          <li><a href="/rolunk">Rólunk</a></li>
          <li><a href="#contact">Kapcsolat</a></li>
          <li><a href="/adatvedelem">Adatvédelem</a></li>
        </ul>
      </nav>

      <div className="hero">
        <span className="hero-eyebrow">🌍 Erdélyi közösségi világtérkép</span>
        <h1 className="hero-title">Merre vagy,<br/>vándor?</h1>
        <p className="hero-sub">Mutasd meg a világnak, hol élsz te.<br/>Erdélyiek a nagyvilágban — egy pontban összegyűjtve.</p>

        <div className="live-stats">
          <div className="stat-pill">
            <span className="stat-pill-num" id="stat-total">–</span>
            <span className="stat-pill-label">vándor</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-num" id="stat-countries">–</span>
            <span className="stat-pill-label">ország</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-num" id="stat-continents">–</span>
            <span className="stat-pill-label">kontinens</span>
          </div>
        </div>

        <a href="/terkep" className="cta-btn">
          🗺️ Tüzd fel magad a térképre
        </a>
        <span className="cta-sub">Ingyenes · Névtelen · Bármikor törölhető</span>

        <div className="pin-types">
          <div className="pin-type"><div className="pin-dot pin-dot--red"></div> Kint élek</div>
          <div className="pin-type"><div className="pin-dot pin-dot--yellow"></div> Kijárok dolgozni</div>
          <div className="pin-type"><div className="pin-dot pin-dot--green"></div> Készülök kimenni</div>
        </div>
      </div>

      <div className="sep"></div>

      <section id="about">
        <div className="section-label">Rólunk</div>
        <h2 className="section-title">Miért csináljuk ezt?</h2>
        <div className="section-divider"></div>
        <p className="section-text">
          Évszázadok óta mennek el erdélyiek a nagyvilágba — <strong>munkáért, jövőért, kalandért.</strong>
          De sosem tudtuk pontosan: hányan vagyunk, és hol. Ez a térkép erre a kérdésre próbál választ adni.
        </p>
        <p className="section-text">
          Nem statisztika. Nem kutatás. Csak egy közösség, amely megmutatja magát — <strong>pontról pontra, városról városra, kontinensről kontinensre.</strong>
        </p>
        <p className="section-text">
          Ez egy <strong>ingyenes, nonprofit projekt.</strong> Senki nem keres rajta semmit. Nincs mögötte cég vagy szponzor — csak erdélyiek, akik szeretnék látni: hányan vagyunk a világban.
        </p>
        <div className="cards">
          <div className="card">
            <div className="card-icon">🔒</div>
            <div className="card-title">Adatvédelem</div>
            <div className="card-text">A neved sosem jelenik meg a térképen. A koordinátákat 11 km-es pontossággal tároljuk. Bármikor törölheted a pinedet.</div>
          </div>
          <div className="card">
            <div className="card-icon">🌍</div>
            <div className="card-title">Közösség</div>
            <div className="card-text">A térkép mögött egy aktív Facebook csoport áll. Csatlakozz te is — ismerős arcokat találhatsz.</div>
          </div>
          <div className="card">
            <div className="card-icon">⛪</div>
            <div className="card-title">Gyökereink</div>
            <div className="card-text">A térkép középpontja Csíksomlyó — ahonnan mindannyian indultunk, bárhol legyünk is ma a világban.</div>
          </div>
        </div>
      </section>

      <div className="sep"></div>

      <section id="contact">
        <div className="section-label">Kapcsolat</div>
        <h2 className="section-title">Találj meg minket</h2>
        <div className="section-divider"></div>
        <div className="contact-box">
          <p>Van kérdésed, ötleted vagy csatlakoznál a közösséghez?<br/>Legegyszerűbben a Facebook csoporton keresztül érhetsz el minket.</p>
          <a href="https://www.facebook.com/groups/963074126669000" target="_blank" rel="noopener" className="btn-fb">
            📘 Facebook csoport
          </a>
          <a href="/terkep" className="btn-outline">
            🗺️ Térkép alkalmazás
          </a>
        </div>
      </section>

      <footer>
        <p>© 2026 Merre vagy, vándor? · <a href="/terkep">Térkép app</a> · <a href="/rolunk">Rólunk</a> · <a href="/adatvedelem">Adatvédelem</a></p>
        <p style={{ marginTop: 6, fontSize: 11 }}>A projekt üzemeltetője az <strong style={{ color: 'var(--gold-dim)' }}>Erdélyi Vándor Baráti Társaság</strong> <span style={{ opacity: 0.6 }}>(alapítás alatt)</span></p>
      </footer>

      <script dangerouslySetInnerHTML={{__html: `
        async function loadStats() {
          try {
            const res = await fetch('/api/pins')
            const data = await res.json()
            const total = data.features?.length || 0
            const countries = new Set(data.features?.map(f => f.properties.country)).size
            const eu = ['United Kingdom','Germany','France','Italy','Spain','Netherlands','Belgium','Switzerland','Sweden','Norway','Denmark','Finland','Poland','Austria','Romania','Hungary','Czech Republic','Slovakia','Serbia','Croatia','Ireland','Portugal','Greece','Ukraine','Russia','Bulgaria','Slovenia','Estonia','Latvia','Lithuania','Moldova','Bosnia and Herzegovina','North Macedonia','Albania','Montenegro','Kosovo','Iceland','Luxembourg']
            const am = ['United States','Canada','Mexico','Brazil','Argentina','Colombia','Chile','Peru','Venezuela']
            const as = ['China','Japan','India','Israel','Turkey','Saudi Arabia','Iran','South Korea','Singapore','Thailand','Vietnam','Indonesia','Malaysia','United Arab Emirates']
            const au = ['Australia','New Zealand']
            const af = ['South Africa','Egypt','Morocco','Nigeria','Kenya','Ethiopia']
            const continentNames = new Set()
            data.features?.forEach(f => {
              const c = f.properties.country
              if (eu.includes(c)) continentNames.add('Európa')
              else if (am.includes(c)) continentNames.add('Amerika')
              else if (as.includes(c)) continentNames.add('Ázsia')
              else if (au.includes(c)) continentNames.add('Ausztrália')
              else if (af.includes(c)) continentNames.add('Afrika')
              else continentNames.add('Egyéb')
            })
            document.getElementById('stat-total').textContent = total
            document.getElementById('stat-countries').textContent = countries
            document.getElementById('stat-continents').textContent = continentNames.size
          } catch(e) {}
        }
        loadStats()
      `}} />
    </>
  )
}
