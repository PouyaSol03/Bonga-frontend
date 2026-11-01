export type AdvertisementStatus =
  | "wait_for_payment"
  | "wait_for_admin"
  | "wait_for_agency"
  | "accepted"
  | "needs_edit"
  | "rejected"
  | "deleted"
  | "expired";

export type AdvertisementFeature = {
  key?: string;
  label: string;
  value: unknown;
};

export type AdvertisementImage = {
  is_main?: boolean;
  path?: string;
  src?: string;
  url?: string;
};

export type AdvertisementLocationEntity = {
  id?: number | string;
  name?: string;
};

export type AdvertisementAgency = {
  _id?: number | string;
  id?: number | string;
  location?: string;
  logo?: string | null;
  name?: string;
  rank?: number | string | null;
  rating_score?: number | string | null;
};

export type AdvertisementAgent = {
  _id?: number | string;
  agency_id?: number | string | null;
  agency_name?: string;
  avatar?: string;
  id?: number | string;
  img?: string;
  logo?: string;
  name?: string;
  rank?: number | string | null;
  rating_score?: number | string | null;
};

export type AdvertisementContacts = {
  chat?: boolean;
  instagram?: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
};

export type AdvertisementSocial = {
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
};
