export interface AdvertisementV2EventPayload {
  event_type: "impression" | "call" | string;
  [key: string]: unknown;
}

export interface AdvertisementV2LeadClient {
  id?: number | string;
  name: string;
  phone: string;
  avatar_url?: string;
}

export interface AdvertisementV2Lead {
  id: string | number;
  client?: AdvertisementV2LeadClient;
  stage?: { key: string; title?: string; label?: string; color?: string };
  appointment?: { date_jalali?: string; time?: string };
  stats?: { calls_count?: number; messages_count?: number };
  notes?: string;
}

export interface AdvertisementV2Activity {
  id: string;
  type?: string;
  title: string;
  description?: string | null;
  occurred_at: string;
}

export interface AdvertisementV2Note {
  id: string;
  content: string;
  created_at: string;
}

export interface AdvertisementV2OwnerContact {
  owner_contact_name?: string | null;
  owner_contact_phone?: string | null;
  owner_contact_address?: string | null;
}

export interface AdvertisementV2LifecycleEligibility {
  status: boolean;
  expires_at?: string | null;
  expire?: { hours?: number; minutes?: number; total_minutes?: number };
  reason?: string;
  submit_request?: boolean;
  submitted_by?: string;
  agency?: { id: number | string; name: string };
  result?: {
    id?: number | string;
    advertise_id?: number | string;
    agency_id?: number | string;
    agency_name?: string;
    result?: string;
    description?: string;
  } | null;
}

export interface AdvertisementV2DealResultPayload {
  client_name?: string;
  client_phone?: string;
  contract_price?: string;
  commission_amount?: string;
  result: "successful" | "failed" | "unresponsive" | string;
  request_id?: number;
  assignment_id?: number;
  description?: string;
}

export interface AdvertisementV2CheckoutPayload {
  items: string[];
  payment_method: string;
  consultant_id?: string;
  discount_code?: string;
}
