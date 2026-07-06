# Housekeeping 5 Estrellas - Booking Test de Interfaces v1.0

## Objetivo
Validar que la v1.0 del MVP pueda demostrarse y operarse sin fallas críticas en tablet, desktop y celular para limpieza, supervisión, administración, propietarios y administradores cliente.

Este documento cubre pruebas funcionales, visuales, datos, permisos, Supabase, Storage, rutas y errores esperados. La meta es reducir al máximo las fallas antes de demo o salida operativa, aunque ningún plan puede garantizar el 100% absoluto de escenarios reales.

## Alcance v1.0
Módulos incluidos:
1. Login, registro, recuperación y sesión.
2. Dashboard.
3. Departamentos.
4. Limpiezas.
5. Nueva limpieza.
6. Checklist.
7. Inventario.
8. Blancos.
9. Lavandería y Bodega.
10. Daños y faltantes.
11. Mantenimiento y Activos.
12. Tickets de mantenimiento.
13. Reporte simple por limpieza.

## Ambientes a probar
- Local: `http://localhost:3000`.
- Producción: `https://housekeeping-5-estrellas.vercel.app`.
- Supabase: proyecto conectado con tablas base, lavandería y mantenimiento.
- Navegadores: Chrome, Safari y navegador de tablet.

## Dispositivos mínimos
- Tablet horizontal: 1024 x 768.
- Tablet vertical: 768 x 1024.
- Celular: 390 x 844.
- Desktop: 1440 x 900.

## Roles a probar
- `admin`: acceso total.
- `supervisor`: revisión y operación.
- `limpieza`: flujo operativo de limpieza.
- `propietario`: consulta de reportes/unidades.
- `administrador_cliente`: consulta y operación asignada.

## Criterios de severidad
- P0 Bloqueante: impide entrar, guardar datos críticos o navegar el flujo principal.
- P1 Alta: rompe una operación clave, evidencia, permisos, visual crítico en tablet o datos incorrectos.
- P2 Media: inconsistencia visual, copy confuso, validación menor, dato secundario.
- P3 Baja: mejora estética o detalle no bloqueante.

## Criterios de salida v1.0
La versión puede liberarse si:
- No hay errores P0.
- No hay errores P1 abiertos en Login, Limpiezas, Fotos, Daños/Faltantes, Lavandería, Mantenimiento o Reportes.
- La app navega completa en tablet.
- El formulario de Departamentos guarda en Supabase.
- Lavandería y Mantenimiento no pierden datos al guardar.
- Las rutas del menú abren sin pantalla rota.
- El diseño no tiene textos encimados ni botones imposibles de tocar.

## Datos mínimos para pruebas
Crear o confirmar:
- 1 usuario admin.
- 1 usuario supervisor.
- 1 usuario limpieza.
- 1 usuario propietario.
- 1 usuario administrador_cliente.
- 4 departamentos activos.
- 3 limpiezas pendientes.
- 1 limpieza en progreso.
- 1 limpieza en supervisión.
- 10 artículos de inventario.
- 10 blancos.
- 1 lote de lavandería.
- 1 ticket de mantenimiento.
- 1 daño o faltante con foto.

## Pruebas globales
| ID | Área | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- | --- |
| G-001 | Carga | Abrir `/` sin sesión | Redirige a login o muestra acceso controlado | P0 |
| G-002 | Carga | Abrir `/` con sesión válida | Dashboard visible sin error | P0 |
| G-003 | Menú | Abrir cada ruta del menú | Todas cargan sin 404 ni crash | P0 |
| G-004 | Menú tablet | Navegar en tablet horizontal | Menú usable, sin saturación ni encimados | P1 |
| G-005 | Menú móvil | Navegar en celular | Menú horizontal deslizable, botones tocables | P1 |
| G-006 | Sesión | Click en Salir | Cierra sesión y vuelve a login | P0 |
| G-007 | Errores | Desconectar Supabase o quitar env local | App no crashea; muestra fallback o error entendible | P1 |
| G-008 | Visual | Revisar tipografías y cards | Jerarquía clara, estilo premium operativo | P2 |
| G-009 | Accesibilidad | Tabular por formularios | Orden lógico y campos enfocables | P2 |
| G-010 | Touch | Botones principales en tablet | Altura cómoda, no menores a target táctil | P1 |

## Login y cuenta
| ID | Caso | Pasos | Resultado esperado | Severidad |
| --- | --- | --- | --- | --- |
| A-001 | Login correcto | Ingresar correo y contraseña válidos | Entra al dashboard | P0 |
| A-002 | Login incorrecto | Contraseña equivocada | Muestra error claro sin borrar interfaz | P1 |
| A-003 | Registro | Crear cuenta con contraseña confirmada | Valida que ambas contraseñas coincidan | P0 |
| A-004 | Registro inválido | Contraseñas distintas | Bloquea registro y muestra mensaje | P1 |
| A-005 | Ver contraseña | Activar/desactivar ojo en password | Cambia entre texto y oculto | P2 |
| A-006 | Recuperar contraseña | Pedir reset por correo | Muestra confirmación o error claro | P1 |
| A-007 | Sesión expirada | Abrir app con sesión vencida | Redirige a login | P0 |

