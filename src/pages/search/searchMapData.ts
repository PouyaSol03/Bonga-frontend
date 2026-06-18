export type SearchFilterChip = {
  id: string;
  label: string;
  isActive?: boolean;
  removable?: boolean;
};

export type SearchMapListingId = number | string;

export type SearchMapListing = {
  id: SearchMapListingId;
  dotId: string;
  title: string;
  priceLabel: string;
  priceValue: string;
  priceUnit?: string;
  latitude: number;
  longitude: number;
  area: string;
  rooms: string;
  year: string;
  locationLabel: string;
  postedAt: string;
  agencyName: string;
  imageSrc: string;
  images: string[];
  showPriceMarker?: boolean;
  imageClassName?: string;
};

export type SearchMapDotMarker = {
  id: string;
  listingId: SearchMapListingId;
  latitude: number;
  longitude: number;
};

export type SearchMapCenter = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type SearchMapBounds = {
  east: number;
  north: number;
  south: number;
  west: number;
};

export type SearchMapTileConfig = {
  urlTemplate: string;
  attribution: string;
  minZoom?: number;
  maxZoom?: number;
  isTms: boolean;
};

/** Reuse the canonical home listing demo photo for map preview imagery. */
export const SEARCH_MAP_DEMO_PHOTO = "/figma/view-ad-album.png";

/** Map carousel shows 4 slots; demo repeats one photo so nothing 404s. */
export const searchMapCardDemoImages: string[] = Array.from(
  { length: 4 },
  () => SEARCH_MAP_DEMO_PHOTO,
);

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
    label: "۱ فیلتر",
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
    id: "area",
    label: "متراژ",
  },
  {
    id: "price",
    label: "قیمت",
  },
];

