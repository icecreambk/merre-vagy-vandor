'use client'

const FB_GROUP_URL = 'https://www.facebook.com/groups/963074126669000'

interface PinSuccessProps {
  city: string
  removalToken: string
  onClose: () => void
}

export default function PinSuccess({ city, removalToken, onClose }: PinSuccessProps) {
  const copyToken = () => {
    navigator.clipboard.writeText(removalToken)
  }

  const shareText = encodeURIComponent(
    `Feltettem a jelölőmet a térképre! Erdélyi magyarként ${city}-ban/-ben élek. Te hol vagy, vándor? 📍`
  )
  const shareUrl = encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`

  return (
    <div className="pin-form">
      <div className="pin-success-icon">✓</div>
      <h2 className="pin-form-title">Felkerültél a térképre!</h2>
      <p className="pin-form-subtitle">
        Köszönjük, vándor. A jelölőd most ott van a világtérképen: <strong>{city}</strong>
      </p>

      {/* Community CTA */}
      <div className="success-community-box">
        <p className="success-community-text">
          Csatlakozz a közösséghez — erdélyiek a világ minden sarkából.
          Megismerheted a többi vándort, megoszhatod a történetedet.
        </p>
        <a
          href={FB_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-fb"
        >
          👥 Csatlakozz a Facebook csoporthoz
        </a>
        <a
          href={fbShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-fb-share"
        >
          📤 Oszd meg a térképet
        </a>
      </div>

      {/* Removal token */}
      <div className="removal-token-box">
        <p className="removal-token-label">Törlési kód (mentsd el!):</p>
        <div className="removal-token-value">
          <code>{removalToken}</code>
          <button onClick={copyToken} className="copy-btn" title="Másolás">📋</button>
        </div>
        <small>Ezzel a kóddal törölheted a jelölődet bármikor</small>
      </div>

      <button className="btn-secondary" onClick={onClose} style={{ width: '100%' }}>
        Vissza a térképre
      </button>
    </div>
  )
}
