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

export type CleaningReport = {
  cleaning: Cleaning;
  checklistCompleted: number;
  checklistTotal: number;
  inventoryIssues: number;
  damages: DamageReport[];
  tickets: MaintenanceTicket[];
};
