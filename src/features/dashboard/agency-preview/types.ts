export type AgencyPreviewContactInfo = {
  phone: string;
  secondPhone: string;
  landline: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  lat?: number;
  lng?: number;
};

export type AgencyPreviewTab = "info" | "ads" | "consultants";

export const agencyEditPath = "/account/dashboard/agency";
export const agencyPreviewPath = "/account/dashboard/agency/preview";

export const consultantAvatarClasses = [
  "from-warning-container to-warning/50",
  "from-tertiary-container to-tertiary/50",
  "from-surface-container-high to-surface-container-highest",
  "from-primary-container to-primary/40",
];

export const agencyTabs: { id: AgencyPreviewTab; label: string }[] = [
  { id: "ads", label: "آگهی‌ها" },
  { id: "consultants", label: "مشاوران" },
  { id: "info", label: "اطلاعات" },
];
