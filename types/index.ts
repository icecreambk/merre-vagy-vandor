export type PinType = 'living' | 'commuter' | 'planning'

export interface Pin {
  id: string
  name: string
  nickname?: string | null
  city: string
  country: string
  lat_rounded: number
  lng_rounded: number
  created_at: string
  pin_type: PinType
  origin_city?: string | null
  origin_country?: string | null
  relevant_date?: string | null
  birth_year?: number | null
  education?: string | null
  occupation?: string | null
}

export interface PinInput {
  name?: string
  nickname?: string
  email?: string
  city: string
  country: string
  lat: number
  lng: number
  pin_type: PinType
  origin_city?: string
  origin_country?: string
  relevant_date?: string
  birth_year?: number
  education?: string
  occupation?: string
  consent_marketing?: boolean
}

export interface PinGeoJSON {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    geometry: {
      type: 'Point'
      coordinates: [number, number]
    }
    properties: {
      id: string
      /** Display label on the map — nickname preferred, falls back to 'Vándor'. */
      name: string
      city: string
      country: string
      pin_type: PinType
      origin_city?: string | null
      origin_country?: string | null
    }
  }>
}

export interface StatsData {
  total: number
  countries: number
  today: number
}
