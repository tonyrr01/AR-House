import type {
  Apartment,
  ChecklistItem,
  Cleaning,
  CleaningReport,
  CleaningLinenReplacement,
  DamageReport,
  InventoryItem,
  LinenItem,
  MaintenanceTicket
} from "@/types";

export const apartments: Apartment[] = [
  {
    id: "apt-roma-01",
    name: "Roma Norte 203",
    code: "RN-203",
    address: "Calle Colima 120, Roma Norte",
    areaM2: 82,
    developmentName: "Casa Colima",
    furnitureType: "Premium urbano",
    decorationType: "Contemporanea",
    ownerName: "Mariana Solis",
    beds: 2,
    baths: 2,
    status: "activo"
  },
  {
    id: "apt-condesa-07",
    name: "Condesa Garden 7",
    code: "CG-007",
    address: "Av. Amsterdam 88, Condesa",
    areaM2: 64,
    developmentName: "Condesa Garden",
    furnitureType: "Compacto premium",
    decorationType: "Natural",
    ownerName: "Grupo Nube",
    beds: 1,
    baths: 1,
    status: "activo"
  },
  {
    id: "apt-polanco-12",
    name: "Polanco Loft 12",
    code: "PL-012",
    address: "Horacio 410, Polanco",
    areaM2: 110,
    developmentName: "Polanco Lofts",
    furnitureType: "Ejecutivo",
    decorationType: "Minimalista",
    ownerName: "Andres Rocha",
    beds: 3,
    baths: 2,
    status: "activo"
  }
];

export const cleanings: Cleaning[] = [
  {
    id: "lim-1001",
    apartmentId: "apt-roma-01",
    apartmentName: "Roma Norte 203",
    assignedTo: "Ana Lopez",
    supervisorName: "Laura Vega",
    scheduledDate: "2026-06-29",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    status: "pendiente",
    cleaningType: "checkout",
    linenReplacementNotes: "Toallas blancas premium y sabanas king",
    progress: 0,
    receivedPhotos: 0,
    finalPhotos: 0
  },
  {
    id: "lim-1002",
    apartmentId: "apt-condesa-07",
    apartmentName: "Condesa Garden 7",
    assignedTo: "Brenda Cruz",
    supervisorName: "Laura Vega",
    scheduledDate: "2026-06-29",
    checkInTime: "16:00",
    checkOutTime: "10:00",
    status: "en_progreso",
    cleaningType: "profunda",
    guestCleaningRating: 4,
    guestFeedback: "Revisar olor en cocina",
    linenReplacementNotes: "Sustituir toallas faciales si hay manchas",
    progress: 45,
    receivedPhotos: 4,
    finalPhotos: 0
  },
  {
    id: "lim-1003",
    apartmentId: "apt-polanco-12",
    apartmentName: "Polanco Loft 12",
    assignedTo: "Carlos Mena",
    supervisorName: "Laura Vega",
    scheduledDate: "2026-06-28",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    status: "en_supervision",
    cleaningType: "checkout",
    guestCleaningRating: 5,
    guestFeedback: "Excelente limpieza anterior",
    linenReplacementNotes: "Sabanas queen y 6 toallas",
    progress: 100,
    receivedPhotos: 5,
    finalPhotos: 8
  }
];

export const checklistItems: ChecklistItem[] = [
  { id: "sala-1", area: "Sala", label: "Orden y superficies", required: true },
  { id: "coc-1", area: "Cocina", label: "Trastes, refrigerador y basura", required: true },
  { id: "rec-1", area: "Recamaras", label: "Sabanas, fundas y closet", required: true },
  { id: "bano-1", area: "Banos", label: "WC, lavabo, regadera y amenidades", required: true },
  { id: "bal-1", area: "Balcon", label: "Piso, muebles y ceniceros", required: true },
  { id: "bla-1", area: "Blancos", label: "Toallas, sabanas y textiles", required: true },
  { id: "ute-1", area: "Utensilios", label: "Vasos, copas, platos y cubiertos", required: true },
  { id: "ele-1", area: "Electronicos", label: "TV, controles y electrodomesticos", required: true },
  { id: "pis-1", area: "Pisos", label: "Aspirar, trapear y revisar manchas", required: true },
  { id: "pue-1", area: "Puertas", label: "Puertas limpias y sin danos", required: true },
  { id: "ven-1", area: "Ventanas", label: "Cristales y cerraduras", required: true },
  { id: "olo-1", area: "Olores", label: "Sin humedad, cigarro o basura", required: true },
  { id: "rui-1", area: "Ruidos", label: "Reportar ruidos anormales", required: false },
  { id: "air-1", area: "Aires acondicionados", label: "Encendido y control", required: true },
  { id: "net-1", area: "Internet", label: "Router y conexion visibles", required: true },
  { id: "cer-1", area: "Cerraduras", label: "Chapa, llaves y acceso", required: true }
];

