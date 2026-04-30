'use client'

const FB_GROUP_URL = 'https://www.facebook.com/groups/963074126669000'

interface PinSuccessProps {
  city: string
  removalToken: string
  pinId: string
  onStartProfile: () => void
  onClose: () => void
}

export default function PinSuccess({
  city,
  removalToken,
  pinId,
  onStartProfile,
  onClose,
}: PinSuccessProps) {
  void pinId // pinId is used by parent to wire up profile flow; kept here for future use
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

      {/* === Form 2 — Sweepstakes / sponsor survey ASK (the big new CTA) === */}
      <div className="success-sweepstakes-box">
        <div className="success-sweepstakes-header">
          <span className="success-sweepstakes-emoji">🎁</span>
          <h3 className="success-sweepstakes-title">Vegyél részt a havi sorsolásban!</h3>
        </div>
        <p className="success-sweepstakes-text">
          Ha most rászánsz <strong>1 percet</strong> és válaszolsz pár kérdésre, automatikusan
          bekerülsz a havi sorsolásba — egy szerencsés kitöltőnek <strong>partnerajánlat-kupont
          sorsolunk ki</strong> (pl. WizzAir kedvezmény, Volánbusz utalvány).
        </p>
        <p className="success-sweepstakes-subtext">
          Egyúttal segítesz nekünk a projekt fenntartásában — ezekből az adatokból tudunk olyan
          ajánlatokat találni, amik <strong>tényleg az erdélyi közösségnek szólnak</strong>.
        </p>
        <button
          className="btn-primary success-sweepstakes-btn"
          onClick={onStartProfile}
        >
          🎯 Folytatom — 1 perc
        </button>
        <button
          className="success-sweepstakes-skip"
          onClick={onClose}
        >
          Inkább most kihagyom
        </button>
      </div>

      {/* Community CTA */}
      <div className="success-community-box">
        <p className="success-community-text">
          Csatlakozz a közösséghez — erdélyiek a világ minden sarkából.
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
    </div>
  )
}
