-- Kjør i Supabase > SQL Editor > New query > Run.
-- Denne demoen lagrer kun den faste, ufarlige testkoden DEMO-1234.
create table if not exists public.demo_events (
  id bigint generated always as identity primary key,
  event_type text not null check (event_type = 'demo_submitted'),
  demo_code text,
  created_at timestamptz not null default now()
);

-- Gjør skriptet kompatibelt med tabeller opprettet før demo_code ble lagt til.
alter table public.demo_events add column if not exists demo_code text;

alter table public.demo_events enable row level security;
-- Ingen åpen lesing/skriving fra nettleser, kun serverens hemmelige nøkkel.
revoke all on table public.demo_events from anon, authenticated;
