'use client'

interface StatsOverlayProps {
  total: number
  countries: number
}

export default function StatsOverlay({ total, countries }: StatsOverlayProps) {
  return (
    <div className="stats-overlay">
      <div className="stat">
        <span className="stat-value">{total.toLocaleString('hu-HU')}</span>
        <span className="stat-label">vándor</span>
      </div>
      <div className="stat-divider" />
      <div className="stat">
        <span className="stat-value">{countries}</span>
        <span className="stat-label">ország</span>
      </div>
    </div>
  )
}
