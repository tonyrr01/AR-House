-- Housekeeping 5 Estrellas - Politicas para perfiles iniciales
-- Ejecutar en Supabase SQL Editor despues de supabase/schema.sql.

drop policy if exists "authenticated users can create own profile" on public.profiles;
create policy "authenticated users can create own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "authenticated users can update own basic profile" on public.profiles;
create policy "authenticated users can update own basic profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());