export const inventoryItems: InventoryItem[] = [
  {
    id: "inv-1",
    apartmentId: "apt-roma-01",
    name: "Toallas grandes",
    category: "Blancos",
    expectedQuantity: 4,
    currentQuantity: 4,
    condition: "ok",
    price: 320,
    supplier: "Hotel Supply MX",
    purchasedAt: "2026-06-10"
  },
  {
    id: "inv-2",
    apartmentId: "apt-roma-01",
    name: "Copas de vino",
    category: "Cocina",
    expectedQuantity: 6,
    currentQuantity: 5,
    condition: "reponer",
    price: 180,
    purchaseTicketUrl: "ticket-copas-rn-203.pdf",
    supplier: "Liverpool",
    purchasedAt: "2026-05-18",
    retirementReason: "Faltante detectado"
  },
  {
    id: "inv-3",
    apartmentId: "apt-condesa-07",
    name: "Control remoto TV",
    category: "Electronica",
    expectedQuantity: 1,
    currentQuantity: 1,
    condition: "revisar",
    price: 450,
    supplier: "Samsung Store",
    purchasedAt: "2026-04-08"
  }
];

export const linenItems: LinenItem[] = [
  {
    id: "lin-1",
    apartmentId: "apt-roma-01",
    itemType: "Toalla grande",
    size: "70x140",
    model: "Hotel premium 600 gsm",
    color: "Blanco",
    expectedQuantity: 4,
    currentQuantity: 4,
    condition: "ok",
    unitCost: 320,
    supplier: "Hotel Supply MX",
    purchasedAt: "2026-06-10"
  },
  {
    id: "lin-2",
    apartmentId: "apt-roma-01",
    itemType: "Sabana king",
    size: "King",
    model: "Algodon 300 hilos",
    color: "Blanco",
    expectedQuantity: 2,
    currentQuantity: 1,
    condition: "reponer",
    unitCost: 690,
    supplier: "Blancos CDMX",
    purchasedAt: "2026-05-22",
    notes: "Una sabana con mancha permanente"
  },
  {
    id: "lin-3",
    apartmentId: "apt-condesa-07",
    itemType: "Funda almohada",
    size: "Standard",
    model: "Algodon 300 hilos",
    color: "Blanco",
    expectedQuantity: 4,
    currentQuantity: 4,
    condition: "revisar",
    unitCost: 120,
    supplier: "Blancos CDMX",
    purchasedAt: "2026-05-22"
  }
];

export const linenReplacements: CleaningLinenReplacement[] = [
  {
    id: "lin-rep-1",
    cleaningId: "lim-1002",
    linenItemId: "lin-2",
    itemType: "Sabana king",
    quantity: 1,
    reason: "Mancha permanente",
    replacedBy: "Brenda Cruz",
    replacedAt: "2026-06-29"
  }
];

export const damageReports: DamageReport[] = [
  {
    id: "dan-1",
    cleaningId: "lim-1002",
    apartmentName: "Condesa Garden 7",
    title: "Mancha en sofa",
    description: "Mancha visible en cojin principal.",
    type: "dano",
    itemName: "Sofa sala",
    damageType: "Textil manchado",
    priority: "media",
    photoCount: 2,
    createdAt: "2026-06-28"
  },
  {
    id: "dan-2",
    cleaningId: "lim-1001",
    apartmentName: "Roma Norte 203",
    title: "Falta una copa de vino",
    description: "Inventario esperaba 6 copas y se encontraron 5.",
    type: "faltante",
    inventoryItemId: "inv-2",
    itemName: "Copas de vino",
    damageType: "Faltante inventario",
    priority: "baja",
    photoCount: 1,
    createdAt: "2026-06-29"
  }
];

export const maintenanceTickets: MaintenanceTicket[] = [
  {
    id: "tic-1",
    apartmentName: "Polanco Loft 12",
    title: "Regadera con baja presion",
    description: "Huesped reporto baja presion en bano principal.",
    maintenanceArea: "Bano principal",
    maintenanceCategory: "Plomeria",
    status: "abierto",
    priority: "importante",
    assignedTo: "Mantenimiento externo",
    createdAt: "2026-06-27"
  }
];

export const report: CleaningReport = {
  cleaning: cleanings[2],
  checklistCompleted: 8,
  checklistTotal: 8,
  inventoryIssues: 1,
  damages: damageReports.slice(0, 1),
  tickets: maintenanceTickets
};
