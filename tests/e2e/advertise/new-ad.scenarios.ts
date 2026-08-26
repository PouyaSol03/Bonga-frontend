export type TransactionLabel = "فروش" | "اجاره" | "پروژه";

export type NewAdScenario = {
  transaction: "sale" | "rent" | "project";
  transactionLabel: TransactionLabel;
  section: string;
  category: string;
  categoryLabel: string;
  formCode: string;
  expectedFields: string[];
};

export const newAdScenarios: NewAdScenario[] = [
  {
    transaction: "sale",
    transactionLabel: "فروش",
    section: "مسکونی",
    category: "apartment",
    categoryLabel: "آپارتمان",
    formCode: "sale-apartment",
    expectedFields: ["متراژ آپارتمان *", "طبقه *", "تعداد اتاق *", "سن ساخت *", "قیمت *"],
  },
  {
    transaction: "sale",
    transactionLabel: "فروش",
    section: "مسکونی",
    category: "land",
    categoryLabel: "زمین، ملک کلنگی",
    formCode: "sale-land",
    expectedFields: ["متراژ زمین *", "سند *", "قیمت *"],
  },
  {
    transaction: "sale",
    transactionLabel: "فروش",
    section: "مسکونی",
    category: "villa-house",
    categoryLabel: "خانه، ویلا",
    formCode: "sale-villa-house",
    expectedFields: ["متراژ زمین *", "متراژ زیربنا *", "تعداد اتاق *", "سن ساخت *", "قیمت *"],
  },
  {
    transaction: "sale",
    transactionLabel: "فروش",
    section: "اداری، تجاری، صنعتی، اقامتی",
    category: "office",
    categoryLabel: "اداری",
    formCode: "sale-office",
    expectedFields: ["متراژ *", "طبقه *", "تعداد اتاق *", "سال ساخت *", "قیمت *"],
  },
  {
    transaction: "sale",
    transactionLabel: "فروش",
    section: "اداری، تجاری، صنعتی، اقامتی",
    category: "commercial-unit",
    categoryLabel: "واحد تجاری",
    formCode: "sale-commercial",
    expectedFields: ["متراژ *", "موقعیت تجاری *", "سند *", "وضعیت مالکیت *", "قیمت *"],
  },
  {
    transaction: "sale",
    transactionLabel: "فروش",
    section: "اداری، تجاری، صنعتی، اقامتی",
    category: "factory-workshop",
    categoryLabel: "واحد صنعتی",
    formCode: "sale-factory",
    expectedFields: ["متراژ زمین *", "موقعیت زمین *", "سال ساخت *", "سند *", "قیمت *"],
  },
  {
    transaction: "sale",
    transactionLabel: "فروش",
    section: "اداری، تجاری، صنعتی، اقامتی",
    category: "hotel-apartment",
    categoryLabel: "هتل، اقامتگاه",
    formCode: "sale-hotel",
    expectedFields: ["نوع اقامتگاه *", "رتبه اقامتگاه *", "متراژ زمین *", "متراژ بنا *", "سند *", "قیمت *"],
  },

  {
    transaction: "rent",
    transactionLabel: "اجاره",
    section: "مسکونی",
    category: "apartment",
    categoryLabel: "آپارتمان",
    formCode: "rent-apartment",
    expectedFields: ["متراژ آپارتمان *", "طبقه *", "تعداد اتاق *", "سن ساخت *", "رهن *", "اجاره *"],
  },
  {
    transaction: "rent",
    transactionLabel: "اجاره",
    section: "مسکونی",
    category: "villa-house",
    categoryLabel: "خانه، ویلا",
    formCode: "rent-villa-house",
    expectedFields: ["متراژ زمین *", "متراژ بنا *", "تعداد اتاق *", "سن ساخت *", "رهن *", "اجاره *"],
  },
  {
    transaction: "rent",
    transactionLabel: "اجاره",
    section: "روزانه",
    category: "daily-apartment-suite",
    categoryLabel: "آپارتمان، سوئیت",
    formCode: "daily-apartment-suite",
    expectedFields: [
      "نوع اقامتگاه *", "متراژ *", "تعداد اتاق *", "ظرفیت استاندارد *",
      "حداقل قیمت *", "حداکثر قیمت *", "روزهای عادی (شنبه تا چهارشنبه) *",
      "آخر هفته (چهار شنبه تا جمعه) *", "روزهای خاص (تعطیلات و مناسبت ها) *",
    ],
  },
  {
    transaction: "rent",
    transactionLabel: "اجاره",
    section: "روزانه",
    category: "daily-garden-villa",
    categoryLabel: "ویلا، باغ",
    formCode: "daily-garden-villa",
    expectedFields: [
      "متراژ زمین *", "متراژ بنا *", "تعداد اتاق *", "ظرفیت استاندارد *",
      "حداقل قیمت *", "حداکثر قیمت *", "روزهای عادی (شنبه تا چهارشنبه) *",
      "آخر هفته (چهار شنبه تا جمعه) *", "روزهای خاص (تعطیلات و مناسبت ها) *",
    ],
  },
  {
    transaction: "rent",
    transactionLabel: "اجاره",
    section: "روزانه",
    category: "daily-hotel-apartment",
    categoryLabel: "هتل، اقامتگاه",
    formCode: "daily-hotel",
    expectedFields: ["رتبه اقامتگاه *", "نوع اقامتگاه *", "حداقل قیمت *", "حداکثر قیمت *"],
  },
  {
    transaction: "rent",
    transactionLabel: "اجاره",
    section: "روزانه",
    category: "daily-workspace",
    categoryLabel: "دفترکار، غرفه",
    formCode: "daily-office-booth",
    expectedFields: [
      "نوع فضا *", "متراژ *", "تعداد اتاق *", "ظرفیت استاندارد *",
      "حداقل قیمت *", "حداکثر قیمت *", "روزهای عادی (شنبه تا چهارشنبه) *",
      "آخر هفته (چهار شنبه تا جمعه) *", "روزهای خاص (تعطیلات و مناسبت ها) *",
    ],
  },
  {
    transaction: "rent",
    transactionLabel: "اجاره",
    section: "اداری، تجاری، صنعتی، اقامتی",
    category: "office",
    categoryLabel: "اداری",
    formCode: "rent-office",
    expectedFields: ["متراژ *", "طبقه *", "تعداد اتاق *", "سال ساخت *", "رهن *", "اجاره *"],
  },
  {
    transaction: "rent",
    transactionLabel: "اجاره",
    section: "اداری، تجاری، صنعتی، اقامتی",
    category: "commercial-unit",
    categoryLabel: "واحد تجاری",
    formCode: "rent-commercial",
    expectedFields: ["متراژ *", "موقعیت تجاری *", "سال ساخت *", "طبقه *", "رهن *", "اجاره *"],
  },
  {
    transaction: "rent",
    transactionLabel: "اجاره",
    section: "اداری، تجاری، صنعتی، اقامتی",
    category: "factory-workshop",
    categoryLabel: "واحد صنعتی",
    formCode: "rent-factory-workshop",
    expectedFields: ["متراژ زمین *", "متراژ بنا *", "موقعیت زمین *", "سال ساخت *", "رهن *", "اجاره *"],
  },
  {
    transaction: "rent",
    transactionLabel: "اجاره",
    section: "اداری، تجاری، صنعتی، اقامتی",
    category: "hotel-apartment",
    categoryLabel: "هتل، اقامتگاه",
    formCode: "rent-hotel",
    expectedFields: ["نوع اقامتگاه *", "رتبه اقامتگاه *", "متراژ زمین *", "متراژ بنا *", "سن ساخت *", "رهن *", "اجاره *"],
  },

  {
    transaction: "project",
    transactionLabel: "پروژه",
    section: "اداری، تجاری، صنعتی، اقامتی",
    category: "project-presale",
    categoryLabel: "پروژه",
    formCode: "presale-special",
    expectedFields: [
      "نام سازنده/شرکت *", "نوع پروژه *", "تعداد کل طبقات *", "تعداد کل واحد ها *", "سند *",
      "حداقل قیمت متری *", "حداکثر قیمت متری *",
    ],
  },
  {
    transaction: "project",
    transactionLabel: "پروژه",
    section: "اداری، تجاری، صنعتی، اقامتی",
    category: "project-partnership",
    categoryLabel: "مشارکت",
    formCode: "partnership",
    expectedFields: ["نوع مشارکت *", "وضعیت فعلی ملک *", "متراژ زمین *", "موقعیت زمین *", "درصد مشارکت / درصد سهم *"],
  },
];

