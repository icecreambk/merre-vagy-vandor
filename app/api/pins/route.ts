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
      .select('id, name, city, country, lat_rounded, lng_rounded, pin_type')
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
          name: pin.name,
          city: pin.city,
          country: pin.country,
          pin_type: pin.pin_type || 'living',
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
const PinSchema = z.object({
  name: z.string().min(1).max(60).default('Vándor'),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  pin_type: z.enum(['living', 'commuter', 'planning']).default('living'),
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

    const { name, email, city, country, lat, lng, pin_type } = parsed.data

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
        name: name || 'Vándor',
        email: email || null,
        city,
        country,
        lat,
        lng,
        lat_rounded,
        lng_rounded,
        pin_type,
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
