'use client'

import { useState } from 'react'
import {
  COUNTY_OPTIONS,
  FAMILY_REMAINED_OPTIONS,
  TRAVEL_FREQUENCY_OPTIONS,
  TRAVEL_MODE_OPTIONS,
  REMITTANCE_FREQUENCY_OPTIONS,
  RELOCATION_PLAN_OPTIONS,
  AGE_RANGE_OPTIONS,
  OCCUPATION_CATEGORY_OPTIONS,
  ACQUISITION_SOURCE_OPTIONS,
  type CountyValue,
  type FamilyRemainedValue,
  type TravelFrequencyValue,
  type TravelModeValue,
  type RemittanceFrequencyValue,
  type RelocationPlanValue,
  type AgeRangeValue,
  type OccupationCategoryValue,
  type AcquisitionSourceValue,
} from '@/types'

interface PinProfileFormProps {
  pinId: string
  removalToken: string
  onComplete: () => void
  onSkip: () => void
}

type Section = 1 | 2 | 3 | 4

export default function PinProfileForm({
  pinId,
  removalToken,
  onComplete,
  onSkip,
}: PinProfileFormProps) {
  const [section, setSection] = useState<Section>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 1/4 — Roots
  const [originTown, setOriginTown] = useState('')
  const [county, setCounty] = useState<CountyValue | ''>('')
  const [familyRemained, setFamilyRemained] = useState<FamilyRemainedValue | ''>('')

  // 2/4 — Travel
  const [travelFrequency, setTravelFrequency] = useState<TravelFrequencyValue | ''>('')
  const [travelMode, setTravelMode] = useState<TravelModeValue | ''>('')

  // 3/4 — Money & plans
  const [remittanceFrequency, setRemittanceFrequency] = useState<RemittanceFrequencyValue | ''>('')
  const [relocationPlan, setRelocationPlan] = useState<RelocationPlanValue | ''>('')

  // 4/4 — You
  const [ageRange, setAgeRange] = useState<AgeRangeValue | ''>('')
  const [occupationCategory, setOccupationCategory] = useState<OccupationCategoryValue | ''>('')
  const [acquisitionSource, setAcquisitionSource] = useState<AcquisitionSourceValue | ''>('')

  // Final consents
  const [consentSponsorOffers, setConsentSponsorOffers] = useState(false)
  const [consentSweepstakes, setConsentSweepstakes] = useState(false)

  const buildPayload = (completionStep: number) => ({
    removal_token: removalToken,
    origin_town: originTown.trim() || undefined,
    county: county || undefined,
    family_remained: familyRemained || undefined,
    travel_frequency: travelFrequency || undefined,
    travel_mode: travelMode || undefined,
    remittance_frequency: remittanceFrequency || undefined,
    relocation_plan: relocationPlan || undefined,
    age_range: ageRange || undefined,
    occupation_category: occupationCategory || undefined,
    acquisition_source: acquisitionSource || undefined,
    consent_sponsor_offers: consentSponsorOffers,
    consent_sweepstakes: consentSweepstakes,
    completion_step: completionStep,
  })

  const saveProgress = async (completionStep: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/pins/${pinId}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(completionStep)),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Mentés sikertelen, próbáld újra.')
        return false
      }
      setError('')
      return true
    } catch {
      setError('Hálózati hiba, próbáld újra.')
      return false
    }
  }

  const goNext = async () => {
    setSubmitting(true)
    const ok = await saveProgress(section)
    setSubmitting(false)
    if (ok && section < 4) {
      setSection((section + 1) as Section)
    }
  }

  const handleFinalSubmit = async () => {
    setSubmitting(true)
    const ok = await saveProgress(4)
    setSubmitting(false)
    if (ok) onComplete()
  }

  const handleEarlyExit = async () => {
    // Save whatever they have so far before closing
    setSubmitting(true)
    await saveProgress(section)
    setSubmitting(false)
    onSkip()
  }

  return (
    <div className="pin-form pin-profile-form">
      <button
        className="pin-form-close"
        onClick={handleEarlyExit}
        aria-label="Bezárás (eddigi válaszaim mentve)"
        title="Bezárás — eddigi válaszaim mentve maradnak"
      >
        ×
      </button>

      {/* Progress bar */}
      <div className="profile-progress">
        <div className="profile-progress-track">
          <div
            className="profile-progress-fill"
            style={{ width: `${(section / 4) * 100}%` }}
          />
        </div>
        <p className="profile-progress-label">
          {section}/4
        </p>
      </div>

      {/* === Section 1/4 — Gyökerek === */}
      {section === 1 && (
        <>
          <h2 className="profile-section-title">🌳 A gyökereid</h2>
          <p className="profile-section-intro">
            Hogy értsük honnan indultál — ezzel olyan régiós ajánlatokat tudunk hozni, amik tényleg neked szólnak.
          </p>

          <div className="field-group">
            <label htmlFor="originTown">
              Erdélyi szülőhely / település <span className="field-hint">(opcionális)</span>
            </label>
            <input
              id="originTown"
              type="text"
              value={originTown}
              onChange={(e) => setOriginTown(e.target.value)}
              placeholder="pl. Székelyudvarhely"
              maxLength={120}
            />
          </div>

          <div className="field-group">
            <label htmlFor="county">Melyik megyéből származol?</label>
            <select
              id="county"
              value={county}
              onChange={(e) => setCounty(e.target.value as CountyValue)}
              className="profile-select"
            >
              <option value="">— Válassz —</option>
              {COUNTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label>Maradt családod kint Erdélyben?</label>
            <div className="profile-radio-group">
              {FAMILY_REMAINED_OPTIONS.map((opt) => (
                <label key={opt.value} className="profile-radio">
                  <input
                    type="radio"
                    name="familyRemained"
                    value={opt.value}
                    checked={familyRemained === opt.value}
                    onChange={() => setFamilyRemained(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* === Section 2/4 — Hazautazás === */}
      {section === 2 && (
        <>
          <h2 className="profile-section-title">✈️ Hazautazás</h2>
          <p className="profile-section-intro">
            Pár szempont arról, hogyan szoktál hazajönni — ezzel pontos utazási kedvezményeket tudunk találni.
          </p>

          <div className="field-group">
            <label>Hányszor jutsz haza évente?</label>
            <div className="profile-radio-group">
              {TRAVEL_FREQUENCY_OPTIONS.map((opt) => (
                <label key={opt.value} className="profile-radio">
                  <input
                    type="radio"
                    name="travelFrequency"
                    value={opt.value}
                    checked={travelFrequency === opt.value}
                    onChange={() => setTravelFrequency(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label>Mivel utazol leggyakrabban?</label>
            <div className="profile-radio-group">
              {TRAVEL_MODE_OPTIONS.map((opt) => (
                <label key={opt.value} className="profile-radio">
                  <input
                    type="radio"
                    name="travelMode"
                    value={opt.value}
                    checked={travelMode === opt.value}
                    onChange={() => setTravelMode(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* === Section 3/4 — Pénz és tervek === */}
      {section === 3 && (
        <>
          <h2 className="profile-section-title">💸 Pénz és tervek</h2>
          <p className="profile-section-intro">
            Ezek segítenek a banki és költöztető partnereinknek olyan ajánlatokat találni, amik valóban segítenek.
          </p>

          <div className="field-group">
            <label>Küldesz haza pénzt?</label>
            <div className="profile-radio-group">
              {REMITTANCE_FREQUENCY_OPTIONS.map((opt) => (
                <label key={opt.value} className="profile-radio">
                  <input
                    type="radio"
                    name="remittanceFrequency"
                    value={opt.value}
                    checked={remittanceFrequency === opt.value}
                    onChange={() => setRemittanceFrequency(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label>Tervezel hazaköltözést a következő években?</label>
            <div className="profile-radio-group">
              {RELOCATION_PLAN_OPTIONS.map((opt) => (
                <label key={opt.value} className="profile-radio">
                  <input
                    type="radio"
                    name="relocationPlan"
                    value={opt.value}
                    checked={relocationPlan === opt.value}
                    onChange={() => setRelocationPlan(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* === Section 4/4 — Te === */}
      {section === 4 && (
        <>
          <h2 className="profile-section-title">👤 Te</h2>
          <p className="profile-section-intro">
            Hogy a partnereink olyan ajánlatokat válogassanak, amik életkor- és pályakör-szempontból illenek rád.
          </p>

          <div className="field-group">
            <label htmlFor="ageRange">Életkor-tartomány</label>
            <select
              id="ageRange"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value as AgeRangeValue)}
              className="profile-select"
            >
              <option value="">— Válassz —</option>
              {AGE_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="occupationCategory">Foglalkozási terület</label>
            <select
              id="occupationCategory"
              value={occupationCategory}
              onChange={(e) => setOccupationCategory(e.target.value as OccupationCategoryValue)}
              className="profile-select"
            >
              <option value="">— Válassz —</option>
              {OCCUPATION_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="acquisitionSource">Honnan ismerted meg a projektet?</label>
            <select
              id="acquisitionSource"
              value={acquisitionSource}
              onChange={(e) => setAcquisitionSource(e.target.value as AcquisitionSourceValue)}
              className="profile-select"
            >
              <option value="">— Válassz —</option>
              {ACQUISITION_SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Sweepstakes consent — the big incentive */}
          <label className="pin-form-consent profile-sweepstakes">
            <input
              type="checkbox"
              checked={consentSweepstakes}
              onChange={(e) => setConsentSweepstakes(e.target.checked)}
            />
            <span>
              <strong>🎁 Igen, szeretnék részt venni a havi sorsolásban</strong> — egy szerencsés kitöltőnek partnerajánlat-kupont sorsolunk ki (pl. WizzAir kedvezmény, Volánbusz utalvány). A sorsolási szabályzatot az adatvédelmi tájékoztatóban érheted el.
            </span>
          </label>

          {/* Sponsor consent — separate, optional */}
          <label className="pin-form-consent pin-form-consent--optional">
            <input
              type="checkbox"
              checked={consentSponsorOffers}
              onChange={(e) => setConsentSponsorOffers(e.target.checked)}
            />
            <span>
              <strong>(opcionális)</strong> Szeretnék néha értesülni az erdélyi közösségnek
              szóló partnerajánlatokról (utazás, pénzküldés, biztosítás). Évente max 4–5 email,
              bármikor visszavonható egy kattintással. <em>Az emailedet sosem adjuk át a partnernek.</em>
            </span>
          </label>
        </>
      )}

      {error && <p className="pin-form-error">{error}</p>}

      {/* Navigation buttons */}
      <div className="pin-form-actions profile-actions">
        {section > 1 && (
          <button
            className="btn-secondary"
            onClick={() => setSection((section - 1) as Section)}
            disabled={submitting}
          >
            ← Vissza
          </button>
        )}
        {section < 4 ? (
          <button
            className="btn-primary"
            onClick={goNext}
            disabled={submitting}
          >
            {submitting ? 'Mentés...' : 'Tovább →'}
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleFinalSubmit}
            disabled={submitting}
          >
            {submitting ? 'Mentés...' : '🙏 Mentés és bezárás'}
          </button>
        )}
      </div>

      <p className="pin-form-privacy">
        🔒 Adataid külön, lezárt adatbázisba kerülnek · Sosem adjuk át a partnereknek · Bármikor törölhető
      </p>
    </div>
  )
}