export const expectedMoreFeatureFieldsByScenario: Record<string, string[]> = {
  "sale:apartment": [
    "تعداد طبقات آپارتمان", "تعداد واحد در طبقه", "موقعیت ساختمان", "موقعیت واحد", "سند",
    "وضعیت سکونت", "بازسازی", "با لوازم و مبله", "نوع آشپزخانه", "جنس نما", "جنس کف", "جنس کابینت",
  ],
  "sale:land": ["نوع کاربری", "موقعیت زمین", "تراکم زمین", "مناسب برای", "عرض زمین", "عرض گذر", "مجوز ساخت"],
  "sale:villa-house": [
    "موقعیت زمین", "نوع بنا", "تیپ بنا", "سند", "تعداد طبقات", "عرض گذر", "بازسازی", "با لوازم و مبله",
    "نوع آشپزخانه", "جنس نما", "جنس کف", "جنس کابینت",
  ],
  "sale:office": [
    "تعداد کل طبقات", "مناسب برای", "وضعیت فعلی", "موقعیت اداری", "سند اداری", "جنس نما", "جنس کف", "جنس کابینت",
    "اتاق مدیریت", "اتاق کنفرانس", "سالن پذیرش", "تابلو خور", "آشپزخانه", "ورودی مجزا", "بازسازی شده", "مبله با لوازم",
  ],
  "sale:commercial-unit": ["سال ساخت", "طبقه", "تعداد کل طبقات", "تعداد اتاق", "تعداد دهنه", "مناسب برای", "مجوز تجاری", "وضعیت فعلی"],
  "sale:factory-workshop": ["تعداد اتاق", "متراژ بنا", "ارتفاع سقف", "نوع ملک", "دسترسی", "وضعیت فعلی", "مجوز تجاری"],
  "sale:hotel-apartment": ["موقعیت زمین", "سن ساخت", "تعداد طبقات", "تعداد اتاق یک تخته", "تعداد اتاق دو تخته", "تعداد سوییت ها", "بازسازی شده", "با لوازم و مبله", "جنس کف"],

  "rent:apartment": [
    "مناسب برای", "تعداد طبقات آپارتمان", "تعداد واحد در طبقه", "موقعیت ساختمان", "موقعیت واحد", "وضعیت سکونت",
    "تاریخ آماده تحویل", "حداقل مدت قرارداد", "حیوان خانگی", "بازسازی", "با لوازم و مبله", "نوع آشپزخانه", "جنس نما", "جنس کف", "جنس کابینت",
  ],
  "rent:villa-house": [
    "مناسب برای", "موقعیت زمین", "نوع بنا", "تیپ بنا", "تعداد طبقات", "عرض گذر", "حیوان خانگی", "بازسازی",
    "با لوازم و مبله", "نوع آشپزخانه", "جنس نما", "جنس کف", "جنس کابینت",
  ],
  "rent:office": [
    "مناسب برای", "موقعیت اداری", "وضعیت فعلی", "تاریخ آماده تحویل", "حداقل مدت قرارداد", "دارای سند", "سند اداری",
    "اتاق مدیریت", "اتاق کنفرانس", "سالن پذیرش", "تابلو خور", "آشپزخانه", "ورودی مجزا", "بازسازی شده", "با لوازم و مبله", "جنس نما", "جنس کف", "جنس کابینت",
  ],
  "rent:commercial-unit": ["تعداد اتاق", "تعداد دهنه", "ارتفاع سقف", "مناسب برای", "وضعیت فعلی", "تاریخ آماده تحویل", "حداقل مدت قرارداد"],
  "rent:factory-workshop": ["تعداد اتاق", "ارتفاع سقف", "نوع ملک", "دسترسی", "وضعیت فعلی", "مجوز تجاری", "تاریخ آماده تحویل", "حداقل مدت قرارداد"],
  "rent:hotel-apartment": ["موقعیت زمین", "تعداد طبقات", "تعداد اتاق یک تخته", "تعداد اتاق دو تخته", "تعداد سوییت ها", "بازسازی شده", "با لوازم و مبله", "جنس کف"],

  "rent:daily-apartment-suite": ["ظرفیت اضافه", "طبقه", "دوره اجاره", "ساعت ورود", "ساعت خروج", "حداقل مدت اقامت", "تضمین تخلیه", "حیوان خانگی", "با لوازم و مبله"],
  "rent:daily-garden-villa": ["ظرفیت اضافه", "چشم انداز", "تیپ بنا", "دوره اجاره", "ساعت ورود", "ساعت خروج", "حداقل مدت اقامت", "تضمین تخلیه", "حیوان خانگی", "با لوازم و مبله"],
  "rent:daily-hotel-apartment": [],
  "rent:daily-workspace": ["ظرفیت اضافه", "طبقه", "دوره اجاره", "ساعت ورود", "ساعت خروج", "حداقل مدت اقامت", "تضمین تخلیه"],

  "project:project-presale": ["وضعیت پروژه", "تاریخ تحویل", "نوع آشپزخانه", "جنس نما", "جنس کف", "جنس کابینت", "با لوازم و مبله"],
  "project:project-partnership": ["مجوز ساخت", "نوع سند", "عرض زمین", "عرض گذر"],
};

export function expectedMoreFeatureFields(scenario: NewAdScenario) {
  return expectedMoreFeatureFieldsByScenario[`${scenario.transaction}:${scenario.category}`] ?? [];
}
