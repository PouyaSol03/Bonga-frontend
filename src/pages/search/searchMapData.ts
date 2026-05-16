export type SearchFilterChip = {
  id: string;
  label: string;
  isActive?: boolean;
  removable?: boolean;
};

export type SearchMapListing = {
  id: number;
  title: string;
  priceLabel: string;
  priceValue: string;
  latitude: number;
  longitude: number;
  area: string;
  rooms: string;
  year: string;
  locationLabel: string;
  imageClassName?: string;
};

export type SearchMapCenter = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type SearchMapTileConfig = {
  urlTemplate: string;
  attribution: string;
  minZoom?: number;
  maxZoom?: number;
  isTms: boolean;
};

export const searchMapTileConfig: SearchMapTileConfig = {
  urlTemplate: "https://map.exirfirm.com/tile/{z}/{x}/{y}.png",
  attribution: "© Exir Map",
  minZoom: 11,
  maxZoom: 19,
  isTms: false,
};

export const searchMapCenter: SearchMapCenter = {
  latitude: 36.2605,
  longitude: 59.5986,
  zoom: 15,
};

export const searchFilterChips: SearchFilterChip[] = [
  {
    id: "filters",
    label: "فیلتر",
    isActive: true,
  },
  {
    id: "sale-apartment",
    label: "فروش آپارتمان",
    isActive: true,
    removable: true,
  },
  {
    id: "neighborhood",
    label: "محله",
  },
  {
    id: "price",
    label: "قیمت",
  },
  {
    id: "area",
    label: "متراژ",
  },
  {
    id: "steps",
    label: "تعداد طبقه",
  },
];

export const searchMapListings: SearchMapListing[] = [
  {
    id: 1,
    title: "آپارتمان ۱۱۰ متری شمال تک واحدی سنددار رحیمی",
    priceLabel: "قیمت",
    priceValue: "۳.۵ میلیارد",
    latitude: 36.2648,
    longitude: 59.5938,
    area: "۱۱۰ متر",
    rooms: "۲ اتاق",
    year: "۱۴۰۰",
    locationLabel: "الهیه",
    imageClassName: "ad-card__image--one",
  },
  {
    id: 2,
    title: "آپارتمان ۹۵ متری نزدیک ایستگاه مترو",
    priceLabel: "قیمت",
    priceValue: "۳.۵ میلیارد",
    latitude: 36.2587,
    longitude: 59.5964,
    area: "۹۵ متر",
    rooms: "۲ اتاق",
    year: "۱۳۹۸",
    locationLabel: "قائم",
    imageClassName: "ad-card__image--two",
  },
  {
    id: 3,
    title: "واحد نوساز دو خوابه با پارکینگ",
    priceLabel: "قیمت",
    priceValue: "۴.۲ میلیارد",
    latitude: 36.2631,
    longitude: 59.6022,
    area: "۱۲۵ متر",
    rooms: "۲ اتاق",
    year: "۱۴۰۲",
    locationLabel: "راهنمایی",
    imageClassName: "ad-card__image--three",
  },
];