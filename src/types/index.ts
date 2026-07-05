export type UserRole =
  | "admin"
  | "supervisor"
  | "limpieza"
  | "propietario"
  | "administrador_cliente";

export type CleaningStatus =
  | "pendiente"
  | "en_progreso"
  | "en_supervision"
  | "aprobada"
  | "requiere_correccion";

export type TicketStatus = "abierto" | "en_proceso" | "resuelto" | "cerrado";
export type Priority = "baja" | "media" | "alta" | "urgente" | "importante" | "preventivo";
export type PhotoKind = "recepcion" | "dano" | "faltante" | "final";

export type LinenCategory =
  | "Sabana bajera"
  | "Sabana encimera"
  | "Funda de almohada"
  | "Protector de almohada"
  | "Protector de colchon"
  | "Toalla de bano"
  | "Toalla de mano"
  | "Toalla facial"
  | "Tapete de bano"
  | "Duvet"
  | "Funda duvet"
  | "Almohada"
  | "Cobija"
  | "Toalla de playa/alberca"
  | "Trapo de cocina";

export type LinenSize = "individual" | "matrimonial" | "queen" | "king" | "estandar" | "playa" | "otro";

export type LinenStatus =
  | "Nuevo"
  | "Bueno"
  | "En uso"
  | "En lavanderia"
  | "En bodega"
  | "Manchado recuperable"
  | "Manchado no recuperable"
  | "Roto"
  | "Percudido"
  | "Extraviado"
  | "Baja"
  | "Cargo sugerido al huesped";

export type LinenLocation = "Departamento" | "Bodega" | "Lavanderia" | "En transito" | "Baja";

export type LaundryStatus =
  | "Instalado en unidad"
  | "Sucio recibido"
  | "En clasificacion"
  | "En pretratamiento"
  | "En lavado"
  | "En secado"
  | "En inspeccion"
  | "Limpio aprobado"
  | "Observado"
  | "Manchado recuperable"
  | "Manchado no recuperable"
  | "Roto"
  | "Percudido"
  | "En bodega"
  | "Kit armado"
  | "En ruta"
  | "Entregado a unidad"
  | "Extraviado"
  | "Baja"
  | "Cargo sugerido al huesped";

export type LaundryLocation =
  | "Unidad/departamento"
  | "Recepcion lavanderia"
  | "Clasificacion"
  | "Pretratamiento"
  | "Lavadora"
  | "Secadora"
  | "Inspeccion"
  | "Doblado"
  | "Bodega limpia"
  | "Bodega observados"
  | "Bodega bajas"
  | "En ruta"
  | "Baja definitiva";

export type KitType = "cama_queen" | "cama_king" | "bano" | "playa" | "cocina" | "completo_departamento";
export type KitStatus = "pendiente" | "armado" | "en_ruta" | "entregado" | "incompleto";
export type StockLevel = "suficiente" | "bajo" | "critico";

export type LinenControlItem = {
  id: string;
  categoria: LinenCategory;
  nombre: string;
  tamano: LinenSize;
  color: string;
  proveedor: string;
  marca: string;
  fechaCompra: string;
  costoUnitario: number;
  cantidadTotal: number;
  cantidadEsperada: number;
  cantidadActual: number;
  estado: LinenStatus;
  ubicacion: LinenLocation;
  propertyId?: string;
  propertyName?: string;
  ultimaRevision: string;
  fotoUrl?: string;
  observaciones?: string;
  requiereReposicion: boolean;
  sugerirCargoHuesped: boolean;
  costoCargoSugerido: number;
};

export type LinenDepartmentSummary = {
  propertyId: string;
  propertyName: string;
  totalAsignado: number;
  completos: number;
  faltantes: number;
  manchados: number;
  danados: number;
  enLavanderia: number;
  reposicionSugerida: number;
  costoEstimado: number;
};

