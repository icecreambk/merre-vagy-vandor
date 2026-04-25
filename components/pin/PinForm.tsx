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
type PinType = 'living' | 'commuter' | 'planning'

const CURRENT_YEAR = new Date().getFullYear()

const DATE_LABEL: Record<PinType, { label: string; hint: string }> = {
  living:   { label: 'Mikor mentél ki?',        hint: 'pl. 2018-05' },
  commuter: { label: 'Mióta jársz ki?',         hint: 'pl. 2020-09' },
  planning: { label: 'Mikor tervezel kimenni?', hint: 'pl. 2026-08' },
}

export default function PinForm({ lat, lng, onSuccess, onCancel }: PinFormProps) {
  const [step, setStep] = useState<Step>('location')

  // Location
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')

  // Identity
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')

  // Origin
  const [originCity, setOriginCity] = useState('')
  const [originCountry, setOriginCountry] = useState('Románia')

  // When
  const [relevantDate, setRelevantDate] = useState('')

  // Profile
  const [birthYear, setBirthYear] = useState('')
  const [education, setEducation] = useState('')
  const [occupation, setOccupation] = useState('')

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
    if (birthYear && (Number(birthYear) < 1900 || Number(birthYear) > CURRENT_YEAR)) {
      setError('Érvénytelen születési év.')
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
          name: name.trim() || undefined,
          nickname: nickname.trim() || undefined,
          email: email.trim(),
          city: city.trim(),
          country: country.trim(),
          lat,
          lng,
          pin_type: pinType,
          origin_city: originCity.trim() || undefined,
          origin_country: originCountry.trim() || undefined,
          relevant_date: relevantDate.trim() || undefined,
          birth_year: birthYear ? Number(birthYear) : undefined,
          education: education.trim() || undefined,
          occupation: occupation.trim() || undefined,
          consent_marketing: consentMarketing,
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

      {/* Pin type selector (no descriptions — see Rólunk page) */}
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
          tudni: hányan vagyunk, és hol. Az emailedet <strong>sosem adjuk el</strong>, és
          csak akkor írunk, ha közösségként szólunk — vagy ha te magad kéred.
        </p>
      </div>

      {/* === SECTION: Most hol vagy === */}
      <div className="pin-form-section">
        <h3 className="pin-form-section-title">Hol vagy most?</h3>

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
      </div>

      {/* === SECTION: Honnan === */}
      <div className="pin-form-section">
        <h3 className="pin-form-section-title">Honnan jössz?</h3>

        <div className="field-group">
          <label htmlFor="originCity">Város / település (nem kötelező)</label>
          <input
            id="originCity"
            type="text"
            value={originCity}
            onChange={(e) => setOriginCity(e.target.value)}
            placeholder="pl. Székelyudvarhely"
            maxLength={100}
          />
        </div>

        <div className="field-group">
          <label htmlFor="originCountry">Ország</label>
          <input
            id="originCountry"
            type="text"
            value={originCountry}
            onChange={(e) => setOriginCountry(e.target.value)}
            placeholder="pl. Románia"
            maxLength={100}
          />
        </div>

        <div className="field-group">
          <label htmlFor="relevantDate">
            {DATE_LABEL[pinType].label} <span className="field-hint">(opcionális)</span>
          </label>
          <input
            id="relevantDate"
            type="month"
            value={relevantDate}
            onChange={(e) => setRelevantDate(e.target.value)}
            placeholder={DATE_LABEL[pinType].hint}
          />
        </div>
      </div>

      {/* === SECTION: Rólad === */}
      <div className="pin-form-section">
        <h3 className="pin-form-section-title">Rólad</h3>

        <div className="field-group">
          <label htmlFor="nickname">
            Nicknév <span className="field-hint">(ez jelenik meg a térképen)</span>
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

        <div className="field-group">
          <label htmlFor="name">Neved (nem kötelező, nem jelenik meg a térképen)</label>
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

        <div className="field-row">
          <div className="field-group">
            <label htmlFor="birthYear">Születési év <span className="field-hint">(opcionális)</span></label>
            <input
              id="birthYear"
              type="number"
              min={1900}
              max={CURRENT_YEAR}
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="pl. 1987"
            />
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="education">Végzettség <span className="field-hint">(opcionális)</span></label>
          <input
            id="education"
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="pl. közgazdász, mérnök, szakmunkás"
            maxLength={120}
          />
        </div>

        <div className="field-group">
          <label htmlFor="occupation">Foglalkozás <span className="field-hint">(opcionális)</span></label>
          <input
            id="occupation"
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="pl. szoftverfejlesztő, pincér, ápoló"
            maxLength={120}
          />
        </div>
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
          kapni a projektről, eseményekről, esetleges partnerek ajánlatairól. Ezt külön,
          bármikor visszavonhatom egyetlen kattintással.
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
        🔒 Neved sosem jelenik meg a térképen · Csak a nicknév látható · Bármikor törölheted a jelölődet
      </p>
    </div>
  )
}
