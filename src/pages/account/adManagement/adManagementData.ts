export type ConsultantAd = {
  actions?: boolean;
  area: string;
  image: string;
  prices: Array<{
    label?: string;
    value: string;
  }>;
  rooms: string;
  time: string;
  title: string;
  year: string;
};

export type AdsTab = "active" | "status";
export type StatisticsAd = Pick<ConsultantAd, "image" | "time" | "title">;

export type AdManagementRouteState = {
  ad?: ConsultantAd;
  showPaymentSuccess?: boolean;
  statisticsAd?: StatisticsAd;
  tab?: AdsTab;
};

export const adManagementPaths = {
  allocation: "/account/ad-management/allocation",
  edit: "/account/ad-management/published/edit",
  filter: "/account/ad-management/filter",
  payment: "/account/ad-management/payment",
  published: "/account/ad-management/published",
  root: "/account/ad-management",
  search: "/account/ad-management/search",
  statistics: "/account/ad-management/statistics",
  statisticsDetails: "/account/ad-management/statistics/details",
} as const;

export const consultantAds: ConsultantAd[] = [
  {
    area: "۱۱۰ متر",
    image: "/figma/account/consultant-ad-card-1.png",
    prices: [{ value: "۳٫۸۵۰ میلیارد" }],
    rooms: "۲ اتاق",
    time: "۱ ساعت پیش در الهیه",
    title: "اپارتمان۱۱۰متری شمال تک واحدی سنداردر رحیمی",
    year: "۱۴۰۰",
  },
  {
    area: "۱۷۰ متر",
    image: "/figma/account/consultant-ad-card-2.png",
    prices: [
      { label: "اجاره:", value: "۷٫۵ میلیون" },
      { label: "رهن:", value: "۱٫۱ میلیارد" },
    ],
    rooms: "۳ اتاق",
    time: "۱ روز پیش در الهیه",
    title: "اجاره آپارتمان ابتدای هاشمیه طبقه اول ۱۷۰ متری",
    year: "۱۳۹۰",
  },
  {
    area: "۸۰۰ متر",
    image: "/figma/account/consultant-ad-card-1.png",
    prices: [
      { label: "از:", value: "۲ میلیون" },
      { label: "تا:", value: "۴ میلیون" },
    ],
    rooms: "۳ اتاق",
    time: "یک هفته پیش در شاندیز",
    title: "اجاره باغ ویلادوبلکس۳خواب استخرجکوزی شاندیز",
    year: "تا ۱۰ نفر",
  },
  {
    area: "۱۱۰ متر",
    image: "/figma/account/consultant-ad-card-1.png",
    prices: [{ value: "۳٫۸۵۰ میلیارد" }],
    rooms: "۲ اتاق",
    time: "۱ ساعت پیش در الهیه",
    title: "اپارتمان۱۱۰متری شمال تک واحدی سنداردر رحیمی",
    year: "۱۴۰۰",
  },
];

export const consultantStatusAds: ConsultantAd[] = [
  {
    actions: true,
    area: "۱۱۰ متر",
    image: "/figma/account/consultant-status-card-1.png",
    prices: [{ value: "۳٫۸۵۰ میلیارد" }],
    rooms: "۲ اتاق",
    time: "۱ ساعت پیش در الهیه",
    title: "اپارتمان۱۱۰متری شمال تک واحدی سنداردر رحیمی",
    year: "۱۴۰۰",
  },
  {
    actions: true,
    area: "۱۷۰ متر",
    image: "/figma/account/consultant-status-card-2.png",
    prices: [
      { label: "اجاره:", value: "۳۵ میلیون" },
      { label: "رهن:", value: "۳٫۸۵۰ میلیارد" },
    ],
    rooms: "۳ اتاق",
    time: "۱ ساعت پیش در الهیه",
    title: "اجاره آپارتمان ابتدای هاشمیه طبقه اول ۱۷۰ متری",
    year: "۱۳۹۶",
  },
  {
    actions: true,
    area: "۱۱۰ متر",
    image: "/figma/account/consultant-status-card-1.png",
    prices: [{ value: "۳٫۸۵۰ میلیارد" }],
    rooms: "۲ اتاق",
    time: "۱ ساعت پیش در الهیه",
    title: "اپارتمان۱۱۰متری شمال تک واحدی سنداردر رحیمی",
    year: "۱۴۰۰",
  },
];

export const statisticsAds: StatisticsAd[] = [
  {
    image: "/figma/account/consultant-stat-thumbnail-1.png",
    time: "۱ ساعت پیش در الهیه",
    title: "اپارتمان۱۱۰متری شمال تک واحدی سنداردر رحیمی",
  },
  {
    image: "/figma/account/consultant-stat-thumbnail-2.png",
    time: "۱ ساعت پیش در الهیه",
    title: "۱۴۰متر*تکواحدی ابتدای صیاد*فول امکانات",
  },
  {
    image: "/figma/account/consultant-stat-thumbnail-3.png",
    time: "۱ ساعت پیش در الهیه",
    title: "۱۶۷ متر صیاد/پیروزی تک واحدی نوساز",
  },
];

export function getAdsForTab(tab: AdsTab) {
  return tab === "active" ? consultantAds : consultantStatusAds;
}

export function getAdManagementRouteState(): AdManagementRouteState {
  return (window.history.state as AdManagementRouteState | null) ?? {};
}

export function getSelectedConsultantAd() {
  return getAdManagementRouteState().ad ?? consultantStatusAds[0];
}

export function getSelectedStatisticsAd() {
  return getAdManagementRouteState().statisticsAd ?? statisticsAds[0];
}
