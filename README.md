# Hacking Arena Deployment – trygg Supabase + Vercel-demo

Dette er en **tydelig merket opplæringsdemo** basert på den opplastede nettsiden. Den opprinnelige nettsiden ba mottakere om ekte CTF-flagg via en tilsynelatende konfidensiell rapport, og er derfor ikke koblet til en database eller klargjort for publisering som den var.

Denne utgaven er en tydelig merket, enkel Hacking Arena Deployment-simulering: `public/index.html` → `public/script.js` → `api/demo-submission.js` (Vercel Node-funksjon) → Supabase-tabellen `demo_events`. API-et aksepterer bare det ufarlige testflagget `DEMO-1234` og lagrer `event_type`, `demo_code` og tidsstempel. Ikke oppgi ekte CTF-flagg, passord eller andre hemmeligheter.

## 1. Lag Supabase-prosjekt
1. Gå til https://supabase.com/dashboard og opprett et prosjekt.
2. Åpne **SQL Editor**. Kjør innholdet i `supabase.sql`.
3. Finn **Project URL** via **Connect** (eller Project Settings) og **Secret key** via **Settings → API Keys**.
4. **Ikke** legg den hemmelige nøkkelen i `public/` eller i GitHub, og ikke send den i chat.

## 2. Lokal test (valgfritt)

Krever Node.js og Vercel CLI.

```sh
npm install
npm install -g vercel
vercel login
vercel link
```

Kopier `.env.example` til `.env.local` og erstatt eksempelverdiene med dine. Kjør:

```sh
vercel dev
```

Åpne URL-en Vercel CLI viser. Skriv kun `DEMO-1234`. Sjekk **Table Editor → demo_events** i Supabase; du skal se en ny rad.

## 3. Publiser på Vercel
1. Last opp **innholdet i denne prosjektmappen** til et nytt GitHub-repository. Ikke last opp node_modules eller `.env.local`.
2. Gå til https://vercel.com/new og importer repositoriet.
3. Sett **Framework Preset: Other**. **Root Directory** skal peke på mappen med `package.json`, `public/` og `api/` (vanligvis `./`). Ingen build-kommando er nødvendig; den statiske siden ligger i `public/`.
4. Gå til **Project Settings → Environment Variables**, legg til `SUPABASE_URL` og `SUPABASE_SECRET_KEY` (for Production; og Preview/Development dersom du bruker disse).
5. Deploy (eller **Redeploy** hvis variablene ble lagt inn etter første deployment).
6. Besøk Vercel-adressen, send `DEMO-1234`, se etter en ny rad i Supabase-tabellen `demo_events`.

## Feilsøking
- **404 på `/api/demo-submission`**: Kontroller at `api/demo-submission.js` ligger i rotmappen ved siden av `package.json`, ikke under `public/`.
- **500: Supabase-variablene mangler**: Kontroller nøyaktige navn i Vercel, og kjør Redeploy.
- **500: Supabase kunne ikke lagre**: Sjekk Vercel Function Logs. Kjør SQL-filen i riktig Supabase-prosjekt, og kontroller at nøkkelen er serverens Secret key (ikke publishable/anon).
- **404 på `/`**: Sett Vercel Framework Preset til Other og kontroller at `public/index.html` finnes.
- **400**: Skriv nøyaktig `DEMO-1234` (ingen ekte flagg eller innloggingskoder).

Dokumentasjon: https://vercel.com/docs/functions ; https://vercel.com/docs/environment-variables ; https://supabase.com/docs/guides/getting-started/api-keys
