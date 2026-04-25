import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/client'
import { generateRemovalToken, hashToken } from '@/lib/utils/token'
import { PIN_EXPIRY_DAYS } from '@/lib/constants'
import type { PinGeoJSON } from '@/types'

// GET /api/pins — return all active pins as GeoJSON
export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('pins')
      .select('id, name, nickname, city, country, lat_rounded, lng_rounded, pin_type, origin_city, origin_country')
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error

    const geojson: PinGeoJSON = {
      type: 'FeatureCollection',
      features: (data || []).map((pin) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [pin.lng_rounded, pin.lat_rounded],
        },
        properties: {
          id: pin.id,
          // Map label: prefer nickname, fall back to 'Vándor' — never leak full name.
          name: (pin.nickname && pin.nickname.trim()) || 'Vándor',
          city: pin.city,
          country: pin.country,
          pin_type: pin.pin_type || 'living',
          origin_city: pin.origin_city,
          origin_country: pin.origin_country,
        },
      })),
    }

    return NextResponse.json(geojson, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
    })
  } catch (err) {
    console.error('GET /api/pins error:', err)
    return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 })
  }
}

// POST /api/pins — create a new pin
const CURRENT_YEAR = new Date().getFullYear()

const PinSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  nickname: z.string().min(1).max(30).optional(),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  pin_type: z.enum(['living', 'commuter', 'planning']).default('living'),
  origin_city: z.string().max(100).optional().or(z.literal('')),
  origin_country: z.string().max(100).optional().or(z.literal('')),
  relevant_date: z.string().optional().or(z.literal('')),
  birth_year: z
    .number()
    .int()
    .min(1900)
    .max(CURRENT_YEAR)
    .optional(),
  education: z.string().max(120).optional().or(z.literal('')),
  occupation: z.string().max(120).optional().or(z.literal('')),
  consent_marketing: z.boolean().optional().default(false),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = PinSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Érvénytelen adatok', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const {
      name,
      nickname,
      email,
      city,
      country,
      lat,
      lng,
      pin_type,
      origin_city,
      origin_country,
      relevant_date,
      birth_year,
      education,
      occupation,
      consent_marketing,
    } = parsed.data

    // Round coordinates for privacy (0.1 degree ≈ 11km)
    const lat_rounded = Math.round(lat * 10) / 10
    const lng_rounded = Math.round(lng * 10) / 10

    const removalToken = generateRemovalToken()
    const removalTokenHash = hashToken(removalToken)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + PIN_EXPIRY_DAYS)

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('pins')
      .insert({
        name: (name && name.trim()) || 'Vándor',
        nickname: (nickname && nickname.trim()) || null,
        email: email || null,
        city,
        country,
        lat,
        lng,
        lat_rounded,
        lng_rounded,
        pin_type,
        origin_city: (origin_city && origin_city.trim()) || null,
        origin_country: (origin_country && origin_country.trim()) || null,
        // <input type="month"> sends YYYY-MM, but Postgres DATE needs YYYY-MM-DD.
        // Store as the first day of that month. Also accept full YYYY-MM-DD if ever sent.
        relevant_date: (() => {
          const v = (relevant_date || '').trim()
          if (!v) return null
          if (/^\d{4}-\d{2}$/.test(v)) return `${v}-01`
          if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v
          return null
        })(),
        birth_year: birth_year ?? null,
        education: (education && education.trim()) || null,
        occupation: (occupation && occupation.trim()) || null,
        consent_marketing: consent_marketing ?? false,
        expires_at: expiresAt.toISOString(),
        removal_token_hash: removalTokenHash,
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      id: data.id,
      removalToken,
    })
  } catch (err) {
    console.error('POST /api/pins error:', err)
    return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 })
  }
}
