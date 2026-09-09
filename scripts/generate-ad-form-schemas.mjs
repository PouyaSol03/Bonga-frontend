import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../src/features/advertisements/forms');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Common options from PDF
const roomOptions = ["بدون اتاق", "۱", "۲", "۳", "۴", "۵ و بیشتر"];
const floorOptions = [
  "زیرهمکف", "همکف", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۱۰", "بالاتر از ۱۰"
];
const ageOptions = [
  "نوساز",
  "۱ سال", "۲ سال", "۳ سال", "۴ سال", "۵ سال",
  "۶ سال", "۷ سال", "۸ سال", "۹ سال", "۱۰ سال",
  "۱۱ سال", "۱۲ سال", "۱۳ سال", "۱۴ سال", "۱۵ سال",
  "۱۶ سال", "۱۷ سال", "۱۸ سال", "۱۹ سال", "۲۰ سال",
  "بیشتر از ۲۰ سال"
];
const totalFloorsOptions = ["۱ طبقه", "۲ طبقه", "۳ طبقه", "۴ طبقه", "۵ طبقه", "۶ طبقه", "۷ طبقه", "۸ طبقه و بیشتر"];
const unitsPerFloorOptions = [
  "تک واحدی", "دو واحدی", "سه واحدی", "چهار واحدی",
  "پنج واحدی", "شش واحدی", "هفت واحدی", "هشت واحد بیشتر"
];
const buildingPositionOptions = ["شمالی", "جنوبی", "شرقی", "غربی", "دونبش", "سه نبش", "دوممر"];
const landPositionOptions = ["شمالی", "جنوبی", "غربی", "شرقی", "دوممر", "دونبش", "سه نبش", "چهارنبش"];
const unitPositionOptions = ["جلو", "عقب", "وسط", "کنج", "دوبلکس", "پنت هاوس"];
const standardDocumentOptions = [
  "تک برگ", "منگوله دار", "آستانه", "اوقافی", "موقوفه",
  "وکالت محضری", "قولنامه", "مشاع", "در دست اقدام", "آماده انتقال"
];
const commercialDocumentOptions = [
  "تک برگ", "منگوله دار", "سرقفلی", "وکالت محضری",
  "قولنامه", "مشاع", "در دست اقدام", "آماده انتقال"
];
const occupancyStatusOptions = ["تخلیه", "مالک", "مستاجر دارد"];
const kitchenTypeOptions = ["اپن", "جزیره", "بسته", "نیمه اپن"];
const facadeOptions = ["سنگ", "آجر", "سیمان", "کامپوزیت", "شیشه", "رومی", "ترکیبی"];
const floorMaterialOptions = ["سرامیک", "سنگ", "پارکت", "لمینت", "موزاییک", "کفپوش"];
const cabinetOptions = ["MDF", "های‌گلاس", "ممبران", "فلزی", "چوبی", "ندارد"];
const rentConversionOptions = ["قابل تبدیل نیست", "رهن قابل تبدیل", "اجاره قابل تبدیل"];
const petPolicyOptions = ["مجاز", "غیر مجاز"];

// Common heating items (all 12 items as specified in PDF)
const commonHeatingItems = [
  { id: "water-cooler", label: "کولر آبی" },
  { id: "gas-cooler", label: "کولر گازی" },
  { id: "duct-split", label: "داکت اسپیلت" },
  { id: "chiller", label: "چیلر" },
  { id: "fan-coil", label: "فن کوئل" },
  { id: "heater", label: "بخاری" },
  { id: "radiator", label: "شوفاژ" },
  { id: "floor-heating", label: "گرمایش ازکف" },
  { id: "fireplace", label: "شومینه" },
  { id: "water-heater", label: "آبگرم کن" },
  { id: "package", label: "پکیج" },
  { id: "central-boiler", label: "موتورخانه" }
];

// Residential facilities (Page 2)
const residentialFacilities = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "yard", label: "حیاط" },
  { id: "iranian-toilet", label: "سرویس ایرانی" },
  { id: "western-toilet", label: "سرویس فرنگی" },
  { id: "wardrobe", label: "کمد دیواری" },
  { id: "security-door", label: "درب ضد سرقت" },
  { id: "video-intercom", label: "آیفون تصویری" },
  { id: "gas-stove", label: "گاز رومیزی" },
  { id: "hood", label: "هود" },
  { id: "oven", label: "فرتوکار" },
  { id: "guard", label: "نگهبانی" },
  { id: "cctv", label: "دوربین امنیتی" },
  { id: "smart-home", label: "سیستم هوشمند" },
  { id: "lobby", label: "لابی" },
  { id: "roof-garden", label: "روف گاردن" },
  { id: "pool", label: "استخر" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "sauna", label: "سونا" }
];

// Villa facilities (Page 4)
const villaFacilities = [
  ...residentialFacilities,
  { id: "gym", label: "سالن ورزشی" },
  { id: "playground", label: "زمین بازی" }
];

// Land facilities (Page 3)
const landFacilities = [
  { id: "power", label: "امتیاز برق" },
  { id: "water", label: "امتیاز آب" },
  { id: "gas", label: "امتیاز گاز" },
  { id: "telephone", label: "امتیاز تلفن" },
  { id: "walled", label: "دور دیوار/حصار" },
  { id: "old-building", label: "بنا کلنگی" },
  { id: "guard", label: "نگهبانی" },
  { id: "well", label: "چاه آب" }
];

// Office facilities (Page 5)
const officeFacilities = [
  ...residentialFacilities,
  { id: "gym", label: "سالن ورزشی" }
];

// Commercial facilities (Page 6)
const commercialFacilities = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "iranian-toilet", label: "سرویس ایرانی" },
  { id: "western-toilet", label: "سرویس فرنگی" },
  { id: "security-door", label: "درب ضد سرقت" },
  { id: "video-intercom", label: "آیفون تصویری" },
  { id: "guard", label: "نگهبانی" },
  { id: "cctv", label: "دوربین امنیتی" },
  { id: "smart-home", label: "سیستم هوشمند" },
  { id: "yard", label: "حیاط" }
];

// Commercial Rent facilities (Page 13)
const commercialRentFacilities = [
  ...commercialFacilities,
  { id: "electric-shutter", label: "کرکره برقی" },
  { id: "single-phase-power", label: "برق تک فاز" },
  { id: "three-phase-power", label: "برق سه فاز" },
  { id: "water", label: "امتیاز آب" },
  { id: "gas", label: "امتیاز گاز" },
  { id: "telephone", label: "امتیاز تلفن" }
];

// Industrial facilities (Page 7 & Page 14)
const industrialFacilities = [
  { id: "single-phase-power", label: "برق تک فاز" },
  { id: "three-phase-power", label: "برق سه فاز" },
  { id: "water", label: "امتیاز آب" },
  { id: "gas", label: "امتیاز گاز" },
  { id: "telephone", label: "امتیاز تلفن" },
  { id: "walled", label: "دور دیوار/حصار" },
  { id: "old-building", label: "بنا کلنگی" },
  { id: "guard", label: "نگهبانی" },
  { id: "well", label: "چاه آب" }
];

// Hotel facilities (Page 8 & Page 11)
const hotelFacilities = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "terrace", label: "تراس" },
  { id: "iranian-toilet", label: "سرویس ایرانی" },
  { id: "western-toilet", label: "سرویس فرنگی" },
  { id: "lobby", label: "لابی" },
  { id: "roof-garden", label: "روف گاردن" },
  { id: "outdoor-pool", label: "استخر روباز" },
  { id: "indoor-pool", label: "استخر سرپوشیده" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "sauna", label: "سونا" },
  { id: "gym", label: "سالن ورزشی" },
  { id: "cinema", label: "سینما" },
  { id: "cafe", label: "کافی شاپ" },
  { id: "restaurant", label: "رستوران" },
  { id: "shop", label: "فروشگاه" }
];

