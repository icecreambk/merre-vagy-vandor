// Maps country names (as returned by Mapbox in Hungarian) to continents
const CONTINENT_MAP: Record<string, string> = {
  // Europe
  'Magyarország': 'Európa', 'Románia': 'Európa', 'Ausztria': 'Európa',
  'Németország': 'Európa', 'Franciaország': 'Európa', 'Egyesült Királyság': 'Európa',
  'Olaszország': 'Európa', 'Spanyolország': 'Európa', 'Portugália': 'Európa',
  'Hollandia': 'Európa', 'Belgium': 'Európa', 'Svájc': 'Európa',
  'Svédország': 'Európa', 'Norvégia': 'Európa', 'Dánia': 'Európa',
  'Finnország': 'Európa', 'Lengyelország': 'Európa', 'Csehország': 'Európa',
  'Szlovákia': 'Európa', 'Szerbia': 'Európa', 'Horvátország': 'Európa',
  'Szlovénia': 'Európa', 'Bulgária': 'Európa', 'Görögország': 'Európa',
  'Ukrajna': 'Európa', 'Oroszország': 'Európa', 'Fehéroroszország': 'Európa',
  'Írország': 'Európa', 'Izland': 'Európa', 'Luxemburg': 'Európa',
  'Málta': 'Európa', 'Ciprus': 'Európa', 'Észtország': 'Európa',
  'Lettország': 'Európa', 'Litvánia': 'Európa', 'Moldávia': 'Európa',
  'Bosznia-Hercegovina': 'Európa', 'Észak-Macedónia': 'Európa', 'Albánia': 'Európa',
  'Montenegró': 'Európa', 'Koszovó': 'Európa', 'Andorra': 'Európa',
  // English names (Mapbox sometimes returns English)
  'Hungary': 'Európa', 'Romania': 'Európa', 'Austria': 'Európa',
  'Germany': 'Európa', 'France': 'Európa', 'United Kingdom': 'Európa',
  'Italy': 'Európa', 'Spain': 'Európa', 'Portugal': 'Európa',
  'Netherlands': 'Európa', 'Belgium': 'Európa', 'Switzerland': 'Európa',
  'Sweden': 'Európa', 'Norway': 'Európa', 'Denmark': 'Európa',
  'Finland': 'Európa', 'Poland': 'Európa', 'Czech Republic': 'Európa',
  'Slovakia': 'Európa', 'Serbia': 'Európa', 'Croatia': 'Európa',
  'Slovenia': 'Európa', 'Bulgaria': 'Európa', 'Greece': 'Európa',
  'Ukraine': 'Európa', 'Russia': 'Európa', 'Ireland': 'Európa',
  'Estonia': 'Európa', 'Latvia': 'Európa', 'Lithuania': 'Európa',
  'Moldova': 'Európa', 'Bosnia and Herzegovina': 'Európa',
  'North Macedonia': 'Európa', 'Albania': 'Európa', 'Montenegro': 'Európa',
  'Kosovo': 'Európa', 'Iceland': 'Európa', 'Luxembourg': 'Európa',
  // Americas
  'Egyesült Államok': 'Amerika', 'Kanada': 'Amerika', 'Mexikó': 'Amerika',
  'Brazília': 'Amerika', 'Argentína': 'Amerika', 'Chile': 'Amerika',
  'Kolumbia': 'Amerika', 'Peru': 'Amerika', 'Venezuela': 'Amerika',
  'United States': 'Amerika', 'Canada': 'Amerika', 'Mexico': 'Amerika',
  'Brazil': 'Amerika', 'Argentina': 'Amerika', 'Colombia': 'Amerika',
  // Asia
  'Kína': 'Ázsia', 'Japán': 'Ázsia', 'India': 'Ázsia', 'Izrael': 'Ázsia',
  'Törökország': 'Ázsia', 'Szaúd-Arábia': 'Ázsia', 'Irán': 'Ázsia',
  'China': 'Ázsia', 'Japan': 'Ázsia', 'Israel': 'Ázsia',
  'Turkey': 'Ázsia', 'Saudi Arabia': 'Ázsia', 'Iran': 'Ázsia',
  'South Korea': 'Ázsia', 'Singapore': 'Ázsia', 'Thailand': 'Ázsia',
  'Vietnam': 'Ázsia', 'Indonesia': 'Ázsia', 'Malaysia': 'Ázsia',
  'United Arab Emirates': 'Ázsia', 'Egyesült Arab Emírségek': 'Ázsia',
  // Oceania
  'Ausztrália': 'Ausztrália', 'Új-Zéland': 'Ausztrália',
  'Australia': 'Ausztrália', 'New Zealand': 'Ausztrália',
  // Africa
  'Dél-Afrika': 'Afrika', 'Egyiptom': 'Afrika', 'Marokkó': 'Afrika',
  'South Africa': 'Afrika', 'Egypt': 'Afrika', 'Morocco': 'Afrika',
  'Nigeria': 'Afrika', 'Kenya': 'Afrika', 'Ethiopia': 'Afrika',
}

export function getContinent(country: string): string {
  return CONTINENT_MAP[country] || 'Egyéb'
}
