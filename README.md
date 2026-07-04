# Housekeeping 5 Estrellas

MVP web para operar limpieza, inventario, danos/faltantes y tickets de mantenimiento en departamentos de Airbnb.

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Supabase para base de datos, auth y storage
- Vercel para deployment

## Secciones incluidas

- Dashboard
- Departamentos
- Limpiezas
- Nueva limpieza
- Checklist
- Inventario
- Danos y faltantes
- Tickets de mantenimiento
- Reporte simple por limpieza

## Flujo principal

1. Ver limpiezas pendientes en el dashboard o en `Limpiezas`.
2. Abrir una limpieza y marcarla como iniciada.
3. Subir fotos de recepcion.
4. Llenar checklist por areas.
5. Revisar inventario basico.
6. Registrar danos o faltantes con foto.
7. Subir fotos finales.
8. Enviar limpieza a supervision.

## Estructura

```txt
src/
  app/
    (app)/
      departamentos/
      limpiezas/
      checklist/
      inventario/
      danos-faltantes/
      tickets/
      reportes/limpieza/
    globals.css
    layout.tsx
  components/
    layout/
    ui/
    cleaning-card.tsx
    page-header.tsx
  lib/
    supabase/
    demo-data.ts
    utils.ts
  types/
supabase/
  schema.sql
```

## Correr localmente

1. Instala dependencias:

```bash
npm install
```

2. Crea el archivo de entorno:

```bash
cp .env.example .env.local
```

3. Agrega tus llaves de Supabase en `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Inicia el servidor local:

```bash
npm run dev
```

5. Abre `http://localhost:3000`.

## Supabase

1. Crea un proyecto en Supabase.
2. En SQL Editor, ejecuta el archivo `supabase/schema.sql`.
3. Crea usuarios desde Supabase Auth.
4. Inserta su perfil en `public.profiles` con uno de estos roles:

- `admin`
- `supervisor`
- `limpieza`
- `propietario`
- `administrador_cliente`

5. Usa el bucket privado `cleaning-photos` para fotos de recepcion, danos/faltantes y fotos finales.

## Estado actual del MVP

La interfaz usa datos demo para que el flujo sea navegable desde el primer arranque. La conexion Supabase ya esta preparada en `src/lib/supabase`, y el esquema incluye tablas, relaciones, roles, politicas RLS basicas y storage.

Siguientes pasos naturales:

- Conectar formularios a Server Actions o Route Handlers.
- Agregar pantalla de login.
- Generar tipos con `supabase gen types typescript`.
- Cambiar listados demo por consultas reales.
- Implementar exportacion PDF del reporte.
