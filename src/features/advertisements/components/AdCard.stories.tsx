import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdCard, type AdCardData } from "./AdCard";

const sampleAd: AdCardData = {
  id: "ad-101",
  title: "آپارتمان ۱۴۰ متری نوساز سه خوابه فرمانیه",
  agency: "املاک بزرگ نیاوران",
  status: "تایید شده",
  statusBadgeClassName: "bg-tertiary/10 text-tertiary",
  imageCount: "۵",
  priceLabelPrimary: "قیمت کل",
  pricePrimary: "۲۱,۰۰۰,۰۰۰,۰۰۰ تومان",
  priceLabelSecondary: "قیمت هر متر",
  priceSecondary: "۱۵۰,۰۰۰,۰۰۰ تومان",
  area: "۱۴۰",
  rooms: "۳ خواب",
  year: "۱۴۰۲",
  timeAndLocation: "۲ ساعت پیش در نیاوران",
  imageClassName: "",
  imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80",
  badges: ["فوری", "ویژه"],
};

const meta: Meta<typeof AdCard> = {
  title: "Features/Advertisements/AdCard",
  component: AdCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "کارت آگهی ملک (AdCard) در لیست‌های جستجو، داشبورد مشاورین و صفحه آگهی‌های من، شامل تصویر، نشان‌های وضعیت، متراژ، خواب، سال ساخت و قیمت‌ها.",
      },
    },
  },
  args: {
    ad: sampleAd,
  },
};

export default meta;
type Story = StoryObj<typeof AdCard>;

export const StandardSearchCard: Story = {
  name: "کارت استاندارد در نتایج جستجو",
  args: {
    ad: sampleAd,
    variant: "standard",
    showBadges: true,
    showAgency: true,
  },
};

export const IncompleteUserAd: Story = {
  name: "آگهی نیمه‌کاره کاربر عادی (Incomplete Status)",
  args: {
    ad: {
      ...sampleAd,
      title: "ویلای دوبلکس ۳۵۰ متری لواسان",
      status: "نیمه کاره",
      statusBadgeClassName: "bg-warning/10 text-warning",
      badges: [],
      agency: "",
    },
    variant: "dashboard",
    showStatusBadge: true,
    showAgency: false,
  },
};

export const ApprovedAd: Story = {
  name: "آگهی تایید شده و فعال (Approved)",
  args: {
    ad: {
      ...sampleAd,
      status: "تایید شده",
      statusBadgeClassName: "bg-tertiary/10 text-tertiary",
    },
    variant: "dashboard",
    showStatusBadge: true,
  },
};

export const RejectedAd: Story = {
  name: "آگهی رد شده با کادر خطا (Rejected)",
  args: {
    ad: {
      ...sampleAd,
      title: "زمین کلنگی ۴۰۰ متری تجریش",
      status: "رد شده",
      statusBadgeClassName: "bg-error/10 text-error",
      badges: [],
    },
    variant: "dashboard",
    showStatusBadge: true,
  },
};

export const WithoutImage: Story = {
  name: "آگهی بدون تصویر (Fallback Placeholder)",
  args: {
    ad: {
      ...sampleAd,
      imageUrl: undefined,
      badges: [],
    },
    variant: "standard",
  },
};

// --- دسته‌بندی‌های سفارشی‌سازی شده (7 دسته درخواست شده) ---

export const CategoryApartmentSale: Story = {
  name: "۱. فروش آپارتمان (متراژ، تعداد اتاق، سن ساخت)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-1",
      category: "فروش آپارتمان",
      formCode: "sale-apartment",
      title: "آپارتمان ۱۱۰ متری دو خوابه نوساز در سعادت‌آباد",
      area: "۱۱۰ متر",
      rooms: "۲ اتاق",
      year: "نوساز",
    },
    variant: "standard",
  },
};

