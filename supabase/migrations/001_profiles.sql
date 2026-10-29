-- Perfil de cada usuário (1 linha por conta)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  theme_mode text not null default 'auto' check (theme_mode in ('auto','light','dark')),
  glass_mode text not null default 'on' check (glass_mode in ('on','reduced','off')),
  accent_color text not null default '#0078d4',
  updated_at timestamptz not null default now()
);

-- Segurança: cada usuário só vê e altera o próprio perfil
alter table public.profiles enable row level security;

create policy "Ler o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Atualizar o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Cria o perfil automaticamente quando alguém se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
