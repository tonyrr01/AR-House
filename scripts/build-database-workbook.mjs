import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "/Users/ar/Documents/AR House/outputs/database-review";
await fs.mkdir(outputDir, { recursive: true });

const tables = [
  {
    name: "profiles",
    module: "Usuarios y roles",
    purpose: "Perfil extendido de usuarios autenticados.",
    columns: [
      ["id", "uuid", "SI", "PK, FK auth.users(id)", "auth.users.id", "on delete cascade", "", "Usuario Supabase asociado"],
      ["full_name", "text", "SI", "", "", "", "", "Nombre visible"],
      ["role", "public.app_role", "SI", "", "", "", "default 'limpieza'", "Rol operativo"],
      ["client_id", "uuid", "NO", "FK", "clients.id", "on delete set null", "", "Cliente/operacion asociada"],
      ["created_at", "timestamptz", "SI", "", "", "", "default now()", "Fecha de creacion"]
    ]
  },
  {
    name: "clients",
    module: "Clientes",
    purpose: "Clientes o grupos de propiedades.",
    columns: [
      ["id", "uuid", "SI", "PK", "", "", "default gen_random_uuid()", "Identificador del cliente"],
      ["name", "text", "SI", "", "", "", "", "Nombre del cliente"],
      ["created_at", "timestamptz", "SI", "", "", "", "default now()", "Fecha de creacion"]
    ]
  },
  {
    name: "apartments",
    module: "Departamentos",
    purpose: "Unidades Airbnb/renta vacacional operadas.",
    columns: [
      ["id", "uuid", "SI", "PK", "", "", "default gen_random_uuid()", "Identificador del departamento"],
      ["client_id", "uuid", "NO", "FK", "clients.id", "on delete cascade", "", "Cliente asociado"],
      ["owner_profile_id", "uuid", "NO", "FK", "profiles.id", "on delete set null", "", "Propietario asociado"],
      ["name", "text", "SI", "", "", "", "", "Nombre operativo"],
      ["code", "text", "SI", "", "", "", "", "Codigo interno"],
      ["address", "text", "SI", "", "", "", "", "Direccion"],
      ["beds", "int", "SI", "", "", "", "default 1", "Numero de camas"],
      ["baths", "int", "SI", "", "", "", "default 1", "Numero de banos"],
      ["status", "text", "SI", "", "", "", "default activo", "Estado operativo"],
      ["created_at", "timestamptz", "SI", "", "", "", "default now()", "Fecha de creacion"]
    ]
  },
  {
    name: "cleanings",
    module: "Limpiezas",
    purpose: "Programacion, ejecucion y supervision de limpiezas.",
    columns: [
      ["id", "uuid", "SI", "PK", "", "", "default gen_random_uuid()", "Identificador de limpieza"],
      ["apartment_id", "uuid", "SI", "FK", "apartments.id", "on delete cascade", "", "Departamento"],
      ["assigned_to", "uuid", "NO", "FK", "profiles.id", "on delete set null", "", "Persona de limpieza asignada"],
      ["scheduled_date", "date", "SI", "", "", "", "", "Fecha programada"],
      ["check_out_time", "time", "NO", "", "", "", "", "Hora de salida"],
      ["check_in_time", "time", "NO", "", "", "", "", "Hora de entrada"],
      ["status", "public.cleaning_status", "SI", "", "", "", "default pendiente", "Estado de limpieza"],
      ["received_notes", "text", "NO", "", "", "", "", "Notas de recepcion"],
      ["final_notes", "text", "NO", "", "", "", "", "Notas finales"],
      ["started_at", "timestamptz", "NO", "", "", "", "", "Hora real de inicio"],
      ["submitted_at", "timestamptz", "NO", "", "", "", "", "Hora enviada a supervision"],
      ["approved_at", "timestamptz", "NO", "", "", "", "", "Hora aprobada"],
      ["created_by", "uuid", "NO", "FK", "profiles.id", "on delete set null", "", "Usuario creador"],
      ["created_at", "timestamptz", "SI", "", "", "", "default now()", "Fecha de creacion"]
    ]
  },
  {
    name: "checklist_templates",
    module: "Checklist",
    purpose: "Plantilla base de checklist por cliente.",
    columns: [
      ["id", "uuid", "SI", "PK", "", "", "default gen_random_uuid()", "Identificador del item plantilla"],
      ["client_id", "uuid", "NO", "FK", "clients.id", "on delete cascade", "", "Cliente"],
      ["area", "text", "SI", "", "", "", "", "Area del checklist"],
      ["label", "text", "SI", "", "", "", "", "Tarea"],
      ["required", "boolean", "SI", "", "", "", "default true", "Si es obligatoria"],
      ["sort_order", "int", "SI", "", "", "", "default 0", "Orden de aparicion"]
    ]
  },
  {
    name: "cleaning_checklist_items",
    module: "Checklist",
    purpose: "Checklist ejecutado por limpieza.",
    columns: [
      ["id", "uuid", "SI", "PK", "", "", "default gen_random_uuid()", "Identificador del item ejecutado"],
      ["cleaning_id", "uuid", "SI", "FK", "cleanings.id", "on delete cascade", "", "Limpieza"],
      ["template_item_id", "uuid", "NO", "FK", "checklist_templates.id", "on delete set null", "", "Item plantilla"],
      ["area", "text", "SI", "", "", "", "", "Area"],
      ["label", "text", "SI", "", "", "", "", "Tarea"],
      ["required", "boolean", "SI", "", "", "", "default true", "Si es obligatoria"],
      ["completed", "boolean", "SI", "", "", "", "default false", "Si fue completada"],
      ["notes", "text", "NO", "", "", "", "", "Notas"],
      ["completed_by", "uuid", "NO", "FK", "profiles.id", "on delete set null", "", "Usuario que completo"],
      ["completed_at", "timestamptz", "NO", "", "", "", "", "Fecha/hora completada"]
    ]
  },
  {
    name: "inventory_items",
    module: "Inventario",
    purpose: "Inventario basico por departamento.",
    columns: [
      ["id", "uuid", "SI", "PK", "", "", "default gen_random_uuid()", "Identificador del articulo"],
      ["apartment_id", "uuid", "SI", "FK", "apartments.id", "on delete cascade", "", "Departamento"],
      ["name", "text", "SI", "", "", "", "", "Articulo"],
      ["category", "text", "SI", "", "", "", "", "Categoria"],
      ["expected_quantity", "int", "SI", "", "", "", "default 0", "Cantidad esperada"],
      ["current_quantity", "int", "SI", "", "", "", "default 0", "Cantidad actual"],
      ["condition", "text", "SI", "", "", "", "default ok", "Estado del articulo"],
      ["updated_at", "timestamptz", "SI", "", "", "", "default now()", "Ultima actualizacion"]
    ]
  },
  {
    name: "damage_reports",
    module: "Danos y faltantes",
    purpose: "Hallazgos con evidencia durante limpieza.",
    columns: [
      ["id", "uuid", "SI", "PK", "", "", "default gen_random_uuid()", "Identificador del reporte"],
      ["cleaning_id", "uuid", "NO", "FK", "cleanings.id", "on delete cascade", "", "Limpieza asociada"],
      ["apartment_id", "uuid", "SI", "FK", "apartments.id", "on delete cascade", "", "Departamento"],
      ["report_type", "text", "SI", "CHECK", "", "", "dano/faltante", "Tipo de hallazgo"],
      ["title", "text", "SI", "", "", "", "", "Titulo"],
      ["description", "text", "NO", "", "", "", "", "Descripcion"],
      ["priority", "public.priority_level", "SI", "", "", "", "default media", "Prioridad"],
      ["created_by", "uuid", "NO", "FK", "profiles.id", "on delete set null", "", "Usuario que reporta"],
      ["created_at", "timestamptz", "SI", "", "", "", "default now()", "Fecha de reporte"]
    ]
  },
  {
    name: "maintenance_tickets",
    module: "Tickets",
    purpose: "Tickets de mantenimiento detectados por operacion.",
    columns: [
      ["id", "uuid", "SI", "PK", "", "", "default gen_random_uuid()", "Identificador del ticket"],
      ["apartment_id", "uuid", "SI", "FK", "apartments.id", "on delete cascade", "", "Departamento"],
      ["cleaning_id", "uuid", "NO", "FK", "cleanings.id", "on delete set null", "", "Limpieza relacionada"],
      ["title", "text", "SI", "", "", "", "", "Titulo"],
      ["description", "text", "NO", "", "", "", "", "Descripcion"],
      ["status", "public.ticket_status", "SI", "", "", "", "default abierto", "Estado"],
      ["priority", "public.priority_level", "SI", "", "", "", "default media", "Prioridad"],
      ["assigned_to", "text", "NO", "", "", "", "", "Responsable/proveedor"],
      ["created_by", "uuid", "NO", "FK", "profiles.id", "on delete set null", "", "Usuario creador"],
      ["created_at", "timestamptz", "SI", "", "", "", "default now()", "Fecha de creacion"],
      ["resolved_at", "timestamptz", "NO", "", "", "", "", "Fecha de resolucion"]
    ]
  },
  {
    name: "photos",
    module: "Fotos",
    purpose: "Fotos de recepcion, danos/faltantes y cierre.",
    columns: [
      ["id", "uuid", "SI", "PK", "", "", "default gen_random_uuid()", "Identificador de foto"],
      ["cleaning_id", "uuid", "NO", "FK", "cleanings.id", "on delete cascade", "", "Limpieza asociada"],
      ["damage_report_id", "uuid", "NO", "FK", "damage_reports.id", "on delete cascade", "", "Reporte asociado"],
      ["kind", "public.photo_kind", "SI", "", "", "", "", "Tipo de foto"],
      ["storage_path", "text", "SI", "", "", "", "", "Ruta en Supabase Storage"],
      ["caption", "text", "NO", "", "", "", "", "Descripcion opcional"],
      ["uploaded_by", "uuid", "NO", "FK", "profiles.id", "on delete set null", "", "Usuario que subio"],
      ["uploaded_at", "timestamptz", "SI", "", "", "", "default now()", "Fecha de subida"]
    ]
  }
];

