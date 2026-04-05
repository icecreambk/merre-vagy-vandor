import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface WelcomeEmailParams {
  to: string
  name: string
  city: string
  country: string
  pinType: 'living' | 'commuter' | 'planning'
  removalToken: string
}

const PIN_TYPE_LABELS = {
  living: '🚩 Kint élek – jelenleg külföldön élek',
  commuter: '🟡 Kijárok – dolgozni járok ki külföldre',
  planning: '🟢 Készülök – tervezem hogy kimegyek',
}

export async function sendWelcomeEmail({
  to,
  name,
  city,
  country,
  pinType,
  removalToken,
}: WelcomeEmailParams) {
  if (!process.env.RESEND_API_KEY) return // ha nincs kulcs, csendben kihagyjuk

  const displayName = name && name !== 'Vándor' ? name : 'Vándor'
  const typeLabel = PIN_TYPE_LABELS[pinType]
  const removeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/remove?token=${removalToken}`

  await resend.emails.send({
    from: 'Merre vagy, vándor? <vandor@merevagyvandor.hu>',
    to,
    subject: '🌍 Felkerültél a vándortérképre!',
    html: `
<!DOCTYPE html>
<html lang="hu">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#060612;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:0 auto;padding:32px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#e8c547;font-size:26px;margin:0 0 6px;">Merre vagy, vándor?</h1>
      <p style="color:rgba(255,255,255,0.45);font-size:13px;margin:0;font-style:italic;">Erdélyi közösségi világtérkép</p>
    </div>

    <!-- Köszöntő -->
    <div style="background:rgba(232,197,71,0.08);border:1px solid rgba(232,197,71,0.2);border-radius:14px;padding:24px;margin-bottom:20px;">
      <p style="color:#e8c547;font-size:18px;margin:0 0 12px;font-weight:bold;">Szia, ${displayName}! 👋</p>
      <p style="color:rgba(255,255,255,0.75);font-size:14px;line-height:1.7;margin:0 0 10px;">
        Felkerültél a vándortérképre! Mostantól te is ott vagy azon a térképen,
        amely megmutatja a világnak: <strong style="color:#fff;">hányan vagyunk, és hol.</strong>
      </p>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;margin:0;">
        📍 <strong style="color:#fff;">${city}, ${country}</strong><br/>
        ${typeLabel}
      </p>
    </div>

    <!-- Mi ez -->
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:20px;">
      <p style="color:rgba(255,255,255,0.85);font-size:13px;line-height:1.7;margin:0 0 10px;">
        Ez egy <strong>ingyenes, nonprofit projekt.</strong> Senki nem keres rajta semmit —
        csak erdélyiek, akik szeretnék tudni: hányan vagyunk, és hol vagyunk a világban.
      </p>
      <p style="color:rgba(255,255,255,0.55);font-size:12px;margin:0;">
        Az email címedet <strong style="color:rgba(255,255,255,0.75);">soha nem adjuk el</strong>, és reklámot nem küldünk.
        Egyetlen célra kérjük: hogy egyszer majd közösségként szólhassunk egymáshoz.
      </p>
    </div>

    <!-- Gombok -->
    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://merre-vagy-vandor.vercel.app" style="display:inline-block;background:#e8c547;color:#0a0a14;text-decoration:none;border-radius:10px;padding:12px 28px;font-size:14px;font-weight:bold;margin-bottom:10px;">
        🌍 Megnézem a térképet
      </a>
      <br/>
      <a href="https://www.facebook.com/groups/963074126669000" style="display:inline-block;background:#1877f2;color:#fff;text-decoration:none;border-radius:10px;padding:12px 28px;font-size:14px;font-weight:bold;">
        📢 Csatlakozom a FB csoporthoz
      </a>
    </div>

    <!-- Törlés -->
    <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;text-align:center;">
      <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0 0 6px;">
        A jelölőd 30 nap után automatikusan törlődik.
        Ha korábban szeretnéd eltávolítani:
      </p>
      <a href="${removeUrl}" style="color:rgba(232,197,71,0.5);font-size:11px;">
        Jelölő törlése
      </a>
    </div>

  </div>
</body>
</html>
    `.trim(),
  })
}
