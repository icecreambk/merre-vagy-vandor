'use client'

import { useState } from 'react'
import { getContinent } from '@/lib/utils/continent'
import type { PinGeoJSON } from '@/types'

interface StatsPanelProps {
  pinsData: PinGeoJSON | null
}

export default function StatsPanel({ pinsData }: StatsPanelProps) {
  const [open, setOpen] = useState(false)

  if (!pinsData || pinsData.features.length === 0) return null

  const total = pinsData.features.length
  const living = pinsData.features.filter(f => f.properties.pin_type === 'living').length
  const commuter = pinsData.features.filter(f => f.properties.pin_type === 'commuter').length
  const planning = pinsData.features.filter(f => f.properties.pin_type === 'planning').length

  const countries = new Set(pinsData.features.map(f => f.properties.country)).size

  const continentCount: Record<string, number> = {}
  for (const f of pinsData.features) {
    const c = getContinent(f.properties.country)
    continentCount[c] = (continentCount[c] || 0) + 1
  }
  const continents = Object.entries(continentCount)
    .sort((a, b) => b[1] - a[1])

  const fbText = encodeURIComponent(
    `🌍 Merre vagy, vándor? – Erdélyi közösségi térkép\n\n` +
    `📊 Jelenlegi állás:\n` +
    `👥 ${total} vándor a világban\n` +
    `🚩 ${living} kint él\n` +
    `🟡 ${commuter} kijár dolgozni\n` +
    `🟢 ${planning} készül kimenni\n` +
    `🌐 ${countries} országból\n\n` +
    `Te hol vagy? Tedd fel a jelölődet!\n` +
    `👉 https://merre-vagy-vandor.vercel.app`
  )
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://merre-vagy-vandor.vercel.app&quote=${fbText}`

  return (
    <>
      {/* Gomb */}
      <button
        className="stats-panel-btn"
        onClick={() => setOpen(true)}
        aria-label="Hányan vagyunk?"
      >
        📊 Hányan vagyunk?
      </button>

      {/* Panel */}
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="stats-panel" onClick={e => e.stopPropagation()}>
            <button className="pin-form-close" onClick={() => setOpen(false)}>×</button>

            <div className="stats-panel-icon">🌍</div>
            <h2 className="stats-panel-title">Merre vagy, vándor?</h2>
            <p className="stats-panel-sub">Erdélyi jelenlét a világban</p>

            {/* Fő szám */}
            <div className="stats-panel-total">
              <span className="stats-panel-total-num">{total}</span>
              <span className="stats-panel-total-label">vándor a világban</span>
            </div>

            {/* Pin típusok */}
            <div className="stats-panel-types">
              <div className="stats-panel-type">
                <span className="spt-dot spt-dot--red" />
                <span className="spt-label">Kint él</span>
                <span className="spt-value">{living}</span>
              </div>
              <div className="stats-panel-type">
                <span className="spt-dot spt-dot--yellow" />
                <span className="spt-label">Kijár dolgozni</span>
                <span className="spt-value">{commuter}</span>
              </div>
              <div className="stats-panel-type">
                <span className="spt-dot spt-dot--green" />
                <span className="spt-label">Készül kimenni</span>
                <span className="spt-value">{planning}</span>
              </div>
            </div>

            {/* Kontinensek */}
            {continents.length > 0 && (
              <div className="stats-panel-continents">
                <div className="spc-title">{countries} ország, {continents.length} kontinens</div>
                {continents.map(([name, count]) => (
                  <div key={name} className="spc-row">
                    <span className="spc-name">{name}</span>
                    <span className="spc-count">{count} fő</span>
                  </div>
                ))}
              </div>
            )}

            {/* FB megosztás */}
            <a
              href={fbShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fb"
              style={{ marginTop: 20 }}
            >
              📢 Oszd meg Facebookon!
            </a>
            <p className="stats-panel-hint">
              Segíts hogy minél többen megtalálják a térképet!
            </p>
          </div>
        </div>
      )}
    </>
  )
}
