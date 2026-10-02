-- Captación: contactos, referentes y límite de envíos (especificación §6.2, §6.3 y §8).
-- Los contactos SOLO se insertan desde la Edge Function con la clave secreta. Nadie con la clave
-- pública puede leerlos ni crearlos; un editor nunca ve datos personales de contactos.

create table public.referral_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  code text not null unique check (code ~ '^[A-Z0-9]+$'),
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

comment on column public.referral_partners.code is
  'Código del enlace ?ref= (§8.4). Mayúsculas y números, sin espacios.';

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  form_type text not null check (form_type in ('contacto', 'consulta')),
  name text not null check (length(trim(name)) > 0),
  email text not null check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  phone text,
  organization text,
  client_type text check (
    client_type in ('entidad-publica', 'empresa-privada', 'contratista-estado', 'persona-natural', 'otro')
  ),
  practice_area text check (
    practice_area in (
      'derecho-publico', 'litigio-administrativo', 'derecho-laboral', 'derecho-privado', 'no-seguro'
    )
  ),
  message text not null check (length(trim(message)) > 0),
  how_found text not null,
  referred_by text,
  referral_code text references public.referral_partners (code) on update cascade on delete set null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  fbclid text,
  landing_page text,
  referrer_url text,
  -- Evidencia del consentimiento, Ley 1581 de 2012 (§8.3).
  consent_accepted boolean not null check (consent_accepted),
  consent_at timestamptz not null,
  consent_policy_version text not null,
  consent_ip inet,
  consent_user_agent text,
  status text not null default 'nuevo' check (status in ('nuevo', 'atendido', 'descartado')),
  internal_notes text,
  created_at timestamptz not null default now()
);

create index leads_fecha_idx on public.leads (created_at desc);
create index leads_referente_idx on public.leads (referral_code);

-- Límite de envíos por IP (§8.5). La IP se guarda solo como hash.
create table public.rate_limits (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index rate_limits_ip_fecha_idx on public.rate_limits (ip_hash, created_at desc);

alter table public.referral_partners enable row level security;
alter table public.leads enable row level security;
alter table public.rate_limits enable row level security;

-- Defensa en profundidad: además de RLS, ni anon ni authenticated tienen permisos de tabla donde
-- no corresponde. La clave secreta (service_role) no está sujeta a RLS.
revoke all on public.leads, public.referral_partners, public.rate_limits from anon;
revoke all on public.rate_limits from authenticated;
revoke insert, delete, truncate, references, trigger on public.leads from authenticated;
revoke update on public.leads from authenticated;
-- El admin solo puede cambiar el estado y las notas de un contacto (§6.3).
grant update (status, internal_notes) on public.leads to authenticated;

create policy "Contactos: el admin lee"
  on public.leads for select to authenticated
  using ((select public.es_admin()));

create policy "Contactos: el admin actualiza estado y notas"
  on public.leads for update to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

create policy "Referentes: el admin gestiona"
  on public.referral_partners for all to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

-- rate_limits: RLS activado y sin políticas. Solo la clave secreta accede.
