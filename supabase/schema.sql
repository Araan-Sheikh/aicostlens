create extension if not exists pgcrypto;

create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  input jsonb not null,
  result jsonb not null,
  summary text,
  public_slug text unique not null
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  audit_id uuid references audits(id),
  email text not null,
  company_name text,
  role text,
  team_size integer,
  total_monthly_savings numeric,
  credex_qualified boolean default false,
  source text default 'ai-spend-audit'
);

create index if not exists audits_public_slug_idx on audits(public_slug);
create index if not exists audits_created_at_idx on audits(created_at);
create index if not exists leads_audit_id_idx on leads(audit_id);
create index if not exists leads_created_at_idx on leads(created_at);
