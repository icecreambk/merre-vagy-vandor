# Merre vagy, vándor?

Szimbolikus világtérkép, amely megmutatja, hol élnek az erdélyi magyarok szerte a világon.

## Funkciók

- 🗺️ Mapbox térkép sötét stílussal
- 📍 Városszintű jelölések klaszterezéssel
- 🏔️ Erdély körvonala overlay-ként
- ⛪ Csíksomlyó jelölő
- 🔊 Magyar hangos üdvözlés (SpeechSynthesis)
- 📧 Email visszaigazolás (Resend)
- 👤 Admin felület Supabase Auth-tal
- ⏰ 30 napos automatikus lejárat

## Technológiai stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Mapbox GL JS
- Supabase (Postgres + Auth)
- Resend (email)

## Helyi fejlesztés

### 1. Függőségek telepítése

```bash
cd merre-vagy-vandor
npm install
```

### 2. Környezeti változók

Másold `.env.example`-t `.env.local`-ba és töltsd ki:

```bash
cp .env.example .env.local
```

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token
NEXT_PUBLIC_MAPBOX_STYLE_URL=mapbox://styles/mapbox/dark-v11
MAPBOX_GEOCODING_TOKEN=pk.your_mapbox_token

# Email (Resend)
RESEND_API_KEY=re_your_resend_key
EMAIL_FROM=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase adatbázis beállítása

1. Hozz létre egy Supabase projektet: https://supabase.com
2. Futtasd a migrációt az SQL Editorban (`supabase/migrations/0001_init.sql`):

```sql
-- Create pins table
CREATE TABLE IF NOT EXISTS pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  lat_rounded DOUBLE PRECISION NOT NULL,
  lng_rounded DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'removed')),
  removal_token_hash TEXT NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pins_status ON pins(status);
CREATE INDEX IF NOT EXISTS idx_pins_expires_at ON pins(expires_at);
CREATE INDEX IF NOT EXISTS idx_pins_country ON pins(country);
CREATE INDEX IF NOT EXISTS idx_pins_city ON pins(city);
CREATE INDEX IF NOT EXISTS idx_pins_created_at ON pins(created_at);

-- Composite index for active non-expired pins query
CREATE INDEX IF NOT EXISTS idx_pins_active_expires ON pins(status, expires_at) WHERE status = 'active';

-- Enable Row Level Security
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;

-- RLS Policy: No direct public access - all access via API routes with service role key
CREATE POLICY "pins_read_active" ON pins
  FOR SELECT
  USING (status = 'active' AND expires_at > now());

-- Scheduled cleanup function for expired pins
CREATE OR REPLACE FUNCTION cleanup_expired_pins()
RETURNS void AS $$
BEGIN
  UPDATE pins
  SET status = 'removed'
  WHERE status = 'active'
    AND expires_at < now();
END;
$$ LANGUAGE plpgsql;
```

3. Másold ki a projekt URL-t és service role key-t a Settings > API menüből.

### 4. Mapbox token beállítása

1. Regisztrálj/jelentkezz be: https://account.mapbox.com
2. Hozz létre egy access tokent
3. Add hozzá a `.env.local` fájlhoz

### 5. Email beállítása (opcionális)

1. Regisztrálj: https://resend.com
2. Hitelesítsd a domaint vagy használj sandbox módot
3. Add hozzá az API key-t

### 6. Fejlesztői szerver indítása

```bash
npm run dev
```

Nyisd meg: http://localhost:3000

## Build és Deploy

### Build

```bash
npm run build
```

### Vercel Deploy

1. Push-old a kódot GitHub-ra
2. Importáld Vercelre: https://vercel.com/new
3. Add hozzá a környezeti változókat a Vercel projekt beállításokban

## Lejárat (Expiry) cron beállítása

A jelölések 30 nap után lejárnak. A lejárt jelölések automatikus eltávolításához válassz az alábbi lehetőségek közül:

### Opció 1: Supabase pg_cron (ajánlott)

Ha a pg_cron extension elérhető a Supabase projektedben:

1. Engedélyezd a pg_cron-t a Database > Extensions menüben
2. Futtasd az SQL Editorban:

```sql
SELECT cron.schedule(
  'cleanup-expired-pins',
  '0 2 * * *',  -- Naponta 2:00 UTC-kor
  'SELECT cleanup_expired_pins();'
);
```

### Opció 2: Supabase Edge Function (scheduled)

1. Hozz létre egy Edge Function-t a `supabase/functions` mappában
2. Állíts be cron triggert a Dashboard-on
3. A function hívja meg a `cleanup_expired_pins()` SQL függvényt

### Opció 3: Manuális cleanup

Periodikusan futtasd az SQL Editorban:

```sql
SELECT cleanup_expired_pins();
```

### Opció 4: Külső cron szolgáltatás

Használj cron.org vagy GitHub Actions-t, ami meghív egy API endpointot a cleanup-hoz.

## Projekt struktúra

```
merre-vagy-vandor/
├── app/
│   ├── api/           # API route-ok
│   ├── admin/         # Admin oldalak
│   ├── pin/           # Pin modal route
│   ├── remove/        # Törlés oldal
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Főoldal
├── components/
│   ├── home/          # HomePage komponens
│   ├── map/           # Térkép komponensek
│   ├── overlays/      # UI overlay-ek
│   └── pin/           # Pin flow komponensek
├── lib/
│   ├── email/         # Email küldés
│   ├── supabase/      # Supabase kliens
│   ├── utils/         # Utility-k (token, rate-limit)
│   ├── voice/         # Hangos üdvözlés
│   └── constants.ts   # Konstansok
├── public/
│   ├── assets/        # Képek
│   └── geo/           # GeoJSON fájlok
├── supabase/
│   └── migrations/    # SQL migrációk
└── types/             # TypeScript típusok
```

## Licenc

MIT
