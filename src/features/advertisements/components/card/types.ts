import type { ReactNode } from "react";

export type AdCardPropertyItem = {
  icon: ReactNode;
  value: string;
};

export type AdCardData = {
  id: number | string;
  title: string;
  agency: string;
  status: string;
  imageCount: string;
  priceLabelPrimary: string;
  pricePrimary: string;
  priceLabelSecondary: string;
  priceSecondary: string;
  area?: string;
  rooms?: string;
  year?: string;
  landArea?: string;
  documentType?: string;
  commercialPosition?: string;
  landPosition?: string;
  floor?: string;
  buildingArea?: string;
  capacity?: string;
  stars?: string;
  rentalPeriod?: string;
  projectType?: string;
  totalFloors?: string;
  totalUnits?: string;
  builderShare?: string;
  currentStatus?: string;
  category?: string;
  formCode?: string;
  properties?: AdCardPropertyItem[];
  timeAndLocation: string;
  imageClassName: string;
  imageUrl?: string;
  badges: string[];
  statusBadgeClassName?: string;
};

export type AdCardVariant = "standard" | "dashboard" | "requestResult" | "mapPreview" | "carousel";
export type AdCardProps = {
  ad: AdCardData;
  ariaLabel?: string;
  className?: string;
  imageAction?: ReactNode;
  imageMeta?: ReactNode;
  imageLoading?: "eager" | "lazy";
  isSelected?: boolean;
  mapPreviewImages?: string[];
  mapSliderCardId?: number | string;
  showBadges?: boolean;
  showAgency?: boolean;
  showImageCount?: boolean;
  showStatusBadge?: boolean;
  state?: unknown;
  to?: string;
  topBadge?: ReactNode;
  variant?: AdCardVariant;
  onDeleteIncomplete?: (event: React.MouseEvent) => void;
};
export type AdCategoryType =
  | "sale-apartment"
  | "sale-land"
  | "sale-garden-villa"
  | "sale-office"
  | "sale-commercial"
  | "sale-factory"
  | "sale-hotel"
  | "rent-apartment"
  | "rent-villa-house"
  | "rent-hotel"
  | "rent-office"
  | "rent-commercial"
  | "rent-factory"
  | "daily-apartment-suite"
  | "daily-garden-villa"
  | "daily-hotel"
  | "daily-office-booth"
  | "project-presale"
  | "project-partnership"
  | "default";

export type AdCardPropertyValue = {
  icon: ReactNode;
  value?: string;
};