// Daily apartment/villa facilities (Page 15 & 16)
const dailyStayFacilities = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "yard", label: "حیاط" },
  { id: "iranian-toilet", label: "سرویس ایرانی" },
  { id: "western-toilet", label: "سرویس فرنگی" },
  { id: "security-door", label: "درب ضد سرقت" },
  { id: "video-intercom", label: "آیفون تصویری" },
  { id: "gas-stove", label: "گاز رومیزی" },
  { id: "hood", label: "هود" },
  { id: "oven", label: "فرتوکار" },
  { id: "guard", label: "نگهبانی" },
  { id: "cctv", label: "دوربین امنیتی" },
  { id: "smart-home", label: "سیستم هوشمند" },
  { id: "lobby", label: "لابی" },
  { id: "roof-garden", label: "روف گاردن" },
  { id: "hot-water-pool", label: "استخر آب گرم" },
  { id: "outdoor-pool", label: "استخر روباز" },
  { id: "indoor-pool", label: "استخر پوشیده" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "sauna", label: "سونا" },
  { id: "gym", label: "سالن ورزشی" },
  { id: "playground", label: "زمین بازی" },
  { id: "high-speed-wifi", label: "اینترنت پر سرعت" },
  { id: "tv", label: "تلویزیون" },
  { id: "audio-system", label: "سیستم صوتی" },
  { id: "washing-machine", label: "ماشین لباسشویی" },
  { id: "refrigerator", label: "یخچال" },
  { id: "microwave", label: "اجاق گاز مایکروفر" },
  { id: "living-room", label: "سالن" },
  { id: "cooking-utensils", label: "لوازم آشپزی" },
  { id: "clean-bedding", label: "ملحفه و حوله تمیز" },
  { id: "hair-dryer", label: "سشوار" },
  { id: "iron", label: "اتو" },
  { id: "dishwasher", label: "ظرفشویی" },
  { id: "outdoor-space", label: "فضا بیرونی" },
  { id: "air-conditioning", label: "سیستم تهویه مطبوع" },
  { id: "coffee-maker", label: "دستگاه قهوه ساز" },
  { id: "workspace", label: "فضا کار" },
  { id: "balcony", label: "بالکن" },
  { id: "bed", label: "تخت خواب" },
  { id: "furniture", label: "مبلمان" },
  { id: "hygiene-kit", label: "پک بهداشتی" },
  { id: "dining-dishes", label: "ظروف و لوازم پذیرایی" },
  { id: "dining-table", label: "میز ناهار خوری" },
  { id: "kitchen", label: "آشپزخانه" },
  { id: "master-bedroom", label: "اتاق مستر" },
  { id: "barbecue", label: "باربیکیو" },
  { id: "gazebo", label: "آلاچیق" },
  { id: "green-space", label: "فضا سبز/باغ" }
];

// Daily office/booth facilities (Page 19)
const dailyWorkspaceFacilities = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "high-speed-wifi", label: "اینترنت پر سرعت" },
  { id: "projector", label: "ویدئو پرژکتور" },
  { id: "whiteboard", label: "تخته وایت برد" },
  { id: "audio-system", label: "سیستم صوتی" },
  { id: "printer-scanner", label: "پرینتر/اسکنر" },
  { id: "office-desk-chair", label: "میزوصندلی اداری" },
  { id: "catering", label: "پذیرایی" },
  { id: "fax", label: "دستگاه فکس" },
  { id: "conference-phone", label: "تلفن کنفرانس" },
  { id: "computer-laptop", label: "کامپیوتر/لبتاب" },
  { id: "monitor", label: "مانیتور" },
  { id: "tv", label: "تلویزیون" },
  { id: "copy-machine", label: "دستگاه کپی" },
  { id: "air-conditioning", label: "سیستم تهویه مطبوع" },
  { id: "filing-cabinet", label: "قفسه وفایلینگ" },
  { id: "meeting-room", label: "اتاق جلسات" },
  { id: "rest-room", label: "اتاق استراحت" },
  { id: "coffee-maker", label: "دستگاه قهوه ساز" },
  { id: "air-purifier", label: "دستگاه تصفیه هوا" },
  { id: "cctv", label: "دوربین مداربسته" },
  { id: "single-phase-power", label: "برق تک فاز" },
  { id: "three-phase-power", label: "برق سه فاز" },
  { id: "water", label: "امتیاز آب" },
  { id: "gas", label: "امتیاز گاز" },
  { id: "telephone", label: "امتیاز تلفن" },
  { id: "voip", label: "VoIP" },
  { id: "private-phone-booth", label: "اتاق تلفن خصوصی" },
  { id: "phone-system", label: "سیستم تلفن" }
];

