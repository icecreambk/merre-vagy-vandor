'use client'

import { useState, useEffect, useRef } from 'react'

interface Suggestion {
  id: string
  city: string
  country: string
  fullName: string
}

interface CityAutocompleteProps {
  city: string
  country: string
  onSelect: (city: string, country: string) => void
}

export default function CityAutocomplete({ city, country, onSelect }: CityAutocompleteProps) {
  const [query, setQuery] = useState(city)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync if parent city changes (e.g. from reverse geocode)
  useEffect(() => {
    setQuery(city)
  }, [city])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const search = async (value: string) => {
    if (value.length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }

    setLoading(true)
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json` +
        `?types=place,locality&language=hu,en&limit=6&access_token=${token}`
      )
      const data = await res.json()

      const results: Suggestion[] = (data.features || []).map((f: {
        id: string
        text: string
        place_name: string
        context?: { id: string; text: string }[]
      }) => {
        const ctx = f.context || []
        const countryCtx = ctx.find((c) => c.id.startsWith('country'))
        return {
          id: f.id,
          city: f.text,
          country: countryCtx?.text || '',
          fullName: f.place_name,
        }
      })

      setSuggestions(results)
      setOpen(results.length > 0)
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (value: string) => {
    setQuery(value)
    // Notify parent of raw typed city (without country yet)
    onSelect(value, country)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(value), 300)
  }

  const handleSelect = (s: Suggestion) => {
    setQuery(s.city)
    setSuggestions([])
    setOpen(false)
    onSelect(s.city, s.country)
  }

  return (
    <div ref={containerRef} className="autocomplete-wrap">
      <div className="autocomplete-input-wrap">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="pl. London, Kolozsvár, Berlin..."
          maxLength={100}
          autoComplete="off"
        />
        {loading && <div className="autocomplete-spinner" />}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="autocomplete-item"
              onMouseDown={() => handleSelect(s)}
            >
              <span className="autocomplete-city">{s.city}</span>
              {s.country && (
                <span className="autocomplete-country">{s.country}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