export const CategoryLandSale: Story = {
  name: "۲. فروش زمین و ملک کلنگی (متراژ، متراژ زمین، نوع سند)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-2",
      category: "فروش زمین و ملک کلنگی",
      formCode: "sale-land",
      title: "ملک کلنگی ۵۰۰ متری با ۲۰۰ متر بنای احداثی در نیاوران",
      area: "۲۰۰ متر",
      landArea: "۵۰۰ متر",
      documentType: "تک برگ",
      rooms: undefined,
      year: undefined,
    },
    variant: "standard",
  },
};

export const CategoryGardenVillaSale: Story = {
  name: "۳. فروش باغ، ویلا (متراژ، اتاق، سن ساخت)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-3",
      category: "فروش باغ، ویلا",
      formCode: "sale-garden-villa",
      title: "ویلا مدرن ۴۵۰ متری دوبلکس استخردار در لواسان",
      area: "۴۵۰ متر",
      rooms: "۴ اتاق",
      year: "۲ سال ساخت",
    },
    variant: "standard",
  },
};

export const CategoryOfficeSale: Story = {
  name: "۴. فروش واحد اداری (متراژ، تعداد اتاق، سن ساخت)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-4",
      category: "فروش واحد اداری",
      formCode: "sale-office",
      title: "واحد اداری ۱۲۰ متری تابلوخور سند اداری در جردن",
      area: "۱۲۰ متر",
      rooms: "۳ اتاق",
      year: "۵ سال ساخت",
    },
    variant: "standard",
  },
};

export const CategoryCommercialSale: Story = {
  name: "۵. فروش واحد تجاری (متراژ، نوع سند، موقعیت تجاری)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-5",
      category: "فروش واحد تجاری",
      formCode: "sale-commercial",
      title: "مغازه تجاری ۶۵ متری بر اصلی خیابان شریعتی",
      area: "۶۵ متر",
      documentType: "سرقفلی",
      commercialPosition: "حاشیه خیابان اصلی",
      rooms: undefined,
      year: undefined,
    },
    variant: "standard",
  },
};

export const CategoryIndustrialSale: Story = {
  name: "۶. فروش واحد صنعتی (متراژ، نوع سند، موقعیت زمین)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-6",
      category: "فروش واحد صنعتی",
      formCode: "sale-factory",
      title: "سوله و کارخانه صنعتی ۱۲۰۰ متری در شهرک صنعتی شمس‌آباد",
      area: "۱۲۰۰ متر",
      documentType: "تک برگ عرصه و اعیان",
      landPosition: "دو نبش",
      rooms: undefined,
      year: undefined,
    },
    variant: "standard",
  },
};

export const CategoryHotelSale: Story = {
  name: "۷. فروش هتل، اقامتگاه (هتل با آیکون شهر، متراژ زمین، نوع سند)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-7",
      category: "فروش هتل، اقامتگاه",
      formCode: "sale-hotel",
      title: "هتل آپارتمان ۳ ستاره فعال با پروانه در مشهد",
      landArea: "۲۵۰۰ متر",
      documentType: "تک برگ ملکی",
      rooms: undefined,
      year: undefined,
    },
    variant: "standard",
  },
};

export const CategoryRentApartment: Story = {
  name: "۸. اجاره آپارتمان (اجاره | رهن - متراژ، اتاق، سن ساخت)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-8",
      category: "اجاره آپارتمان",
      formCode: "rent-apartment",
      title: "آپارتمان ۱۱۰ متری ۲ خوابه فول امکانات در سعادت‌آباد",
      priceLabelPrimary: "اجاره:",
      pricePrimary: "۳۵٬۰۰۰٬۰۰۰",
      priceLabelSecondary: "رهن:",
      priceSecondary: "۸۰۰٬۰۰۰٬۰۰۰",
      area: "۱۱۰ متر",
      rooms: "۲ اتاق",
      year: "۴ سال ساخت",
    },
    variant: "standard",
  },
};

export const CategoryRentVillaHouse: Story = {
  name: "۹. اجاره خانه، ویلا (متراژ، اتاق، سن ساخت)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-9",
      category: "اجاره خانه، ویلا",
      formCode: "rent-house-villa",
      title: "ویلای دربست ۳۵۰ متری حیاط‌دار در شهرک غرب",
      priceLabelPrimary: "اجاره:",
      pricePrimary: "۶۵٬۰۰۰٬۰۰۰",
      priceLabelSecondary: "رهن:",
      priceSecondary: "۱٬۵۰۰٬۰۰۰٬۰۰۰",
      area: "۳۵۰ متر",
      rooms: "۴ اتاق",
      year: "۸ سال ساخت",
    },
    variant: "standard",
  },
};

