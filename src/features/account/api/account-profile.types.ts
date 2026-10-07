import type { AuthRole } from "../../../shared/auth/auth-storage";

export type ProfileContextItem = {
  context:
    | "personal"
    | "agency"
    | "independent-consultant"
    | "agency-consultant"
    | "superadmin"
    | string;
  id?: number | string;
  _id?: number | string;
  name?: string | null;
  permissions?: Record<string, boolean>;
};

export type ProfileAccountItem = {
  context?:
    | "personal"
    | "agency"
    | "independent-consultant"
    | "agency-consultant"
    | "superadmin"
    | string;
  type?: "user" | "agency" | "agent" | string;
  role_slug?: string;
  id?: number | string;
  _id?: number | string;
  name?: string | null;
  status?: number | string;
  agency_id?: number | string | null;
  agency?: {
    id?: number | string;
    name?: string | null;
  } | null;
  permissions?: Record<string, boolean>;
};

export type UserProfile = {
  _id?: string;
  accounts?: ProfileAccountItem[];
  contexts?: ProfileContextItem[];
  agency_id?: string | number | null;
  agency_status?: number | string | null;
  authorized?: number | boolean;
  authorize_date?: string | null;
  avatar?: string | null;
  city_id?: string | null;
  contact_social?: Record<string, unknown> | null;
  contacts?: Record<string, unknown> | null;
  email?: string | null;
  family?: string | null;
  full_name?: string | null;
  id?: string | number;
  instagram?: string | null;
  mobile?: string;
  name?: string | null;
  nationalnumber?: string | null;
  neighborhood_id?: string | null;
  neighborhood_ids?: string[] | string | null;
  phone?: string;
  role?: string;
  roles?: Array<AuthRole | string | Record<string, unknown>>;
  role_slugs?: string[];
  social?: Record<string, unknown> | null;
  telegram?: string | null;
  whatsapp?: string | null;
};

export type UserProfileV2Response = {
  status?: boolean;
  user?: UserProfile;
  contexts?: ProfileContextItem[];
  context?: ProfileContextItem;
  accounts?: ProfileAccountItem[];
  data?: UserProfile;
};
