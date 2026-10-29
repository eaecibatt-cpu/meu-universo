alter table public.profiles
  add column home_cards jsonb not null default '[]'::jsonb;