export const CategoryRentHotel: Story = {
  name: "۱۰. اجاره هتل و اقامتگاه (هتل با آیکون شهر، متراژ زمین، نوع سند)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-10",
      category: "اجاره هتل و اقامتگاه",
      formCode: "rent-hotel",
      title: "اقامتگاه بوم‌گردی ۱۲ سوییته فعال در کاشان",
      priceLabelPrimary: "اجاره:",
      pricePrimary: "۸۰٬۰۰۰٬۰۰۰",
      priceLabelSecondary: "ودیعه:",
      priceSecondary: "۲٬۰۰۰٬۰۰۰٬۰۰۰",
      landArea: "۱۸۰۰ متر",
      documentType: "ششدانگ عرصه و اعیان",
      rooms: undefined,
      year: undefined,
    },
    variant: "standard",
  },
};

export const CategoryRentOffice: Story = {
  name: "۱۱. اجاره واحد اداری (متراژ، تعداد اتاق، طبقه)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-11",
      category: "اجاره واحد اداری",
      formCode: "rent-office",
      title: "دفتر کار ۹۵ متری موقعیت اداری در میرداماد",
      priceLabelPrimary: "اجاره:",
      pricePrimary: "۴۰٬۰۰۰٬۰۰۰",
      priceLabelSecondary: "رهن:",
      priceSecondary: "۵۰۰٬۰۰۰٬۰۰۰",
      area: "۹۵ متر",
      rooms: "۲ اتاق",
      floor: "طبقه ۴",
      year: undefined,
    },
    variant: "standard",
  },
};

export const CategoryRentCommercial: Story = {
  name: "۱۲. اجاره واحد تجاری (متراژ، اتاق، طبقه)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-12",
      category: "اجاره واحد تجاری",
      formCode: "rent-commercial",
      title: "واحد تجاری ۵۰ متری در پاساژ تندیس تجریش",
      priceLabelPrimary: "اجاره:",
      pricePrimary: "۵۵٬۰۰۰٬۰۰۰",
      priceLabelSecondary: "رهن:",
      priceSecondary: "۷۰۰٬۰۰۰٬۰۰۰",
      area: "۵۰ متر",
      rooms: "۱ اتاق",
      floor: "همکف",
      year: undefined,
    },
    variant: "standard",
  },
};

export const CategoryRentIndustrial: Story = {
  name: "۱۳. اجاره واحد صنعتی (متراژ، زیربنا، موقعیت زمین)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-13",
      category: "اجاره واحد صنعتی",
      formCode: "rent-factory",
      title: "سوله بهداشتی ۸۰۰ متری دارای انشعابات کامل در کرج",
      priceLabelPrimary: "اجاره:",
      pricePrimary: "۷۰٬۰۰۰٬۰۰۰",
      priceLabelSecondary: "رهن:",
      priceSecondary: "۱٬۰۰۰٬۰۰۰٬۰۰۰",
      area: "۸۰۰ متر",
      buildingArea: "۶۵۰ متر زیربنا",
      landPosition: "دو بر",
      rooms: undefined,
      year: undefined,
    },
    variant: "standard",
  },
};

export const CategoryDailyApartment: Story = {
  name: "۱۴. اجاره روزانه آپارتمان، سوئیت (قیمت x تا y آبی، آپارتمان با آیکون، اتاق، متراژ)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-14",
      category: "اجاره روزانه آپارتمان، سوئیت",
      formCode: "daily-rent-apartment",
      title: "سوئیت مبله شیک یک‌خوابه مرکز شهر نزدیک مترو",
      priceLabelPrimary: "قیمت",
      pricePrimary: "۱٬۸۰۰٬۰۰۰",
      priceSecondary: "۲٬۵۰۰٬۰۰۰",
      area: "۷۵ متر",
      rooms: "۱ اتاق",
      year: undefined,
    },
    variant: "standard",
  },
};

