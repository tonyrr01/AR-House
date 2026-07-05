import type {
  Apartment,
  ChecklistItem,
  Cleaning,
  CleaningReport,
  CleaningLinenReplacement,
  DamageReport,
  InventoryItem,
  LaundryBatch,
  LaundryBatchItem,
  LaundryCapacity,
  LaundryCost,
  LaundryMovement,
  LinenControlItem,
  LinenDepartmentSummary,
  LinenItem,
  LinenKit,
  MaintenanceTicket,
  WarehouseStockItem
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

export const linenControlItems: LinenControlItem[] = [
  {
    id: "bl-101-sab-bajera",
    categoria: "Sabana bajera",
    nombre: "Sabana bajera queen blanca",
    tamano: "queen",
    color: "Blanco",
    proveedor: "Blancos CDMX",
    marca: "Hotel Collection",
    fechaCompra: "2026-06-01",
    costoUnitario: 420,
    cantidadTotal: 4,
    cantidadEsperada: 4,
    cantidadActual: 4,
    estado: "En uso",
    ubicacion: "Departamento",
    propertyId: "dep-101",
    propertyName: "Departamento 101",
    ultimaRevision: "2026-07-03",
    requiereReposicion: false,
    sugerirCargoHuesped: false,
    costoCargoSugerido: 0
  },
  {
    id: "bl-101-toalla-bano",
    categoria: "Toalla de bano",
    nombre: "Toalla de bano 600 gsm",
    tamano: "estandar",
    color: "Blanco",
    proveedor: "Hotel Supply MX",
    marca: "Luxe Cotton",
    fechaCompra: "2026-06-01",
    costoUnitario: 320,
    cantidadTotal: 8,
    cantidadEsperada: 6,
    cantidadActual: 5,
    estado: "Cargo sugerido al huesped",
    ubicacion: "Departamento",
    propertyId: "dep-101",
    propertyName: "Departamento 101",
    ultimaRevision: "2026-07-04",
    observaciones: "Falta una toalla despues de checkout.",
    requiereReposicion: true,
    sugerirCargoHuesped: true,
    costoCargoSugerido: 320
  },
  {
    id: "bl-102-funda",
    categoria: "Funda de almohada",
    nombre: "Funda de almohada queen",
    tamano: "queen",
    color: "Blanco",
    proveedor: "Blancos CDMX",
    marca: "Hotel Collection",
    fechaCompra: "2026-06-05",
    costoUnitario: 110,
    cantidadTotal: 8,
    cantidadEsperada: 8,
    cantidadActual: 8,
    estado: "Bueno",
    ubicacion: "Departamento",
    propertyId: "dep-102",
    propertyName: "Departamento 102",
    ultimaRevision: "2026-07-03",
    requiereReposicion: false,
    sugerirCargoHuesped: false,
    costoCargoSugerido: 0
  },
  {
    id: "bl-102-tapete",
    categoria: "Tapete de bano",
    nombre: "Tapete de bano hotelero",
    tamano: "estandar",
    color: "Blanco",
    proveedor: "Hotel Supply MX",
    marca: "Luxe Cotton",
    fechaCompra: "2026-06-06",
    costoUnitario: 180,
    cantidadTotal: 4,
    cantidadEsperada: 2,
    cantidadActual: 2,
    estado: "Manchado recuperable",
    ubicacion: "Lavanderia",
    propertyId: "dep-102",
    propertyName: "Departamento 102",
    ultimaRevision: "2026-07-04",
    observaciones: "Separado para desmanchado.",
    requiereReposicion: false,
    sugerirCargoHuesped: false,
    costoCargoSugerido: 0
  },
  {
    id: "bl-201-protector",
    categoria: "Protector de colchon",
    nombre: "Protector impermeable queen",
    tamano: "queen",
    color: "Blanco",
    proveedor: "Blancos CDMX",
    marca: "Sleep Guard",
    fechaCompra: "2026-06-08",
    costoUnitario: 560,
    cantidadTotal: 4,
    cantidadEsperada: 4,
    cantidadActual: 3,
    estado: "Roto",
    ubicacion: "Departamento",
    propertyId: "dep-201",
    propertyName: "Departamento 201",
    ultimaRevision: "2026-07-04",
    observaciones: "Un protector con ruptura lateral.",
    requiereReposicion: true,
    sugerirCargoHuesped: true,
    costoCargoSugerido: 560
  },
  {
    id: "bl-201-duvet",
    categoria: "Duvet",
    nombre: "Duvet queen ligero",
    tamano: "queen",
    color: "Blanco",
    proveedor: "Hotel Supply MX",
    marca: "Cloud Rest",
    fechaCompra: "2026-06-08",
    costoUnitario: 980,
    cantidadTotal: 4,
    cantidadEsperada: 2,
    cantidadActual: 2,
    estado: "En lavanderia",
    ubicacion: "Lavanderia",
    propertyId: "dep-201",
    propertyName: "Departamento 201",
    ultimaRevision: "2026-07-03",
    requiereReposicion: false,
    sugerirCargoHuesped: false,
    costoCargoSugerido: 0
  },
  {
    id: "bl-202-playa",
    categoria: "Toalla de playa/alberca",
    nombre: "Toalla de alberca gris",
    tamano: "playa",
    color: "Gris",
    proveedor: "Costco",
    marca: "Resort Line",
    fechaCompra: "2026-06-12",
    costoUnitario: 260,
    cantidadTotal: 8,
    cantidadEsperada: 6,
    cantidadActual: 4,
    estado: "Extraviado",
    ubicacion: "Departamento",
    propertyId: "dep-202",
    propertyName: "Departamento 202",
    ultimaRevision: "2026-07-04",
    observaciones: "Dos toallas de alberca no regresaron.",
    requiereReposicion: true,
    sugerirCargoHuesped: true,
    costoCargoSugerido: 520
  },
  {
    id: "bl-bodega-almohada",
    categoria: "Almohada",
    nombre: "Almohada queen repuesto",
    tamano: "queen",
    color: "Blanco",
    proveedor: "Blancos CDMX",
    marca: "Cloud Rest",
    fechaCompra: "2026-06-15",
    costoUnitario: 390,
    cantidadTotal: 10,
    cantidadEsperada: 0,
    cantidadActual: 10,
    estado: "En bodega",
    ubicacion: "Bodega",
    ultimaRevision: "2026-07-02",
    requiereReposicion: false,
    sugerirCargoHuesped: false,
    costoCargoSugerido: 0
  },
  {
    id: "bl-baja-sabana",
    categoria: "Sabana encimera",
    nombre: "Sabana encimera queen baja",
    tamano: "queen",
    color: "Blanco",
    proveedor: "Blancos CDMX",
    marca: "Hotel Collection",
    fechaCompra: "2026-05-18",
    costoUnitario: 390,
    cantidadTotal: 2,
    cantidadEsperada: 0,
    cantidadActual: 0,
    estado: "Baja",
    ubicacion: "Baja",
    ultimaRevision: "2026-07-01",
    observaciones: "Percudida, no apta para huesped.",
    requiereReposicion: true,
    sugerirCargoHuesped: false,
    costoCargoSugerido: 0
  }
];

export const linenDepartmentSummaries: LinenDepartmentSummary[] = [
  {
    propertyId: "dep-101",
    propertyName: "Departamento 101",
    totalAsignado: 18,
    completos: 17,
    faltantes: 1,
    manchados: 0,
    danados: 0,
    enLavanderia: 0,
    reposicionSugerida: 1,
    costoEstimado: 320
  },
  {
    propertyId: "dep-102",
    propertyName: "Departamento 102",
    totalAsignado: 18,
    completos: 18,
    faltantes: 0,
    manchados: 1,
    danados: 0,
    enLavanderia: 2,
    reposicionSugerida: 0,
    costoEstimado: 0
  },
  {
    propertyId: "dep-201",
    propertyName: "Departamento 201",
    totalAsignado: 20,
    completos: 19,
    faltantes: 0,
    manchados: 0,
    danados: 1,
    enLavanderia: 2,
    reposicionSugerida: 1,
    costoEstimado: 560
  },
  {
    propertyId: "dep-202",
    propertyName: "Departamento 202",
    totalAsignado: 22,
    completos: 20,
    faltantes: 2,
    manchados: 0,
    danados: 0,
    enLavanderia: 0,
    reposicionSugerida: 2,
    costoEstimado: 520
  }
];

export const laundryRooms = Array.from({ length: 50 }, (_, index) => {
  const number = index + 1;
  const floor = number <= 25 ? 1 : 2;
  return {
    id: `room-${String(number).padStart(3, "0")}`,
    name: `Habitacion ${floor}${String(number).padStart(2, "0")}`,
    beds: 2,
    baths: 2,
    expectedKg: 5.8
  };
});

export const laundryBatches: LaundryBatch[] = [
  {
    id: "lb-1001",
    fechaRecepcion: "2026-07-04",
    propertyId: "dep-101",
    propertyName: "Departamento 101",
    cleaningId: "lim-1001",
    responsableRecepcion: "Ana Lopez",
    pesoKg: 28.4,
    piezasRecibidas: 42,
    estado: "Sucio recibido",
    observaciones: "Checkout con volumen normal.",
    fotosRecepcion: 1,
    creadoEn: "2026-07-04T08:10:00",
    actualizadoEn: "2026-07-04T08:10:00"
  },
  {
    id: "lb-1002",
    fechaRecepcion: "2026-07-04",
    propertyId: "dep-102",
    propertyName: "Departamento 102",
    cleaningId: "lim-1002",
    responsableRecepcion: "Brenda Cruz",
    pesoKg: 31.2,
    piezasRecibidas: 47,
    estado: "En lavado",
    observaciones: "Separar tapetes manchados.",
    fotosRecepcion: 2,
    creadoEn: "2026-07-04T09:15:00",
    actualizadoEn: "2026-07-04T10:40:00"
  },
  {
    id: "lb-1003",
    fechaRecepcion: "2026-07-04",
    propertyId: "dep-201",
    propertyName: "Departamento 201",
    cleaningId: "lim-1003",
    responsableRecepcion: "Carlos Mena",
    pesoKg: 35.6,
    piezasRecibidas: 51,
    estado: "En inspeccion",
    observaciones: "Revisar protectores de colchon.",
    fotosRecepcion: 2,
    creadoEn: "2026-07-04T07:45:00",
    actualizadoEn: "2026-07-04T11:25:00"
  },
  {
    id: "lb-1004",
    fechaRecepcion: "2026-07-04",
    propertyId: "dep-202",
    propertyName: "Departamento 202",
    cleaningId: "lim-1004",
    responsableRecepcion: "Laura Vega",
    pesoKg: 24.8,
    piezasRecibidas: 35,
    estado: "Limpio aprobado",
    observaciones: "Listo para bodega limpia.",
    fotosRecepcion: 0,
    creadoEn: "2026-07-04T06:55:00",
    actualizadoEn: "2026-07-04T12:10:00"
  },
  {
    id: "lb-1005",
    fechaRecepcion: "2026-07-03",
    propertyId: "dep-101",
    propertyName: "Departamento 101",
    cleaningId: "lim-0999",
    responsableRecepcion: "Ana Lopez",
    pesoKg: 18.5,
    piezasRecibidas: 22,
    estado: "Observado",
    observaciones: "Toallas con manchas no recuperables.",
    fotosRecepcion: 3,
    creadoEn: "2026-07-03T17:20:00",
    actualizadoEn: "2026-07-04T09:30:00"
  },
  {
    id: "lb-1006",
    fechaRecepcion: "2026-07-03",
    propertyId: "dep-201",
    propertyName: "Departamento 201",
    cleaningId: "lim-0998",
    responsableRecepcion: "Supervisor guardia",
    pesoKg: 12.1,
    piezasRecibidas: 12,
    estado: "Baja",
    observaciones: "Baja por rotura y fin de vida util.",
    fotosRecepcion: 2,
    creadoEn: "2026-07-03T16:00:00",
    actualizadoEn: "2026-07-04T08:00:00"
  }
];

export const laundryBatchItems: LaundryBatchItem[] = [
  {
    id: "lbi-1",
    batchId: "lb-1001",
    categoria: "Sabana bajera",
    nombre: "Sabana bajera queen",
    tamano: "queen",
    cantidadRecibida: 4,
    cantidadAprobada: 0,
    cantidadObservada: 0,
    cantidadBaja: 0,
    cantidadExtraviada: 0,
    estado: "Sucio recibido",
    costoUnitario: 420,
    costoReposicionEstimado: 0,
    sugerirCargoHuesped: false
  },
  {
    id: "lbi-2",
    batchId: "lb-1002",
    categoria: "Tapete de bano",
    nombre: "Tapete de bano hotelero",
    tamano: "estandar",
    cantidadRecibida: 3,
    cantidadAprobada: 0,
    cantidadObservada: 1,
    cantidadBaja: 0,
    cantidadExtraviada: 0,
    estado: "Manchado recuperable",
    observaciones: "Pretratamiento antes de lavado.",
    costoUnitario: 180,
    costoReposicionEstimado: 0,
    sugerirCargoHuesped: false
  },
  {
    id: "lbi-3",
    batchId: "lb-1003",
    categoria: "Protector de colchon",
    nombre: "Protector impermeable queen",
    tamano: "queen",
    cantidadRecibida: 4,
    cantidadAprobada: 3,
    cantidadObservada: 1,
    cantidadBaja: 0,
    cantidadExtraviada: 0,
    estado: "Roto",
    observaciones: "Requiere foto y posible cargo.",
    costoUnitario: 560,
    costoReposicionEstimado: 560,
    sugerirCargoHuesped: true
  },
  {
    id: "lbi-4",
    batchId: "lb-1005",
    categoria: "Toalla de bano",
    nombre: "Toalla de bano 600 gsm",
    tamano: "estandar",
    cantidadRecibida: 6,
    cantidadAprobada: 4,
    cantidadObservada: 2,
    cantidadBaja: 1,
    cantidadExtraviada: 0,
    estado: "Manchado no recuperable",
    observaciones: "Sugerir reposicion.",
    costoUnitario: 320,
    costoReposicionEstimado: 320,
    sugerirCargoHuesped: true
  }
];

export const laundryMovements: LaundryMovement[] = [
  {
    id: "mov-1",
    batchId: "lb-1002",
    origen: "Recepcion lavanderia",
    destino: "Lavadora",
    estadoAnterior: "En clasificacion",
    estadoNuevo: "En lavado",
    cantidad: 47,
    responsable: "Brenda Cruz",
    fecha: "2026-07-04T10:40:00",
    observaciones: "Carga 1 de 2"
  },
  {
    id: "mov-2",
    batchId: "lb-1003",
    origen: "Secadora",
    destino: "Inspeccion",
    estadoAnterior: "En secado",
    estadoNuevo: "En inspeccion",
    cantidad: 51,
    responsable: "Carlos Mena",
    fecha: "2026-07-04T11:25:00"
  },
  {
    id: "mov-3",
    batchId: "lb-1004",
    origen: "Inspeccion",
    destino: "Bodega limpia",
    estadoAnterior: "En inspeccion",
    estadoNuevo: "Limpio aprobado",
    cantidad: 35,
    responsable: "Laura Vega",
    fecha: "2026-07-04T12:10:00"
  }
];

const kitItemsQueen = (kitId: string) => [
  { id: `${kitId}-1`, kitId, categoria: "Sabana bajera" as const, nombre: "Sabana bajera queen", tamano: "queen" as const, cantidadRequerida: 1, cantidadIncluida: 1, estado: "completo" as const },
  { id: `${kitId}-2`, kitId, categoria: "Sabana encimera" as const, nombre: "Sabana encimera queen", tamano: "queen" as const, cantidadRequerida: 1, cantidadIncluida: 1, estado: "completo" as const },
  { id: `${kitId}-3`, kitId, categoria: "Funda de almohada" as const, nombre: "Fundas de almohada", tamano: "queen" as const, cantidadRequerida: 2, cantidadIncluida: 2, estado: "completo" as const },
  { id: `${kitId}-4`, kitId, categoria: "Funda duvet" as const, nombre: "Funda duvet queen", tamano: "queen" as const, cantidadRequerida: 1, cantidadIncluida: 1, estado: "completo" as const }
];

export const linenKits: LinenKit[] = [
  {
    id: "kit-101-full",
    propertyId: "dep-101",
    propertyName: "Departamento 101",
    tipoKit: "completo_departamento",
    estado: "pendiente",
    fechaArmado: "2026-07-04",
    responsableArmado: "Bodega turno AM",
    items: kitItemsQueen("kit-101-full"),
    observaciones: "Falta agregar kit bano y playa."
  },
  {
    id: "kit-102-bano",
    propertyId: "dep-102",
    propertyName: "Departamento 102",
    tipoKit: "bano",
    estado: "armado",
    fechaArmado: "2026-07-04",
    responsableArmado: "Bodega turno AM",
    fechaEntrega: "2026-07-04",
    responsableEntrega: "Ana Lopez",
    items: [
      { id: "kit-102-bano-1", kitId: "kit-102-bano", categoria: "Toalla de bano", nombre: "Toallas de bano", tamano: "estandar", cantidadRequerida: 2, cantidadIncluida: 2, estado: "completo" },
      { id: "kit-102-bano-2", kitId: "kit-102-bano", categoria: "Toalla de mano", nombre: "Toalla de mano", tamano: "estandar", cantidadRequerida: 1, cantidadIncluida: 1, estado: "completo" },
      { id: "kit-102-bano-3", kitId: "kit-102-bano", categoria: "Tapete de bano", nombre: "Tapete de bano", tamano: "estandar", cantidadRequerida: 1, cantidadIncluida: 1, estado: "completo" }
    ]
  },
  {
    id: "kit-202-playa",
    propertyId: "dep-202",
    propertyName: "Departamento 202",
    tipoKit: "playa",
    estado: "incompleto",
    fechaArmado: "2026-07-04",
    responsableArmado: "Bodega turno AM",
    items: [
      { id: "kit-202-playa-1", kitId: "kit-202-playa", categoria: "Toalla de playa/alberca", nombre: "Toallas de playa", tamano: "playa", cantidadRequerida: 6, cantidadIncluida: 4, estado: "faltante", observaciones: "Stock bajo por extravios." }
    ],
    observaciones: "No marcar entregado hasta completar o confirmar excepcion."
  }
];

export const warehouseStockItems: WarehouseStockItem[] = [
  { id: "stock-1", categoria: "Sabana bajera", stockDisponible: 140, stockMinimo: 110, stock50Habitaciones: 100, stock100Habitaciones: 220, nivel: "suficiente" },
  { id: "stock-2", categoria: "Toalla de bano", stockDisponible: 92, stockMinimo: 120, stock50Habitaciones: 150, stock100Habitaciones: 300, nivel: "bajo" },
  { id: "stock-3", categoria: "Tapete de bano", stockDisponible: 28, stockMinimo: 70, stock50Habitaciones: 80, stock100Habitaciones: 160, nivel: "critico" },
  { id: "stock-4", categoria: "Funda de almohada", stockDisponible: 260, stockMinimo: 180, stock50Habitaciones: 200, stock100Habitaciones: 420, nivel: "suficiente" },
  { id: "stock-5", categoria: "Toalla de playa/alberca", stockDisponible: 48, stockMinimo: 80, stock50Habitaciones: 120, stock100Habitaciones: 240, nivel: "critico" }
];

export const laundryCosts: LaundryCost[] = [
  {
    id: "cost-2026-07-04",
    fecha: "2026-07-04",
    kgProcesados: 238,
    habitacionesAtendidas: 46,
    costoManoObra: 3200,
    costoAgua: 620,
    costoGas: 980,
    costoElectricidad: 740,
    costoQuimicos: 860,
    costoMantenimiento: 450,
    costoMermaBlancos: 1440,
    otrosCostos: 300,
    costoTotal: 8590,
    costoPorKg: 36.09,
    costoPorHabitacion: 186.74,
    observaciones: "Dia estable con merma moderada por manchas."
  }
];

export const laundryCapacities: LaundryCapacity[] = [
  {
    id: "cap-65",
    fecha: "2026-07-04",
    lavadorasDisponibles: 3,
    secadorasDisponibles: 2,
    capacidadLavadoKgDia: 300,
    capacidadSecadoKgDia: 280,
    kgProcesados: 182,
    porcentajeUso: 65,
    alertaSaturacion: "normal",
    observaciones: "Operacion fluida para 50 habitaciones."
  },
  {
    id: "cap-85",
    fecha: "2026-07-05",
    lavadorasDisponibles: 3,
    secadorasDisponibles: 2,
    capacidadLavadoKgDia: 300,
    capacidadSecadoKgDia: 280,
    kgProcesados: 255,
    porcentajeUso: 85,
    alertaSaturacion: "alta",
    observaciones: "Preparar turnos y carros adicionales."
  },
  {
    id: "cap-105",
    fecha: "2026-07-06",
    lavadorasDisponibles: 3,
    secadorasDisponibles: 2,
    capacidadLavadoKgDia: 300,
    capacidadSecadoKgDia: 280,
    kgProcesados: 315,
    porcentajeUso: 105,
    alertaSaturacion: "saturada",
    observaciones: "Rebasada capacidad; tercerizar o agregar equipo."
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
