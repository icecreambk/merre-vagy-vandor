import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/client'
import { hashToken } from '@/lib/utils/token'

const ProfileSchema = z.object({
  removal_token: z.string().min(32).max(128),
  origin_town: z.string().max(120).optional(),
  county: z.enum([
    'hargita','maros','kovaszna','kolozs','szatmar','bihar',
    'brasso','beszterce_naszod','feher','szeben','szilagy',
    'maramaros','krasso_szoreny','not_transylvania','no_say'
  ]).optional(),
  family_remained: z.enum(['close','distant','none','no_say']).optional(),
  travel_frequency: z.enum(['never','1-2','3-5','6+']).optional(),
  travel_mode: z.enum(['flight','car','bus','train','mixed']).optional(),
  remittance_frequency: z.enum(['regular','occasional','no','no_say']).optional(),
  relocation_plan: z.enum(['soon_1_2','someday','no','unsure']).optional(),
  age_range: z.enum(['18-25','26-35','36-45','46-55','56+','no_say']).optional(),
  occupation_category: z.enum([
    'it','health','education','commerce','finance','construction','student','other','no_say'
  ]).optional(),
  acquisition_source: z.enum(['fb','social','friend','press','aaron','other']).optional(),
  consent_sponsor_offers: z.boolean().optional().default(false),
  consent_sweepstakes: z.boolean().optional().default(false),
  completion_step: z.number().int().min(0).max(4).optional().default(0),
})

// POST /api/pins/[id]/profile — save Form 2 (sponsor-relevant survey).
// Authenticated by removal_token (the user proves ownership of the pin).
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pinId } = await params

    if (!pinId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pinId)) {
      return NextResponse.json({ error: 'Érvénytelen pin azonosító' }, { status: 400 })
    }

    const body = await req.json()
    const parsed = ProfileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Érvénytelen adatok', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { removal_token, ...profileData } = parsed.data

    const supabase = createServerClient()

    // Verify token matches the pin
    const tokenHash = hashToken(removal_token)
    const { data: pin, error: pinError } = await supabase
      .from('pins')
      .select('id, removal_token_hash, status')
      .eq('id', pinId)
      .single()

    if (pinError || !pin) {
      return NextResponse.json({ error: 'A jelölő nem található' }, { status: 404 })
    }
    if (pin.removal_token_hash !== tokenHash) {
      return NextResponse.json({ error: 'Hibás hitelesítés' }, { status: 403 })
    }
    if (pin.status !== 'active') {
      return NextResponse.json({ error: 'A jelölő nem aktív' }, { status: 410 })
    }

    // Upsert the profile (1-to-1 with pin)
    const { error: upsertError } = await supabase
      .from('pin_profiles')
      .upsert({
        pin_id: pinId,
        origin_town: profileData.origin_town?.trim() || null,
        county: profileData.county || null,
        family_remained: profileData.family_remained || null,
        travel_frequency: profileData.travel_frequency || null,
        travel_mode: profileData.travel_mode || null,
        remittance_frequency: profileData.remittance_frequency || null,
        relocation_plan: profileData.relocation_plan || null,
        age_range: profileData.age_range || null,
        occupation_category: profileData.occupation_category || null,
        acquisition_source: profileData.acquisition_source || null,
        consent_sponsor_offers: profileData.consent_sponsor_offers ?? false,
        consent_sweepstakes: profileData.consent_sweepstakes ?? false,
        completion_step: profileData.completion_step ?? 0,
      }, { onConflict: 'pin_id' })

    if (upsertError) throw upsertError

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/pins/[id]/profile error:', err)
    return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 })
  }
}
