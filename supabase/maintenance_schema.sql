-- Housekeeping 5 Estrellas - Mantenimiento y Activos
-- Ejecutar despues de supabase/schema.sql.

do $$
begin
  create type public.business_unit as enum (
    'housekeeping',
    'laundry',
    'maintenance',
    'replacements',
    'owner_charge',
    'guest_charge',
    'warranty',
    'preventive'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.maintenance_ticket_status as enum (
    'abierto',
    'en_revision',
    'diagnostico',
    'cotizacion',
    'aprobado',
    'asignado',
    'en_proceso',
    'en_espera_de_material',
    'terminado',
    'supervision',
    'cerrado',
    'cancelado'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.maintenance_priority as enum ('urgente', 'alta', 'media', 'baja', 'preventiva');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.maintenance_charge_to as enum ('huesped', 'propietario', 'operacion', 'garantia', 'preventivo', 'seguro');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.work_order_status as enum (
    'pendiente',
    'asignada',
    'en_proceso',
    'en_espera_de_material',
    'terminada',
    'en_supervision',
    'cerrada',
    'cancelada'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.maintenance_asset_tickets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  cleaning_id uuid references public.cleanings(id) on delete set null,
  damage_report_id uuid references public.damage_reports(id) on delete set null,
  source_module text not null default 'manual',
  source_id uuid,
  title text not null,
  description text not null,
  issue_type text not null default 'Desperfecto',
  category text not null,
  priority public.maintenance_priority not null default 'media',
  status public.maintenance_ticket_status not null default 'abierto',
  area text not null default 'otro',
  reported_by uuid references public.profiles(id) on delete set null,
  reported_at timestamptz not null default now(),
  estimated_cost numeric(12,2) not null default 0 check (estimated_cost >= 0),
  final_cost numeric(12,2) not null default 0 check (final_cost >= 0),
  suggested_charge_to_guest boolean not null default false,
  charge_to public.maintenance_charge_to not null default 'operacion',
  business_unit public.business_unit not null default 'maintenance',
  due_date date,
  assigned_specialty text,
  assigned_technician_id uuid,
  observations text,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint maintenance_guest_charge_requires_cost check (
    suggested_charge_to_guest = false or estimated_cost > 0
  )
);

create table if not exists public.technicians (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  name text not null,
  specialty text not null,
  phone text,
  email text,
  internal_or_external text not null default 'externo' check (internal_or_external in ('interno', 'externo')),
  hourly_rate numeric(12,2) not null default 0 check (hourly_rate >= 0),
  active boolean not null default true,
  rating numeric(3,2) not null default 5 check (rating >= 0 and rating <= 5),
  notes text,
  created_at timestamptz not null default now()
);

do $$
begin
  alter table public.maintenance_asset_tickets
    add constraint maintenance_asset_tickets_assigned_technician_fkey
    foreign key (assigned_technician_id) references public.technicians(id) on delete set null;
exception
  when duplicate_object then null;
end $$;

create table if not exists public.work_orders (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.maintenance_asset_tickets(id) on delete cascade,
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  title text not null,
  description text,
  assigned_technician_id uuid references public.technicians(id) on delete set null,
  specialty text,
  scheduled_date date,
  start_time time,
  end_time time,
  status public.work_order_status not null default 'pendiente',
  diagnosis text,
  work_performed text,
  labor_cost numeric(12,2) not null default 0 check (labor_cost >= 0),
  material_cost numeric(12,2) not null default 0 check (material_cost >= 0),
  total_cost numeric(12,2) generated always as (labor_cost + material_cost) stored,
  supervisor_approval boolean not null default false,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  charge_to public.maintenance_charge_to not null default 'operacion',
  business_unit public.business_unit not null default 'maintenance',
  observations text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.preventive_maintenance_plans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  frequency text not null default 'bimestral',
  next_date date not null,
  last_date date,
  status text not null default 'vigente',
  assigned_supervisor uuid references public.profiles(id) on delete set null,
  checklist_template_id text,
  observations text,
  created_at timestamptz not null default now()
);

create table if not exists public.preventive_maintenance_visits (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.preventive_maintenance_plans(id) on delete cascade,
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  scheduled_date date not null,
  completed_date date,
  responsible uuid references public.profiles(id) on delete set null,
  status text not null default 'programada',
  checklist_results jsonb not null default '[]'::jsonb,
  tickets_created int not null default 0 check (tickets_created >= 0),
  photos_count int not null default 0 check (photos_count >= 0),
  general_condition text,
  estimated_repairs_cost numeric(12,2) not null default 0 check (estimated_repairs_cost >= 0),
  observations text,
  created_at timestamptz not null default now()
);

create table if not exists public.technical_assets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  category text not null,
  area text not null default 'otro',
  name text not null,
  brand text,
  model text,
  serial_number text,
  material_type text,
  color text,
  finish text,
  dimensions text,
  supplier text,
  purchase_date date,
  installation_date date,
  warranty_until date,
  cost numeric(12,2) not null default 0 check (cost >= 0),
  replacement_cost numeric(12,2) not null default 0 check (replacement_cost >= 0),
  photo_storage_path text,
  manual_storage_path text,
  compatible_parts text[] not null default '{}',
  maintenance_notes text,
  cleaning_care_notes text,
  status text not null default 'ok',
  observations text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spare_parts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  name text not null,
  category text not null,
  brand text,
  model text,
  compatible_asset_ids uuid[] not null default '{}',
  compatible_properties uuid[] not null default '{}',
  stock_actual int not null default 0 check (stock_actual >= 0),
  stock_minimo int not null default 0 check (stock_minimo >= 0),
  unit_cost numeric(12,2) not null default 0 check (unit_cost >= 0),
  supplier text,
  supplier_contact text,
  location text,
  photo_storage_path text,
  lead_time_days int not null default 0 check (lead_time_days >= 0),
  status text not null default 'disponible',
  observations text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_order_materials (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  spare_part_id uuid not null references public.spare_parts(id) on delete restrict,
  quantity int not null check (quantity > 0),
  unit_cost numeric(12,2) not null default 0 check (unit_cost >= 0),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.maintenance_costs (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.maintenance_asset_tickets(id) on delete set null,
  work_order_id uuid references public.work_orders(id) on delete set null,
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  cost_date date not null default current_date,
  labor_cost numeric(12,2) not null default 0 check (labor_cost >= 0),
  material_cost numeric(12,2) not null default 0 check (material_cost >= 0),
  spare_parts_cost numeric(12,2) not null default 0 check (spare_parts_cost >= 0),
  external_service_cost numeric(12,2) not null default 0 check (external_service_cost >= 0),
  total_cost numeric(12,2) generated always as (labor_cost + material_cost + spare_parts_cost + external_service_cost) stored,
  charge_to public.maintenance_charge_to not null default 'operacion',
  business_unit public.business_unit not null default 'maintenance',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.maintenance_evidence (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.maintenance_asset_tickets(id) on delete cascade,
  work_order_id uuid references public.work_orders(id) on delete cascade,
  evidence_kind text not null check (evidence_kind in ('antes', 'durante', 'despues', 'diagnostico', 'cierre')),
  storage_path text not null,
  caption text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  uploaded_at timestamptz not null default now()
);

create index if not exists maintenance_asset_tickets_apartment_idx on public.maintenance_asset_tickets(apartment_id);
create index if not exists maintenance_asset_tickets_cleaning_idx on public.maintenance_asset_tickets(cleaning_id);
create index if not exists maintenance_asset_tickets_damage_idx on public.maintenance_asset_tickets(damage_report_id);
create index if not exists work_orders_ticket_idx on public.work_orders(ticket_id);
create index if not exists preventive_plans_apartment_idx on public.preventive_maintenance_plans(apartment_id);
create index if not exists technical_assets_apartment_idx on public.technical_assets(apartment_id);
create index if not exists spare_parts_client_idx on public.spare_parts(client_id);
create index if not exists maintenance_costs_ticket_idx on public.maintenance_costs(ticket_id);
create index if not exists maintenance_evidence_ticket_idx on public.maintenance_evidence(ticket_id);

create or replace function public.decrement_spare_part_stock(
  p_spare_part_id uuid,
  p_quantity int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_stock int;
begin
  if p_quantity <= 0 then
    raise exception 'Quantity must be positive';
  end if;

  select stock_actual into current_stock
  from public.spare_parts
  where id = p_spare_part_id
  for update;

  if current_stock is null then
    raise exception 'Spare part not found';
  end if;

  if current_stock < p_quantity then
    raise exception 'Not enough stock';
  end if;

  update public.spare_parts
  set stock_actual = stock_actual - p_quantity,
      status = case
        when stock_actual - p_quantity <= 0 then 'critico'
        when stock_actual - p_quantity <= stock_minimo then 'stock_bajo'
        else status
      end,
      updated_at = now()
  where id = p_spare_part_id;
end;
$$;

alter table public.maintenance_asset_tickets enable row level security;
alter table public.technicians enable row level security;
alter table public.work_orders enable row level security;
alter table public.preventive_maintenance_plans enable row level security;
alter table public.preventive_maintenance_visits enable row level security;
alter table public.technical_assets enable row level security;
alter table public.spare_parts enable row level security;
alter table public.work_order_materials enable row level security;
alter table public.maintenance_costs enable row level security;
alter table public.maintenance_evidence enable row level security;

drop policy if exists "maintenance tickets visible by client" on public.maintenance_asset_tickets;
create policy "maintenance tickets visible by client"
on public.maintenance_asset_tickets for select
using (
  public.current_profile_role() = 'admin'
  or client_id = public.current_client_id()
  or exists (
    select 1 from public.apartments a
    where a.id = maintenance_asset_tickets.apartment_id
    and (a.client_id = public.current_client_id() or a.owner_profile_id = auth.uid())
  )
);

drop policy if exists "operations can manage maintenance tickets" on public.maintenance_asset_tickets;
create policy "operations can manage maintenance tickets"
on public.maintenance_asset_tickets for all
using (public.can_manage_operations() or reported_by = auth.uid())
with check (public.can_manage_operations() or reported_by = auth.uid());

drop policy if exists "maintenance shared visible by client" on public.technicians;
create policy "maintenance shared visible by client"
on public.technicians for select
using (public.current_profile_role() = 'admin' or client_id = public.current_client_id());

drop policy if exists "operations can manage technicians" on public.technicians;
create policy "operations can manage technicians"
on public.technicians for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

drop policy if exists "work orders visible through ticket" on public.work_orders;
create policy "work orders visible through ticket"
on public.work_orders for select
using (
  public.current_profile_role() = 'admin'
  or exists (
    select 1 from public.maintenance_asset_tickets t
    where t.id = work_orders.ticket_id
    and (t.client_id = public.current_client_id() or t.reported_by = auth.uid())
  )
);

drop policy if exists "operations can manage work orders" on public.work_orders;
create policy "operations can manage work orders"
on public.work_orders for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

drop policy if exists "maintenance apartment data visible by client" on public.preventive_maintenance_plans;
create policy "maintenance apartment data visible by client"
on public.preventive_maintenance_plans for select
using (
  public.current_profile_role() = 'admin'
  or client_id = public.current_client_id()
  or exists (
    select 1 from public.apartments a
    where a.id = preventive_maintenance_plans.apartment_id
    and (a.client_id = public.current_client_id() or a.owner_profile_id = auth.uid())
  )
);

drop policy if exists "operations can manage preventive plans" on public.preventive_maintenance_plans;
create policy "operations can manage preventive plans"
on public.preventive_maintenance_plans for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

drop policy if exists "preventive visits visible through plan" on public.preventive_maintenance_visits;
create policy "preventive visits visible through plan"
on public.preventive_maintenance_visits for select
using (
  public.current_profile_role() = 'admin'
  or exists (
    select 1 from public.preventive_maintenance_plans p
    where p.id = preventive_maintenance_visits.plan_id
    and p.client_id = public.current_client_id()
  )
);

drop policy if exists "operations can manage preventive visits" on public.preventive_maintenance_visits;
create policy "operations can manage preventive visits"
on public.preventive_maintenance_visits for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

drop policy if exists "technical assets visible by client" on public.technical_assets;
create policy "technical assets visible by client"
on public.technical_assets for select
using (
  public.current_profile_role() = 'admin'
  or client_id = public.current_client_id()
  or exists (
    select 1 from public.apartments a
    where a.id = technical_assets.apartment_id
    and (a.client_id = public.current_client_id() or a.owner_profile_id = auth.uid())
  )
);

drop policy if exists "operations can manage technical assets" on public.technical_assets;
create policy "operations can manage technical assets"
on public.technical_assets for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

drop policy if exists "spare parts visible by client" on public.spare_parts;
create policy "spare parts visible by client"
on public.spare_parts for select
using (public.current_profile_role() = 'admin' or client_id = public.current_client_id());

drop policy if exists "operations can manage spare parts" on public.spare_parts;
create policy "operations can manage spare parts"
on public.spare_parts for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

drop policy if exists "work order materials visible through order" on public.work_order_materials;
create policy "work order materials visible through order"
on public.work_order_materials for select
using (
  public.current_profile_role() = 'admin'
  or exists (
    select 1 from public.work_orders wo
    join public.maintenance_asset_tickets t on t.id = wo.ticket_id
    where wo.id = work_order_materials.work_order_id
    and t.client_id = public.current_client_id()
  )
);

drop policy if exists "operations can manage work order materials" on public.work_order_materials;
create policy "operations can manage work order materials"
on public.work_order_materials for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

drop policy if exists "maintenance costs visible by client" on public.maintenance_costs;
create policy "maintenance costs visible by client"
on public.maintenance_costs for select
using (
  public.current_profile_role() = 'admin'
  or exists (
    select 1 from public.apartments a
    where a.id = maintenance_costs.apartment_id
    and (a.client_id = public.current_client_id() or a.owner_profile_id = auth.uid())
  )
);

drop policy if exists "operations can manage maintenance costs" on public.maintenance_costs;
create policy "operations can manage maintenance costs"
on public.maintenance_costs for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

drop policy if exists "maintenance evidence visible through ticket" on public.maintenance_evidence;
create policy "maintenance evidence visible through ticket"
on public.maintenance_evidence for select
using (
  public.current_profile_role() = 'admin'
  or uploaded_by = auth.uid()
  or exists (
    select 1 from public.maintenance_asset_tickets t
    where t.id = maintenance_evidence.ticket_id
    and (t.client_id = public.current_client_id() or t.reported_by = auth.uid())
  )
);

drop policy if exists "operations can upload maintenance evidence" on public.maintenance_evidence;
create policy "operations can upload maintenance evidence"
on public.maintenance_evidence for insert
with check (public.can_manage_operations() or uploaded_by = auth.uid());

insert into storage.buckets (id, name, public)
values ('maintenance-evidence', 'maintenance-evidence', false)
on conflict (id) do nothing;

drop policy if exists "authenticated users can upload maintenance evidence" on storage.objects;
create policy "authenticated users can upload maintenance evidence"
on storage.objects for insert
to authenticated
with check (bucket_id = 'maintenance-evidence');

drop policy if exists "authenticated users can read maintenance evidence" on storage.objects;
create policy "authenticated users can read maintenance evidence"
on storage.objects for select
to authenticated
using (bucket_id = 'maintenance-evidence');
