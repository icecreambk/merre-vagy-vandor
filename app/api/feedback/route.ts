import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { opinion, device, improvement, source } = await req.json()

    if (!opinion && !improvement) {
      return NextResponse.json({ error: 'Legalább egy mezőt tölts ki' }, { status: 400 })
    }

    const { error } = await supabase.from('feedback').insert({
      opinion: opinion?.trim() || null,
      device: device || null,
      improvement: improvement?.trim() || null,
      source: source || 'landing',
    })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Feedback error:', err)
    return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 })
  }
}
