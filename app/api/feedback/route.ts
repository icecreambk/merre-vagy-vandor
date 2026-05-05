import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

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

    // Email értesítő
    await resend.emails.send({
      from: 'Merre vagy, vándor? <onboarding@resend.dev>',
      to: 'merevagyvandor@gmail.com',
      subject: `💬 Új visszajelzés — ${source === 'terkep' ? 'Térkép' : 'Landing'}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;background:#060612;color:#e0e0e0;padding:28px;border-radius:12px;">
          <h2 style="color:#e8c547;margin-bottom:20px;">Új visszajelzés érkezett</h2>
          <p><strong style="color:#e8c547;">Forrás:</strong> ${source === 'terkep' ? '🗺️ Térkép oldal' : '🏠 Landing oldal'}</p>
          <p><strong style="color:#e8c547;">Eszköz:</strong> ${device || '—'}</p>
          <hr style="border-color:rgba(232,197,71,0.2);margin:16px 0;" />
          <p><strong style="color:#e8c547;">Mit gondol az oldalról?</strong></p>
          <p style="background:rgba(255,255,255,0.05);padding:12px;border-radius:8px;">${opinion || '—'}</p>
          <p><strong style="color:#e8c547;">Mit kellene javítani?</strong></p>
          <p style="background:rgba(255,255,255,0.05);padding:12px;border-radius:8px;">${improvement || '—'}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Feedback error:', err)
    return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 })
  }
}
