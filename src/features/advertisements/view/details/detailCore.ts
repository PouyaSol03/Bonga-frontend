import type { IconName } from "../viewAdTypes";
import {
  toEnglishDigits,
  toPersianNumber as toPersianDigits,
} from "../../../../shared/lib/numberUtils";

export type AdvertiserPreview = {
  href: string;
  id: string;
  kind: "agency" | "agent";
  location: string;
  logoUrl?: string;
  name: string;
  rank?: string;
  ratingScore?: string;
  subtitle: string;
};

export function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(toEnglishDigits(value).replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function toText(value: unknown, fallback = ""): string {
  if (typeof value === "string" && value.trim()) {
    return toPersianDigits(value);
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("fa-IR").format(value);
  }

  if (typeof value === "boolean") {
    return value ? "دارد" : "ندارد";
  }

  if (Array.isArray(value)) {
    const text: string = value
      .map((item) => toText(item))
      .filter(Boolean)
      .join("، ");

    return text || fallback;
  }

  return fallback;
}

export const PROPERTY_DETAIL_ICONS = {
  loan: "/icons/loan.svg",
  exchange: "/icons/exchange.svg",
  selected: "/icons/selected-icon.svg",
};

export type DetailInfoValue = string | string[];

export type DetailInfoTone = "neutral" | "success" | "warning" | "danger";

export type DetailInfoLayout = "grid" | "rows";

export type DetailInfoItem = {
  icon: IconName;
  label: string;
  value: DetailInfoValue;
  badge?: boolean;
  tone?: DetailInfoTone;
  featureIconLabel?: string;
  hideFallbackIcon?: boolean;
  iconSrc?: string | null;
  extraRows?: Array<{
    label: string;
    value: string;
  }>;
};

export type DetailInfoSection = {
  title: string;
  items: DetailInfoItem[];
  layout?: DetailInfoLayout;
  columns?: 2 | 3;
  choiceRows?: DetailInfoItem[];
  badges?: DetailInfoItem[];
  showIcons?: boolean;
  ratingBanner?: {
    count: number;
    label?: string;
  };
};