const forms = [
  // 1. فروش مسکونی: آپارتمان (Page 2)
  {
    formCode: "sale-apartment",
    title: "فروش آپارتمان",
    transaction: "sale",
    category: "apartment",
    create: {
      specsTitle: "مشخصات آپارتمان",
      basicFields: [
        { key: "meterage", title: "متراژ آپارتمان", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۸۵", required: true },
        { key: "floor", title: "طبقه", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: floorOptions },
        { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: roomOptions },
        { key: "age", title: "سن ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: ageOptions }
      ],
      pricing: { mode: "sale", loan: true, exchange: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: residentialFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "totalFloors", title: "تعداد طبقات آپارتمان", input: "select", ui: "bottomSheet", options: totalFloorsOptions },
          { key: "unitsPerFloor", title: "تعداد واحد در طبقه", input: "select", ui: "bottomSheet", options: unitsPerFloorOptions },
          { key: "unitType", title: "موقعیت ساختمان", input: "select", ui: "bottomSheet", options: buildingPositionOptions },
          { key: "unitPosition", title: "موقعیت واحد", input: "select", ui: "bottomSheet", options: unitPositionOptions },
          { key: "documentType", title: "سند", input: "select", ui: "bottomSheet", options: standardDocumentOptions },
          { key: "occupancyStatus", title: "وضعیت سکونت", input: "select", ui: "bottomSheet", options: occupancyStatusOptions },
          { key: "renovated", title: "بازسازی", input: "toggle", ui: "toggle" },
          { key: "furnished", title: "با لوازم و مبله", input: "toggle", ui: "toggle" },
          { key: "kitchenType", title: "نوع آشپزخانه", input: "select", ui: "bottomSheet", options: kitchenTypeOptions },
          { key: "facadeMaterial", title: "جنس نما", input: "select", ui: "bottomSheet", options: facadeOptions },
          { key: "floorMaterial", title: "جنس کف", input: "select", ui: "bottomSheet", options: floorMaterialOptions },
          { key: "cabinetMaterial", title: "جنس کابینت", input: "select", ui: "bottomSheet", options: cabinetOptions }
        ]
      }
    }
  },

  // 2. فروش مسکونی: زمین، ملک کلنگی (Page 3)
  {
    formCode: "sale-land",
    title: "فروش زمین، ملک کلنگی",
    transaction: "sale",
    category: "land",
    create: {
      specsTitle: "مشخصات ملک",
      basicFields: [
        { key: "meterage", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۳۰۰", required: true },
        { key: "documentType", title: "سند", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: standardDocumentOptions }
      ],
      pricing: { mode: "sale", loan: true, exchange: true },
      heatingCooling: { enabled: false },
      facilities: { enabled: true, items: landFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          {
            key: "usageType",
            title: "نوع کاربری",
            input: "select",
            ui: "bottomSheet",
            options: [
              "مسکونی", "اداری", "تجاری", "صنعتی", "کشاورزی", "باغی", "آموزشی",
              "درمانی", "مذهبی", "ورزشی", "خدماتی", "گردشگری و توریستی", "پارکینگ", "حریم", "فاقد کاربری"
            ]
          },
          { key: "landPosition", title: "موقعیت زمین", input: "select", ui: "bottomSheet", options: landPositionOptions },
          { key: "density", title: "تراکم زمین", input: "select", ui: "bottomSheet", options: ["کم", "متوسط", "زیاد"] },
          { key: "suitableFor", title: "مناسب برای", input: "multiSelect", ui: "bottomSheet", options: ["ساخت آپارتمان", "ساخت ویلا", "سرمایه گذاری", "تجمیع با ملک مجاور"] },
          { key: "landWidth", title: "عرض زمین", input: "number", leftText: "متر", numeric: true },
          { key: "streetWidth", title: "عرض گذر", input: "number", leftText: "متر", numeric: true },
          { key: "constructionPermit", title: "مجوز ساخت", input: "toggle", ui: "toggle" }
        ]
      }
    }
  },

  // 3. فروش مسکونی: خانه، ویلا (Page 4)
  {
    formCode: "sale-villa-house",
    title: "فروش خانه، ویلا",
    transaction: "sale",
    category: "villa-house",
    create: {
      specsTitle: "مشخصات بنا",
      basicFields: [
        { key: "landArea", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۲۵۰", required: true },
        { key: "meterage", title: "متراژ زیربنا", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۱۲۰", required: true },
        { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: roomOptions },
        { key: "age", title: "سن ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: ageOptions }
      ],
      pricing: { mode: "sale", loan: true, exchange: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: villaFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "landPosition", title: "موقعیت زمین", input: "select", ui: "bottomSheet", options: landPositionOptions },
          { key: "buildingType", title: "نوع بنا", input: "select", ui: "bottomSheet", options: ["ویلایی مستقل", "شهرکی", "آپارتمانی"] },
          { key: "villaType", title: "تیپ بنا", input: "select", ui: "bottomSheet", options: ["فلت", "تک طبقه", "دوبلکس", "تریبلکس", "خونه باغ"] },
          { key: "documentType", title: "سند", input: "select", ui: "bottomSheet", options: standardDocumentOptions },
          { key: "totalFloors", title: "تعداد طبقات", input: "select", ui: "bottomSheet", options: totalFloorsOptions },
          { key: "streetWidth", title: "عرض گذر (متر)", input: "number", leftText: "متر", numeric: true },
          { key: "renovated", title: "بازسازی", input: "toggle", ui: "toggle" },
          { key: "furnished", title: "با لوازم و مبله", input: "toggle", ui: "toggle" },
          { key: "kitchenType", title: "نوع آشپزخانه", input: "select", ui: "bottomSheet", options: kitchenTypeOptions },
          { key: "facadeMaterial", title: "جنس نما", input: "select", ui: "bottomSheet", options: facadeOptions },
          { key: "floorMaterial", title: "جنس کف", input: "select", ui: "bottomSheet", options: floorMaterialOptions },
          { key: "cabinetMaterial", title: "جنس کابینت", input: "select", ui: "bottomSheet", options: cabinetOptions }
        ]
      }
    }
  },

  // فروش باغ و ویلا (همسو با خانه و ویلا)
  {
    formCode: "sale-garden-villa",
    title: "فروش باغ و ویلا",
    transaction: "sale",
    category: "garden-villa",
    create: {
      specsTitle: "مشخصات باغ ویلا",
      basicFields: [
        { key: "landArea", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۵۰۰", required: true },
        { key: "meterage", title: "متراژ زیربنا", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۱۲۰", required: true },
        { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: roomOptions },
        { key: "age", title: "سن ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: ageOptions }
      ],
      pricing: { mode: "sale", loan: true, exchange: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: villaFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "landPosition", title: "موقعیت زمین", input: "select", ui: "bottomSheet", options: landPositionOptions },
          { key: "buildingType", title: "نوع بنا", input: "select", ui: "bottomSheet", options: ["ویلایی مستقل", "شهرکی", "آپارتمانی"] },
          { key: "villaType", title: "تیپ بنا", input: "select", ui: "bottomSheet", options: ["فلت", "تک طبقه", "دوبلکس", "تریبلکس", "خونه باغ"] },
          { key: "documentType", title: "سند", input: "select", ui: "bottomSheet", options: standardDocumentOptions },
          { key: "totalFloors", title: "تعداد طبقات", input: "select", ui: "bottomSheet", options: totalFloorsOptions },
          { key: "streetWidth", title: "عرض گذر (متر)", input: "number", leftText: "متر", numeric: true },
          { key: "renovated", title: "بازسازی", input: "toggle", ui: "toggle" },
          { key: "furnished", title: "با لوازم و مبله", input: "toggle", ui: "toggle" },
          { key: "kitchenType", title: "نوع آشپزخانه", input: "select", ui: "bottomSheet", options: kitchenTypeOptions },
          { key: "facadeMaterial", title: "جنس نما", input: "select", ui: "bottomSheet", options: facadeOptions },
          { key: "floorMaterial", title: "جنس کف", input: "select", ui: "bottomSheet", options: floorMaterialOptions },
          { key: "cabinetMaterial", title: "جنس کابینت", input: "select", ui: "bottomSheet", options: cabinetOptions }
        ]
      }
    }
  },

  // 4. فروش اداری (Page 5)
  {
    formCode: "sale-office",
    title: "فروش اداری",
    transaction: "sale",
    category: "office",
    create: {
      specsTitle: "مشخصات اداری",
      basicFields: [
        { key: "meterage", title: "متراژ", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۷۵", required: true },
        { key: "floor", title: "طبقه", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: floorOptions },
        { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: roomOptions },
        { key: "age", title: "سال ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: ageOptions }
      ],
      pricing: { mode: "sale", loan: true, exchange: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: officeFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "totalFloors", title: "تعداد کل طبقات", input: "select", ui: "bottomSheet", options: totalFloorsOptions },
          {
            key: "suitableFor",
            title: "مناسب برای",
            input: "multiSelect",
            ui: "bottomSheet",
            options: [
              "مهندسین", "شرکت ها", "وکلا", "مطب", "موسسه", "آموزشگاه", "آتلیه",
              "مزون", "اسناد رسمی", "دفاتر دولت", "صنایع", "خدماتی", "ورزشی", "فرهنگی", "مذهبی", "همه مشاغل"
            ]
          },
          { key: "currentStatus", title: "وضعیت فعلی", input: "select", ui: "bottomSheet", options: ["تخلیه", "فعال", "درحال بازسازی"] },
          {
            key: "officePosition",
            title: "موقعیت اداری",
            input: "select",
            ui: "bottomSheet",
            options: ["مجتمع اداری", "برج اداری", "برخیابان اصلی", "موقعیت مسکونی", "مجتمع پزشکان"]
          },
          { key: "officeDocumentType", title: "سند اداری", input: "select", ui: "bottomSheet", options: ["دائم", "موقت"] },
          { key: "facadeMaterial", title: "جنس نما", input: "select", ui: "bottomSheet", options: facadeOptions },
          { key: "floorMaterial", title: "جنس کف", input: "select", ui: "bottomSheet", options: floorMaterialOptions },
          { key: "cabinetMaterial", title: "جنس کابینت", input: "select", ui: "bottomSheet", options: cabinetOptions },
          { key: "managementRoom", title: "اتاق مدیریت", input: "toggle", ui: "toggle" },
          { key: "conferenceRoom", title: "اتاق کنفرانس", input: "toggle", ui: "toggle" },
          { key: "receptionHall", title: "سالن پذیرش", input: "toggle", ui: "toggle" },
          { key: "signboard", title: "تابلو خور", input: "toggle", ui: "toggle" },
          { key: "kitchen", title: "آشپزخانه", input: "toggle", ui: "toggle" },
          { key: "separateEntrance", title: "ورودی مجزا", input: "toggle", ui: "toggle" },
          { key: "renovated", title: "بازسازی شده", input: "toggle", ui: "toggle" },
          { key: "furnished", title: "مبله با لوازم", input: "toggle", ui: "toggle" }
        ]
      }
    }
  },

  // 5. فروش واحد تجاری (Page 6)
  {
    formCode: "sale-commercial",
    title: "فروش واحد تجاری",
    transaction: "sale",
    category: "commercial-unit",
    create: {
      specsTitle: "مشخصات تجاری",
      basicFields: [
        { key: "meterage", title: "متراژ", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۴۰", required: true },
        {
          key: "commercialPosition",
          title: "موقعیت تجاری",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["برخیابان اصلی", "داخل پاساژ", "داخل کوچه", "بازار محله", "غرفه"]
        },
        { key: "documentType", title: "سند", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: commercialDocumentOptions },
        {
          key: "ownershipStatus",
          title: "وضعیت مالکیت",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["مالکیت کامل", "فقط سرقفلی", "فقط مالکیت", "مالکیت مشترک"]
        }
      ],
      pricing: { mode: "sale", loan: true, exchange: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: commercialFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "age", title: "سال ساخت", input: "select", ui: "bottomSheet", options: ageOptions },
          { key: "floor", title: "طبقه", input: "select", ui: "bottomSheet", options: floorOptions },
          { key: "totalFloors", title: "تعداد کل طبقات", input: "select", ui: "bottomSheet", options: totalFloorsOptions },
          { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", options: roomOptions },
          {
            key: "suitableFor",
            title: "مناسب برای",
            input: "multiSelect",
            ui: "bottomSheet",
            options: ["فروشگاه", "تجاری", "خدماتی", "اداری", "صنعتی", "آموزشی", "درمانی", "انباری", "همه مشاغل"]
          },
          { key: "commercialLicense", title: "مجوز تجاری", input: "select", ui: "bottomSheet", options: ["دائم", "موقت"] },
          { key: "currentStatus", title: "وضعیت فعلی", input: "select", ui: "bottomSheet", options: ["تخلیه", "فعال"] }
        ]
      }
    }
  },

  // 6. فروش واحد صنعتی (Page 7)
  {
    formCode: "sale-factory",
    title: "فروش واحد صنعتی",
    transaction: "sale",
    category: "factory-workshop",
    create: {
      specsTitle: "مشخصات کارخانه و کارگاه",
      basicFields: [
        { key: "landArea", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۲۰۰۰", required: true },
        { key: "landPosition", title: "موقعیت زمین", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: landPositionOptions },
        { key: "age", title: "سال ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: ageOptions },
        { key: "documentType", title: "سند", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: standardDocumentOptions }
      ],
      pricing: { mode: "sale", loan: true, exchange: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: industrialFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", options: roomOptions },
          { key: "meterage", title: "متراژ بنا", input: "number", leftText: "متر مربع", numeric: true },
          { key: "ceilingHeight", title: "ارتفاع سقف", input: "number", leftText: "متر", numeric: true },
          {
            key: "industrialPropertyType",
            title: "نوع ملک",
            input: "select",
            ui: "bottomSheet",
            options: ["سوله", "انبار", "کارگاه", "کارخانه", "گلخانه", "گاوداری", "مرغداری"]
          },
          {
            key: "accessType",
            title: "دست رسی",
            input: "select",
            ui: "bottomSheet",
            options: ["جاده آسفالت", "جاده خاکی", "نزدیک بزرگراه"]
          },
          { key: "currentStatus", title: "وضعیت فعلی", input: "select", ui: "bottomSheet", options: ["تخلیه", "فعال"] },
          { key: "commercialLicense", title: "مجوز تجاری", input: "select", ui: "bottomSheet", options: ["دائم", "موقت"] }
        ]
      }
    }
  },

  // فروش انبار و سوله (مشابه صنعتی)
  {
    formCode: "sale-warehouse",
    title: "فروش انبار و سوله",
    transaction: "sale",
    category: "warehouse",
    create: {
      specsTitle: "مشخصات انبار و سوله",
      basicFields: [
        { key: "landArea", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۱۰۰۰", required: true },
        { key: "meterage", title: "متراژ بنا", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۵۰۰", required: true },
        { key: "ceilingHeight", title: "ارتفاع سقف", input: "text", ui: "input", numeric: true, leftText: "متر", placeholder: "مثلا ۶" },
        { key: "documentType", title: "سند", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: standardDocumentOptions }
      ],
      pricing: { mode: "sale", loan: true, exchange: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: industrialFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "age", title: "سال ساخت", input: "select", ui: "bottomSheet", options: ageOptions },
          { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", options: roomOptions },
          { key: "accessType", title: "دست رسی", input: "select", ui: "bottomSheet", options: ["جاده آسفالت", "جاده خاکی", "نزدیک بزرگراه"] },
          { key: "currentStatus", title: "وضعیت فعلی", input: "select", ui: "bottomSheet", options: ["تخلیه", "فعال"] }
        ]
      }
    }
  },

  // 7. فروش هتل، اقامتگاه (Page 8)
  {
    formCode: "sale-hotel",
    title: "فروش هتل، اقامتگاه",
    transaction: "sale",
    category: "hotel-apartment",
    create: {
      specsTitle: "مشخصات هتل و اقامتگاه",
      basicFields: [
        {
          key: "accommodationType",
          title: "نوع اقامتگاه",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["هتل", "هتل آپارتمان", "متل", "مسافر خونه", "مجتمع توریستی"]
        },
        {
          key: "hotelStars",
          title: "رتبه اقامتگاه",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["۱ ستاره", "۲ ستاره", "۳ ستاره", "۴ ستاره", "۵ ستاره"]
        },
        { key: "landArea", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۱۰۰۰", required: true },
        { key: "meterage", title: "متراژ بنا", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۲۰۰۰", required: true },
        { key: "documentType", title: "سند", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: standardDocumentOptions }
      ],
      pricing: { mode: "sale", loan: true, exchange: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: hotelFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "landPosition", title: "موقعیت زمین", input: "select", ui: "bottomSheet", options: landPositionOptions },
          { key: "age", title: "سن ساخت", input: "select", ui: "bottomSheet", options: ageOptions },
          { key: "totalFloors", title: "تعداد طبقات", input: "select", ui: "bottomSheet", options: totalFloorsOptions },
          { key: "singleRoomCount", title: "تعداد اتاق یک تخته", input: "number", numeric: true },
          { key: "doubleRoomCount", title: "تعداد اتاق دو تخته", input: "number", numeric: true },
          { key: "suiteCount", title: "تعداد سوییت ها", input: "number", numeric: true },
          { key: "renovated", title: "بازسازی شده", input: "toggle", ui: "toggle" },
          { key: "furnished", title: "با لوازم و مبله", input: "toggle", ui: "toggle" },
          { key: "floorMaterial", title: "جنس کف", input: "select", ui: "bottomSheet", options: floorMaterialOptions }
        ]
      }
    }
  },

  // 8. اجاره مسکونی: اجاره آپارتمان (Page 9)
  {
    formCode: "rent-apartment",
    title: "اجاره آپارتمان",
    transaction: "rent",
    category: "apartment",
    create: {
      specsTitle: "مشخصات آپارتمان",
      basicFields: [
        { key: "meterage", title: "متراژ آپارتمان", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۸۵", required: true },
        { key: "floor", title: "طبقه", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: floorOptions },
        { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: roomOptions },
        { key: "age", title: "سن ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: ageOptions }
      ],
      pricing: { mode: "rent", rentConversion: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: residentialFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "suitableFor", title: "مناسب برای", input: "multiSelect", ui: "bottomSheet", options: ["خانواده", "مجرد", "دانشجو", "زوج"] },
          { key: "totalFloors", title: "تعداد طبقات آپارتمان", input: "select", ui: "bottomSheet", options: totalFloorsOptions },
          { key: "unitsPerFloor", title: "تعداد واحد در طبقه", input: "select", ui: "bottomSheet", options: unitsPerFloorOptions },
          { key: "unitType", title: "موقعیت ساختمان", input: "select", ui: "bottomSheet", options: buildingPositionOptions },
          { key: "unitPosition", title: "موقعیت واحد", input: "select", ui: "bottomSheet", options: unitPositionOptions },
          { key: "occupancyStatus", title: "وضعیت سکونت", input: "select", ui: "bottomSheet", options: occupancyStatusOptions },
          { key: "readyDeliveryDate", title: "تاریخ آماده تحویل", input: "date" },
          { key: "minContractMonths", title: "حداقل مدت قرارداد (ماه)", input: "number", leftText: "ماه", numeric: true },
          { key: "petPolicy", title: "حیوان خانگی", input: "select", ui: "bottomSheet", options: petPolicyOptions },
          { key: "renovated", title: "بازسازی", input: "toggle", ui: "toggle" },
          { key: "furnished", title: "با لوازم و مبله", input: "toggle", ui: "toggle" },
          { key: "kitchenType", title: "نوع آشپزخانه", input: "select", ui: "bottomSheet", options: kitchenTypeOptions },
          { key: "facadeMaterial", title: "جنس نما", input: "select", ui: "bottomSheet", options: facadeOptions },
          { key: "floorMaterial", title: "جنس کف", input: "select", ui: "bottomSheet", options: floorMaterialOptions },
          { key: "cabinetMaterial", title: "جنس کابینت", input: "select", ui: "bottomSheet", options: cabinetOptions }
        ]
      }
    }
  },

  // 9. اجاره مسکونی: اجاره خانه ، ویلا (Page 9 & 10)
  {
    formCode: "rent-villa-house",
    title: "اجاره خانه، ویلا",
    transaction: "rent",
    category: "villa-house",
    create: {
      specsTitle: "مشخصات بنا",
      basicFields: [
        { key: "landArea", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۲۵۰", required: true },
        { key: "meterage", title: "متراژ بنا", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۱۲۰", required: true },
        { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: roomOptions },
        { key: "age", title: "سن ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: ageOptions }
      ],
      pricing: { mode: "rent", rentConversion: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: villaFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "suitableFor", title: "مناسب برای", input: "multiSelect", ui: "bottomSheet", options: ["خانواده", "برگزاری مراسم", "چند خانواده"] },
          { key: "landPosition", title: "موقعیت زمین", input: "select", ui: "bottomSheet", options: landPositionOptions },
          { key: "buildingType", title: "نوع بنا", input: "select", ui: "bottomSheet", options: ["ویلایی مستقل", "شهرکی", "آپارتمانی"] },
          { key: "villaType", title: "تیپ بنا", input: "select", ui: "bottomSheet", options: ["فلت", "تک طبقه", "دوبلکس", "تریبلکس", "خونه باغ"] },
          { key: "totalFloors", title: "تعداد طبقات", input: "select", ui: "bottomSheet", options: totalFloorsOptions },
          { key: "streetWidth", title: "عرض گذر (متر)", input: "number", leftText: "متر", numeric: true },
          { key: "petPolicy", title: "حیوان خانگی", input: "select", ui: "bottomSheet", options: petPolicyOptions },
          { key: "renovated", title: "بازسازی", input: "toggle", ui: "toggle" },
          { key: "furnished", title: "با لوازم و مبله", input: "toggle", ui: "toggle" },
          { key: "kitchenType", title: "نوع آشپزخانه", input: "select", ui: "bottomSheet", options: kitchenTypeOptions },
          { key: "facadeMaterial", title: "جنس نما", input: "select", ui: "bottomSheet", options: facadeOptions },
          { key: "floorMaterial", title: "جنس کف", input: "select", ui: "bottomSheet", options: floorMaterialOptions },
          { key: "cabinetMaterial", title: "جنس کابینت", input: "select", ui: "bottomSheet", options: cabinetOptions }
        ]
      }
    }
  },

  // اجاره باغ و ویلا
  {
    formCode: "rent-garden-villa",
    title: "اجاره باغ و ویلا",
    transaction: "rent",
    category: "garden-villa",
    create: {
      specsTitle: "مشخصات باغ ویلا",
      basicFields: [
        { key: "landArea", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۵۰۰", required: true },
        { key: "meterage", title: "متراژ بنا", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۱۲۰", required: true },
        { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: roomOptions },
        { key: "age", title: "سن ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: ageOptions }
      ],
      pricing: { mode: "rent", rentConversion: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: villaFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "suitableFor", title: "مناسب برای", input: "multiSelect", ui: "bottomSheet", options: ["خانواده", "برگزاری مراسم", "چند خانواده"] },
          { key: "landPosition", title: "موقعیت زمین", input: "select", ui: "bottomSheet", options: landPositionOptions },
          { key: "buildingType", title: "نوع بنا", input: "select", ui: "bottomSheet", options: ["ویلایی مستقل", "شهرکی", "آپارتمانی"] },
          { key: "villaType", title: "تیپ بنا", input: "select", ui: "bottomSheet", options: ["فلت", "تک طبقه", "دوبلکس", "تریبلکس", "خونه باغ"] },
          { key: "totalFloors", title: "تعداد طبقات", input: "select", ui: "bottomSheet", options: totalFloorsOptions },
          { key: "streetWidth", title: "عرض گذر (متر)", input: "number", leftText: "متر", numeric: true },
          { key: "petPolicy", title: "حیوان خانگی", input: "select", ui: "bottomSheet", options: petPolicyOptions },
          { key: "renovated", title: "بازسازی", input: "toggle", ui: "toggle" },
          { key: "furnished", title: "با لوازم و مبله", input: "toggle", ui: "toggle" },
          { key: "kitchenType", title: "نوع آشپزخانه", input: "select", ui: "bottomSheet", options: kitchenTypeOptions },
          { key: "facadeMaterial", title: "جنس نما", input: "select", ui: "bottomSheet", options: facadeOptions },
          { key: "floorMaterial", title: "جنس کف", input: "select", ui: "bottomSheet", options: floorMaterialOptions },
          { key: "cabinetMaterial", title: "جنس کابینت", input: "select", ui: "bottomSheet", options: cabinetOptions }
        ]
      }
    }
  },

  // 10. اجاره هتل، اقامتگاه (Page 11)
  {
    formCode: "rent-hotel",
    title: "اجاره هتل، اقامتگاه",
    transaction: "rent",
    category: "hotel-apartment",
    create: {
      specsTitle: "مشخصات هتل و اقامتگاه",
      basicFields: [
        {
          key: "accommodationType",
          title: "نوع اقامتگاه",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["هتل", "هتل آپارتمان", "متل", "مسافر خونه", "مجتمع توریستی"]
        },
        {
          key: "hotelStars",
          title: "رتبه اقامتگاه",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["۱ ستاره", "۲ ستاره", "۳ ستاره", "۴ ستاره", "۵ ستاره"]
        },
        { key: "landArea", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۱۰۰۰", required: true },
        { key: "meterage", title: "متراژ بنا", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۲۰۰۰", required: true },
        { key: "age", title: "سن ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: ageOptions }
      ],
      pricing: { mode: "rent", rentConversion: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: hotelFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "landPosition", title: "موقعیت زمین", input: "select", ui: "bottomSheet", options: landPositionOptions },
          { key: "totalFloors", title: "تعداد طبقات", input: "select", ui: "bottomSheet", options: totalFloorsOptions },
          { key: "singleRoomCount", title: "تعداد اتاق یک تخته", input: "number", numeric: true },
          { key: "doubleRoomCount", title: "تعداد اتاق دو تخته", input: "number", numeric: true },
          { key: "suiteCount", title: "تعداد سوییت ها", input: "number", numeric: true },
          { key: "renovated", title: "بازسازی شده", input: "toggle", ui: "toggle" },
          { key: "furnished", title: "با لوازم و مبله", input: "toggle", ui: "toggle" },
          { key: "floorMaterial", title: "جنس کف", input: "select", ui: "bottomSheet", options: floorMaterialOptions }
        ]
      }
    }
  },

  // 11. اجاره واحد اداری (Page 11 & 12)
  {
    formCode: "rent-office",
    title: "اجاره واحد اداری",
    transaction: "rent",
    category: "office",
    create: {
      specsTitle: "مشخصات اداری",
      basicFields: [
        { key: "meterage", title: "متراژ", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۷۵", required: true },
        { key: "floor", title: "طبقه", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: floorOptions },
        { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: roomOptions },
        { key: "age", title: "سال ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: ageOptions }
      ],
      pricing: { mode: "rent", rentConversion: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: officeFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          {
            key: "suitableFor",
            title: "مناسب برای",
            input: "multiSelect",
            ui: "bottomSheet",
            options: [
              "تجاری", "خدماتی", "اداری", "صنعتی", "آموزشی", "درمانی", "انباری", "مهندسین", "شرکت ها", "وکلا", "مطب",
              "موسسه", "آموزشگاه", "آتلیه", "مزون", "اسناد رسمی", "دفاتر دولت", "صنایع", "خدماتی", "ورزشی", "فرهنگی", "مذهبی", "همه مشاغل"
            ]
          },
          {
            key: "officePosition",
            title: "موقعیت اداری",
            input: "select",
            ui: "bottomSheet",
            options: ["مجتمع اداری", "برج اداری", "برخیابان اصلی", "موقعیت مسکونی", "مجتمع پزشکان"]
          },
          { key: "currentStatus", title: "وضعیت فعلی", input: "select", ui: "bottomSheet", options: ["تخلیه", "فعال"] },
          { key: "readyDeliveryDate", title: "تاریخ آماده تحویل", input: "date" },
          { key: "minContractMonths", title: "حداقل مدت قرارداد (ماه)", input: "number", leftText: "ماه", numeric: true },
          { key: "officeDocumentType", title: "سند اداری", input: "select", ui: "bottomSheet", options: ["دائم", "موقت"] },
          { key: "managementRoom", title: "اتاق مدیریت", input: "toggle", ui: "toggle" },
          { key: "conferenceRoom", title: "اتاق کنفرانس", input: "toggle", ui: "toggle" },
          { key: "receptionHall", title: "سالن پذیرش", input: "toggle", ui: "toggle" },
          { key: "signboard", title: "تابلو خور", input: "toggle", ui: "toggle" },
          { key: "kitchen", title: "آشپزخانه", input: "toggle", ui: "toggle" },
          { key: "separateEntrance", title: "ورودی مجزا", input: "toggle", ui: "toggle" },
          { key: "renovated", title: "بازسازی شده", input: "toggle", ui: "toggle" },
          { key: "furnished", title: "با لوازم و مبله", input: "toggle", ui: "toggle" },
          { key: "facadeMaterial", title: "جنس نما", input: "select", ui: "bottomSheet", options: facadeOptions },
          { key: "floorMaterial", title: "جنس کف", input: "select", ui: "bottomSheet", options: floorMaterialOptions },
          { key: "cabinetMaterial", title: "جنس کابینت", input: "select", ui: "bottomSheet", options: cabinetOptions }
        ]
      }
    }
  },

  // 12. اجاره واحد تجاری (Page 12 & 13)
  {
    formCode: "rent-commercial",
    title: "اجاره واحد تجاری",
    transaction: "rent",
    category: "commercial-unit",
    create: {
      specsTitle: "مشخصات تجاری",
      basicFields: [
        { key: "meterage", title: "متراژ", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۴۰", required: true },
        {
          key: "commercialPosition",
          title: "موقعیت تجاری",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["برخیابان اصلی", "داخل پاساژ", "داخل کوچه", "بازار محله", "غرفه"]
        },
        { key: "age", title: "سال ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: ageOptions },
        { key: "floor", title: "طبقه", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: floorOptions }
      ],
      pricing: { mode: "rent", rentConversion: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: commercialRentFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", options: roomOptions },
          { key: "openingCount", title: "تعداد دهنه", input: "select", ui: "bottomSheet", options: ["۱ دهنه", "۲ دهنه", "۳ دهنه", "۴ دهنه و بیشتر"] },
          { key: "ceilingHeight", title: "ارتفاع سقف", input: "number", leftText: "متر", numeric: true },
          {
            key: "suitableFor",
            title: "مناسب برای",
            input: "multiSelect",
            ui: "bottomSheet",
            options: ["فروشگاه", "تجاری", "خدماتی", "اداری", "صنعتی", "آموزشی", "درمانی", "انباری", "همه مشاغل", "سایر"]
          },
          { key: "currentStatus", title: "وضعیت فعلی", input: "select", ui: "bottomSheet", options: ["تخلیه", "فعال"] },
          { key: "readyDeliveryDate", title: "تاریخ آماده تحویل", input: "date" },
          { key: "minContractMonths", title: "حداقل مدت قرارداد (ماه)", input: "number", leftText: "ماه", numeric: true }
        ]
      }
    }
  },

  // 13. اجاره واحد صنعتی (Page 14)
  {
    formCode: "rent-factory-workshop",
    title: "اجاره واحد صنعتی",
    transaction: "rent",
    category: "factory-workshop",
    create: {
      specsTitle: "مشخصات کارخانه و کارگاه",
      basicFields: [
        { key: "landArea", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۲۰۰۰", required: true },
        { key: "meterage", title: "متراژ بنا", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۵۰۰", required: true },
        { key: "landPosition", title: "موقعیت زمین", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: landPositionOptions },
        { key: "age", title: "سال ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: ageOptions }
      ],
      pricing: { mode: "rent", rentConversion: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: industrialFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", options: roomOptions },
          { key: "ceilingHeight", title: "ارتفاع سقف", input: "number", leftText: "متر", numeric: true },
          {
            key: "industrialPropertyType",
            title: "نوع ملک",
            input: "select",
            ui: "bottomSheet",
            options: ["سوله", "انبار", "کارگاه", "کارخانه", "گلخانه", "سردخانه", "گاوداری", "مرغداری", "سالن صنعتی"]
          },
          {
            key: "accessType",
            title: "دست رسی",
            input: "select",
            ui: "bottomSheet",
            options: ["جاده آسفالت", "جاده خاکی", "نزدیک بزرگراه"]
          },
          { key: "currentStatus", title: "وضعیت فعلی", input: "select", ui: "bottomSheet", options: ["تخلیه", "فعال"] },
          { key: "commercialLicense", title: "مجوز تجاری", input: "select", ui: "bottomSheet", options: ["دائم", "موقت"] },
          { key: "readyDeliveryDate", title: "تاریخ آماده تحویل", input: "date" },
          { key: "minContractMonths", title: "حداقل مدت قرارداد (ماه)", input: "number", leftText: "ماه", numeric: true }
        ]
      }
    }
  },

  // اجاره انبار و سوله
  {
    formCode: "rent-warehouse",
    title: "اجاره انبار و سوله",
    transaction: "rent",
    category: "warehouse",
    create: {
      specsTitle: "مشخصات انبار و سوله",
      basicFields: [
        { key: "landArea", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۱۰۰۰", required: true },
        { key: "meterage", title: "متراژ بنا", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۴۰۰", required: true },
        { key: "ceilingHeight", title: "ارتفاع سقف", input: "text", ui: "input", numeric: true, leftText: "متر", placeholder: "مثلا ۵" },
        { key: "age", title: "سال ساخت", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: ageOptions }
      ],
      pricing: { mode: "rent", rentConversion: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: industrialFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", options: roomOptions },
          { key: "accessType", title: "دست رسی", input: "select", ui: "bottomSheet", options: ["جاده آسفالت", "جاده خاکی", "نزدیک بزرگراه"] },
          { key: "currentStatus", title: "وضعیت فعلی", input: "select", ui: "bottomSheet", options: ["تخلیه", "فعال"] },
          { key: "readyDeliveryDate", title: "تاریخ آماده تحویل", input: "date" },
          { key: "minContractMonths", title: "حداقل مدت قرارداد (ماه)", input: "number", leftText: "ماه", numeric: true }
        ]
      }
    }
  },

  // 14. اجاره روزانه: آپارتمان، سویئت (Page 15)
  {
    formCode: "daily-apartment-suite",
    title: "اجاره روزانه آپارتمان، سوئیت",
    transaction: "rent",
    category: "daily-apartment-suite",
    create: {
      specsTitle: "مشخصات سوئیت و آپارتمان",
      basicFields: [
        {
          key: "accommodationType",
          title: "نوع اقامتگاه",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["سوئیت", "آپارتمان", "اتاق", "خوابگاه یا پانسیون", "بوم گردی"]
        },
        { key: "meterage", title: "متراژ", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۵۰", required: true },
        { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: roomOptions },
        {
          key: "standardCapacity",
          title: "ظرفیت استاندارد",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["۱ نفر", "۲ نفر", "۳ نفر", "۴ نفر", "۵ نفر", "۶ نفر", "۷ نفر", "۸ نفر و بیشتر"]
        }
      ],
      pricing: { mode: "dailyRent" },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: dailyStayFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "extraPeopleCapacity", title: "ظرفیت اضافه", input: "select", ui: "bottomSheet", options: ["۱ نفر", "۲ نفر", "۳ نفر", "۴ نفر", "۵ نفر و بیشتر"] },
          { key: "floor", title: "طبقه", input: "select", ui: "bottomSheet", options: floorOptions },
          { key: "rentalPeriod", title: "دوره اجاره", input: "select", ui: "bottomSheet", options: ["روزانه", "هفتگی", "ماهانه", "نصف روز", "بلند مدت"] },
          { key: "checkInTime", title: "ساعت ورود", input: "time", ui: "bottomSheet" },
          { key: "checkOutTime", title: "ساعت خروج", input: "time", ui: "bottomSheet" },
          { key: "minStayDays", title: "حداقل مدت اقامت (روز)", input: "number", leftText: "روز", numeric: true },
          { key: "evacuationGuarantee", title: "تضمین تخلیه (تومان)", input: "currency", leftText: "تومان", numeric: true },
          { key: "furnished", title: "با لوازم و مبله", input: "toggle", ui: "toggle" },
          { key: "petPolicy", title: "حیوان خانگی", input: "select", ui: "bottomSheet", options: petPolicyOptions }
        ]
      }
    }
  },

  // 15. اجاره روزانه: باغ، ویلا (Page 16)
  {
    formCode: "daily-garden-villa",
    title: "اجاره روزانه ویلا، باغ",
    transaction: "rent",
    category: "daily-garden-villa",
    create: {
      specsTitle: "مشخصات ویلا",
      basicFields: [
        { key: "landArea", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۵۰۰", required: true },
        { key: "buildingArea", title: "متراژ بنا", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۱۲۰", required: true },
        { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", required: true, options: roomOptions },
        {
          key: "standardCapacity",
          title: "ظرفیت استاندارد",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["۱ نفر", "۲ نفر", "۳ نفر", "۴ نفر", "۵ نفر", "۶ نفر", "۷ نفر", "۸ نفر و بیشتر"]
        }
      ],
      pricing: { mode: "dailyRent" },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: dailyStayFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "extraPeopleCapacity", title: "ظرفیت اضافه", input: "select", ui: "bottomSheet", options: ["۱ نفر", "۲ نفر", "۳ نفر", "۴ نفر", "۵ نفر و بیشتر"] },
          {
            key: "viewType",
            title: "چشم انداز",
            input: "select",
            ui: "bottomSheet",
            options: ["جنگلی", "کوهستان", "دریا", "رودخانه", "شهر", "دشت", "باغ", "بیابان"]
          },
          { key: "villaType", title: "تیپ بنا", input: "select", ui: "bottomSheet", options: ["فلت", "تک طبقه", "دوبلکس", "تریبلکس", "خونه باغ"] },
          { key: "rentalPeriod", title: "دوره اجاره", input: "select", ui: "bottomSheet", options: ["روزانه", "هفتگی", "ماهانه", "نصف روز", "بلند مدت"] },
          { key: "checkInTime", title: "ساعت ورود", input: "time", ui: "bottomSheet" },
          { key: "checkOutTime", title: "ساعت خروج", input: "time", ui: "bottomSheet" },
          { key: "minStayDays", title: "حداقل مدت اقامت (روز)", input: "number", leftText: "روز", numeric: true },
          { key: "evacuationGuarantee", title: "تضمین تخلیه (تومان)", input: "currency", leftText: "تومان", numeric: true },
          { key: "petPolicy", title: "حیوان خانگی", input: "select", ui: "bottomSheet", options: petPolicyOptions },
          { key: "furnished", title: "با لوازم و مبله", input: "toggle", ui: "toggle" }
        ]
      }
    }
  },

  // 16. اجاره روزانه: هتل، اقامتگاه (Page 17 & 18)
  {
    formCode: "daily-hotel",
    title: "اجاره روزانه هتل، اقامتگاه",
    transaction: "rent",
    category: "daily-hotel-apartment",
    create: {
      specsTitle: "مشخصات هتل و اقامتگاه",
      basicFields: [
        {
          key: "accommodationType",
          title: "نوع اقامتگاه",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["هتل", "هتل آپارتمان", "متل", "مسافر خونه"]
        },
        {
          key: "hotelStars",
          title: "رتبه اقامتگاه",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["۱ ستاره", "۲ ستاره", "۳ ستاره", "۴ ستاره", "۵ ستاره"]
        }
      ],
      pricing: { mode: "dailyRent" },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: dailyStayFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "rentalPeriod", title: "دوره اجاره", input: "select", ui: "bottomSheet", options: ["روزانه", "هفتگی", "ماهانه", "نصف روز", "بلند مدت"] },
          { key: "checkInTime", title: "ساعت ورود", input: "time", ui: "bottomSheet" },
          { key: "minStayDays", title: "حداقل مدت اقامت (روز)", input: "number", leftText: "روز", numeric: true },
          { key: "checkOutTime", title: "ساعت خروج", input: "time", ui: "bottomSheet" },
          { key: "petPolicy", title: "حیوان خانگی", input: "select", ui: "bottomSheet", options: petPolicyOptions }
        ]
      }
    }
  },

  // 17. اجاره روزانه: دفترکار، غرفه (Page 18 & 19)
  {
    formCode: "daily-office-booth",
    title: "اجاره روزانه دفترکار، غرفه",
    transaction: "rent",
    category: "daily-workspace",
    create: {
      specsTitle: "مشخصات دفترکار و غرفه",
      basicFields: [
        {
          key: "spaceType",
          title: "نوع فضا",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["اتاق کار اشتراکی", "اتاق کار خصوصی", "اتاق جلسه", "کلاس آموزشی", "سالن همایش", "غرفه نمایشگاه", "کانتر"]
        },
        { key: "meterage", title: "متراژ (متر مربع)", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۲۵", required: true },
        { key: "rooms", title: "تعداد اتاق", input: "select", ui: "bottomSheet", placeholder: "انتخاب کنید", options: roomOptions },
        {
          key: "standardCapacity",
          title: "ظرفیت استاندارد",
          input: "select",
          ui: "bottomSheet",
          placeholder: "انتخاب کنید",
          options: ["۱ نفر", "۲ نفر", "۳ نفر", "۴ نفر", "۵ نفر", "۶ نفر", "۷ نفر", "۸ نفر و بیشتر"]
        }
      ],
      pricing: { mode: "dailyRent" },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: dailyWorkspaceFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "extraPeopleCapacity", title: "ظرفیت اضافه", input: "select", ui: "bottomSheet", options: ["۱ نفر", "۲ نفر", "۳ نفر", "۴ نفر", "۵ نفر و بیشتر"] },
          { key: "floor", title: "طبقه", input: "select", ui: "bottomSheet", options: floorOptions },
          { key: "rentalPeriod", title: "دوره اجاره", input: "select", ui: "bottomSheet", options: ["ساعتی", "روزانه", "هفتگی", "ماهانه", "نصف روز", "بلند مدت"] },
          { key: "checkInTime", title: "ساعت ورود", input: "time", ui: "bottomSheet" },
          { key: "checkOutTime", title: "ساعت خروج", input: "time", ui: "bottomSheet" },
          { key: "minStayDays", title: "حداقل مدت اقامت (روز)", input: "number", leftText: "روز", numeric: true },
          { key: "evacuationGuarantee", title: "تضمین تخلیه (تومان)", input: "currency", leftText: "تومان", numeric: true }
        ]
      }
    }
  },

  // 18. پیش فروش، فروش پروژه (Page 20)
  {
    formCode: "presale-special",
    title: "پیش فروش، فروش ویژه",
    transaction: "project",
    category: "project-presale",
    create: {
      specsTitle: "مشخصات پیش فروش، فروش ویژه",
      basicFields: [
        { key: "builderCompanyName", title: "نام سازنده/شرکت", input: "text", ui: "input", placeholder: "نام شرکت یا سازنده" },
        { key: "projectType", title: "نوع پروژه", input: "select", ui: "bottomSheet", options: ["مسکونی", "تجاری", "اداری"] },
        { key: "projectTotalFloors", title: "تعداد کل طبقات", input: "select", ui: "bottomSheet", options: totalFloorsOptions },
        { key: "projectTotalUnits", title: "تعداد کل واحد ها", input: "number", numeric: true, placeholder: "مثلا ۲۰" },
        { key: "documentType", title: "سند", input: "select", ui: "bottomSheet", options: standardDocumentOptions }
      ],
      pricing: { mode: "project", saleTerms: true, exchange: true },
      heatingCooling: { enabled: true, items: commonHeatingItems },
      facilities: { enabled: true, items: residentialFacilities },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "projectStatus", title: "وضعیت پروژه", input: "select", ui: "bottomSheet", options: ["در حال ساخت", "آماده تحویل"] },
          { key: "projectDeliveryDate", title: "تاریخ تحویل", input: "date" },
          { key: "kitchenType", title: "نوع آشپزخانه", input: "select", ui: "bottomSheet", options: kitchenTypeOptions },
          { key: "facadeMaterial", title: "جنس نما", input: "select", ui: "bottomSheet", options: facadeOptions },
          { key: "floorMaterial", title: "جنس کف", input: "select", ui: "bottomSheet", options: floorMaterialOptions },
          { key: "cabinetMaterial", title: "جنس کابینت", input: "select", ui: "bottomSheet", options: cabinetOptions },
          { key: "furnished", title: "با لوازم و مبله", input: "toggle", ui: "toggle" }
        ]
      }
    }
  },

  // 19. مشارکت (Page 20 & 21)
  {
    formCode: "partnership",
    title: "مشارکت",
    transaction: "project",
    category: "project-partnership",
    create: {
      specsTitle: "مشخصات مشارکت",
      basicFields: [
        {
          key: "participationType",
          title: "نوع مشارکت",
          input: "select",
          ui: "bottomSheet",
          options: ["مشارکت در ساخت", "تهاتر", "سرمایه گذاری در خرید", "سرمایه گذاری مشترک در ساخت"]
        },
        {
          key: "currentStatus",
          title: "وضعیت فعلی ملک",
          input: "select",
          ui: "bottomSheet",
          options: ["بنا قدیمی", "زمین خالی", "درحال ساخت", "ساختمان نوساز"]
        },
        { key: "landArea", title: "متراژ زمین", input: "text", ui: "input", numeric: true, leftText: "متر مربع", placeholder: "مثلا ۴۰۰", required: true },
        { key: "landPosition", title: "موقعیت زمین", input: "select", ui: "bottomSheet", options: landPositionOptions }
      ],
      pricing: { mode: "partnership" },
      heatingCooling: { enabled: false },
      facilities: { enabled: false },
      moreFeatures: {
        enabled: true,
        fields: [
          { key: "constructionPermit", title: "مجوز ساخت", input: "toggle", ui: "toggle" },
          { key: "documentType", title: "نوع سند", input: "select", ui: "bottomSheet", options: standardDocumentOptions },
          { key: "landWidth", title: "عرض زمین", input: "number", leftText: "متر", numeric: true },
          { key: "streetWidth", title: "عرض گذر", input: "number", leftText: "متر", numeric: true }
        ]
      }
    }
  }
];

for (const form of forms) {
  if (form.create?.moreFeatures?.fields) {
    const endKeys = ['facadeMaterial', 'floorMaterial', 'cabinetMaterial'];
    const otherFields = form.create.moreFeatures.fields.filter(f => !endKeys.includes(f.key));
    const endFields = form.create.moreFeatures.fields.filter(f => endKeys.includes(f.key));
    
    // Also if kitchenType was after toggles, make sure toggles come after kitchenType:
    const nonToggleOthers = otherFields.filter(f => f.input !== 'toggle' && f.ui !== 'toggle');
    const toggleOthers = otherFields.filter(f => f.input === 'toggle' || f.ui === 'toggle');
    
    form.create.moreFeatures.fields = [...nonToggleOthers, ...toggleOthers, ...endFields];
  }
  const filePath = path.join(targetDir, `${form.formCode}.json`);
  let existingFilter = { sections: [] };
  if (fs.existsSync(filePath)) {
    try {
      const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (existingData.filter?.sections?.length > 0) {
        existingFilter = existingData.filter;
      }
    } catch {}
  }

  const schema = {
    $schema: "./types.ts",
    formCode: form.formCode,
    title: form.title,
    transaction: form.transaction,
    category: form.category,
    create: form.create,
    view: { sections: [] },
    filter: existingFilter
  };

  fs.writeFileSync(filePath, JSON.stringify(schema, null, 2), 'utf-8');
  console.log(`Generated: ${form.formCode}.json`);
}

console.log(`\nSuccessfully updated all ${forms.length} JSON form schemas strictly from the PDF document.`);
