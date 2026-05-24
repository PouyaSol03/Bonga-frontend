export type CreditPlan = {
  benefits?: string[];
  currentPrice: string;
  giftBenefits?: string[];
  name: string;
  originalPrice: string;
  selected?: boolean;
};

export type CreditPayment = {
  amount: string;
  id: string;
  method: string;
  paidAt: string;
  service: string;
  status: string;
  statusTone: "error" | "success";
};

export const panelCreditPlans: CreditPlan[] = [
  {
    currentPrice: "۴,۵۰۰,۰۰۰",
    name: "۱ ساله",
    originalPrice: "۶,۰۰۰,۰۰۰",
    selected: true,
  },
  {
    currentPrice: "۳,۵۰۰,۰۰۰",
    name: "۶ ماهه",
    originalPrice: "۵,۰۰۰,۰۰۰",
  },
  {
    currentPrice: "۱,۵۰۰,۰۰۰",
    name: "۳ ماهه",
    originalPrice: "۲,۰۰۰,۰۰۰",
  },
];

export const panelCreditBonusPlans: CreditPlan[] = [
  {
    currentPrice: "۱,۵۰۰,۰۰۰",
    giftBenefits: ["۵۰ آگهی", "۲۰ ویژه", "۲۵ بروزرسانی"],
    name: "۱ ساله",
    originalPrice: "۲,۰۰۰,۰۰۰",
    selected: true,
  },
  {
    currentPrice: "۱,۵۰۰,۰۰۰",
    giftBenefits: ["۵۰ آگهی", "۲۰ ویژه", "۲۵ بروزرسانی"],
    name: "۶ ماهه",
    originalPrice: "۲,۰۰۰,۰۰۰",
  },
  {
    currentPrice: "۱,۵۰۰,۰۰۰",
    giftBenefits: ["۵۰ آگهی", "۲۰ ویژه", "۲۵ بروزرسانی"],
    name: "۳ ماهه",
    originalPrice: "۲,۰۰۰,۰۰۰",
  },
];

export const creditPackages: CreditPlan[] = [
  {
    benefits: ["۲۰۰ اعتبار آگهی", "۸۰ اعتبار ویژه", "۱۲۰ اعتبار بروزرسانی"],
    currentPrice: "۴,۰۰۰,۰۰۰",
    name: "بسته حرفه‌ای",
    originalPrice: "۶,۰۰۰,۰۰۰",
    selected: true,
  },
  {
    benefits: ["۱۰۰ اعتبار آگهی", "۴۰ اعتبار ویژه", "۵۰ اعتبار بروزرسانی"],
    currentPrice: "۳,۵۰۰,۰۰۰",
    name: "بسته پیشرفته",
    originalPrice: "۴,۵۰۰,۰۰۰",
  },
  {
    benefits: ["۵۰ اعتبار آگهی", "۲۰ اعتبار ویژه", "۳۰ اعتبار بروزرسانی"],
    currentPrice: "۱,۵۰۰,۰۰۰",
    name: "بسته اقتصادی",
    originalPrice: "۲,۰۰۰,۰۰۰",
  },
];

export const creditPayments: CreditPayment[] = [
  {
    amount: "۱,۵۰۰,۰۰۰ تومان",
    id: "۶۵۴۱۵۴۸۹",
    method: "پرداخت آنلاین",
    paidAt: "۰۱ خرداد ۱۴۰۳",
    service: "بسته اقتصادی",
    status: "پرداخت شده",
    statusTone: "success",
  },
  {
    amount: "۳,۰۰۰,۰۰۰ تومان",
    id: "-",
    method: "پرداخت آنلاین",
    paidAt: "۰۱ خرداد ۱۴۰۳",
    service: "اعتبار ۶ ماهه",
    status: "ناموفق",
    statusTone: "error",
  },
  {
    amount: "۳۰,۰۰۰ تومان",
    id: "۶۵۴۱۵۴۸۹",
    method: "پرداخت آنلاین",
    paidAt: "۰۱ خرداد ۱۴۰۳",
    service: "۱۳۰ بروزرسانی",
    status: "پرداخت شده",
    statusTone: "success",
  },
];
