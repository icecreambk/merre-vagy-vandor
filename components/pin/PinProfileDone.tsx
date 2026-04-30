'use client'

const FB_GROUP_URL = 'https://www.facebook.com/groups/963074126669000'

interface PinProfileDoneProps {
  onClose: () => void
}

export default function PinProfileDone({ onClose }: PinProfileDoneProps) {
  return (
    <div className="pin-form">
      <div className="pin-success-icon">🙏</div>
      <h2 className="pin-form-title">Köszönjük, vándor!</h2>
      <p className="pin-form-subtitle">
        Ezzel <strong>megalapoztad a projekt fenntartását</strong>. A válaszaid biztonságos,
        lezárt adatbázisba kerültek — sosem adjuk át őket harmadik félnek.
      </p>

      <div className="success-community-box">
        <p className="success-community-text" style={{ marginBottom: 12 }}>
          🎁 <strong>Bekerültél a havi sorsolásba</strong> (ha bepipáltad).
          Az eredményt emailen küldjük értesítés formájában.
        </p>
        <p className="success-community-text">
          Találkozzunk a közösségben:
        </p>
        <a
          href={FB_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-fb"
        >
          👥 Csatlakozz a Facebook csoporthoz
        </a>
      </div>

      <button className="btn-secondary" onClick={onClose} style={{ width: '100%', marginTop: 12 }}>
        Vissza a térképre
      </button>
    </div>
  )
}
