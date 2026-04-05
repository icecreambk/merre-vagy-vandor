export type PinType = 'living' | 'commuter' | 'planning'

export interface Pin {
  id: string
  name: string
  city: string
  country: string
  lat_rounded: number
  lng_rounded: number
  created_at: string
  pin_type: PinType
}

export interface PinInput {
  name: string
  email?: string
  city: string
  country: string
  lat: number
  lng: number
  pin_type: PinType
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
      name: string
      city: string
      country: string
    }
  }>
}

export interface StatsData {
  total: number
  countries: number
  today: number
}