## Dashboard
| ID | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- |
| D-001 | Carga inicial | Cards visibles con métricas principales | P1 |
| D-002 | Limpiezas pendientes | Conteo coherente con datos demo/reales | P2 |
| D-003 | Tickets | Conteo visible y no rompe si no hay tickets | P2 |
| D-004 | Acciones rápidas | Botones llevan a rutas correctas | P1 |
| D-005 | Tablet | Cards no se enciman ni quedan demasiado pequeñas | P1 |

## Departamentos
| ID | Caso | Pasos | Resultado esperado | Severidad |
| --- | --- | --- | --- | --- |
| DEP-001 | Listado real | Abrir `/departamentos` con Supabase activo | Muestra departamentos reales si existen | P0 |
| DEP-002 | Fallback | Tabla `apartments` vacía | Muestra datos demo para demo visual | P2 |
| DEP-003 | Alta válida | Guardar nombre, código, dirección, camas y baños | Inserta en Supabase y muestra mensaje de éxito | P0 |
| DEP-004 | Alta incompleta | Guardar sin nombre/código/dirección | Bloquea o redirige con error claro | P1 |
| DEP-005 | RLS | Usuario sin permisos intenta guardar | Muestra error de permisos, no crashea | P1 |
| DEP-006 | Campos numéricos | Poner negativos o texto en camas/baños | No guarda valores inválidos | P1 |
| DEP-007 | Visual tablet | Formulario en tablet vertical | Campos legibles y botón visible | P1 |
| DEP-008 | Historial | Refrescar después de alta | La unidad sigue apareciendo | P0 |

## Limpiezas
| ID | Caso | Pasos | Resultado esperado | Severidad |
| --- | --- | --- | --- | --- |
| LIM-001 | Ver pendientes | Abrir `/limpiezas` | Cards de limpiezas visibles | P0 |
| LIM-002 | Entrar detalle | Click en una limpieza | Abre `/limpiezas/[id]` | P0 |
| LIM-003 | Iniciar limpieza | Click en iniciar limpieza | Acción visible y no rompe layout | P1 |
| LIM-004 | Fotos recepción | Seleccionar fotos iniciales | Campo acepta imágenes múltiples | P1 |
| LIM-005 | Fotos finales | Seleccionar fotos finales | Campo acepta imágenes múltiples | P1 |
| LIM-006 | Enviar supervisión | Click enviar a supervisión | No debe permitir cierre real sin fotos finales cuando esté conectado | P0 |
| LIM-007 | Acciones laterales | Checklist, Inventario, Daños, Lavandería, Mantenimiento, Reporte | Todas navegan correctamente | P0 |
| LIM-008 | Tablet | Flujo detalle en tablet | Panel principal y acciones sin encimarse | P1 |

## Nueva limpieza
| ID | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- |
| NL-001 | Abrir formulario | Carga sin error | P0 |
| NL-002 | Seleccionar departamento | Lista departamentos disponibles | P1 |
| NL-003 | Fechas/horas | Inputs aceptan fecha y horarios | P1 |
| NL-004 | Blancos sugeridos | Campo operativo visible | P2 |
| NL-005 | Guardar incompleto | No debe guardar sin departamento/fecha cuando esté conectado | P1 |

## Checklist
| ID | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- |
| CHK-001 | Cargar checklist | Áreas principales visibles | P0 |
| CHK-002 | Marcar items | Checkboxes funcionan | P1 |
| CHK-003 | Observaciones | Textarea visible y usable | P2 |
| CHK-004 | Áreas | Sala, cocina, recámaras, baños y reglas AGENTS presentes | P1 |
| CHK-005 | Tablet | Checkboxes grandes, no apretados | P1 |

## Inventario
| ID | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- |
| INV-001 | Listado | Items visibles por departamento | P1 |
| INV-002 | Estados | ok/revisar/reponer claros visualmente | P1 |
| INV-003 | Cantidades | Esperado vs actual legibles | P1 |
| INV-004 | Formulario | Inputs iniciales no rompen layout | P2 |
| INV-005 | Relación faltante | Faltante debe poder ligarse a inventario cuando se conecte | P1 |

