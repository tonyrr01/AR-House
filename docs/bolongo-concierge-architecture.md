# Bolongo Concierge - Arquitectura inicial

## Objetivo
Bolongo Concierge será una plataforma digital para operar servicios premium en Bolongo, Punta de Mita: solicitudes de huéspedes, aprobaciones de propietarios, coordinación de proveedores, accesos, emergencias, evidencias y seguimiento operativo.

## Alcance MVP
El MVP debe cubrir:

- Autenticación por rol con Supabase Auth.
- Unidades, estancias, huéspedes y pre-check-in.
- Catálogo de servicios y categorías.
- Solicitudes de servicio con prioridad, estado, cotización y asignación de proveedor.
- Chat por solicitud.
- Adjuntos/evidencias por solicitud.
- Auditoría de cambios de estado y campos críticos.
- Calificaciones de servicios.
- Panel básico para concierge, propietarios, proveedores y seguridad.

## Monorepo propuesto
```txt
apps/
  admin/      Panel web administrativo en Next.js.
  mobile/     App móvil en React Native + Expo.
packages/
  config/     Configuración compartida de TypeScript, ESLint, Tailwind e i18n.
  types/      Tipos compartidos del dominio.
  ui/         Componentes compartidos cuando el diseño se estabilice.
supabase/
  migrations/ Esquemas versionados de base de datos.
  seed/       Datos iniciales para catálogos.
docs/         Decisiones técnicas y documentación de producto.
```

La app web actual de housekeeping puede convivir temporalmente en la raíz. Cuando convenga, se puede mover a `apps/admin` o mantenerla como panel operativo separado.

## Apps

### Mobile
React Native con Expo para huéspedes, propietarios, proveedores y seguridad. Debe priorizar flujos rápidos: solicitar servicio, ver estado, responder chat, subir evidencia y validar accesos.

### Admin
Next.js con App Router para concierge y admin. Debe ofrecer bandeja de solicitudes, filtros por unidad/fecha/categoría/prioridad, asignación de proveedores, cotización, auditoría y reportes.

## Backend
Supabase cubre:

- PostgreSQL: datos operativos.
- Auth: identidad y sesión.
- Storage: evidencias, documentos de pre-check-in y fotos.
- Row Level Security: aislamiento por rol.

Las integraciones externas de push, email y WhatsApp se preparan mediante tablas de `notification_events`, pero no se implementan todavía.

## Roles y permisos base

- `guest`: ve su estancia, solicitudes, pases y mensajes.
- `owner`: ve sus unidades, reportes, solicitudes asociadas y aprueba gastos.
- `concierge`: gestiona solicitudes, cotizaciones, estados, proveedores y chat.
- `vendor`: ve solicitudes asignadas y sube avances/evidencias.
- `security`: ve pases, emergencias e incidencias.
- `admin`: acceso total.

## Estados de solicitud
Flujo recomendado:

```txt
requested -> reviewing -> quoted -> approved -> scheduled -> in_progress -> completed -> rated
```

Estados alternos: `cancelled`.

## i18n
El contenido visible debe guardar llaves o campos separados por idioma cuando aplique. Para el MVP se usa español como fuente principal con campos `name_es`, `description_es`, `instructions_es`; se dejan campos equivalentes en inglés para el futuro.

## Notificaciones
No se conectan proveedores externos en el MVP. Cada evento relevante puede insertar un registro en `notification_events` con canal previsto: `push`, `email`, `whatsapp` o `in_app`.

## Próximos pasos
1. Crear proyectos reales en `apps/mobile` y `apps/admin`.
2. Generar tipos Supabase desde la base.
3. Construir autenticación por rol.
4. Implementar bandeja de solicitudes concierge.
5. Implementar creación de solicitud desde mobile.
