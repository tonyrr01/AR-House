# Housekeeping 5 Estrellas - Instrucciones para Codex

## Objetivo del proyecto
Crear una app web para operar limpieza premium, inventario, daños, faltantes, reportes y tickets de mantenimiento para departamentos Airbnb y rentas vacacionales.

## Contexto
En julio iniciaremos con 4 departamentos. El negocio combina software operativo, empresa de limpieza premium y servicio para administradores de propiedades. Cuando la operación esté estable al 100%, se anexará el servicio de mantenimiento.

El problema que resolvemos es: malos reviews por limpieza deficiente, daños no detectados, faltantes de utensilios, toallas y blancos, textiles en mal estado, mobiliario dañado y falta de evidencia para cobrar afectaciones al huésped.

## Prioridades del MVP
1. Usabilidad en tablet.
2. Flujo simple para personal de limpieza.
3. Evidencia fotográfica obligatoria.
4. Control básico de inventario por unidad.
5. Registro de daños y faltantes.
6. Tickets de mantenimiento.
7. Reportes claros para propietarios y administradores.
8. Código simple, ordenado y mantenible.

## Stack técnico
Usar:
- Next.js con App Router.
- TypeScript.
- Tailwind CSS.
- Supabase para base de datos, autenticación y almacenamiento de fotos.
- Vercel para deployment.

## Roles
- admin: acceso total.
- supervisor: revisa y aprueba limpiezas.
- limpieza: llena checklist, sube fotos y reporta hallazgos.
- propietario: consulta reportes de sus unidades.
- administrador_cliente: consulta unidades asignadas y reportes.

## Módulos actuales del MVP
1. Dashboard.
2. Departamentos.
3. Limpiezas.
4. Nueva limpieza.
5. Checklist.
6. Inventario.
7. Blancos.
8. Lavandería y Bodega.
9. Daños y faltantes.
10. Mantenimiento y Activos.
11. Tickets de mantenimiento.
12. Reporte simple por limpieza.

## Módulos conectados parcialmente a Supabase
- Lavandería y Bodega: lectura/creación de lotes y movimientos con respaldo de datos demo.
- Mantenimiento y Activos: tickets, órdenes, preventivos, activos, refacciones, técnicos, costos y evidencias con respaldo de datos demo.

Mantener los datos demo organizados como respaldo visual mientras cada módulo se conecta completamente a Supabase.

## Flujo principal
El personal de limpieza debe poder:
1. Ver limpiezas pendientes.
2. Seleccionar departamento.
3. Iniciar limpieza.
4. Subir fotos de cómo se recibió el departamento.
5. Llenar checklist por áreas.
6. Revisar inventario básico.
7. Registrar daños o faltantes con foto.
8. Subir fotos finales.
9. Enviar limpieza a supervisión.

## Reglas de operación
- No permitir cerrar una limpieza sin fotos finales.
- No permitir aprobar una limpieza sin revisión del supervisor.
- Todo daño debe tener foto.
- Todo faltante debe ligarse a un artículo de inventario cuando sea posible.
- Todo ticket debe tener prioridad: urgente, importante o preventivo.
- Cada limpieza debe guardar fecha, hora de inicio, hora de fin y responsable.
- El sistema debe funcionar bien en tablet.
- El historial por departamento debe conservarse.

## Áreas del checklist
- Sala.
- Cocina.
- Recámaras.
- Baños.
- Balcón.
- Blancos.
- Utensilios.
- Electrónicos.
- Pisos.
- Puertas.
- Ventanas.
- Olores.
- Ruidos.
- Aires acondicionados.
- Internet.
- Cerraduras.

## Qué NO hacer todavía
No implementar en la primera versión:
- Integración directa con Airbnb.
- Cobros automáticos.
- Facturación.
- IA avanzada.
- App nativa iOS/Android.
- Automatización avanzada de lavandería.
- Reposición automática de blancos.
- Módulo financiero complejo.

Primero construir un MVP funcional para operar los 4 departamentos de julio.
