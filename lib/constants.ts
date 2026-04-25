export const CSIKSOMLYÓ = {
  lng: 25.8897,
  lat: 46.3833,
  name: 'Csíksomlyó',
}

export const TRANSYLVANIA_CENTER = {
  lng: 24.5,
  lat: 46.0,
}

export const MAP_INITIAL_VIEW = {
  center: [10, 30] as [number, number],
  zoom: 1.8,
}

// Pins now retained until the user revokes consent (removal token) or an admin hides them.
// We keep a long expiry as a safety net, not a deletion rule.
export const PIN_EXPIRY_DAYS = 3650 // ~10 years

export const APP_NAME = 'Merre vagy, vándor?'

export const OPERATOR_NAME = 'Erdélyi Vándor Baráti Társaság'
export const OPERATOR_STATUS = 'alapítás alatt'
