-- Housekeeping 5 Estrellas - Lavanderia y Bodega
-- Modelo por cantidad agrupada para MVP.
-- Ejecutar despues de supabase/schema.sql.

do $$
begin
  create type public.laundry_status as enum (
    'instalado_en_unidad',
    'sucio_recibido',
    'en_clasificacion',
    'en_pretratamiento',
    'en_lavado',
    'en_secado',
    'en_inspeccion',
    'limpio_aprobado',
    'observado',
    'manchado_recuperable',
    'manchado_no_recuperable',
    'roto',
    'percudido',
    'en_bodega',
    'kit_armado',
    'en_ruta',
    'entregado_a_unidad',
    'extraviado',
    'baja',
    'cargo_sugerido_al_huesped'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.laundry_location as enum (
    'unidad_departamento',
    'recepcion_lavanderia',
    'clasificacion',
    'pretratamiento',
    'lavadora',
    'secadora',
    'inspeccion',
    'doblado',
    'bodega_limpia',
    'bodega_observados',
    'bodega_bajas',
    'en_ruta',
    'baja_definitiva'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.linen_kit_type as enum (
    'cama_queen',
    'cama_king',
    'bano',
    'playa',
    'cocina',
    'completo_departamento'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.linen_kit_status as enum (
    'pendiente',
    'armado',
    'en_ruta',
    'entregado',
    'incompleto'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.stock_level as enum (
    'suficiente',
    'bajo',
    'critico'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.laundry_saturation_level as enum (
    'normal',
    'alta',
    'saturada'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.laundry_batches (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  apartment_id uuid references public.apartments(id) on delete set null,
  cleaning_id uuid references public.cleanings(id) on delete set null,
  received_by uuid references public.profiles(id) on delete set null,
  current_responsible_id uuid references public.profiles(id) on delete set null,
  received_at timestamptz not null default now(),
  status public.laundry_status not null default 'sucio_recibido',
  location public.laundry_location not null default 'recepcion_lavanderia',
  weight_kg numeric(10,2) not null default 0 check (weight_kg >= 0),
  total_items int not null default 0 check (total_items >= 0),
  reception_photo_count int not null default 0 check (reception_photo_count >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.laundry_batch_items (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.laundry_batches(id) on delete cascade,
  linen_item_id uuid references public.linen_items(id) on delete set null,
  category text not null,
  item_name text not null,
  size text,
  quantity_received int not null default 0 check (quantity_received >= 0),
  quantity_approved int not null default 0 check (quantity_approved >= 0),
  quantity_observed int not null default 0 check (quantity_observed >= 0),
  quantity_discarded int not null default 0 check (quantity_discarded >= 0),
  quantity_lost int not null default 0 check (quantity_lost >= 0),
  status public.laundry_status not null default 'sucio_recibido',
  unit_cost numeric(12,2) not null default 0 check (unit_cost >= 0),
  estimated_replacement_cost numeric(12,2) not null default 0 check (estimated_replacement_cost >= 0),
  suggest_guest_charge boolean not null default false,
  photo_storage_path text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint laundry_batch_items_quantity_total_check check (
    quantity_approved + quantity_observed + quantity_discarded + quantity_lost <= quantity_received
  )
);

create table if not exists public.laundry_movements (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.laundry_batches(id) on delete cascade,
  batch_item_id uuid references public.laundry_batch_items(id) on delete cascade,
  linen_item_id uuid references public.linen_items(id) on delete set null,
  from_location public.laundry_location not null,
  to_location public.laundry_location not null,
  previous_status public.laundry_status not null,
  new_status public.laundry_status not null,
  quantity int not null default 1 check (quantity > 0),
  responsible_id uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.warehouse_stock_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  category text not null,
  item_name text not null,
  size text,
  stock_available int not null default 0 check (stock_available >= 0),
  stock_reserved int not null default 0 check (stock_reserved >= 0),
  stock_minimum int not null default 0 check (stock_minimum >= 0),
  stock_target_50_rooms int not null default 0 check (stock_target_50_rooms >= 0),
  stock_target_100_rooms int not null default 0 check (stock_target_100_rooms >= 0),
  unit_cost numeric(12,2) not null default 0 check (unit_cost >= 0),
  level public.stock_level not null default 'suficiente',
  notes text,
  updated_at timestamptz not null default now(),
  unique (client_id, category, item_name, size)
);

create table if not exists public.linen_kits (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  apartment_id uuid references public.apartments(id) on delete set null,
  cleaning_id uuid references public.cleanings(id) on delete set null,
  kit_type public.linen_kit_type not null,
  status public.linen_kit_status not null default 'pendiente',
  assembled_by uuid references public.profiles(id) on delete set null,
  delivered_by uuid references public.profiles(id) on delete set null,
  assembled_at timestamptz,
  delivered_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.linen_kit_items (
  id uuid primary key default gen_random_uuid(),
  kit_id uuid not null references public.linen_kits(id) on delete cascade,
  warehouse_stock_item_id uuid references public.warehouse_stock_items(id) on delete set null,
  category text not null,
  item_name text not null,
  size text,
  quantity_required int not null default 0 check (quantity_required >= 0),
  quantity_included int not null default 0 check (quantity_included >= 0),
  status text not null default 'completo' check (status in ('completo', 'faltante', 'observado')),
  notes text
);

create table if not exists public.laundry_write_offs (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.laundry_batches(id) on delete set null,
  batch_item_id uuid references public.laundry_batch_items(id) on delete set null,
  apartment_id uuid references public.apartments(id) on delete set null,
  cleaning_id uuid references public.cleanings(id) on delete set null,
  category text not null,
  item_name text not null,
  size text,
  quantity int not null default 1 check (quantity > 0),
  reason public.laundry_status not null,
  replacement_cost numeric(12,2) not null default 0 check (replacement_cost >= 0),
  suggest_guest_charge boolean not null default false,
  photo_storage_path text,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.laundry_costs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  cost_date date not null,
  kg_processed numeric(10,2) not null default 0 check (kg_processed >= 0),
  rooms_served int not null default 0 check (rooms_served >= 0),
  labor_cost numeric(12,2) not null default 0 check (labor_cost >= 0),
  water_cost numeric(12,2) not null default 0 check (water_cost >= 0),
  gas_cost numeric(12,2) not null default 0 check (gas_cost >= 0),
  electricity_cost numeric(12,2) not null default 0 check (electricity_cost >= 0),
  chemicals_cost numeric(12,2) not null default 0 check (chemicals_cost >= 0),
  maintenance_cost numeric(12,2) not null default 0 check (maintenance_cost >= 0),
  linen_loss_cost numeric(12,2) not null default 0 check (linen_loss_cost >= 0),
  other_costs numeric(12,2) not null default 0 check (other_costs >= 0),
  total_cost numeric(12,2) generated always as (
    labor_cost + water_cost + gas_cost + electricity_cost + chemicals_cost + maintenance_cost + linen_loss_cost + other_costs
  ) stored,
  cost_per_kg numeric(12,2) generated always as (
    case when kg_processed > 0 then
      (labor_cost + water_cost + gas_cost + electricity_cost + chemicals_cost + maintenance_cost + linen_loss_cost + other_costs) / kg_processed
    else 0 end
  ) stored,
  cost_per_room numeric(12,2) generated always as (
    case when rooms_served > 0 then
      (labor_cost + water_cost + gas_cost + electricity_cost + chemicals_cost + maintenance_cost + linen_loss_cost + other_costs) / rooms_served
    else 0 end
  ) stored,
  notes text,
  created_at timestamptz not null default now(),
  unique (client_id, cost_date)
);

create table if not exists public.laundry_capacity (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  capacity_date date not null,
  washers_available int not null default 0 check (washers_available >= 0),
  dryers_available int not null default 0 check (dryers_available >= 0),
  washing_capacity_kg_day numeric(10,2) not null default 0 check (washing_capacity_kg_day >= 0),
  drying_capacity_kg_day numeric(10,2) not null default 0 check (drying_capacity_kg_day >= 0),
  kg_processed numeric(10,2) not null default 0 check (kg_processed >= 0),
  usage_percentage numeric(6,2) generated always as (
    case when least(washing_capacity_kg_day, drying_capacity_kg_day) > 0 then
      (kg_processed / least(washing_capacity_kg_day, drying_capacity_kg_day)) * 100
    else 0 end
  ) stored,
  saturation_level public.laundry_saturation_level generated always as (
    case
      when least(washing_capacity_kg_day, drying_capacity_kg_day) <= 0 then 'normal'::public.laundry_saturation_level
      when (kg_processed / least(washing_capacity_kg_day, drying_capacity_kg_day)) >= 1 then 'saturada'::public.laundry_saturation_level
      when (kg_processed / least(washing_capacity_kg_day, drying_capacity_kg_day)) >= 0.8 then 'alta'::public.laundry_saturation_level
      else 'normal'::public.laundry_saturation_level
    end
  ) stored,
  notes text,
  created_at timestamptz not null default now(),
  unique (client_id, capacity_date)
);

create index if not exists laundry_batches_client_idx on public.laundry_batches(client_id);
create index if not exists laundry_batches_apartment_idx on public.laundry_batches(apartment_id);
create index if not exists laundry_batches_cleaning_idx on public.laundry_batches(cleaning_id);
create index if not exists laundry_batch_items_batch_idx on public.laundry_batch_items(batch_id);
create index if not exists laundry_movements_batch_idx on public.laundry_movements(batch_id);
create index if not exists warehouse_stock_client_idx on public.warehouse_stock_items(client_id);
create index if not exists linen_kits_client_idx on public.linen_kits(client_id);
create index if not exists linen_kits_apartment_idx on public.linen_kits(apartment_id);
create index if not exists linen_kit_items_kit_idx on public.linen_kit_items(kit_id);
create index if not exists laundry_write_offs_cleaning_idx on public.laundry_write_offs(cleaning_id);
create index if not exists laundry_costs_client_date_idx on public.laundry_costs(client_id, cost_date);
create index if not exists laundry_capacity_client_date_idx on public.laundry_capacity(client_id, capacity_date);

alter table public.laundry_batches enable row level security;
alter table public.laundry_batch_items enable row level security;
alter table public.laundry_movements enable row level security;
alter table public.warehouse_stock_items enable row level security;
alter table public.linen_kits enable row level security;
alter table public.linen_kit_items enable row level security;
alter table public.laundry_write_offs enable row level security;
alter table public.laundry_costs enable row level security;
alter table public.laundry_capacity enable row level security;

drop policy if exists "laundry batches visible by client or assignment" on public.laundry_batches;
create policy "laundry batches visible by client or assignment"
on public.laundry_batches for select
using (
  public.current_profile_role() = 'admin'
  or received_by = auth.uid()
  or current_responsible_id = auth.uid()
  or client_id = public.current_client_id()
  or exists (
    select 1 from public.apartments a
    where a.id = laundry_batches.apartment_id
    and (a.client_id = public.current_client_id() or a.owner_profile_id = auth.uid())
  )
);

drop policy if exists "operations can manage laundry batches" on public.laundry_batches;
create policy "operations can manage laundry batches"
on public.laundry_batches for all
using (public.can_manage_operations() or received_by = auth.uid() or current_responsible_id = auth.uid())
with check (public.can_manage_operations() or received_by = auth.uid() or current_responsible_id = auth.uid());

drop policy if exists "laundry batch items visible through batch" on public.laundry_batch_items;
create policy "laundry batch items visible through batch"
on public.laundry_batch_items for select
using (
  exists (
    select 1 from public.laundry_batches b
    where b.id = laundry_batch_items.batch_id
    and (
      public.current_profile_role() = 'admin'
      or b.client_id = public.current_client_id()
      or b.received_by = auth.uid()
      or b.current_responsible_id = auth.uid()
    )
  )
);

drop policy if exists "operations can manage laundry batch items" on public.laundry_batch_items;
create policy "operations can manage laundry batch items"
on public.laundry_batch_items for all
using (
  public.can_manage_operations()
  or exists (
    select 1 from public.laundry_batches b
    where b.id = laundry_batch_items.batch_id
    and (b.received_by = auth.uid() or b.current_responsible_id = auth.uid())
  )
)
with check (
  public.can_manage_operations()
  or exists (
    select 1 from public.laundry_batches b
    where b.id = laundry_batch_items.batch_id
    and (b.received_by = auth.uid() or b.current_responsible_id = auth.uid())
  )
);

drop policy if exists "laundry movements visible through batch" on public.laundry_movements;
create policy "laundry movements visible through batch"
on public.laundry_movements for select
using (
  exists (
    select 1 from public.laundry_batches b
    where b.id = laundry_movements.batch_id
    and (
      public.current_profile_role() = 'admin'
      or b.client_id = public.current_client_id()
      or b.received_by = auth.uid()
      or b.current_responsible_id = auth.uid()
    )
  )
);

drop policy if exists "operations can create laundry movements" on public.laundry_movements;
create policy "operations can create laundry movements"
on public.laundry_movements for insert
with check (
  public.can_manage_operations()
  or responsible_id = auth.uid()
  or exists (
    select 1 from public.laundry_batches b
    where b.id = laundry_movements.batch_id
    and (b.received_by = auth.uid() or b.current_responsible_id = auth.uid())
  )
);

drop policy if exists "warehouse stock visible by client" on public.warehouse_stock_items;
create policy "warehouse stock visible by client"
on public.warehouse_stock_items for select
using (public.current_profile_role() = 'admin' or client_id = public.current_client_id());

drop policy if exists "operations can manage warehouse stock" on public.warehouse_stock_items;
create policy "operations can manage warehouse stock"
on public.warehouse_stock_items for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

drop policy if exists "linen kits visible by client or apartment" on public.linen_kits;
create policy "linen kits visible by client or apartment"
on public.linen_kits for select
using (
  public.current_profile_role() = 'admin'
  or client_id = public.current_client_id()
  or exists (
    select 1 from public.apartments a
    where a.id = linen_kits.apartment_id
    and (a.client_id = public.current_client_id() or a.owner_profile_id = auth.uid())
  )
);

drop policy if exists "operations can manage linen kits" on public.linen_kits;
create policy "operations can manage linen kits"
on public.linen_kits for all
using (public.can_manage_operations() or assembled_by = auth.uid() or delivered_by = auth.uid())
with check (public.can_manage_operations() or assembled_by = auth.uid() or delivered_by = auth.uid());

drop policy if exists "linen kit items visible through kit" on public.linen_kit_items;
create policy "linen kit items visible through kit"
on public.linen_kit_items for select
using (
  exists (
    select 1 from public.linen_kits k
    where k.id = linen_kit_items.kit_id
    and (public.current_profile_role() = 'admin' or k.client_id = public.current_client_id())
  )
);

drop policy if exists "operations can manage linen kit items" on public.linen_kit_items;
create policy "operations can manage linen kit items"
on public.linen_kit_items for all
using (
  public.can_manage_operations()
  or exists (
    select 1 from public.linen_kits k
    where k.id = linen_kit_items.kit_id
    and (k.assembled_by = auth.uid() or k.delivered_by = auth.uid())
  )
)
with check (
  public.can_manage_operations()
  or exists (
    select 1 from public.linen_kits k
    where k.id = linen_kit_items.kit_id
    and (k.assembled_by = auth.uid() or k.delivered_by = auth.uid())
  )
);

drop policy if exists "laundry write offs visible by client" on public.laundry_write_offs;
create policy "laundry write offs visible by client"
on public.laundry_write_offs for select
using (
  public.current_profile_role() = 'admin'
  or created_by = auth.uid()
  or exists (
    select 1 from public.apartments a
    where a.id = laundry_write_offs.apartment_id
    and (a.client_id = public.current_client_id() or a.owner_profile_id = auth.uid())
  )
);

drop policy if exists "operations can manage laundry write offs" on public.laundry_write_offs;
create policy "operations can manage laundry write offs"
on public.laundry_write_offs for all
using (public.can_manage_operations() or created_by = auth.uid())
with check (public.can_manage_operations() or created_by = auth.uid());

drop policy if exists "laundry costs visible by client" on public.laundry_costs;
create policy "laundry costs visible by client"
on public.laundry_costs for select
using (public.current_profile_role() = 'admin' or client_id = public.current_client_id());

drop policy if exists "operations can manage laundry costs" on public.laundry_costs;
create policy "operations can manage laundry costs"
on public.laundry_costs for all
using (public.can_manage_operations())
with check (public.can_manage_operations());

drop policy if exists "laundry capacity visible by client" on public.laundry_capacity;
create policy "laundry capacity visible by client"
on public.laundry_capacity for select
using (public.current_profile_role() = 'admin' or client_id = public.current_client_id());

drop policy if exists "operations can manage laundry capacity" on public.laundry_capacity;
create policy "operations can manage laundry capacity"
on public.laundry_capacity for all
using (public.can_manage_operations())
with check (public.can_manage_operations());
