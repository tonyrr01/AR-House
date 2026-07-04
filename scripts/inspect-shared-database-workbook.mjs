import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/ar/Desktop/2026/JULIO/Bolongo/BASE DE DATOS/Sistema Control Limpieza 5 Estrellas.xlsx";
const outputPath = "/Users/ar/Documents/AR House/outputs/database-review/shared-workbook-inspection.ndjson";

await fs.mkdir("/Users/ar/Documents/AR House/outputs/database-review", { recursive: true });

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 8,
  tableMaxCols: 12,
  tableMaxCellChars: 120
});

const sheets = await workbook.inspect({
  kind: "sheet",
  include: "id,name",
  maxChars: 12000
});

const sheetNames = [];
for (const line of sheets.ndjson.split("\n")) {
  if (!line.trim()) continue;
  try {
    const row = JSON.parse(line);
    if (row.name) sheetNames.push(row.name);
  } catch {
    // Ignore non-JSON diagnostics.
  }
}

const chunks = [`# OVERVIEW\n${overview.ndjson}`, `# SHEETS\n${sheets.ndjson}`];

for (const sheetName of sheetNames) {
  const table = await workbook.inspect({
    kind: "region",
    sheetId: sheetName,
    range: "A1:Z80",
    maxChars: 20000,
    tableMaxRows: 80,
    tableMaxCols: 26,
    tableMaxCellChars: 140
  });
  chunks.push(`# SHEET ${sheetName}\n${table.ndjson}`);
}

await fs.writeFile(outputPath, chunks.join("\n\n"), "utf8");
console.log(outputPath);