export const CategoryDailyGardenVilla: Story = {
  name: "۱۵. اجاره روزانه باغ ویلا (قیمت x تا y، متراژ، اتاق، ظرفیت استاندارد)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-15",
      category: "اجاره روزانه باغ، ویلا",
      formCode: "daily-rent-villa",
      title: "ویلای استخردار آبگرم با فضای بازی در کردان",
      priceLabelPrimary: "قیمت",
      pricePrimary: "۳٬۵۰۰٬۰۰۰",
      priceSecondary: "۵٬۵۰۰٬۰۰۰",
      area: "۵۰۰ متر",
      rooms: "۳ اتاق",
      capacity: "۶ نفر",
      year: undefined,
    },
    variant: "standard",
  },
};

export const CategoryDailyHotel: Story = {
  name: "۱۶. اجاره روزانه هتل، اقامتگاه (قیمت x تا y، هتل، ستاره، دوره اجاره)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-16",
      category: "اجاره روزانه هتل، اقامتگاه",
      formCode: "daily-rent-hotel",
      title: "اتاق دوتخته رو به دریا در هتل ساحلی کیش",
      priceLabelPrimary: "قیمت",
      pricePrimary: "۲٬۲۰۰٬۰۰۰",
      priceSecondary: "۳٬۴۰۰٬۰۰۰",
      stars: "۴ ستاره",
      rentalPeriod: "روزانه",
      rooms: undefined,
      year: undefined,
    },
    variant: "standard",
  },
};

export const CategoryDailyOfficeBooth: Story = {
  name: "۱۷. اجاره روزانه دفترکار، غرفه (اتاق کار خصوصی با آیکون شهر، تعداد اتاق، متراژ)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-17",
      category: "اجاره روزانه دفترکار، اتاق کار و غرفه",
      formCode: "daily-rent-office",
      title: "اتاق جلسه و فضای کار اشتراکی ساعتی و روزانه در ونک",
      priceLabelPrimary: "قیمت",
      pricePrimary: "۸۰۰٬۰۰۰",
      priceSecondary: "۱٬۴۰۰٬۰۰۰",
      area: "۴۰ متر",
      rooms: "۲ اتاق",
      year: undefined,
    },
    variant: "standard",
  },
};

export const CategoryProjectPresale: Story = {
  name: "۱۸. پیش‌فروش (قیمت متری: x تا x - نوع پروژه، تعداد کل طبقات، تعداد کل واحد ها)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-18",
      category: "پیش فروش، فروش پروژه",
      formCode: "presale-special",
      title: "پروژه لوکس رونیکا پالاس هروی برج باغ مدرن",
      priceLabelPrimary: "قیمت متری:",
      pricePrimary: "۶۵٬۰۰۰٬۰۰۰",
      priceSecondary: "۸۵٬۰۰۰٬۰۰۰",
      projectType: "مسکونی",
      totalFloors: "۱۲ طبقه",
      totalUnits: "۸۰ واحد",
      rooms: undefined,
      year: undefined,
      area: undefined,
    },
    variant: "standard",
  },
};

export const CategoryProjectPartnership: Story = {
  name: "۱۹. مشارکت (درصد مشارکت - متراژ زمین، موقعیت، وضعیت فعلی ملک)",
  args: {
    ad: {
      ...sampleAd,
      id: "ad-cat-19",
      category: "مشارکت در ساخت",
      formCode: "partnership",
      title: "ملک کلنگی ۶۰۰ متری موقعیت عالی مناسب مشارکت در ساخت در یوسف‌آباد",
      pricePrimary: "",
      priceSecondary: "",
      priceLabelPrimary: "درصد مشارکت:",
      builderShare: "۶۰٪",
      landArea: "۶۰۰ متر",
      landPosition: "دو نبش",
      currentStatus: "بنا قدیمی",
      rooms: undefined,
      year: undefined,
      area: undefined,
    },
    variant: "standard",
  },
};

