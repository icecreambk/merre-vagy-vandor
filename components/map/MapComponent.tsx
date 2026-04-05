'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { CSIKSOMLYÓ, MAP_INITIAL_VIEW } from '@/lib/constants'
import type { PinGeoJSON } from '@/types'

interface MapComponentProps {
  onMapClick?: (lat: number, lng: number) => void
  onPinClick?: (city: string, country: string, name: string) => void
  pinsData?: PinGeoJSON
}

const EMPTY: PinGeoJSON = { type: 'FeatureCollection', features: [] }

export default function MapComponent({ onMapClick, onPinClick, pinsData }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const popup = useRef<mapboxgl.Popup | null>(null)
  const isStyleLoaded = useRef(false)

  // Always keep latest callbacks/data in refs so event handlers never go stale
  const onMapClickRef = useRef(onMapClick)
  const onPinClickRef = useRef(onPinClick)
  const pinsDataRef = useRef(pinsData)

  useEffect(() => { onMapClickRef.current = onMapClick }, [onMapClick])
  useEffect(() => { onPinClickRef.current = onPinClick }, [onPinClick])
  useEffect(() => { pinsDataRef.current = pinsData }, [pinsData])

  // Apply pins to the map — works whether source exists or not
  const applyPins = useCallback((data: PinGeoJSON) => {
    const m = map.current
    if (!m || !isStyleLoaded.current) return

    const source = m.getSource('pins') as mapboxgl.GeoJSONSource | undefined
    if (source) {
      source.setData(data)
    } else {
      m.addSource('pins', {
        type: 'geojson',
        data,
        cluster: true,
        clusterMaxZoom: 10,
        clusterRadius: 50,
      })

      m.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'pins',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#e8c547', 10, '#f59e0b', 30, '#ef4444'],
          'circle-radius': ['step', ['get', 'point_count'], 18, 10, 26, 30, 34],
          'circle-opacity': 0.85,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.3,
        },
      })

      m.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'pins',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 13,
        },
        paint: { 'text-color': '#ffffff' },
      })

      // 🔵 living = blue, 🟡 lived = gold
      m.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'pins',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match', ['get', 'pin_type'],
            'living',   '#ef4444',
            'commuter', '#e8c547',
            'planning', '#22c55e',
            '#ef4444'
          ],
          'circle-radius': 7,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.4,
          'circle-opacity': 0.9,
        },
      })

      // Events on layers — added once here
      m.on('click', 'unclustered-point', (e) => {
        if (!e.features?.[0]) return
        const props = e.features[0].properties as { city: string; country: string; name: string; pin_type: string }
        const coords = (e.features[0].geometry as GeoJSON.Point).coordinates as [number, number]
        popup.current?.remove()
        const typeLabel = props.pin_type === 'commuter' ? '🟡 Kijár dolgozni'
          : props.pin_type === 'planning' ? '🟢 Készül kimenni'
          : '🚩 Kint él'
        popup.current = new mapboxgl.Popup({ closeButton: false, closeOnClick: true })
          .setLngLat(coords)
          .setHTML(
            `<div style="color:#1a1a2e;font-family:sans-serif;padding:2px 4px">
              <strong>${props.name}</strong><br/>
              <span style="font-size:12px">${props.city}, ${props.country}</span><br/>
              <span style="font-size:11px;color:#555">${typeLabel}</span>
            </div>`
          )
          .addTo(m)
        onPinClickRef.current?.(props.city, props.country, props.name)
      })

      m.on('click', 'clusters', (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: ['clusters'] })
        const clusterId = features[0].properties?.cluster_id
        const src = m.getSource('pins') as mapboxgl.GeoJSONSource
        src.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return
          const coords = (features[0].geometry as GeoJSON.Point).coordinates as [number, number]
          m.easeTo({ center: coords, zoom: zoom! })
        })
      })

      m.on('mouseenter', 'clusters', () => { m.getCanvas().style.cursor = 'pointer' })
      m.on('mouseleave', 'clusters', () => { m.getCanvas().style.cursor = '' })
      m.on('mouseenter', 'unclustered-point', () => { m.getCanvas().style.cursor = 'pointer' })
      m.on('mouseleave', 'unclustered-point', () => { m.getCanvas().style.cursor = '' })
    }
  }, [])

  // Initialize map — once only
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL || 'mapbox://styles/mapbox/dark-v11',
      center: MAP_INITIAL_VIEW.center,
      zoom: MAP_INITIAL_VIEW.zoom,
      projection: 'globe',
      attributionControl: false,
    })

    map.current = m

    m.on('style.load', () => {
      isStyleLoaded.current = true

      m.setFog({
        color: 'rgb(10, 10, 20)',
        'high-color': 'rgb(20, 20, 40)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(5, 5, 15)',
        'star-intensity': 0.6,
      })

      // Csíksomlyó
      const el = document.createElement('div')
      el.innerHTML = '⛪'
      el.style.cssText = 'font-size: 20px; cursor: pointer; filter: drop-shadow(0 0 6px rgba(232,197,71,0.8));'
      new mapboxgl.Marker({ element: el })
        .setLngLat([CSIKSOMLYÓ.lng, CSIKSOMLYÓ.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Csíksomlyó'))
        .addTo(m)

      // Map click handler
      m.on('click', (e) => {
        const features = m.queryRenderedFeatures(e.point, {
          layers: ['unclustered-point', 'clusters'],
        })
        if (features.length > 0) return
        onMapClickRef.current?.(e.lngLat.lat, e.lngLat.lng)
      })

      // Apply any pins that arrived before the style loaded
      applyPins(pinsDataRef.current || EMPTY)
    })

    return () => {
      m.remove()
      map.current = null
      isStyleLoaded.current = false
    }
  }, [applyPins])

  // Re-apply pins whenever pinsData changes
  useEffect(() => {
    if (!pinsData) return
    applyPins(pinsData)
  }, [pinsData, applyPins])

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
  )
}
