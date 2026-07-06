create extension if not exists "pgcrypto";

do $$ begin
  create type public.bolongo_role as enum ('guest', 'owner', 'concierge', 'vendor', 'security', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.bolongo_request_status as enum (
    'requested',
    'reviewing',
    'quoted',
    'approved',
    'scheduled',
    'in_progress',
    'completed',
    'rated',
    'cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.bolongo_priority as enum ('normal', 'important', 'urgent', 'emergency');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.bolongo_access_pass_status as enum ('pending', 'active', 'used', 'expired', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.bolongo_notification_channel as enum ('in_app', 'push', 'email', 'whatsapp');
exception when duplicate_object then null;
end $$;

create table if not exists public.bolongo_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.bolongo_role not null default 'guest',
  full_name text not null,
  phone text,
  preferred_language text not null default 'es' check (preferred_language in ('es', 'en')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bolongo_units (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  tower text,
  floor text,
  address text,
  owner_profile_id uuid references public.bolongo_profiles(id) on delete set null,
  bedrooms int not null default 1,
  bathrooms numeric(4,1) not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bolongo_stays (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.bolongo_units(id) on delete cascade,
  primary_guest_profile_id uuid references public.bolongo_profiles(id) on delete set null,
  owner_profile_id uuid references public.bolongo_profiles(id) on delete set null,
  confirmation_code text,
  check_in_at timestamptz not null,
  check_out_at timestamptz not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'completed', 'cancelled')),
  pre_check_in_completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bolongo_stays_dates_check check (check_out_at > check_in_at)
);

create table if not exists public.bolongo_guests (
  id uuid primary key default gen_random_uuid(),
  stay_id uuid not null references public.bolongo_stays(id) on delete cascade,
  profile_id uuid references public.bolongo_profiles(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  is_primary boolean not null default false,
  document_storage_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.bolongo_access_passes (
  id uuid primary key default gen_random_uuid(),
  stay_id uuid references public.bolongo_stays(id) on delete cascade,
  unit_id uuid not null references public.bolongo_units(id) on delete cascade,
  guest_id uuid references public.bolongo_guests(id) on delete set null,
  label text not null,
  qr_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  valid_from timestamptz not null,
  valid_until timestamptz not null,
  status public.bolongo_access_pass_status not null default 'pending',
  created_by uuid references public.bolongo_profiles(id) on delete set null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  constraint bolongo_access_pass_dates_check check (valid_until > valid_from)
);

create table if not exists public.bolongo_service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_es text not null,
  name_en text,
  description_es text,
  description_en text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bolongo_services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.bolongo_service_categories(id) on delete cascade,
  slug text not null unique,
  name_es text not null,
  name_en text,
  description_es text,
  description_en text,
  instructions_es text,
  instructions_en text,
  requires_quote boolean not null default true,
  requires_owner_approval boolean not null default false,
  base_price numeric(12,2),
  currency text not null default 'MXN',
  is_urgent_available boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.bolongo_vendors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.bolongo_profiles(id) on delete set null,
  display_name text not null,
  legal_name text,
  category_id uuid references public.bolongo_service_categories(id) on delete set null,
  phone text,
  email text,
  status text not null default 'active' check (status in ('active', 'inactive', 'blocked')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bolongo_service_requests (
  id uuid primary key default gen_random_uuid(),
  stay_id uuid references public.bolongo_stays(id) on delete set null,
  unit_id uuid not null references public.bolongo_units(id) on delete cascade,
  service_id uuid not null references public.bolongo_services(id) on delete restrict,
  requested_by uuid references public.bolongo_profiles(id) on delete set null,
  assigned_concierge_id uuid references public.bolongo_profiles(id) on delete set null,
  assigned_vendor_id uuid references public.bolongo_vendors(id) on delete set null,
  status public.bolongo_request_status not null default 'requested',
  priority public.bolongo_priority not null default 'normal',
  title text not null,
  description text,
  requested_for timestamptz,
  scheduled_for timestamptz,
  quote_amount numeric(12,2),
  quote_currency text not null default 'MXN',
  owner_approval_required boolean not null default false,
  owner_approved_by uuid references public.bolongo_profiles(id) on delete set null,
  owner_approved_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bolongo_service_request_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.bolongo_service_requests(id) on delete cascade,
  sender_profile_id uuid references public.bolongo_profiles(id) on delete set null,
  body text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.bolongo_service_request_attachments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.bolongo_service_requests(id) on delete cascade,
  uploaded_by uuid references public.bolongo_profiles(id) on delete set null,
  storage_path text not null,
  file_name text,
  content_type text,
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists public.bolongo_payments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.bolongo_service_requests(id) on delete cascade,
  amount numeric(12,2) not null,
  currency text not null default 'MXN',
  status text not null default 'pending' check (status in ('pending', 'authorized', 'paid', 'failed', 'refunded', 'cancelled')),
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bolongo_reviews (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.bolongo_service_requests(id) on delete cascade,
  reviewer_profile_id uuid references public.bolongo_profiles(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.bolongo_incidents (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references public.bolongo_units(id) on delete set null,
  stay_id uuid references public.bolongo_stays(id) on delete set null,
  reported_by uuid references public.bolongo_profiles(id) on delete set null,
  priority public.bolongo_priority not null default 'urgent',
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.bolongo_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.bolongo_profiles(id) on delete set null,
  entity_table text not null,
  entity_id uuid not null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.bolongo_notification_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.bolongo_profiles(id) on delete cascade,
  request_id uuid references public.bolongo_service_requests(id) on delete cascade,
  channel public.bolongo_notification_channel not null default 'in_app',
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'cancelled')),
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists bolongo_profiles_role_idx on public.bolongo_profiles(role);
create index if not exists bolongo_units_owner_idx on public.bolongo_units(owner_profile_id);
create index if not exists bolongo_stays_unit_idx on public.bolongo_stays(unit_id);
create index if not exists bolongo_stays_primary_guest_idx on public.bolongo_stays(primary_guest_profile_id);
create index if not exists bolongo_guests_stay_idx on public.bolongo_guests(stay_id);
create index if not exists bolongo_access_passes_unit_idx on public.bolongo_access_passes(unit_id);
create index if not exists bolongo_services_category_idx on public.bolongo_services(category_id);
create index if not exists bolongo_vendors_profile_idx on public.bolongo_vendors(profile_id);
create index if not exists bolongo_requests_unit_idx on public.bolongo_service_requests(unit_id);
create index if not exists bolongo_requests_status_idx on public.bolongo_service_requests(status);
create index if not exists bolongo_requests_vendor_idx on public.bolongo_service_requests(assigned_vendor_id);
create index if not exists bolongo_messages_request_idx on public.bolongo_service_request_messages(request_id);
create index if not exists bolongo_attachments_request_idx on public.bolongo_service_request_attachments(request_id);
create index if not exists bolongo_audit_entity_idx on public.bolongo_audit_logs(entity_table, entity_id);

create or replace function public.bolongo_current_role()
returns public.bolongo_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.bolongo_profiles where id = auth.uid()
$$;

create or replace function public.bolongo_is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.bolongo_current_role() in ('admin', 'concierge'), false)
$$;

create or replace function public.bolongo_is_security_or_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.bolongo_current_role() in ('admin', 'concierge', 'security'), false)
$$;

create or replace function public.bolongo_vendor_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from public.bolongo_vendors where profile_id = auth.uid() and status = 'active' limit 1
$$;

create or replace function public.bolongo_can_see_unit(unit_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    public.bolongo_is_staff()
    or exists (
      select 1 from public.bolongo_units u
      where u.id = unit_uuid and u.owner_profile_id = auth.uid()
    )
    or exists (
      select 1 from public.bolongo_stays s
      where s.unit_id = unit_uuid
      and s.primary_guest_profile_id = auth.uid()
      and s.status in ('upcoming', 'active')
    ),
    false
  )
$$;

create or replace function public.bolongo_can_see_request(request_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    public.bolongo_is_staff()
    or exists (
      select 1
      from public.bolongo_service_requests r
      join public.bolongo_units u on u.id = r.unit_id
      where r.id = request_uuid
      and (
        r.requested_by = auth.uid()
        or r.assigned_concierge_id = auth.uid()
        or u.owner_profile_id = auth.uid()
        or r.assigned_vendor_id = public.bolongo_vendor_id()
      )
    ),
    false
  )
$$;

create or replace function public.bolongo_log_request_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and old.status is distinct from new.status then
    insert into public.bolongo_audit_logs (
      actor_profile_id,
      entity_table,
      entity_id,
      action,
      before_data,
      after_data
    )
    values (
      auth.uid(),
      'bolongo_service_requests',
      new.id,
      'status_changed',
      jsonb_build_object('status', old.status),
      jsonb_build_object('status', new.status)
    );
  end if;

  return new;
end;
$$;

drop trigger if exists bolongo_request_status_audit on public.bolongo_service_requests;
create trigger bolongo_request_status_audit
after update on public.bolongo_service_requests
for each row execute function public.bolongo_log_request_status_change();

alter table public.bolongo_profiles enable row level security;
alter table public.bolongo_units enable row level security;
alter table public.bolongo_stays enable row level security;
alter table public.bolongo_guests enable row level security;
alter table public.bolongo_access_passes enable row level security;
alter table public.bolongo_service_categories enable row level security;
alter table public.bolongo_services enable row level security;
alter table public.bolongo_vendors enable row level security;
alter table public.bolongo_service_requests enable row level security;
alter table public.bolongo_service_request_messages enable row level security;
alter table public.bolongo_service_request_attachments enable row level security;
alter table public.bolongo_payments enable row level security;
alter table public.bolongo_reviews enable row level security;
alter table public.bolongo_incidents enable row level security;
alter table public.bolongo_audit_logs enable row level security;
alter table public.bolongo_notification_events enable row level security;

drop policy if exists "bolongo profiles read own or staff" on public.bolongo_profiles;
create policy "bolongo profiles read own or staff"
on public.bolongo_profiles for select
using (id = auth.uid() or public.bolongo_is_staff());

drop policy if exists "bolongo profiles admin manage" on public.bolongo_profiles;
create policy "bolongo profiles admin manage"
on public.bolongo_profiles for all
using (public.bolongo_current_role() = 'admin')
with check (public.bolongo_current_role() = 'admin');

drop policy if exists "bolongo profiles create own guest" on public.bolongo_profiles;
create policy "bolongo profiles create own guest"
on public.bolongo_profiles for insert
to authenticated
with check (id = auth.uid() and role = 'guest');

drop policy if exists "bolongo units visible by relationship" on public.bolongo_units;
create policy "bolongo units visible by relationship"
on public.bolongo_units for select
using (public.bolongo_can_see_unit(id));

drop policy if exists "bolongo units staff manage" on public.bolongo_units;
create policy "bolongo units staff manage"
on public.bolongo_units for all
using (public.bolongo_is_staff())
with check (public.bolongo_is_staff());

drop policy if exists "bolongo stays visible by relationship" on public.bolongo_stays;
create policy "bolongo stays visible by relationship"
on public.bolongo_stays for select
using (
  public.bolongo_is_staff()
  or primary_guest_profile_id = auth.uid()
  or owner_profile_id = auth.uid()
  or public.bolongo_can_see_unit(unit_id)
);

drop policy if exists "bolongo stays staff manage" on public.bolongo_stays;
create policy "bolongo stays staff manage"
on public.bolongo_stays for all
using (public.bolongo_is_staff())
with check (public.bolongo_is_staff());

drop policy if exists "bolongo guests visible through stay" on public.bolongo_guests;
create policy "bolongo guests visible through stay"
on public.bolongo_guests for select
using (
  public.bolongo_is_staff()
  or profile_id = auth.uid()
  or exists (
    select 1 from public.bolongo_stays s
    where s.id = bolongo_guests.stay_id
    and (s.primary_guest_profile_id = auth.uid() or s.owner_profile_id = auth.uid())
  )
);

drop policy if exists "bolongo guests guest or staff manage" on public.bolongo_guests;
create policy "bolongo guests guest or staff manage"
on public.bolongo_guests for all
using (
  public.bolongo_is_staff()
  or exists (
    select 1 from public.bolongo_stays s
    where s.id = bolongo_guests.stay_id and s.primary_guest_profile_id = auth.uid()
  )
)
with check (
  public.bolongo_is_staff()
  or exists (
    select 1 from public.bolongo_stays s
    where s.id = bolongo_guests.stay_id and s.primary_guest_profile_id = auth.uid()
  )
);

drop policy if exists "bolongo access passes visible by role" on public.bolongo_access_passes;
create policy "bolongo access passes visible by role"
on public.bolongo_access_passes for select
using (
  public.bolongo_is_security_or_staff()
  or public.bolongo_can_see_unit(unit_id)
);

drop policy if exists "bolongo access passes staff manage" on public.bolongo_access_passes;
create policy "bolongo access passes staff manage"
on public.bolongo_access_passes for all
using (public.bolongo_is_security_or_staff())
with check (public.bolongo_is_security_or_staff());

drop policy if exists "bolongo categories active readable" on public.bolongo_service_categories;
create policy "bolongo categories active readable"
on public.bolongo_service_categories for select
using (is_active = true or public.bolongo_is_staff());

drop policy if exists "bolongo categories staff manage" on public.bolongo_service_categories;
create policy "bolongo categories staff manage"
on public.bolongo_service_categories for all
using (public.bolongo_is_staff())
with check (public.bolongo_is_staff());

drop policy if exists "bolongo services active readable" on public.bolongo_services;
create policy "bolongo services active readable"
on public.bolongo_services for select
using (is_active = true or public.bolongo_is_staff());

drop policy if exists "bolongo services staff manage" on public.bolongo_services;
create policy "bolongo services staff manage"
on public.bolongo_services for all
using (public.bolongo_is_staff())
with check (public.bolongo_is_staff());

drop policy if exists "bolongo vendors readable by staff or self" on public.bolongo_vendors;
create policy "bolongo vendors readable by staff or self"
on public.bolongo_vendors for select
using (public.bolongo_is_staff() or profile_id = auth.uid());

drop policy if exists "bolongo vendors staff manage" on public.bolongo_vendors;
create policy "bolongo vendors staff manage"
on public.bolongo_vendors for all
using (public.bolongo_is_staff())
with check (public.bolongo_is_staff());

drop policy if exists "bolongo requests visible by relationship" on public.bolongo_service_requests;
create policy "bolongo requests visible by relationship"
on public.bolongo_service_requests for select
using (public.bolongo_can_see_request(id));

drop policy if exists "bolongo requests create by authorized users" on public.bolongo_service_requests;
create policy "bolongo requests create by authorized users"
on public.bolongo_service_requests for insert
with check (
  public.bolongo_is_staff()
  or (requested_by = auth.uid() and public.bolongo_can_see_unit(unit_id))
);

drop policy if exists "bolongo requests update by staff vendor owner" on public.bolongo_service_requests;
create policy "bolongo requests update by staff vendor owner"
on public.bolongo_service_requests for update
using (
  public.bolongo_is_staff()
  or assigned_vendor_id = public.bolongo_vendor_id()
  or exists (
    select 1 from public.bolongo_units u
    where u.id = bolongo_service_requests.unit_id
    and u.owner_profile_id = auth.uid()
  )
)
with check (
  public.bolongo_is_staff()
  or assigned_vendor_id = public.bolongo_vendor_id()
  or exists (
    select 1 from public.bolongo_units u
    where u.id = bolongo_service_requests.unit_id
    and u.owner_profile_id = auth.uid()
  )
);

drop policy if exists "bolongo messages visible through request" on public.bolongo_service_request_messages;
create policy "bolongo messages visible through request"
on public.bolongo_service_request_messages for select
using (
  public.bolongo_can_see_request(request_id)
  and (is_internal = false or public.bolongo_is_staff())
);

drop policy if exists "bolongo messages create through request" on public.bolongo_service_request_messages;
create policy "bolongo messages create through request"
on public.bolongo_service_request_messages for insert
with check (
  sender_profile_id = auth.uid()
  and public.bolongo_can_see_request(request_id)
  and (is_internal = false or public.bolongo_is_staff())
);

drop policy if exists "bolongo attachments visible through request" on public.bolongo_service_request_attachments;
create policy "bolongo attachments visible through request"
on public.bolongo_service_request_attachments for select
using (public.bolongo_can_see_request(request_id));

drop policy if exists "bolongo attachments upload through request" on public.bolongo_service_request_attachments;
create policy "bolongo attachments upload through request"
on public.bolongo_service_request_attachments for insert
with check (uploaded_by = auth.uid() and public.bolongo_can_see_request(request_id));

drop policy if exists "bolongo payments visible through request" on public.bolongo_payments;
create policy "bolongo payments visible through request"
on public.bolongo_payments for select
using (public.bolongo_can_see_request(request_id));

drop policy if exists "bolongo payments staff manage" on public.bolongo_payments;
create policy "bolongo payments staff manage"
on public.bolongo_payments for all
using (public.bolongo_is_staff())
with check (public.bolongo_is_staff());

drop policy if exists "bolongo reviews visible through request" on public.bolongo_reviews;
create policy "bolongo reviews visible through request"
on public.bolongo_reviews for select
using (public.bolongo_can_see_request(request_id));

drop policy if exists "bolongo reviews create by reviewer" on public.bolongo_reviews;
create policy "bolongo reviews create by reviewer"
on public.bolongo_reviews for insert
with check (reviewer_profile_id = auth.uid() and public.bolongo_can_see_request(request_id));

drop policy if exists "bolongo incidents visible by role" on public.bolongo_incidents;
create policy "bolongo incidents visible by role"
on public.bolongo_incidents for select
using (
  public.bolongo_is_security_or_staff()
  or reported_by = auth.uid()
  or public.bolongo_can_see_unit(unit_id)
);

drop policy if exists "bolongo incidents create by authenticated" on public.bolongo_incidents;
create policy "bolongo incidents create by authenticated"
on public.bolongo_incidents for insert
to authenticated
with check (
  public.bolongo_is_security_or_staff()
  or (
    reported_by = auth.uid()
    and (unit_id is null or public.bolongo_can_see_unit(unit_id))
  )
);

drop policy if exists "bolongo incidents staff update" on public.bolongo_incidents;
create policy "bolongo incidents staff update"
on public.bolongo_incidents for update
using (public.bolongo_is_security_or_staff())
with check (public.bolongo_is_security_or_staff());

drop policy if exists "bolongo audit logs staff read" on public.bolongo_audit_logs;
create policy "bolongo audit logs staff read"
on public.bolongo_audit_logs for select
using (public.bolongo_is_staff());

drop policy if exists "bolongo audit logs staff insert" on public.bolongo_audit_logs;
create policy "bolongo audit logs staff insert"
on public.bolongo_audit_logs for insert
with check (public.bolongo_is_staff() or actor_profile_id = auth.uid());

drop policy if exists "bolongo notifications visible own or staff" on public.bolongo_notification_events;
create policy "bolongo notifications visible own or staff"
on public.bolongo_notification_events for select
using (profile_id = auth.uid() or public.bolongo_is_staff());

drop policy if exists "bolongo notifications staff insert" on public.bolongo_notification_events;
create policy "bolongo notifications staff insert"
on public.bolongo_notification_events for insert
with check (public.bolongo_is_staff());

insert into storage.buckets (id, name, public)
values ('bolongo-concierge', 'bolongo-concierge', false)
on conflict (id) do nothing;

drop policy if exists "bolongo storage authenticated read" on storage.objects;
create policy "bolongo storage authenticated read"
on storage.objects for select
to authenticated
using (bucket_id = 'bolongo-concierge');

drop policy if exists "bolongo storage authenticated upload" on storage.objects;
create policy "bolongo storage authenticated upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'bolongo-concierge');
