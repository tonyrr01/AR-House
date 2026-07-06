export type BolongoRole =
  | "guest"
  | "owner"
  | "concierge"
  | "vendor"
  | "security"
  | "admin";

export type ServiceRequestStatus =
  | "requested"
  | "reviewing"
  | "quoted"
  | "approved"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "rated"
  | "cancelled";

export type ServicePriority = "normal" | "important" | "urgent" | "emergency";

export type AccessPassStatus = "pending" | "active" | "used" | "expired" | "cancelled";

export type NotificationChannel = "in_app" | "push" | "email" | "whatsapp";

export interface ServiceCategory {
  id: string;
  slug: string;
  name_es: string;
  name_en?: string | null;
  sort_order: number;
}

export interface ConciergeService {
  id: string;
  category_id: string;
  slug: string;
  name_es: string;
  name_en?: string | null;
  requires_quote: boolean;
  base_price?: number | null;
  is_urgent_available: boolean;
}

export interface ServiceRequestSummary {
  id: string;
  unit_id: string;
  service_id: string;
  status: ServiceRequestStatus;
  priority: ServicePriority;
  requested_for?: string | null;
  assigned_vendor_id?: string | null;
}
