create extension if not exists "pgcrypto";

create type public.app_role as enum (
  'admin',
  'supervisor',
  'limpieza',
  'propietario',
  'administrador_cliente'
);

create type public.cleaning_status as enum (
  'pendiente',
  'en_progreso',
  'en_supervision',
  'aprobada',
  'requiere_correccion'
);

create type public.priority_level as enum ('baja', 'media', 'alta', 'urgente', 'importante', 'preventivo');
create type public.ticket_status as enum ('abierto', 'en_proceso', 'resuelto', 'cerrado');
create type public.photo_kind as enum ('recepcion', 'dano', 'faltante', 'final');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.app_role not null default 'limpieza',
  client_id uuid,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_client_id_fkey
  foreign key (client_id) references public.clients(id) on delete set null;

create table public.apartments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  owner_profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  code text not null,
  address text not null,
  area_m2 numeric(10,2),
  development_name text,
  furniture_type text,
  decoration_type text,
  beds int not null default 1,
  baths int not null default 1,
  status text not null default 'activo',
  created_at timestamptz not null default now()
);

create table public.cleanings (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  supervisor_id uuid references public.profiles(id) on delete set null,
  scheduled_date date not null,
  check_out_time time,
  check_in_time time,
  status public.cleaning_status not null default 'pendiente',
  cleaning_type text,
  guest_cleaning_rating int check (guest_cleaning_rating between 1 and 5),
  guest_feedback text,
  linen_replacement_notes text,
  received_notes text,
  final_notes text,
  started_at timestamptz,
  submitted_at timestamptz,
  approved_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.checklist_templates (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  area text not null,
  label text not null,
  required boolean not null default true,
  sort_order int not null default 0
);

create table public.cleaning_checklist_items (
  id uuid primary key default gen_random_uuid(),
  cleaning_id uuid not null references public.cleanings(id) on delete cascade,
  template_item_id uuid references public.checklist_templates(id) on delete set null,
  area text not null,
  label text not null,
  required boolean not null default true,
  completed boolean not null default false,
  notes text,
  completed_by uuid references public.profiles(id) on delete set null,
  completed_at timestamptz
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  name text not null,
  category text not null,
  expected_quantity int not null default 0,
  current_quantity int not null default 0,
  condition text not null default 'ok',
  price numeric(12,2),
  purchase_ticket_url text,
  supplier text,
  purchased_at date,
  retired_at date,
  retirement_reason text,
  updated_at timestamptz not null default now()
);

create table public.linen_items (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  item_type text not null,
  size text,
  model text,
  color text,
  expected_quantity int not null default 0,
  current_quantity int not null default 0,
  condition text not null default 'ok',
  unit_cost numeric(12,2),
  supplier text,
  purchased_at date,
  retired_at date,
  retirement_reason text,
  notes text,
  updated_at timestamptz not null default now()
);

create table public.cleaning_linen_replacements (
  id uuid primary key default gen_random_uuid(),
  cleaning_id uuid not null references public.cleanings(id) on delete cascade,
  linen_item_id uuid references public.linen_items(id) on delete set null,
  item_type text not null,
  quantity int not null default 1,
  reason text,
  replaced_by uuid references public.profiles(id) on delete set null,
  replaced_at timestamptz not null default now()
);

create table public.damage_reports (
  id uuid primary key default gen_random_uuid(),
  cleaning_id uuid references public.cleanings(id) on delete cascade,
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  inventory_item_id uuid references public.inventory_items(id) on delete set null,
  report_type text not null check (report_type in ('dano', 'faltante')),
  title text not null,
  description text,
  item_name text,
  damage_type text,
  priority public.priority_level not null default 'media',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.maintenance_tickets (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  cleaning_id uuid references public.cleanings(id) on delete set null,
  title text not null,
  description text,
  maintenance_area text,
  maintenance_category text,
  status public.ticket_status not null default 'abierto',
  priority public.priority_level not null default 'media',
  assigned_to text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  cleaning_id uuid references public.cleanings(id) on delete cascade,
  damage_report_id uuid references public.damage_reports(id) on delete cascade,
  kind public.photo_kind not null,
  storage_path text not null,
  caption text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  uploaded_at timestamptz not null default now()
);

create index apartments_client_idx on public.apartments(client_id);
create index cleanings_apartment_idx on public.cleanings(apartment_id);
create index cleanings_assigned_to_idx on public.cleanings(assigned_to);
create index cleanings_supervisor_idx on public.cleanings(supervisor_id);
create index linen_items_apartment_idx on public.linen_items(apartment_id);
create index cleaning_linen_replacements_cleaning_idx on public.cleaning_linen_replacements(cleaning_id);
create index cleaning_linen_replacements_linen_item_idx on public.cleaning_linen_replacements(linen_item_id);
create index damage_reports_cleaning_idx on public.damage_reports(cleaning_id);
create index damage_reports_inventory_item_idx on public.damage_reports(inventory_item_id);
create index tickets_apartment_idx on public.maintenance_tickets(apartment_id);
create index photos_cleaning_idx on public.photos(cleaning_id);

create or replace function public.current_profile_role()
returns public.app_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_client_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select client_id from public.profiles where id = auth.uid()
$$;

create or replace function public.can_manage_operations()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.current_profile_role() in ('admin', 'supervisor', 'administrador_cliente'), false)
$$;

alter table public.clients enable row level security;
alter table public.profiles enable row level security;
alter table public.apartments enable row level security;
alter table public.cleanings enable row level security;
alter table public.checklist_templates enable row level security;
alter table public.cleaning_checklist_items enable row level security;
alter table public.inventory_items enable row level security;
alter table public.linen_items enable row level security;
alter table public.cleaning_linen_replacements enable row level security;
alter table public.damage_reports enable row level security;
alter table public.maintenance_tickets enable row level security;
alter table public.photos enable row level security;

create policy "profiles can read same client profiles"
on public.profiles for select
using (
  id = auth.uid()
  or public.current_profile_role() = 'admin'
  or client_id = public.current_client_id()
);

create policy "admins can manage profiles"
on public.profiles for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

create policy "clients visible by membership"
on public.clients for select
using (id = public.current_client_id() or public.current_profile_role() = 'admin');

create policy "client managers can manage clients"
on public.clients for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

create policy "apartments visible by client or owner"
on public.apartments for select
using (
  public.current_profile_role() = 'admin'
  or client_id = public.current_client_id()
  or owner_profile_id = auth.uid()
);

create policy "operation managers can manage apartments"
on public.apartments for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

create policy "cleanings visible by assignment and client"
on public.cleanings for select
using (
  public.current_profile_role() = 'admin'
  or assigned_to = auth.uid()
  or exists (
    select 1 from public.apartments a
    where a.id = cleanings.apartment_id
    and (a.client_id = public.current_client_id() or a.owner_profile_id = auth.uid())
  )
);

create policy "operation managers can create cleanings"
on public.cleanings for insert
with check (public.can_manage_operations());

create policy "assigned cleaners can update their cleanings"
on public.cleanings for update
using (assigned_to = auth.uid() or public.can_manage_operations())
with check (assigned_to = auth.uid() or public.can_manage_operations());

create policy "checklist templates visible by client"
on public.checklist_templates for select
using (client_id = public.current_client_id() or public.current_profile_role() = 'admin');

create policy "operation managers can manage checklist templates"
on public.checklist_templates for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

create policy "checklist items visible through cleaning"
on public.cleaning_checklist_items for select
using (
  exists (
    select 1 from public.cleanings c
    where c.id = cleaning_checklist_items.cleaning_id
    and (c.assigned_to = auth.uid() or public.can_manage_operations())
  )
);

create policy "assigned cleaners can update checklist"
on public.cleaning_checklist_items for all
using (
  exists (
    select 1 from public.cleanings c
    where c.id = cleaning_checklist_items.cleaning_id
    and (c.assigned_to = auth.uid() or public.can_manage_operations())
  )
)
with check (
  exists (
    select 1 from public.cleanings c
    where c.id = cleaning_checklist_items.cleaning_id
    and (c.assigned_to = auth.uid() or public.can_manage_operations())
  )
);

create policy "inventory visible through apartments"
on public.inventory_items for select
using (
  public.current_profile_role() = 'admin'
  or exists (
    select 1 from public.apartments a
    where a.id = inventory_items.apartment_id
    and (a.client_id = public.current_client_id() or a.owner_profile_id = auth.uid())
  )
);

create policy "operations can manage inventory"
on public.inventory_items for all
using (public.can_manage_operations() or public.current_profile_role() = 'limpieza')
with check (public.can_manage_operations() or public.current_profile_role() = 'limpieza');

create policy "linen visible through apartments"
on public.linen_items for select
using (
  public.current_profile_role() = 'admin'
  or exists (
    select 1 from public.apartments a
    where a.id = linen_items.apartment_id
    and (a.client_id = public.current_client_id() or a.owner_profile_id = auth.uid())
  )
);

create policy "operations can manage linen"
on public.linen_items for all
using (public.can_manage_operations() or public.current_profile_role() = 'limpieza')
with check (public.can_manage_operations() or public.current_profile_role() = 'limpieza');

create policy "linen replacements visible through cleaning"
on public.cleaning_linen_replacements for select
using (
  exists (
    select 1 from public.cleanings c
    where c.id = cleaning_linen_replacements.cleaning_id
    and (c.assigned_to = auth.uid() or public.can_manage_operations())
  )
);

create policy "operations can manage linen replacements"
on public.cleaning_linen_replacements for all
using (
  public.can_manage_operations()
  or exists (
    select 1 from public.cleanings c
    where c.id = cleaning_linen_replacements.cleaning_id
    and c.assigned_to = auth.uid()
  )
)
with check (
  public.can_manage_operations()
  or exists (
    select 1 from public.cleanings c
    where c.id = cleaning_linen_replacements.cleaning_id
    and c.assigned_to = auth.uid()
  )
);

create policy "operations can manage damage reports"
on public.damage_reports for all
using (public.can_manage_operations() or created_by = auth.uid())
with check (public.can_manage_operations() or created_by = auth.uid());

create policy "tickets visible by client"
on public.maintenance_tickets for select
using (
  public.current_profile_role() = 'admin'
  or exists (
    select 1 from public.apartments a
    where a.id = maintenance_tickets.apartment_id
    and (a.client_id = public.current_client_id() or a.owner_profile_id = auth.uid())
  )
);

create policy "operations can manage tickets"
on public.maintenance_tickets for all
using (public.can_manage_operations() or created_by = auth.uid())
with check (public.can_manage_operations() or created_by = auth.uid());

create policy "photos visible through cleaning or report"
on public.photos for select
using (
  public.current_profile_role() = 'admin'
  or exists (
    select 1 from public.cleanings c
    where c.id = photos.cleaning_id
    and (c.assigned_to = auth.uid() or public.can_manage_operations())
  )
  or uploaded_by = auth.uid()
);

create policy "operations can upload photos"
on public.photos for insert
with check (public.can_manage_operations() or uploaded_by = auth.uid());

insert into storage.buckets (id, name, public)
values ('cleaning-photos', 'cleaning-photos', false)
on conflict (id) do nothing;

create policy "authenticated users can upload cleaning photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'cleaning-photos');

create policy "authenticated users can read cleaning photos"
on storage.objects for select
to authenticated
using (bucket_id = 'cleaning-photos');
