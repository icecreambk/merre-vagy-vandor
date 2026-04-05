'use client'

import { useState } from 'react'

export default function AboutOverlay() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Small "?" button always visible */}
      <button className="about-btn" onClick={() => setOpen(true)} aria-label="A projektről">
        ?
      </button>

      {/* Full about panel */}
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="about-panel" onClick={(e) => e.stopPropagation()}>
            <button className="pin-form-close" onClick={() => setOpen(false)}>×</button>

            <div className="about-icon">🏔️</div>

            <h2 className="about-title">Merre vagy, vándor?</h2>

            <p className="about-lead">
              Elmentünk. De sosem igazán.
            </p>

            <div className="about-body">
              <p>
                Erdélyből milliók indultak útnak — ki munkát keresve, ki jobb életet,
                ki csak azt, hogy holnap is legyen mit enni. Szétszóródtunk a világban,
                egyik napról a másikra lettünk vándorok — Londonban, Berlinben,
                Budapesten, New Yorkban, Torontóban. Bárhol, csak nem otthon.
              </p>
              <p>
                Ez a térkép nem statisztika. Nem politika. Nem panasz.
                Ez egy egyszerű kérdés, amit minden erdélyi érez, ha messze van:
                <strong> „Te hol vagy most, vándor?"</strong>
              </p>
              <p>
                Tedd fel a jelölődet. Mutasd meg, hogy ott vagy.
                Hogy nem tűntél el — csak messzire kerültél.
                Hogy Erdély nem csak egy hely, hanem valami, amit magaddal viszünk.
              </p>
              <p>
                Ez a projekt <strong>teljesen ingyenes és nonprofit.</strong> Senki
                nem keres rajta semmit. Nincs mögötte cég, szponzor, vagy politikai szándék.
                Csak erdélyiek, akik szeretnék tudni: hányan vagyunk, és hol.
              </p>
            </div>

            <div className="about-rules">
              <div className="about-rule">📍 Csak városszintű helyzetet mutatunk — pontos koordinátát nem tárolunk</div>
              <div className="about-rule">⏰ Jelölőd 30 nap után automatikusan törlődik</div>
              <div className="about-rule">🔒 Neved és email-ed soha nem jelenik meg a térképen</div>
              <div className="about-rule">💛 Nem adunk el adatot, nem küldünk reklámot — soha</div>
              <div className="about-rule">🤝 Az email címedet csak arra használjuk, hogy egyszer majd közösségként szólhassunk egymáshoz</div>
            </div>

            <a
              href="https://www.facebook.com/groups/963074126669000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fb"
            >
              👥 Csatlakozz a Facebook csoporthoz
            </a>

            <button className="btn-primary" style={{ marginTop: '10px' }} onClick={() => setOpen(false)}>
              Értem — teszem a jelölőmet
            </button>
          </div>
        </div>
      )}
    </>
  )
}
