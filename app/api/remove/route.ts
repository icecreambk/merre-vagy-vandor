import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/client'
import { hashToken } from '@/lib/utils/token'

const RemoveSchema = z.object({
  token: z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RemoveSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Érvénytelen token' }, { status: 400 })
    }

    const tokenHash = hashToken(parsed.data.token)
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('pins')
      .update({ status: 'removed' })
      .eq('removal_token_hash', tokenHash)
      .eq('status', 'active')
      .select('id')
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Token nem található vagy már törölve' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/remove error:', err)
    return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 })
  }
}
