export type PinType = 'living' | 'commuter' | 'planning'

// === Form 1 — Pin (slim, public-facing) ===

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
    }
  }>
}

export interface StatsData {
  total: number
  countries: number
  today: number
}

// === Form 2 — PinProfile (sponsor-relevant survey, locked-down) ===

export type CountyValue =
  | 'hargita' | 'maros' | 'kovaszna' | 'kolozs' | 'szatmar' | 'bihar'
  | 'brasso' | 'beszterce_naszod' | 'feher' | 'szeben' | 'szilagy'
  | 'maramaros' | 'krasso_szoreny' | 'not_transylvania' | 'no_say'

export type FamilyRemainedValue = 'close' | 'distant' | 'none' | 'no_say'

export type TravelFrequencyValue = 'never' | '1-2' | '3-5' | '6+'

export type TravelModeValue = 'flight' | 'car' | 'bus' | 'train' | 'mixed'

export type RemittanceFrequencyValue = 'regular' | 'occasional' | 'no' | 'no_say'

export type RelocationPlanValue = 'soon_1_2' | 'someday' | 'no' | 'unsure'

export type AgeRangeValue = '18-25' | '26-35' | '36-45' | '46-55' | '56+' | 'no_say'

export type OccupationCategoryValue =
  | 'it' | 'health' | 'education' | 'commerce' | 'finance'
  | 'construction' | 'student' | 'other' | 'no_say'

export type AcquisitionSourceValue =
  | 'fb' | 'social' | 'friend' | 'press' | 'aaron' | 'other'

export interface PinProfile {
  pin_id: string
  origin_town?: string | null
  county?: CountyValue | null
  family_remained?: FamilyRemainedValue | null
  travel_frequency?: TravelFrequencyValue | null
  travel_mode?: TravelModeValue | null
  remittance_frequency?: RemittanceFrequencyValue | null
  relocation_plan?: RelocationPlanValue | null
  age_range?: AgeRangeValue | null
  occupation_category?: OccupationCategoryValue | null
  acquisition_source?: AcquisitionSourceValue | null
  consent_sponsor_offers: boolean
  consent_sweepstakes: boolean
  completion_step: number
  created_at: string
  updated_at: string
}

export interface PinProfileInput {
  removal_token: string  // proves ownership of the pin
  origin_town?: string
  county?: CountyValue
  family_remained?: FamilyRemainedValue
  travel_frequency?: TravelFrequencyValue
  travel_mode?: TravelModeValue
  remittance_frequency?: RemittanceFrequencyValue
  relocation_plan?: RelocationPlanValue
  age_range?: AgeRangeValue
  occupation_category?: OccupationCategoryValue
  acquisition_source?: AcquisitionSourceValue
  consent_sponsor_offers?: boolean
  consent_sweepstakes?: boolean
  completion_step?: number
}

// === Hungarian display labels for dropdowns / radio groups ===

export const COUNTY_OPTIONS: Array<{ value: CountyValue; label: string }> = [
  { value: 'hargita', label: 'Hargita' },
  { value: 'maros', label: 'Maros' },
  { value: 'kovaszna', label: 'Kovászna' },
  { value: 'kolozs', label: 'Kolozs' },
  { value: 'szatmar', label: 'Szatmár' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'brasso', label: 'Brassó' },
  { value: 'beszterce_naszod', label: 'Beszterce-Naszód' },
  { value: 'feher', label: 'Fehér' },
  { value: 'szeben', label: 'Szeben' },
  { value: 'szilagy', label: 'Szilágy' },
  { value: 'maramaros', label: 'Máramaros' },
  { value: 'krasso_szoreny', label: 'Krassó-Szörény' },
  { value: 'not_transylvania', label: 'Nem Erdélyből származom' },
  { value: 'no_say', label: 'Inkább nem mondom' },
]

export const FAMILY_REMAINED_OPTIONS: Array<{ value: FamilyRemainedValue; label: string }> = [
  { value: 'close', label: 'Igen, közeli (szülők, testvér, gyerek)' },
  { value: 'distant', label: 'Igen, távolabbi rokonok' },
  { value: 'none', label: 'Nem maradt' },
  { value: 'no_say', label: 'Inkább nem mondom' },
]

export const TRAVEL_FREQUENCY_OPTIONS: Array<{ value: TravelFrequencyValue; label: string }> = [
  { value: 'never', label: 'Még nem voltam azóta' },
  { value: '1-2', label: 'Évente 1–2x' },
  { value: '3-5', label: 'Évente 3–5x' },
  { value: '6+', label: '6+ alkalom (havi rendszerességgel)' },
]

export const TRAVEL_MODE_OPTIONS: Array<{ value: TravelModeValue; label: string }> = [
  { value: 'flight', label: '✈️ Repülő' },
  { value: 'car', label: '🚗 Autó' },
  { value: 'bus', label: '🚌 Busz' },
  { value: 'train', label: '🚆 Vonat' },
  { value: 'mixed', label: 'Vegyes / változó' },
]

export const REMITTANCE_FREQUENCY_OPTIONS: Array<{ value: RemittanceFrequencyValue; label: string }> = [
  { value: 'regular', label: 'Igen, rendszeresen' },
  { value: 'occasional', label: 'Igen, alkalmanként (ünnepek, segítség)' },
  { value: 'no', label: 'Nem' },
  { value: 'no_say', label: 'Inkább nem mondom' },
]

export const RELOCATION_PLAN_OPTIONS: Array<{ value: RelocationPlanValue; label: string }> = [
  { value: 'soon_1_2', label: 'Igen, 1–2 éven belül' },
  { value: 'someday', label: 'Igen, valamikor' },
  { value: 'no', label: 'Nem terveztem' },
  { value: 'unsure', label: 'Még nem tudom' },
]

export const AGE_RANGE_OPTIONS: Array<{ value: AgeRangeValue; label: string }> = [
  { value: '18-25', label: '18–25' },
  { value: '26-35', label: '26–35' },
  { value: '36-45', label: '36–45' },
  { value: '46-55', label: '46–55' },
  { value: '56+', label: '56+' },
  { value: 'no_say', label: 'Inkább nem mondom' },
]

export const OCCUPATION_CATEGORY_OPTIONS: Array<{ value: OccupationCategoryValue; label: string }> = [
  { value: 'it', label: 'IT / mérnök / technológia' },
  { value: 'health', label: 'Egészségügy / orvos / ápolás' },
  { value: 'education', label: 'Oktatás / kultúra / tudomány' },
  { value: 'commerce', label: 'Kereskedelem / vendéglátás / turizmus' },
  { value: 'finance', label: 'Pénzügy / üzlet / jog' },
  { value: 'construction', label: 'Építőipar / szakmunka' },
  { value: 'student', label: 'Diák' },
  { value: 'other', label: 'Egyéb' },
  { value: 'no_say', label: 'Inkább nem mondom' },
]

export const ACQUISITION_SOURCE_OPTIONS: Array<{ value: AcquisitionSourceValue; label: string }> = [
  { value: 'fb', label: 'Facebook (1,08M-os Erdélyi csoport)' },
  { value: 'social', label: 'Más közösségi média (IG, TikTok, X)' },
  { value: 'friend', label: 'Barát / ismerős ajánlotta' },
  { value: 'press', label: 'Sajtó / blog / cikk' },
  { value: 'aaron', label: 'Áron / Chillygence' },
  { value: 'other', label: 'Egyéb' },
]
