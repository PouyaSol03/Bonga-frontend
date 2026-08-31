export type IconName =
  | "add"
  | "addToList"
  | "album"
  | "apartment"
  | "area"
  | "attachment"
  | "arrowLeft"
  | "arrowDown"
  | "arrowUp"
  | "back"
  | "bed"
  | "bookmark"
  | "building"
  | "cabinet"
  | "calendar"
  | "ceramic"
  | "chat"
  | "checklist"
  | "cooler"
  | "document"
  | "elevator"
  | "exchange"
  | "floor"
  | "info"
  | "informationDiamond"
  | "loan"
  | "location"
  | "money"
  | "more"
  | "navigation"
  | "note"
  | "parking"
  | "payment"
  | "radiator"
  | "ranking"
  | "ruler"
  | "share"
  | "star"
  | "terrace"
  | "tooman"
  | "underfloorHeating"
  | "video"
  | "warehouse"
  | "waterCooler"
  | "waterHeater"
  | "yard";

export type DetailItem = {
  icon: IconName;
  label: string;
  value: string;
  tone?: "neutral" | "danger";
  inlineNote?: string;
  statusBadge?: string;
  featureIconLabel?: string;
  hideFallbackIcon?: boolean;
  iconSrc?: string | null;
};

export type PropertyInfoRow = DetailItem;

export type ActionRow = {
  icon: IconName;
  label: string;
};

export type EquipmentSection = {
  icon: IconName;
  items: DetailItem[];
  title: string;
};

export type ViewAdDetails = {
  adCode: string;
  agency: string;
  agencyLocation: string;
  age: string;
  categoryNeighborhood: string;
  description: string;
  formCode: string;
  headline: string;
  locationTitle: string;
  pricePerMeter: string;
  pricePrimaryLabel: string;
  priceSecondaryLabel: string;
  rentConversionPolicy?: string;
  status: string;
  title: string;
  totalPrice: string;
  imagesBelongToAd?: boolean;
  features: DetailItem[];
  equipmentSections: EquipmentSection[];
  propertyInfoPreview: DetailItem[];
  propertyInfoRows: PropertyInfoRow[];
  rows: ActionRow[];
};
