'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import TitleOverlay from '@/components/overlays/TitleOverlay'
import StatsOverlay from '@/components/overlays/StatsOverlay'
import PinForm from '@/components/pin/PinForm'
import PinSuccess from '@/components/pin/PinSuccess'
import Leaderboard from '@/components/overlays/Leaderboard'
import AboutOverlay from '@/components/overlays/AboutOverlay'
import type { PinGeoJSON } from '@/types'

// Mapbox must not run on server
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => <div className="map-loading"><div className="spinner" /></div>,
})

type UIState = 'idle' | 'placing' | 'success'

export default function HomePage() {
  const [pinsData, setPinsData] = useState<PinGeoJSON | null>(null)
  const [uiState, setUiState] = useState<UIState>('idle')
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [successData, setSuccessData] = useState<{ token: string; city: string } | null>(null)
  const [stats, setStats] = useState({ total: 0, countries: 0 })
  const [hint, setHint] = useState(false)

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
    setClickedCoords({ lat, lng })
    setUiState('placing')
    setHint(false)
  }, [uiState])

  const handlePinSuccess = useCallback((removalToken: string, city: string) => {
    setSuccessData({ token: removalToken, city })
    setUiState('success')
    fetchPins() // Refresh pins
  }, [fetchPins])

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
        Powered by Kobori AI Systems · London 2026
      </div>

      {/* About button + panel */}
      <AboutOverlay />

      {/* Click hint */}
      {hint && uiState === 'idle' && (
        <div className="hint-overlay">
          👆 Kattints a térképre a jelölőd elhelyezéséhez
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

      {/* Success modal */}
      {uiState === 'success' && successData && (
        <div className="modal-backdrop">
          <PinSuccess
            city={successData.city}
            removalToken={successData.token}
            onClose={handleClose}
          />
        </div>
      )}
    </main>
  )
}
