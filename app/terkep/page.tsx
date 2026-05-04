'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import TitleOverlay from '@/components/overlays/TitleOverlay'
import StatsOverlay from '@/components/overlays/StatsOverlay'
import PinForm from '@/components/pin/PinForm'
import PinSuccess from '@/components/pin/PinSuccess'
import PinProfileForm from '@/components/pin/PinProfileForm'
import PinProfileDone from '@/components/pin/PinProfileDone'
import Leaderboard from '@/components/overlays/Leaderboard'
import AboutOverlay from '@/components/overlays/AboutOverlay'
import StatsPanel from '@/components/overlays/StatsPanel'
import type { PinGeoJSON } from '@/types'

// Mapbox must not run on server
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => <div className="map-loading"><div className="spinner" /></div>,
})

type UIState = 'idle' | 'placing' | 'success' | 'profile' | 'profile_done'

export default function HomePage() {
  const [pinsData, setPinsData] = useState<PinGeoJSON | null>(null)
  const [uiState, setUiState] = useState<UIState>('idle')
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [successData, setSuccessData] = useState<{ token: string; city: string; pinId: string } | null>(null)
  const [stats, setStats] = useState({ total: 0, countries: 0 })
  const [hint, setHint] = useState(false)
  const [visitorMode, setVisitorMode] = useState(false)

  const fetchPins = useCallback(async () => {
    try {
      const res = await fetch('/api/pins')
      const data: PinGeoJSON = await res.json()
      setPinsData(data)

      // Compute stats from geojson
      const total = data.features.length
      const countries = new Set(data.features.map((f) => f.properties.country)).size
      setStats({ total, countries })
    } catch (err) {
      console.error('Failed to fetch pins:', err)
    }
  }, [])

  useEffect(() => {
    fetchPins()
    // Show click hint after 2s
    const t = setTimeout(() => setHint(true), 2000)
    return () => clearTimeout(t)
  }, [fetchPins])

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (uiState !== 'idle') return
    if (visitorMode) return // látogató módban nem nyílik meg a form
    setClickedCoords({ lat, lng })
    setUiState('placing')
    setHint(false)
  }, [uiState, visitorMode])

  const handlePinSuccess = useCallback((removalToken: string, city: string, pinId: string) => {
    setSuccessData({ token: removalToken, city, pinId })
    setUiState('success')
    fetchPins() // Refresh pins
  }, [fetchPins])

  const handleStartProfile = useCallback(() => {
    setUiState('profile')
  }, [])

  const handleProfileComplete = useCallback(() => {
    setUiState('profile_done')
  }, [])

  const handleProfileSkip = useCallback(() => {
    setUiState('idle')
    setClickedCoords(null)
    setSuccessData(null)
  }, [])

  const handleClose = useCallback(() => {
    setUiState('idle')
    setClickedCoords(null)
    setSuccessData(null)
  }, [])

  return (
    <main className="app-container">
      {/* Full-screen map */}
      <MapComponent
        onMapClick={handleMapClick}
        pinsData={pinsData || undefined}
      />

      {/* Title top-left */}
      <TitleOverlay />

      {/* Stats bottom-left */}
      {stats.total > 0 && (
        <StatsOverlay total={stats.total} countries={stats.countries} />
      )}

      {/* Leaderboard top-right */}
      <Leaderboard pinsData={pinsData} />

      {/* Map legend */}
      <div className="map-legend">
        <div className="map-legend-item">
          <div className="map-legend-dot map-legend-dot--red" />
          <span>Kint él</span>
        </div>
        <div className="map-legend-item">
          <div className="map-legend-dot map-legend-dot--yellow" />
          <span>Kijár dolgozni</span>
        </div>
        <div className="map-legend-item">
          <div className="map-legend-dot map-legend-dot--green" />
          <span>Készül kimenni</span>
        </div>
      </div>

      {/* Powered by */}
      <div className="powered-by">
        <a href="/" style={{ color: 'rgba(232,197,71,0.7)', textDecoration: 'none', marginRight: 6 }}>
          Főoldal
        </a>
        ·{' '}
        <a href="/rolunk" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(232,197,71,0.7)', textDecoration: 'none', marginLeft: 6, marginRight: 6 }}>
          Rólunk
        </a>
        ·{' '}
        <a href="/adatvedelem" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(232,197,71,0.7)', textDecoration: 'none', marginLeft: 6, marginRight: 6 }}>
          Adatvédelem
        </a>
        <br />
        <span style={{ fontSize: 10, opacity: 0.7 }}>
          Üzemeltető: Erdélyi Vándor Baráti Társaság (alapítás alatt) · 2026
        </span>
      </div>

      {/* About button + panel */}
      <AboutOverlay />

      {/* Statisztika panel + FB megosztás */}
      {uiState === 'idle' && (
        <StatsPanel pinsData={pinsData} />
      )}

      {/* Click hint */}
      {hint && uiState === 'idle' && !visitorMode && (
        <div className="hint-overlay">
          <span>👆 Kattints a térképre a jelölőd elhelyezéséhez</span>
          <button
            className="hint-visitor-btn"
            onClick={() => { setVisitorMode(true); setHint(false) }}
          >
            Csak megnézem →
          </button>
        </div>
      )}

      {/* Látogató mód jelzés */}
      {visitorMode && uiState === 'idle' && (
        <div className="visitor-banner">
          <span>👁 Nézelődő módban vagy</span>
          <button
            className="visitor-banner-btn"
            onClick={() => setVisitorMode(false)}
          >
            Felrakom magam is
          </button>
        </div>
      )}

      {/* Pin form modal */}
      {uiState === 'placing' && clickedCoords && (
        <div className="modal-backdrop">
          <PinForm
            lat={clickedCoords.lat}
            lng={clickedCoords.lng}
            onSuccess={handlePinSuccess}
            onCancel={handleClose}
          />
        </div>
      )}

      {/* Success modal — pin felkerült + sweepstakes inducement */}
      {uiState === 'success' && successData && (
        <div className="modal-backdrop">
          <PinSuccess
            city={successData.city}
            removalToken={successData.token}
            pinId={successData.pinId}
            onStartProfile={handleStartProfile}
            onClose={handleClose}
          />
        </div>
      )}

      {/* Profile (Form 2) — sponsor-relevant survey */}
      {uiState === 'profile' && successData && (
        <div className="modal-backdrop">
          <PinProfileForm
            pinId={successData.pinId}
            removalToken={successData.token}
            onComplete={handleProfileComplete}
            onSkip={handleProfileSkip}
          />
        </div>
      )}

      {/* Profile complete — thank-you screen */}
      {uiState === 'profile_done' && (
        <div className="modal-backdrop">
          <PinProfileDone onClose={handleClose} />
        </div>
      )}
    </main>
  )
}