## Blancos
| ID | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- |
| BLA-001 | Abrir blancos | Dashboard/listado carga | P0 |
| BLA-002 | Estados textiles | Bueno, manchado, roto, baja, extraviado visibles | P1 |
| BLA-003 | Revisión blancos | Flujo de revisión carga | P0 |
| BLA-004 | Evidencia | Campo de foto visible si hay incidencia | P1 |
| BLA-005 | Cargo huésped | Incidencia con costo sugerido visible | P1 |
| BLA-006 | Tablet | Resumen y revisión no se enciman | P1 |

## Lavandería y Bodega
| ID | Caso | Pasos | Resultado esperado | Severidad |
| --- | --- | --- | --- | --- |
| LAV-001 | Abrir módulo | Abrir `/lavanderia` | Dashboard y navegación interna visibles | P0 |
| LAV-002 | Crear lote válido | Departamento, kg y piezas | Guarda lote en Supabase si hay permisos | P0 |
| LAV-003 | Crear lote inválido | Sin kg o sin piezas | Muestra error, no guarda lote incompleto | P1 |
| LAV-004 | Movimientos | Mover lote a siguiente estado | Registra movimiento si lote es real | P0 |
| LAV-005 | Sin conexión | Supabase vacío/no disponible | Muestra respaldo visual sin crash | P1 |
| LAV-006 | Bodega | Ver stock de blancos | Niveles suficiente/bajo/crítico claros | P1 |
| LAV-007 | Kits | Armar kit visual | No rompe layout | P2 |
| LAV-008 | Bajas | Ver bajas y cargos sugeridos | Costos y estado claros | P1 |
| LAV-009 | Capacidad | Ver capacidad diaria | No excede visualmente tarjetas | P2 |
| LAV-010 | Tablet | Kanban de proceso | Scroll horizontal o columnas usables | P1 |

## Daños y faltantes
| ID | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- |
| DAN-001 | Abrir módulo | Carga reportes y formulario | P0 |
| DAN-002 | Tipo daño | Campo visible y coherente | P1 |
| DAN-003 | Tipo faltante | Permite artículo y costo | P1 |
| DAN-004 | Foto obligatoria | Daño/faltante real debe exigir foto al conectar | P0 |
| DAN-005 | Enviar a mantenimiento | Botón abre Mantenimiento con origen | P0 |
| DAN-006 | Cargo huésped | Costo sugerido claro | P1 |
| DAN-007 | Tablet | Formulario no se hace pesado | P1 |

## Mantenimiento y Activos
| ID | Caso | Pasos | Resultado esperado | Severidad |
| --- | --- | --- | --- | --- |
| MAN-001 | Abrir módulo | `/mantenimiento` | Carga dashboard completo | P0 |
| MAN-002 | Crear ticket válido | Departamento, descripción, prioridad | Inserta en `maintenance_asset_tickets` | P0 |
| MAN-003 | Crear ticket sin descripción | Guardar incompleto | Muestra error | P1 |
| MAN-004 | Ticket urgente sin fecha | Prioridad urgente sin compromiso | Muestra error | P1 |
| MAN-005 | Cargo huésped sin costo | Marcar cargo sin costo | Muestra error | P1 |
| MAN-006 | Evidencia | Subir foto inicial | Guarda en Storage y `maintenance_evidence` | P0 |
| MAN-007 | Kanban estados | Revisar todos los estados | Estados no se pierden ni se enciman | P1 |
| MAN-008 | Órdenes | Tabla de órdenes carga | Datos reales o respaldo visual | P1 |
| MAN-009 | Refacciones | Stock crítico visible | Badge claro | P1 |
| MAN-010 | Técnicos | Tabla/cards cargan | Sin layout roto | P2 |
| MAN-011 | Costos | Revisar resumen | Suma correctamente | P1 |
| MAN-012 | Preventivos | Planes/visitas visibles | No rompe si están vacíos | P1 |
| MAN-013 | Tablet | Kanban y tablas con scroll | Usable sin encimarse | P1 |

## Tickets de mantenimiento legacy
| ID | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- |
| TCK-001 | Abrir `/tickets` | Ruta no falla aunque ya no esté en menú principal | P2 |
| TCK-002 | Crear ticket legacy visual | Formulario no rompe | P3 |
| TCK-003 | Consistencia | Usuario debe preferir Mantenimiento y Activos | P2 |

## Reporte simple por limpieza
| ID | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- |
| REP-001 | Abrir reporte | Carga resumen de limpieza | P0 |
| REP-002 | Checklist | Muestra avance | P1 |
| REP-003 | Inventario | Muestra incidencias | P1 |
| REP-004 | Daños/faltantes | Reporta hallazgos | P1 |
| REP-005 | Tickets | Tickets asociados visibles | P1 |
| REP-006 | Propietario | Información clara y no técnica | P2 |
| REP-007 | Tablet/celular | Reporte legible sin tablas rotas | P1 |