const enums = [
  ["app_role", "admin", "Acceso total", ""],
  ["app_role", "supervisor", "Revisa y aprueba limpiezas", ""],
  ["app_role", "limpieza", "Ejecuta limpieza y reporta hallazgos", ""],
  ["app_role", "propietario", "Consulta reportes", ""],
  ["app_role", "administrador_cliente", "Consulta unidades y reportes", ""],
  ["cleaning_status", "pendiente", "Pendiente", ""],
  ["cleaning_status", "en_progreso", "En proceso", ""],
  ["cleaning_status", "en_supervision", "En revision", ""],
  ["cleaning_status", "aprobada", "Aprobada", ""],
  ["cleaning_status", "requiere_correccion", "Rechazada/correccion", ""],
  ["priority_level", "urgente", "Atencion inmediata", ""],
  ["priority_level", "importante", "Atencion prioritaria", ""],
  ["priority_level", "preventivo", "Prevencion/mantenimiento", ""],
  ["priority_level", "baja", "Legacy", ""],
  ["priority_level", "media", "Legacy", ""],
  ["priority_level", "alta", "Legacy", ""],
  ["ticket_status", "abierto", "Abierto", ""],
  ["ticket_status", "en_proceso", "En proceso", ""],
  ["ticket_status", "resuelto", "Resuelto", ""],
  ["ticket_status", "cerrado", "Cerrado", ""],
  ["photo_kind", "recepcion", "Foto inicial", ""],
  ["photo_kind", "dano", "Dano", ""],
  ["photo_kind", "faltante", "Faltante", ""],
  ["photo_kind", "final", "Foto final", ""]
];

