'use client'

import { useState, useMemo } from 'react'
import { getContinent } from '@/lib/utils/continent'
import type { PinGeoJSON } from '@/types'

type Tab = 'cities' | 'countries' | 'continents'

interface LeaderboardProps {
  pinsData: PinGeoJSON | null
}

const TAB_LABELS: Record<Tab, string> = {
  cities: 'Városok',
  countries: 'Országok',
  continents: 'Kontinensek',
}

const CONTINENT_FLAGS: Record<string, string> = {
  'Európa': '🌍',
  'Amerika': '🌎',
  'Ázsia': '🌏',
  'Ausztrália': '🦘',
  'Afrika': '🌍',
  'Egyéb': '🌐',
}

export default function Leaderboard({ pinsData }: LeaderboardProps) {
  const [tab, setTab] = useState<Tab>('cities')
  const [collapsed, setCollapsed] = useState(
    typeof window !== 'undefined' && window.innerWidth < 640
  )

  const stats = useMemo(() => {
    if (!pinsData || pinsData.features.length === 0) return null

    const cityCount: Record<string, { count: number; country: string }> = {}
    const countryCount: Record<string, number> = {}
    const continentCount: Record<string, number> = {}

    for (const f of pinsData.features) {
      const { city, country } = f.properties

      // Cities
      const cityKey = `${city}||${country}`
      if (!cityCount[cityKey]) cityCount[cityKey] = { count: 0, country }
      cityCount[cityKey].count++

      // Countries
      if (country) {
        countryCount[country] = (countryCount[country] || 0) + 1
      }

      // Continents
      const continent = getContinent(country)
      continentCount[continent] = (continentCount[continent] || 0) + 1
    }

    const cities = Object.entries(cityCount)
      .map(([key, val]) => ({ name: key.split('||')[0], country: val.country, count: val.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    const countries = Object.entries(countryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    const continents = Object.entries(continentCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return { cities, countries, continents }
  }, [pinsData])

  if (!stats) return null

  const total = pinsData!.features.length
  const maxCount = tab === 'cities'
    ? (stats.cities[0]?.count || 1)
    : tab === 'countries'
    ? (stats.countries[0]?.count || 1)
    : (stats.continents[0]?.count || 1)

  const rows = tab === 'cities' ? stats.cities
    : tab === 'countries' ? stats.countries
    : stats.continents

  return (
    <div className={`leaderboard ${collapsed ? 'leaderboard--collapsed' : ''}`}>
      {/* Header */}
      <div className="lb-header">
        <div className="lb-title-row">
          <span className="lb-title">Vándortérkép</span>
          <button className="lb-collapse" onClick={() => setCollapsed(c => !c)}>
            {collapsed ? '▼' : '▲'}
          </button>
        </div>
        {!collapsed && (
          <div className="lb-total">{total.toLocaleString('hu-HU')} vándor a világban</div>
        )}
      </div>

      {!collapsed && (
        <>
          {/* Tabs */}
          <div className="lb-tabs">
            {(Object.keys(TAB_LABELS) as Tab[]).map(t => (
              <button
                key={t}
                className={`lb-tab ${tab === t ? 'lb-tab--active' : ''}`}
                onClick={() => setTab(t)}
              >
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>

          {/* Rows */}
          <div className="lb-rows">
            {rows.map((row, i) => {
              const pct = Math.round((row.count / maxCount) * 100)
              const flag = tab === 'continents' ? (CONTINENT_FLAGS[row.name] || '🌐') : ''
              return (
                <div key={row.name} className="lb-row">
                  <span className="lb-rank">{i + 1}</span>
                  <div className="lb-info">
                    <div className="lb-name-row">
                      {flag && <span className="lb-flag">{flag}</span>}
                      <span className="lb-name">{row.name}</span>
                      {'country' in row && tab === 'cities' && (
                        <span className="lb-sub">{(row as { country: string }).country}</span>
                      )}
                      <span className="lb-count">{row.count}</span>
                    </div>
                    <div className="lb-bar-bg">
                      <div className="lb-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