export type LaundryBatch = {
  id: string;
  fechaRecepcion: string;
  propertyId: string;
  propertyName: string;
  cleaningId?: string;
  responsableRecepcion: string;
  pesoKg: number;
  piezasRecibidas: number;
  estado: LaundryStatus;
  observaciones?: string;
  fotosRecepcion: number;
  creadoEn: string;
  actualizadoEn: string;
};

export type LaundryBatchItem = {
  id: string;
  batchId: string;
  categoria: LinenCategory;
  nombre: string;
  tamano: LinenSize;
  cantidadRecibida: number;
  cantidadAprobada: number;
  cantidadObservada: number;
  cantidadBaja: number;
  cantidadExtraviada: number;
  estado: LaundryStatus;
  observaciones?: string;
  fotoUrl?: string;
  costoUnitario: number;
  costoReposicionEstimado: number;
  sugerirCargoHuesped: boolean;
};

export type LaundryMovement = {
  id: string;
  linenItemId?: string;
  batchId: string;
  origen: LaundryLocation;
  destino: LaundryLocation;
  estadoAnterior: LaundryStatus;
  estadoNuevo: LaundryStatus;
  cantidad: number;
  responsable: string;
  fecha: string;
  observaciones?: string;
};

export type LinenKitItem = {
  id: string;
  kitId: string;
  categoria: LinenCategory;
  nombre: string;
  tamano: LinenSize;
  cantidadRequerida: number;
  cantidadIncluida: number;
  estado: "completo" | "faltante" | "observado";
  observaciones?: string;
};

export type LinenKit = {
  id: string;
  propertyId: string;
  propertyName: string;
  tipoKit: KitType;
  estado: KitStatus;
  fechaArmado?: string;
  responsableArmado?: string;
  fechaEntrega?: string;
  responsableEntrega?: string;
  items: LinenKitItem[];
  observaciones?: string;
};

export type LaundryCost = {
  id: string;
  fecha: string;
  kgProcesados: number;
  habitacionesAtendidas: number;
  costoManoObra: number;
  costoAgua: number;
  costoGas: number;
  costoElectricidad: number;
  costoQuimicos: number;
  costoMantenimiento: number;
  costoMermaBlancos: number;
  otrosCostos: number;
  costoTotal: number;
  costoPorKg: number;
  costoPorHabitacion: number;
  observaciones?: string;
};

export type LaundryCapacity = {
  id: string;
  fecha: string;
  lavadorasDisponibles: number;
  secadorasDisponibles: number;
  capacidadLavadoKgDia: number;
  capacidadSecadoKgDia: number;
  kgProcesados: number;
  porcentajeUso: number;
  alertaSaturacion: "normal" | "alta" | "saturada";
  observaciones?: string;
};

export type WarehouseStockItem = {
  id: string;
  categoria: LinenCategory;
  stockDisponible: number;
  stockMinimo: number;
  stock50Habitaciones: number;
  stock100Habitaciones: number;
  nivel: StockLevel;
};

export type Apartment = {
  id: string;
  name: string;
  code: string;
  address: string;
  areaM2?: number;
  developmentName?: string;
  furnitureType?: string;
  decorationType?: string;
  ownerName: string;
  beds: number;
  baths: number;
  status: "activo" | "pausado";
};

export type Cleaning = {
  id: string;
  apartmentId: string;
  apartmentName: string;
  assignedTo: string;
  supervisorName?: string;
  scheduledDate: string;
  checkInTime: string;
  checkOutTime: string;
  status: CleaningStatus;
  cleaningType?: string;
  guestCleaningRating?: number;
  guestFeedback?: string;
  linenReplacementNotes?: string;
  progress: number;
  receivedPhotos: number;
  finalPhotos: number;
};

export type ChecklistItem = {
  id: string;
  area: string;
  label: string;
  required: boolean;
};

export type InventoryItem = {
  id: string;
  apartmentId: string;
  name: string;
  category: string;
  expectedQuantity: number;
  currentQuantity: number;
  condition: "ok" | "revisar" | "reponer";
  price?: number;
  purchaseTicketUrl?: string;
  supplier?: string;
  purchasedAt?: string;
  retiredAt?: string;
  retirementReason?: string;
};