const workbook = Workbook.create();
const relations = [];
for (const table of tables) {
  for (const column of table.columns) {
    if (column[4]) relations.push([table.name, column[0], column[4], column[5] || "", column[7] || ""]);
  }
}

function titleBlock(sheet, title, subtitle, width = "H") {
  sheet.showGridLines = false;
  sheet.getRange(`A1:${width}1`).merge();
  sheet.getRange("A1").values = [[title]];
  sheet.getRange(`A2:${width}2`).merge();
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange(`A1:${width}1`).format.fill.color = "#1f5f50";
  sheet.getRange(`A1:${width}1`).format.font.color = "#FFFFFF";
  sheet.getRange(`A1:${width}1`).format.font.bold = true;
  sheet.getRange(`A1:${width}1`).format.font.size = 16;
  sheet.getRange(`A2:${width}2`).format.fill.color = "#eef3f1";
  sheet.getRange(`A2:${width}2`).format.font.italic = true;
  sheet.getRange(`A2:${width}2`).format.wrapText = true;
}

function styleTable(sheet, range, headerRange) {
  sheet.freezePanes.freezeRows(4);
  const header = sheet.getRange(headerRange);
  header.format.fill.color = "#17211f";
  header.format.font.color = "#FFFFFF";
  header.format.font.bold = true;
  const data = sheet.getRange(range);
  data.format.wrapText = true;
  data.format.borders = { preset: "outside", style: "thin", color: "#CBD5E1" };
  data.format.autofitColumns();
  data.format.autofitRows();
}