## RLS y permisos
| ID | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- |
| RLS-001 | Admin | Puede ver y operar todo | P0 |
| RLS-002 | Supervisor | Puede aprobar/revisar operaciones | P0 |
| RLS-003 | Limpieza | Puede operar limpiezas y evidencias permitidas | P0 |
| RLS-004 | Propietario | Solo ve sus unidades/reportes | P0 |
| RLS-005 | Administrador cliente | Ve unidades asignadas y reportes | P0 |
| RLS-006 | Usuario sin perfil | No debe ver datos sensibles | P0 |
| RLS-007 | Intento escritura no permitido | Supabase rechaza y UI muestra error | P1 |

## Storage y evidencia
| ID | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- |
| STO-001 | Foto mantenimiento | Se guarda en bucket `maintenance-evidence` | P0 |
| STO-002 | Foto daño | Debe quedar obligatoria al conectar módulo | P0 |
| STO-003 | Foto recepción limpieza | Debe quedar obligatoria al conectar módulo | P0 |
| STO-004 | Foto final limpieza | Debe bloquear cierre si falta | P0 |
| STO-005 | Archivo no imagen | Debe rechazar o no aceptar en input | P1 |
| STO-006 | Foto pesada | No debe romper la pantalla; validar límite | P1 |

## Responsive y tablet
| ID | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- |
| UI-001 | Tablet vertical | Menú superior horizontal usable | P1 |
| UI-002 | Tablet horizontal | Cards y formularios equilibrados | P1 |
| UI-003 | Celular | No hay texto cortado dentro de botones | P1 |
| UI-004 | Desktop | Sidebar con scroll si altura baja | P1 |
| UI-005 | Tablas | Tienen scroll horizontal cuando lo necesitan | P1 |
| UI-006 | Formularios | Inputs grandes, cómodos y legibles | P1 |
| UI-007 | Estados | Pendiente/en proceso/revisión/aprobada/rechazada claros | P1 |
| UI-008 | Premium operativo | No parece landing page; se siente herramienta hotelera | P2 |

## Pruebas de datos y fallback
| ID | Caso | Resultado esperado | Severidad |
| --- | --- | --- | --- |
| DAT-001 | Supabase con datos | Muestra datos reales primero | P0 |
| DAT-002 | Supabase sin datos | Muestra respaldo demo donde aplique | P1 |
| DAT-003 | Error de consulta | UI no crashea | P0 |
| DAT-004 | Datos duplicados | No rompe cards ni tablas | P2 |
| DAT-005 | Campos nulos | Muestra textos tipo "Sin definir" | P2 |
| DAT-006 | Fechas inválidas | No rompe render | P1 |

## Pruebas de regresión obligatorias antes de release
1. Login con admin.
2. Crear departamento.
3. Ver departamento creado.
4. Abrir Limpiezas.
5. Entrar a detalle de limpieza.
6. Ir a Checklist.
7. Ir a Inventario.
8. Abrir Blancos.
9. Abrir Revisión de Blancos.
10. Crear lote de lavandería.
11. Mover lote de lavandería.
12. Crear daño/faltante visual.
13. Enviar daño/faltante a mantenimiento.
14. Crear ticket de mantenimiento con foto.
15. Ver ticket en tabla y kanban.
16. Abrir Reporte simple.
17. Cerrar sesión.

## Checklist final de aprobación v1.0
- [ ] Producción abre sin error.
- [ ] GitHub tiene último commit.
- [ ] Vercel despliega último commit.
- [ ] Supabase tiene tablas base ejecutadas.
- [ ] Supabase tiene tablas de lavandería ejecutadas.
- [ ] Supabase tiene tablas de mantenimiento ejecutadas.
- [ ] Variables de entorno configuradas en Vercel.
- [ ] Roles de prueba creados.
- [ ] Flujo principal de limpieza probado en tablet.
- [ ] Evidencia fotográfica validada donde ya está conectada.
- [ ] No hay textos visibles de "mock" en operación principal.
- [ ] Menú no está saturado.
- [ ] Reporte simple legible para propietario.
- [ ] No hay P0 abiertos.
- [ ] No hay P1 abiertos en flujo principal.

## Registro de bugs
Usar este formato:

| ID bug | Fecha | Módulo | Severidad | Rol | Dispositivo | Descripción | Pasos | Resultado esperado | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BUG-001 |  |  |  |  |  |  |  |  |  | Abierto |

## Recomendación de orden de prueba
1. Probar navegación general.
2. Probar login y roles.
3. Probar Departamentos.
4. Probar Limpiezas.
5. Probar Checklist, Inventario y Blancos.
6. Probar Lavandería y Bodega.
7. Probar Daños/Faltantes.
8. Probar Mantenimiento y Activos.
9. Probar Reporte.
10. Repetir todo en tablet.
