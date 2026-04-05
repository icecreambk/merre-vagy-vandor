'use client'

import { useState, useEffect } from 'react'
import CityAutocomplete from './CityAutocomplete'

interface PinFormProps {
  lat: number
  lng: number
  onSuccess: (removalToken: string, city: string) => void
  onCancel: () => void
}

type Step = 'location' | 'details' | 'submitting'

export default function PinForm({ lat, lng, onSuccess, onCancel }: PinFormProps) {
  const [step, setStep] = useState<Step>('location')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pinType, setPinType] = useState<'living' | 'commuter' | 'planning'>('living')
  const [consent, setConsent] = useState(false)
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
      setError('Kérjük add meg a várost.')
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
          name: name.trim() || 'Vándor',
          email: email.trim(),
          city: city.trim(),
          country: country.trim(),
          lat,
          lng,
          pin_type: pinType,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Hiba történt')
      onSuccess(data.removalToken, city)
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
          <span className="pin-type-desc">Jelenleg külföldön élek</span>
        </button>
        <button
          className={`pin-type-btn ${pinType === 'commuter' ? 'pin-type-btn--active-yellow' : ''}`}
          onClick={() => setPinType('commuter')}
          type="button"
        >
          🟡 Kijárok
          <span className="pin-type-desc">Dolgozni járok ki külföldre</span>
        </button>
        <button
          className={`pin-type-btn ${pinType === 'planning' ? 'pin-type-btn--active-green' : ''}`}
          onClick={() => setPinType('planning')}
          type="button"
        >
          🟢 Készülök
          <span className="pin-type-desc">Tervezem hogy kimegyek</span>
        </button>
      </div>

      {/* Community message */}
      <div className="pin-form-mission">
        <p>
          Ez egy <strong>ingyenes, nonprofit projekt.</strong> Senki nem keres rajta semmit,
          nincs mögötte cég vagy szponzor. Csak erdélyiek, akik szeretnék tudni: hányan vagyunk, és hol.
        </p>
        <p>
          Az email címedet <strong>soha nem adjuk el, és reklámot nem küldünk.</strong> Egyetlen
          célra kérjük: hogy egyszer majd közösségként szólhassunk egymáshoz — amikor eljön az ideje.
        </p>
      </div>

      <div className="pin-form-fields">
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

        <div className="field-group">
          <label htmlFor="name">Neved (nem kötelező)</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="pl. Kovács János"
            maxLength={60}
          />
        </div>

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
      </div>

      {/* Consent checkbox */}
      <label className="pin-form-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          Megértettem, hogy ez egy nonprofit projekt. Az email címemet csak a jelölő
          kezeléséhez és közösségi célokra használják, soha nem adják el harmadik félnek.
        </span>
      </label>

      {error && <p className="pin-form-error">{error}</p>}

      <div className="pin-form-actions">
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={step === 'submitting'}
        >
          {step === 'submitting' ? 'Küldés...' : 'Jelölő elhelyezése'}
        </button>
        <button className="btn-secondary" onClick={onCancel}>
          Mégsem
        </button>
      </div>

      <p className="pin-form-privacy">
        🔒 Jelölőd 30 nap után automatikusan törlődik · Neved sosem jelenik meg a térképen
      </p>
    </div>
  )
}
