import {
  type AdvertisementAgency,
  type AdvertisementAgent,
  type AdvertisementLocationEntity,
  type AdvertisementContacts,
  type AdvertisementFeature,
  type AdvertisementImage,
  type AdvertisementSocial,
  type AdvertisementStatus,
} from "./entity-types";

export type AdvertisementItem = Record<string, unknown> & {
  _id?: string;
  agency?: AdvertisementAgency | string | null;
  agency_id?: number | string | null;
  agent?: AdvertisementAgent | null;
  consultant?: AdvertisementAgent | null;
  agent_id?: number | string | null;
  area?: string | number;
  badges?: string[];
  is_ladder?: boolean | number | string;
  is_special?: boolean | number | string;
  isAssigned?: boolean;
  assignment_status?: string | number | null;
  assigned_agency_id?: number | string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  long?: number | string | null;
  neighborhoodId?: number | string | null;
  subNeighborhoodId?: number | string | null;
  project_type?: string | null;
  document_type?: string | null;
  total_floors?: number | string | null;
  total_units?: number | string | null;
  sale_terms_percent?: number | string | null;
  sale_terms_installment_months?: number | string | null;
  city?: AdvertisementLocationEntity | null;
  city_id?: number | string | null;
  city_name?: string;
  category_neighborhood?: string | null;
  contact_type?: string[];
  contacts?: AdvertisementContacts | null;
  created_at?: string;
  description?: string;
  district?: AdvertisementLocationEntity | null;
  district_name?: string;
  features?: AdvertisementFeature[];
  form_code?: string;
  form_neighborhood_title?: string | null;
  id?: string | number;
  image?: string;
  images?: AdvertisementImage[];
  is_bookmarked?: boolean;
  is_mine?: boolean;
  label?: string;
  lat?: number | string | null;
  lng?: number | string | null;
  loan?: {
    amount?: string | number | null;
    installment?: string | number | null;
  } | null;
  location_label?: string | null;
  neighborhood?: AdvertisementLocationEntity | null;
  neighborhood_id?: number | string | null;
  neighborhood_name?: string;
  owner_contact_name?: string | null;
  owner_contact_phone?: string | null;
  owner_contact_address?: string | null;
  ownerContactName?: string | null;
  ownerContactPhone?: string | null;
  ownerContactAddress?: string | null;
  ownerName?: string | null;
  owner_name?: string | null;
  ownerAddress?: string | null;
  owner_address?: string | null;
  owner_profile?: {
    display_name?: string;
    first_name?: string;
    last_name?: string;
    mobile?: string;
  } | null;
  loan_amount?: number | string | null;
  loan_installment?: number | string | null;
  has_loan?: boolean | number | string | null;
  floor?: number | string | null;
  unit_floor?: number | string | null;
  location?: { label?: string; coordinates?: [number, number] } | null;
  owner_type?: string;
  publisher_type?: "user" | "agency" | "agent" | string;
  publisher_user_id?: number | string | null;
  publisher_agency_id?: number | string | null;
  publisher_agent_id?: number | string | null;
  price?: string | number;
  price_label?: string;
  published_days?: string | number | null;
  published_date?: string | number | null;
  published_time_ago?: string | number;
  rooms?: string | number;
  short_description?: string;
  social?: AdvertisementSocial | null;
  status?: AdvertisementStatus | string;
  status_code?: number;
  status_label?: string;
  sub_neighborhood?: AdvertisementLocationEntity | null;
  sub_neighborhood_id?: number | string | null;
  title?: string;
  updated_at?: string;
  video?: string | null;
  virtual_tour_link?: string | null;
  year?: string | number;
};
