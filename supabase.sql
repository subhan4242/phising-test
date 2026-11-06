-- Kjør i Supabase > SQL Editor > New query > Run.
-- Tabellen lagrer bare ufarlig testhendelse og tidsstempel.
create table if not exists public.demo_events (
  id bigint generated always as identity primary key,
  event_type text not null check (event_type = 'demo_submitted'),
  created_at timestamptz not null default now()
);

alter table public.demo_events enable row level security;
-- Ingen åpen lesing/skriving fra nettleser, kun serverens hemmelige nøkkel.
revoke all on table public.demo_events from anon, authenticated;
