'use client'

import { useState, useEffect } from 'react'
import CityAutocomplete from './CityAutocomplete'

interface PinFormProps {
  lat: number
  lng: number
  onSuccess: (removalToken: string, city: string, pinId: string) => void
  onCancel: () => void
}

type Step = 'location' | 'details' | 'submitting'
type PinType = 'living' | 'commuter' | 'planning'

export default function PinForm({ lat, lng, onSuccess, onCancel }: PinFormProps) {
  const [step, setStep] = useState<Step>('location')

  // Location
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')

  // Identity (slim)
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')

  // Pin type + consents
  const [pinType, setPinType] = useState<PinType>('living')
  const [consent, setConsent] = useState(false)
  const [consentMarketing, setConsentMarketing] = useState(false)

  const [error, setError] = useState('')
  const [loadingCity, setLoadingCity] = useState(false)

  useEffect(() => {
    const fetchLocation = async () => {
      setLoadingCity(true)
      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place,locality,region&access_token=${token}`
        )
        const data = await res.json()
        if (data.features?.length > 0) {
          const feature = data.features[0]
          setCity(feature.text || feature.place_name?.split(',')[0] || '')
          const ctx = feature.context || []
          const countryCtx = ctx.find((c: { id: string; text: string }) => c.id.startsWith('country'))
          setCountry(countryCtx?.text || '')
        }
      } catch {
        // user fills in manually
      } finally {
        setLoadingCity(false)
        setStep('details')
      }
    }
    fetchLocation()
  }, [lat, lng])

  const handleSubmit = async () => {
    if (!city.trim()) {
      setError('Kérjük add meg a várost, ahol most vagy.')
      return
    }
    if (!email.trim()) {
      setError('Az email cím kötelező.')
      return
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!emailValid) {
      setError('Kérjük adj meg érvényes email címet.')
      return
    }
    if (!consent) {
      setError('Kérjük fogadd el az adatkezelési feltételeket.')
      return
    }

    setStep('submitting')
    setError('')

    try {
      const res = await fetch('/api/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim() || undefined,
          email: email.trim(),
          city: city.trim(),
          country: country.trim(),
          lat,
          lng,
          pin_type: pinType,
          consent_marketing: consentMarketing,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Hiba történt')
      onSuccess(data.removalToken, city, data.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt')
      setStep('details')
    }
  }

  if (step === 'location' || loadingCity) {
    return (
      <div className="pin-form">
        <div className="pin-form-loading">
          <div className="spinner" />
          <p>Helyszín azonosítása...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pin-form">
      <button className="pin-form-close" onClick={onCancel} aria-label="Bezárás">×</button>

      <h2 className="pin-form-title">📍 Tedd fel a jelölődet</h2>

      {/* Pin type selector */}
      <div className="pin-type-selector">
        <button
          className={`pin-type-btn ${pinType === 'living' ? 'pin-type-btn--active-red' : ''}`}
          onClick={() => setPinType('living')}
          type="button"
        >
          🚩 Kint élek
        </button>
        <button
          className={`pin-type-btn ${pinType === 'commuter' ? 'pin-type-btn--active-yellow' : ''}`}
          onClick={() => setPinType('commuter')}
          type="button"
        >
          🟡 Kijárok
        </button>
        <button
          className={`pin-type-btn ${pinType === 'planning' ? 'pin-type-btn--active-green' : ''}`}
          onClick={() => setPinType('planning')}
          type="button"
        >
          🟢 Készülök
        </button>
      </div>

      {/* Community message */}
      <div className="pin-form-mission">
        <p>
          <strong>Ingyenes, nonprofit projekt.</strong> Csak erdélyiek, akik szeretnék
          tudni: hányan vagyunk, és hol. Az emailedet <strong>sosem adjuk el</strong>.
        </p>
      </div>

      {/* Location */}
      <div className="field-group">
        <label>Város * <span className="field-hint">(írj be legalább 3 betűt)</span></label>
        <CityAutocomplete
          city={city}
          country={country}
          onSelect={(c, co) => { setCity(c); setCountry(co) }}
        />
      </div>

      <div className="field-group">
        <label htmlFor="country">Ország</label>
        <input
          id="country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="automatikusan kitöltődik"
          maxLength={100}
        />
      </div>

      {/* Email */}
      <div className="field-group">
        <label htmlFor="email">Email cím *</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="pl. janos@email.com"
        />
      </div>

      {/* Nickname (with privacy warning) */}
      <div className="field-group">
        <label htmlFor="nickname">
          Nicknév <span className="field-hint">(opcionális, ez jelenik meg a térképen)</span>
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="pl. Vándor_23"
          maxLength={30}
        />
        <p className="field-warn">⚠ Ne írd be a teljes neved — nyilvánosan látszik a térképen</p>
      </div>

      {/* Consent — data processing (REQUIRED) */}
      <label className="pin-form-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          Elolvastam és elfogadom az{' '}
          <a href="/adatvedelem" target="_blank" rel="noopener noreferrer" className="pin-form-consent-link">
            Adatvédelmi tájékoztatót
          </a>
          . Hozzájárulok, hogy adataimat az <strong>Erdélyi Vándor Baráti Társaság</strong>{' '}
          <span style={{ opacity: 0.7 }}>(alapítás alatt)</span> a jelölő kezelése és közösségi
          célok érdekében feldolgozza. Hozzájárulásomat bármikor visszavonhatom.
        </span>
      </label>

      {/* Consent — marketing (OPTIONAL, separate) */}
      <label className="pin-form-consent pin-form-consent--optional">
        <input
          type="checkbox"
          checked={consentMarketing}
          onChange={(e) => setConsentMarketing(e.target.checked)}
        />
        <span>
          <strong>(opcionális)</strong> Szeretnék ritkán hírlevelet / közösségi értesítést
          kapni a projektről, eseményekről. Bármikor visszavonhatom.
        </span>
      </label>

      {error && <p className="pin-form-error">{error}</p>}

      <div className="pin-form-actions">
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={step === 'submitting'}
        >
          {step === 'submitting' ? 'Küldés...' : '📍 Pin felrakása'}
        </button>
        <button className="btn-secondary" onClick={onCancel}>
          Mégsem
        </button>
      </div>

      <p className="pin-form-privacy">
        🔒 Csak a nicknév látszik a térképen · Bármikor törölheted · ~30 másodperc
      </p>
    </div>
  )
}