export type LinenItem = {
  id: string;
  apartmentId: string;
  itemType: string;
  size?: string;
  model?: string;
  color?: string;
  expectedQuantity: number;
  currentQuantity: number;
  condition: "ok" | "revisar" | "reponer" | "retirar";
  unitCost?: number;
  supplier?: string;
  purchasedAt?: string;
  retiredAt?: string;
  retirementReason?: string;
  notes?: string;
};

export type CleaningLinenReplacement = {
  id: string;
  cleaningId: string;
  linenItemId?: string;
  itemType: string;
  quantity: number;
  reason?: string;
  replacedBy?: string;
  replacedAt: string;
};

export type DamageReport = {
  id: string;
  cleaningId: string;
  apartmentName: string;
  title: string;
  description: string;
  type: "dano" | "faltante";
  inventoryItemId?: string;
  itemName?: string;
  damageType?: string;
  priority: Priority;
  photoCount: number;
  createdAt: string;
};

export type MaintenanceTicket = {
  id: string;
  apartmentName: string;
  title: string;
  description: string;
  maintenanceArea?: string;
  maintenanceCategory?: string;
  status: TicketStatus;
  priority: Priority;
  assignedTo: string;
  createdAt: string;
};

export type BusinessUnit =
  | "housekeeping"
  | "laundry"
  | "maintenance"
  | "replacements"
  | "owner_charge"
  | "guest_charge"
  | "warranty"
  | "preventive";

export type MaintenanceSourceModule =
  | "limpieza"
  | "danos_faltantes"
  | "huesped"
  | "propietario"
  | "supervisor"
  | "preventivo"
  | "manual";

export type MaintenanceIssueType =
  | "Desperfecto"
  | "Dano atribuible a huesped"
  | "Desgaste natural"
  | "Mantenimiento preventivo"
  | "Mejora"
  | "Contingencia"
  | "Garantia"
  | "Reposicion"
  | "Otro";

export type MaintenanceCategory =
  | "Aire acondicionado"
  | "Plomeria"
  | "Electricidad"
  | "Carpinteria"
  | "Pintura"
  | "Tablaroca"
  | "Pisos"
  | "Aluminio"
  | "Banos"
  | "Cocina"
  | "Electrodomesticos"
  | "Mobiliario"
  | "Cerrajeria"
  | "Internet / TV"
  | "Iluminacion"
  | "Canceleria"
  | "Decoracion"
  | "Seguridad"
  | "Otro";

export type TechnicianSpecialty =
  | "Carpintero"
  | "Pintor"
  | "Plomero"
  | "Electrico"
  | "Tablaroquero"
  | "Pisero"
  | "Tecnico de aire acondicionado"
  | "Aluminero"
  | "Cerrajero"
  | "Tecnico de electrodomesticos"
  | "Tecnico general"
  | "Supervisor";

export type MaintenancePriority = "Urgente" | "Alta" | "Media" | "Baja" | "Preventiva";

export type MaintenanceTicketStatus =
  | "Abierto"
  | "En revision"
  | "Diagnostico"
  | "Cotizacion"
  | "Aprobado"
  | "Asignado"
  | "En proceso"
  | "En espera de material"
  | "Terminado"
  | "Supervision"
  | "Cerrado"
  | "Cancelado";

export type WorkOrderStatus =
  | "Pendiente"
  | "Asignada"
  | "En proceso"
  | "En espera de material"
  | "Terminada"
  | "En supervision"
  | "Cerrada"
  | "Cancelada";

export type MaintenanceArea =
  | "sala"
  | "cocina"
  | "recamara"
  | "bano"
  | "balcon"
  | "lavanderia"
  | "instalaciones"
  | "exterior"
  | "otro";

export type MaintenanceChargeTo = "huesped" | "propietario" | "operacion" | "garantia" | "preventivo" | "seguro";

