export type CreateMyAgencyPayload = {
  lat?: number;
  lng?: number;
  name: string;
  neighborhood_ids: string[];
};

export type CreateMyAgentPayload = {
  agency_id?: string | number | null;
  name: string;
  phonenumber?: string;
};

export type AgentRequestItem = {
  agency_id?: string | number | null;
  created_at?: string;
  id: string | number;
  name: string;
  phonenumber?: string;
  status?: string;
  updated_at?: string;
  user_id: string | number;
};

export type CreateMyAgentResponse = {
  agent: AgentRequestItem;
  status: boolean;
};

export type MyAgencyProfile = {
  _id?: string | number;
  id?: string | number;
  name?: string | null;
  neighborhood_id?: string | null;
  neighborhood_ids?: string[] | null;
  user_chat_ids?: string[];
  logo?: string | null;
  img?: string | null;
  status?: number | null;
  agency_type?: number | null;
  phone1?: string | null;
  phone2?: string | null;
  phone3?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  working_hours?: string | null;
  address?: string | null;
  city_id?: string | null;
  city_name?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  location?: unknown;
  about_us?: string | null;
  created_at?: string;
  updated_at?: string;
  status_text?: string;
  membership?: {
    id?: number;
    role?: string;
    role_id?: number;
    permissions?: {
      manage_advertises?: boolean;
      manage_consultants?: boolean;
      manage_credits?: boolean;
      manage_requests?: boolean;
      support?: boolean;
    };
  } | null;
};

export type CreateMyAgencyResponse = {
  action?: "created" | "updated";
  agency?: MyAgencyProfile;
  status?: boolean;
};

export type UpdateMyAgencyProfilePayload = {
  name: string;
  neighborhood_id?: string | null;
  neighborhood_ids: string[];
  phone1?: string | null;
  phone2?: string | null;
  phone3?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  working_hours?: string | null;
  address?: string | null;
  about_us?: string | null;
  lat?: number | null;
  lng?: number | null;
  agency_type?: number | null;
  logo?: File | null;
  img?: File | null;
};

export interface ConsultantProfileUser {
  id?: number | string;
  name?: string | null;
  family?: string | null;
  email?: string | null;
  mobile?: string | null;
  avatar?: string | null;
}

export interface ConsultantProfileDetail {
  id?: number | string;
  phone?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  neighborhood_ids?: Array<string | number> | null;
  profile_complete?: boolean;
}

export interface ConsultantProfileResponse {
  status?: boolean;
  data: {
    user?: ConsultantProfileUser;
    consultant?: ConsultantProfileDetail;
  };
}

export interface UpdateConsultantProfilePayload {
  name?: string | null;
  family?: string | null;
  email?: string | null;
  phone?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  neighborhood_ids?: number[] | null;
}