export const searchMapListings: SearchMapListing[] = [
  {
    id: 1,
    dotId: "dot-1",
    title: "اپارتمان ۱۱۰متری شمال تک واحدی سنداردر رحیمی",
    priceLabel: "قیمت",
    priceValue: "۳٫۸۵۰ میلیارد",
    priceUnit: "تومان",
    latitude: 36.2637,
    longitude: 59.5917,
    area: "۱۱۰ متر",
    rooms: "۲ اتاق",
    year: "۱۴۰۰",
    locationLabel: "الهیه",
    postedAt: "۱ ساعت پیش",
    agencyName: "دفتر املاک شریعت زاده",
    imageSrc: SEARCH_MAP_DEMO_PHOTO,
    images: searchMapCardDemoImages,
    imageClassName: "ad-card__image--one",
    showPriceMarker: true,
  },
  {
    id: 2,
    dotId: "dot-2",
    title: "آپارتمان ۹۵متری نورگیر با پارکینگ اختصاصی",
    priceLabel: "قیمت",
    priceValue: "۳٫۲۰۰ میلیارد",
    priceUnit: "تومان",
    latitude: 36.2622,
    longitude: 59.5943,
    area: "۹۵ متر",
    rooms: "۲ اتاق",
    year: "۱۳۹۸",
    locationLabel: "الهیه",
    postedAt: "۲ ساعت پیش",
    agencyName: "مشاورین املاک صدف",
    imageSrc: SEARCH_MAP_DEMO_PHOTO,
    images: searchMapCardDemoImages,
    imageClassName: "ad-card__image--two",
    showPriceMarker: true,
  },
  {
    id: 3,
    dotId: "dot-3",
    title: "واحد ۱۲۵متری خوش‌نقشه نزدیک بلوار اصلی",
    priceLabel: "قیمت",
    priceValue: "۴٫۴۰۰ میلیارد",
    priceUnit: "تومان",
    latitude: 36.2604,
    longitude: 59.5929,
    area: "۱۲۵ متر",
    rooms: "۳ اتاق",
    year: "۱۴۰۱",
    locationLabel: "سجاد",
    postedAt: "۳ ساعت پیش",
    agencyName: "دفتر املاک پارسیان",
    imageSrc: SEARCH_MAP_DEMO_PHOTO,
    images: searchMapCardDemoImages,
    imageClassName: "ad-card__image--three",
    showPriceMarker: true,
  },
  {
    id: 4,
    dotId: "dot-4",
    title: "آپارتمان ۸۸متری بازسازی‌شده با آسانسور",
    priceLabel: "قیمت",
    priceValue: "۲٫۷۵۰ میلیارد",
    priceUnit: "تومان",
    latitude: 36.2618,
    longitude: 59.6006,
    area: "۸۸ متر",
    rooms: "۲ اتاق",
    year: "۱۳۹۵",
    locationLabel: "احمدآباد",
    postedAt: "۴ ساعت پیش",
    agencyName: "املاک آریا",
    imageSrc: SEARCH_MAP_DEMO_PHOTO,
    images: searchMapCardDemoImages,
    imageClassName: "ad-card__image--four",
    showPriceMarker: false,
  },
  {
    id: 5,
    dotId: "dot-5",
    title: "واحد ۱۴۰متری فول امکانات طبقه بالا",
    priceLabel: "قیمت",
    priceValue: "۵٫۶۰۰ میلیارد",
    priceUnit: "تومان",
    latitude: 36.2634,
    longitude: 59.6038,
    area: "۱۴۰ متر",
    rooms: "۳ اتاق",
    year: "۱۴۰۲",
    locationLabel: "هاشمیه",
    postedAt: "۵ ساعت پیش",
    agencyName: "املاک اعتماد",
    imageSrc: SEARCH_MAP_DEMO_PHOTO,
    images: searchMapCardDemoImages,
    imageClassName: "ad-card__image--one",
    showPriceMarker: true,
  },
  {
    id: 6,
    dotId: "dot-6",
    title: "آپارتمان ۷۵متری اقتصادی مناسب سرمایه‌گذاری",
    priceLabel: "قیمت",
    priceValue: "۲٫۱۵۰ میلیارد",
    priceUnit: "تومان",
    latitude: 36.2591,
    longitude: 59.6022,
    area: "۷۵ متر",
    rooms: "۱ اتاق",
    year: "۱۳۹۶",
    locationLabel: "کوهسنگی",
    postedAt: "۶ ساعت پیش",
    agencyName: "دفتر املاک مرکزی",
    imageSrc: SEARCH_MAP_DEMO_PHOTO,
    images: searchMapCardDemoImages,
    imageClassName: "ad-card__image--two",
    showPriceMarker: false,
  },
  {
    id: 7,
    dotId: "dot-7",
    title: "آپارتمان ۱۰۵متری تک واحدی با انباری",
    priceLabel: "قیمت",
    priceValue: "۳٫۶۵۰ میلیارد",
    priceUnit: "تومان",
    latitude: 36.2579,
    longitude: 59.5968,
    area: "۱۰۵ متر",
    rooms: "۲ اتاق",
    year: "۱۳۹۹",
    locationLabel: "ملک‌آباد",
    postedAt: "دیروز",
    agencyName: "مشاورین املاک نگین",
    imageSrc: SEARCH_MAP_DEMO_PHOTO,
    images: searchMapCardDemoImages,
    imageClassName: "ad-card__image--three",
    showPriceMarker: true,
  },
  {
    id: 8,
    dotId: "dot-8",
    title: "واحد ۱۱۸متری کم‌واحد در موقعیت عالی",
    priceLabel: "قیمت",
    priceValue: "۴٫۰۵۰ میلیارد",
    priceUnit: "تومان",
    latitude: 36.2582,
    longitude: 59.5929,
    area: "۱۱۸ متر",
    rooms: "۲ اتاق",
    year: "۱۴۰۰",
    locationLabel: "الهیه",
    postedAt: "دیروز",
    agencyName: "املاک شریعت زاده",
    imageSrc: SEARCH_MAP_DEMO_PHOTO,
    images: searchMapCardDemoImages,
    imageClassName: "ad-card__image--four",
    showPriceMarker: true,
  },
];

export const searchMapDotMarkers: SearchMapDotMarker[] = searchMapListings.map(
  (listing) => ({
    id: listing.dotId,
    listingId: listing.id,
    latitude: listing.latitude,
    longitude: listing.longitude,
  }),
);

export const searchMapListingById = new Map<SearchMapListingId, SearchMapListing>(
  searchMapListings.map((listing) => [listing.id, listing]),
);

export const searchMapListingByDotId = new Map<string, SearchMapListing>(
  searchMapListings.map((listing) => [listing.dotId, listing]),
);