export type MaintenanceAssetTicket = {
  id: string;
  propertyId: string;
  propertyName: string;
  sourceModule: MaintenanceSourceModule;
  sourceId?: string;
  title: string;
  description: string;
  issueType: MaintenanceIssueType;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceTicketStatus;
  area: MaintenanceArea;
  reportedBy: string;
  reportedAt: string;
  photosBefore: number;
  estimatedCost: number;
  finalCost: number;
  suggestedChargeToGuest: boolean;
  chargeTo: MaintenanceChargeTo;
  businessUnit: BusinessUnit;
  dueDate?: string;
  assignedSpecialty: TechnicianSpecialty;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  observations?: string;
};

export type WorkOrder = {
  id: string;
  ticketId: string;
  propertyId: string;
  propertyName: string;
  title: string;
  description: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  specialty: TechnicianSpecialty;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  status: WorkOrderStatus;
  diagnosis?: string;
  workPerformed?: string;
  laborCost: number;
  materialCost: number;
  totalCost: number;
  materialsUsed: string[];
  photosBefore: number;
  photosDuring: number;
  photosAfter: number;
  supervisorApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  chargeTo: MaintenanceChargeTo;
  businessUnit: BusinessUnit;
  observations?: string;
};

export type PreventiveMaintenancePlan = {
  id: string;
  propertyId: string;
  propertyName: string;
  frequency: "bimestral";
  nextDate: string;
  lastDate?: string;
  status: "vigente" | "vencido" | "completado";
  assignedSupervisor: string;
  checklistTemplateId: string;
  observations?: string;
};

export type PreventiveMaintenanceVisit = {
  id: string;
  planId: string;
  propertyId: string;
  propertyName: string;
  scheduledDate: string;
  completedDate?: string;
  responsible: string;
  status: "programada" | "en_proceso" | "completada" | "vencida";
  checklistResults: Array<{ area: string; completed: number; total: number; issues: number }>;
  ticketsCreated: number;
  photos: number;
  generalCondition: "excelente" | "buena" | "regular" | "critica";
  estimatedRepairsCost: number;
  observations?: string;
};

export type TechnicalAsset = {
  id: string;
  propertyId: string;
  propertyName: string;
  category: string;
  area: MaintenanceArea;
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  materialType?: string;
  color?: string;
  finish?: string;
  dimensions?: string;
  supplier?: string;
  purchaseDate?: string;
  installationDate?: string;
  warrantyUntil?: string;
  cost: number;
  replacementCost: number;
  photoUrl?: string;
  manualUrl?: string;
  compatibleParts: string[];
  maintenanceNotes?: string;
  cleaningCareNotes?: string;
  status: "ok" | "revisar" | "garantia" | "reponer" | "fuera_servicio";
  observations?: string;
};

export type SparePart = {
  id: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  compatibleAssetIds: string[];
  compatibleProperties: string[];
  stockActual: number;
  stockMinimo: number;
  unitCost: number;
  supplier: string;
  supplierContact?: string;
  location: string;
  photoUrl?: string;
  leadTimeDays: number;
  status: "disponible" | "stock_bajo" | "critico" | "descontinuado";
  observations?: string;
};

export type Technician = {
  id: string;
  name: string;
  specialty: TechnicianSpecialty;
  phone: string;
  email: string;
  internalOrExternal: "interno" | "externo";
  hourlyRate: number;
  active: boolean;
  rating: number;
  notes?: string;
};

export type MaintenanceCost = {
  id: string;
  ticketId?: string;
  workOrderId?: string;
  propertyId: string;
  propertyName: string;
  date: string;
  laborCost: number;
  materialCost: number;
  sparePartsCost: number;
  externalServiceCost: number;
  totalCost: number;
  chargeTo: MaintenanceChargeTo;
  businessUnit: BusinessUnit;
  notes?: string;
};

export type CleaningReport = {
  cleaning: Cleaning;
  checklistCompleted: number;
  checklistTotal: number;
  inventoryIssues: number;
  damages: DamageReport[];
  tickets: MaintenanceTicket[];
};