const summary = workbook.worksheets.add("Resumen");
titleBlock(summary, "Housekeeping 5 Estrellas - Base de datos MVP", "Archivo editable para revisar tablas, campos, relaciones y comentarios antes de conectar Supabase.");
summary.getRange("A4:D4").values = [["Tabla", "Modulo", "Proposito", "Columnas"]];
summary.getRange(`A5:D${4 + tables.length}`).values = tables.map((table) => [table.name, table.module, table.purpose, table.columns.length]);
summary.getRange("F4:H4").values = [["Seccion", "Estado", "Notas"]];
summary.getRange("F5:H9").values = [
  ["Auth/Roles", "Base", "profiles + app_role"],
  ["Limpiezas", "Base", "cleanings + checklist + photos"],
  ["Inventario", "Base", "inventory_items"],
  ["Hallazgos", "Base", "damage_reports"],
  ["Mantenimiento", "Base", "maintenance_tickets"]
];
styleTable(summary, `A4:H${Math.max(9, 4 + tables.length)}`, "A4:H4");
summary.getRange("A:D").format.columnWidth = 24;
summary.getRange("C:C").format.columnWidth = 54;

const enumSheet = workbook.worksheets.add("Enums");
titleBlock(enumSheet, "Enums y catalogos", "Valores permitidos actuales. Puedes modificar o comentar cambios deseados.", "D");
enumSheet.getRange("A4:D4").values = [["Enum", "Valor", "Descripcion", "Comentarios / cambios"]];
enumSheet.getRange(`A5:D${4 + enums.length}`).values = enums;
styleTable(enumSheet, `A4:D${4 + enums.length}`, "A4:D4");
enumSheet.getRange("A:D").format.columnWidth = 26;

const relSheet = workbook.worksheets.add("Relaciones");
titleBlock(relSheet, "Relaciones entre tablas", "Llaves foraneas y comportamiento al borrar registros.", "E");
relSheet.getRange("A4:E4").values = [["Tabla origen", "Campo", "Referencia", "On delete", "Notas"]];
relSheet.getRange(`A5:E${4 + relations.length}`).values = relations;
styleTable(relSheet, `A4:E${4 + relations.length}`, "A4:E4");
relSheet.getRange("A:E").format.columnWidth = 28;

for (const table of tables) {
  const sheet = workbook.worksheets.add(table.name.slice(0, 31));
  titleBlock(sheet, `Tabla: ${table.name}`, `${table.module} - ${table.purpose}`, "I");
  sheet.getRange("A4:I4").values = [["Campo", "Tipo", "Obligatorio", "Clave / constraint", "Referencia", "On delete", "Default / regla", "Notas", "Comentarios / cambios"]];
  sheet.getRange(`A5:I${4 + table.columns.length}`).values = table.columns.map((row) => [...row, ""]);
  styleTable(sheet, `A4:I${4 + table.columns.length}`, "A4:I4");
  sheet.getRange("A:A").format.columnWidth = 24;
  sheet.getRange("B:B").format.columnWidth = 22;
  sheet.getRange("D:F").format.columnWidth = 24;
  sheet.getRange("G:I").format.columnWidth = 32;
  sheet.getRange(`C5:C${4 + table.columns.length}`).dataValidation = { rule: { type: "list", values: ["SI", "NO"] } };
}

const inspect = await workbook.inspect({
  kind: "table",
  range: "Resumen!A1:H16",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 12
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan"
});
console.log(errors.ndjson);

const preview = await workbook.render({ sheetName: "Resumen", range: "A1:H16", scale: 1, format: "png" });
await fs.writeFile(`${outputDir}/preview_resumen.png`, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
const filePath = `${outputDir}/housekeeping_5_estrellas_base_datos_mvp.xlsx`;
await output.save(filePath);
console.log(filePath);
