import type { AdCardData } from "../../../../advertisements/components/AdCard";
import type { TeamConsultant } from "../ConsultantManagementPage";
import type { ConsultantPieDatum } from "./types";

export const MONTHLY_PROGRESS_DATA = [
  { month: "فروردین", value: 12 },
  { month: "اردیبهشت", value: 18 },
  { month: "خرداد", value: 24 },
  { month: "تیر", value: 31 },
  { month: "مرداد", value: 42 },
  { month: "شهریور", value: 51 },
];

export const YEARLY_PROGRESS_DATA = [
  { month: "۱۴۰۰", value: 48 },
  { month: "۱۴۰۱", value: 92 },
  { month: "۱۴۰۲", value: 135 },
  { month: "۱۴۰۳", value: 178 },
  { month: "۱۴۰۴", value: 215 },
];

export const sampleConsultantAds: AdCardData[] = [
  {
    id: "sample-ad-1",
    title: "آپارتمان ۱۴۰ متری سه خواب تک‌واحدی، سجاد",
    agency: "املاک اکسیر",
    status: "",
    imageCount: "۵",
    priceLabelPrimary: "قیمت کل:",
    pricePrimary: "۹/۸۰۰/۰۰۰/۰۰۰",
    priceLabelSecondary: "قیمت هر متر:",
    priceSecondary: "۷۰/۰۰۰/۰۰۰",
    area: "۱۴۰",
    rooms: "۳",
    year: "۱۴۰۲",
    category: "residential-apartment",
    timeAndLocation: "۳ ساعت پیش در سجاد",
    imageClassName: "ad-card__image--1",
    badges: ["فوری", "تک‌واحدی"],
  },
  {
    id: "sample-ad-2",
    title: "ویلایی دوبلکس ۳۰۰ متر با استخر، وکیل‌آباد",
    agency: "املاک اکسیر",
    status: "",
    imageCount: "۸",
    priceLabelPrimary: "رهن کامل:",
    pricePrimary: "۲/۵۰۰/۰۰۰/۰۰۰",
    priceLabelSecondary: "",
    priceSecondary: "",
    area: "۳۰۰",
    rooms: "۴",
    year: "۱۴۰۰",
    category: "residential-villa",
    timeAndLocation: "امروز در وکیل‌آباد",
    imageClassName: "ad-card__image--2",
    badges: ["استخردار"],
  },
  {
    id: "sample-ad-3",
    title: "مغازه تجاری ۴۵ متری بر اصلی، احمدآباد",
    agency: "املاک اکسیر",
    status: "",
    imageCount: "۳",
    priceLabelPrimary: "قیمت کل:",
    pricePrimary: "۱۲/۰۰۰/۰۰۰/۰۰۰",
    priceLabelSecondary: "",
    priceSecondary: "",
    area: "۴۵",
    rooms: "-",
    year: "۱۳۹۸",
    category: "commercial-shop",
    timeAndLocation: "دیروز در احمدآباد",
    imageClassName: "ad-card__image--3",
    badges: [],
  },
];

export function createConsultantPieDatum({
  badgeClassName,
  color,
  consultantValue,
  lightColor,
  periodText = "در این ماه",
  title,
  total,
}: {
  badgeClassName: string;
  color: string;
  consultantValue: number;
  lightColor: string;
  periodText?: string;
  title: string;
  total: number | undefined;
}): ConsultantPieDatum {
  const hasTotal = typeof total === "number";
  const safeTotal = hasTotal ? Math.max(0, total) : 0;
  const safeValue = Math.max(0, consultantValue);
  const consultantPercent =
    safeTotal > 0
      ? Math.min(100, Math.round((safeValue / safeTotal) * 100))
      : 0;
  const formatter = new Intl.NumberFormat("fa-IR");

  return {
    agencyPercent: safeTotal > 0 ? 100 - consultantPercent : 0,
    badge: hasTotal ? `${formatter.format(consultantPercent)}٪` : "—",
    badgeClassName,
    color,
    lightColor,
    subtitle: hasTotal
      ? `${formatter.format(safeValue)} مورد از ${formatter.format(safeTotal)} مورد ثبت شده ${periodText}`
      : "داده‌ای از سرور دریافت نشده است",
    title,
    value: consultantPercent,
  };
}

export function buildConsultantPieCards(
  consultant: TeamConsultant,
  isMonth: boolean,
): ConsultantPieDatum[] {
  const periodText = isMonth ? "در این ماه" : "در این سال";

  return [
    createConsultantPieDatum({
      badgeClassName: "bg-primary-container text-primary",
      color: "var(--primary)",
      consultantValue: isMonth ? consultant.scores.ads : 340,
      lightColor: "var(--primary-container)",
      periodText,
      title: "آگهی منتشر شده در آژانس",
      total: isMonth ? 100 : 600,
    }),
    createConsultantPieDatum({
      badgeClassName: "bg-tertiary-container text-tertiary",
      color: "var(--tertiary)",
      consultantValue: isMonth ? consultant.scores.steps : 180,
      lightColor: "var(--tertiary-container)",
      periodText,
      title: "بروزرسانی منتشر شده در آژانس",
      total: isMonth ? 50 : 320,
    }),
    createConsultantPieDatum({
      badgeClassName: "bg-warning-container text-warning",
      color: "var(--warning)",
      consultantValue: isMonth ? consultant.scores.rocket : 75,
      lightColor: "var(--warning-container)",
      periodText,
      title: "ویژه منتشر شده در آژانس",
      total: isMonth ? 25 : 150,
    }),
  ];
}
