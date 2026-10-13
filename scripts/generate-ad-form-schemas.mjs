import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../src/features/advertisements/forms');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Canonical schemas matching current production forms
const schemas = {
  "daily-apartment-suite": {
    "$schema": "./types.ts",
    "formCode": "daily-apartment-suite",
    "title": "اجاره روزانه آپارتمان، سوئیت",
    "transaction": "rent",
    "category": "daily-apartment-suite",
    "create": {
      "specsTitle": "مشخصات سوئیت و آپارتمان",
      "basicFields": [
        {
          "key": "accommodationType",
          "title": "نوع اقامتگاه",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "سوئیت",
            "آپارتمان",
            "اتاق",
            "خوابگاه یا پانسیون",
            "بوم گردی"
          ]
        },
        {
          "key": "meterage",
          "title": "متراژ",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۵۰",
          "required": true
        },
        {
          "key": "rooms",
          "title": "تعداد اتاق",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵+"
          ]
        },
        {
          "key": "standardCapacity",
          "title": "ظرفیت استاندارد",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸",
            "۹",
            "۱۰",
            "۱۲",
            "۱۵",
            "۲۰",
            "۳۰",
            "۴۰",
            "۵۰+"
          ]
        }
      ],
      "pricing": {
        "mode": "dailyRent"
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "yard",
            "label": "حیاط"
          },
          {
            "id": "iranian",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western",
            "label": "سرویس فرنگی"
          },
          {
            "id": "door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video",
            "label": "آیفون تصویری"
          },
          {
            "id": "gas-stove",
            "label": "گاز رومیزی"
          },
          {
            "id": "hood",
            "label": "هود"
          },
          {
            "id": "oven",
            "label": "فرتوکار"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "camera",
            "label": "دوربین امنیتی"
          },
          {
            "id": "bms",
            "label": "سیستم هوشمند"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof",
            "label": "روف گاردن"
          },
          {
            "id": "heated-pool",
            "label": "استخر آب گرم"
          },
          {
            "id": "outdoor-pool",
            "label": "استخرروباز"
          },
          {
            "id": "covered-pool",
            "label": "استخر پوشیده"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          },
          {
            "id": "gym",
            "label": "سالن ورزشی"
          },
          {
            "id": "playground",
            "label": "زمین بازی"
          },
          {
            "id": "internet",
            "label": "اینترنت پر سرعت"
          },
          {
            "id": "tv",
            "label": "تلویزیون"
          },
          {
            "id": "audio",
            "label": "سیستم صوتی"
          },
          {
            "id": "washing-machine",
            "label": "ماشین لباسشویی"
          },
          {
            "id": "fridge",
            "label": "یخچال"
          },
          {
            "id": "stove-microwave",
            "label": "اجاق گاز مایکروفر"
          },
          {
            "id": "hall",
            "label": "سالن"
          },
          {
            "id": "cookware",
            "label": "لوازم آشپزی"
          },
          {
            "id": "clean-linen",
            "label": "ملحفه و حوله تمیز"
          },
          {
            "id": "hairdryer",
            "label": "سشوار"
          },
          {
            "id": "iron",
            "label": "اتو"
          },
          {
            "id": "dishwasher",
            "label": "ظرفشویی"
          },
          {
            "id": "outdoor-space",
            "label": "فضا بیرونی"
          },
          {
            "id": "ventilation",
            "label": "سیستم تهویه مطبوع"
          },
          {
            "id": "coffee-maker",
            "label": "دستگاه قهوه ساز"
          },
          {
            "id": "security-system",
            "label": "سیستم امنیتی"
          },
          {
            "id": "workspace",
            "label": "فضا کار"
          },
          {
            "id": "balcony",
            "label": "بالکن"
          },
          {
            "id": "service",
            "label": "سرویس"
          },
          {
            "id": "bedding",
            "label": "سرویس خواب"
          },
          {
            "id": "bed",
            "label": "تخت خواب"
          },
          {
            "id": "furniture",
            "label": "مبلمان"
          },
          {
            "id": "hygiene-pack",
            "label": "پک بهداشتی"
          },
          {
            "id": "serving-items",
            "label": "ظروف و لوازم پذیرایی"
          },
          {
            "id": "dining-table",
            "label": "میزناهار خوری"
          },
          {
            "id": "kitchen",
            "label": "آشپزخانه"
          },
          {
            "id": "master-room",
            "label": "اتاق مستر"
          },
          {
            "id": "barbecue",
            "label": "باربیکیو"
          },
          {
            "id": "gazebo",
            "label": "آلاچیق"
          },
          {
            "id": "garden",
            "label": "فضا سبز/باغ"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "extraPeopleCapacity",
            "title": "ظرفیت اضافه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱",
              "۲",
              "۳",
              "۴",
              "۵",
              "۶",
              "۷",
              "۸",
              "۹",
              "۱۰",
              "۱۲",
              "۱۵",
              "۲۰",
              "۳۰",
              "۴۰",
              "۵۰+"
            ]
          },
          {
            "key": "floor",
            "title": "طبقه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "همکف",
              "۱",
              "۲",
              "۳",
              "۴",
              "۵",
              "۶",
              "۷",
              "۸ و بیشتر"
            ]
          },
          {
            "key": "rentalPeriod",
            "title": "دوره اجاره",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "روزانه",
              "هفتگی",
              "ماهانه",
              "نصف روز",
              "بلند مدت"
            ]
          },
          {
            "key": "checkInTime",
            "title": "ساعت ورود",
            "input": "time",
            "ui": "bottomSheet"
          },
          {
            "key": "checkOutTime",
            "title": "ساعت خروج",
            "input": "time",
            "ui": "bottomSheet"
          },
          {
            "key": "minStayDays",
            "title": "حداقل مدت اقامت (روز)",
            "input": "number",
            "leftText": "روز",
            "numeric": true
          },
          {
            "key": "evacuationGuarantee",
            "title": "تضمین تخلیه (تومان)",
            "input": "currency",
            "leftText": "تومان",
            "numeric": true
          },
          {
            "key": "petPolicy",
            "title": "حیوان خانگی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "مجاز",
              "غیر مجاز"
            ]
          },
          {
            "key": "furnished",
            "title": "با لوازم و مبله",
            "input": "toggle",
            "ui": "toggle"
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "meterage",
          "title": "متراژ",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "dailyPrice",
          "title": "قیمت روزانه",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "single",
          "id": "accommodationType",
          "title": "نوع اقامتگاه",
          "icon": "building",
          "options": [
            "سوئیت",
            "آپارتمان",
            "اتاق",
            "خوابگاه یا پانسیون",
            "بوم گردی"
          ]
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "single",
          "id": "standardCapacity",
          "title": "ظرفیت استاندارد",
          "icon": "unitBed",
          "options": [
            "۱ نفر",
            "۲ نفر",
            "۳ نفر",
            "۴ نفر",
            "۵ نفر",
            "۶ نفر",
            "۷ نفر",
            "۸ نفر",
            "۹ نفر",
            "۱۰ نفر",
            "۱۲ نفر",
            "۱۵ نفر",
            "۲۰ نفر",
            "۳۰ نفر",
            "۴۰ نفر",
            "۵۰+ نفر"
          ],
          "more": true,
          "moreLimit": 5,
          "moreLabel": "مشاهده همه ظرفیتها",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "floor",
          "title": "طبقه",
          "icon": "floor",
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 6,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 15 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "yard",
              "label": "حیاط"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "wardrobe",
              "label": "کمد دیواری"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "gas-stove",
              "label": "گاز رومیزی"
            },
            {
              "id": "hood",
              "label": "هود"
            },
            {
              "id": "oven",
              "label": "فرتوکار"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "pool",
              "label": "استخر"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            }
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "daily-garden-villa": {
    "$schema": "./types.ts",
    "formCode": "daily-garden-villa",
    "title": "اجاره روزانه ویلا، باغ",
    "transaction": "rent",
    "category": "daily-garden-villa",
    "create": {
      "specsTitle": "مشخصات ویلا",
      "basicFields": [
        {
          "key": "landArea",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۵۰۰",
          "required": true
        },
        {
          "key": "buildingArea",
          "title": "متراژ بنا",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۱۲۰",
          "required": true
        },
        {
          "key": "rooms",
          "title": "تعداد اتاق",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵+"
          ]
        },
        {
          "key": "standardCapacity",
          "title": "ظرفیت استاندارد",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸",
            "۹",
            "۱۰",
            "۱۲",
            "۱۵",
            "۲۰",
            "۳۰",
            "۴۰",
            "۵۰+"
          ]
        }
      ],
      "pricing": {
        "mode": "dailyRent"
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "yard",
            "label": "حیاط"
          },
          {
            "id": "iranian",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western",
            "label": "سرویس فرنگی"
          },
          {
            "id": "door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video",
            "label": "آیفون تصویری"
          },
          {
            "id": "gas-stove",
            "label": "گاز رومیزی"
          },
          {
            "id": "hood",
            "label": "هود"
          },
          {
            "id": "oven",
            "label": "فرتوکار"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "camera",
            "label": "دوربین امنیتی"
          },
          {
            "id": "bms",
            "label": "سیستم هوشمند"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof",
            "label": "روف گاردن"
          },
          {
            "id": "heated-pool",
            "label": "استخر آب گرم"
          },
          {
            "id": "outdoor-pool",
            "label": "استخرروباز"
          },
          {
            "id": "covered-pool",
            "label": "استخر پوشیده"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          },
          {
            "id": "gym",
            "label": "سالن ورزشی"
          },
          {
            "id": "playground",
            "label": "زمین بازی"
          },
          {
            "id": "internet",
            "label": "اینترنت پر سرعت"
          },
          {
            "id": "tv",
            "label": "تلویزیون"
          },
          {
            "id": "audio",
            "label": "سیستم صوتی"
          },
          {
            "id": "washing-machine",
            "label": "ماشین لباسشویی"
          },
          {
            "id": "fridge",
            "label": "یخچال"
          },
          {
            "id": "stove-microwave",
            "label": "اجاق گاز مایکروفر"
          },
          {
            "id": "hall",
            "label": "سالن"
          },
          {
            "id": "cookware",
            "label": "لوازم آشپزی"
          },
          {
            "id": "clean-linen",
            "label": "ملحفه و حوله تمیز"
          },
          {
            "id": "hairdryer",
            "label": "سشوار"
          },
          {
            "id": "iron",
            "label": "اتو"
          },
          {
            "id": "dishwasher",
            "label": "ظرفشویی"
          },
          {
            "id": "outdoor-space",
            "label": "فضا بیرونی"
          },
          {
            "id": "ventilation",
            "label": "سیستم تهویه مطبوع"
          },
          {
            "id": "coffee-maker",
            "label": "دستگاه قهوه ساز"
          },
          {
            "id": "security-system",
            "label": "سیستم امنیتی"
          },
          {
            "id": "workspace",
            "label": "فضا کار"
          },
          {
            "id": "balcony",
            "label": "بالکن"
          },
          {
            "id": "service",
            "label": "سرویس"
          },
          {
            "id": "bedding",
            "label": "سرویس خواب"
          },
          {
            "id": "bed",
            "label": "تخت خواب"
          },
          {
            "id": "furniture",
            "label": "مبلمان"
          },
          {
            "id": "hygiene-pack",
            "label": "پک بهداشتی"
          },
          {
            "id": "serving-items",
            "label": "ظروف و لوازم پذیرایی"
          },
          {
            "id": "dining-table",
            "label": "میزناهار خوری"
          },
          {
            "id": "kitchen",
            "label": "آشپزخانه"
          },
          {
            "id": "master-room",
            "label": "اتاق مستر"
          },
          {
            "id": "barbecue",
            "label": "باربیکیو"
          },
          {
            "id": "gazebo",
            "label": "آلاچیق"
          },
          {
            "id": "garden",
            "label": "فضا سبز/باغ"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "extraPeopleCapacity",
            "title": "ظرفیت اضافه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱",
              "۲",
              "۳",
              "۴",
              "۵",
              "۶",
              "۷",
              "۸",
              "۹",
              "۱۰",
              "۱۲",
              "۱۵",
              "۲۰",
              "۳۰",
              "۴۰",
              "۵۰+"
            ]
          },
          {
            "key": "viewType",
            "title": "چشم انداز",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "جنگلی",
              "کوهستان",
              "دریا",
              "رودخانه",
              "شهر",
              "دشت",
              "باغ",
              "بیابان"
            ]
          },
          {
            "key": "villaType",
            "title": "تیپ بنا",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "فلت",
              "تک طبقه",
              "دوبلکس",
              "تریبلکس",
              "خونه باغ"
            ]
          },
          {
            "key": "rentalPeriod",
            "title": "دوره اجاره",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "روزانه",
              "هفتگی",
              "ماهانه",
              "نصف روز",
              "بلند مدت"
            ]
          },
          {
            "key": "checkInTime",
            "title": "ساعت ورود",
            "input": "time",
            "ui": "bottomSheet"
          },
          {
            "key": "checkOutTime",
            "title": "ساعت خروج",
            "input": "time",
            "ui": "bottomSheet"
          },
          {
            "key": "minStayDays",
            "title": "حداقل مدت اقامت (روز)",
            "input": "number",
            "leftText": "روز",
            "numeric": true
          },
          {
            "key": "evacuationGuarantee",
            "title": "تضمین تخلیه (تومان)",
            "input": "currency",
            "leftText": "تومان",
            "numeric": true
          },
          {
            "key": "petPolicy",
            "title": "حیوان خانگی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "مجاز",
              "غیر مجاز"
            ]
          },
          {
            "key": "furnished",
            "title": "با لوازم و مبله",
            "input": "toggle",
            "ui": "toggle"
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "landArea",
          "title": "متراژ زمین",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "buildingArea",
          "title": "متراژ بنا",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "dailyPrice",
          "title": "قیمت روزانه",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "single",
          "id": "standardCapacity",
          "title": "ظرفیت استاندارد",
          "icon": "unitBed",
          "options": [
            "۱ نفر",
            "۲ نفر",
            "۳ نفر",
            "۴ نفر",
            "۵ نفر",
            "۶ نفر",
            "۷ نفر",
            "۸ نفر",
            "۹ نفر",
            "۱۰ نفر",
            "۱۲ نفر",
            "۱۵ نفر",
            "۲۰ نفر",
            "۳۰ نفر",
            "۴۰ نفر",
            "۵۰+ نفر"
          ],
          "more": true,
          "moreLimit": 5,
          "moreLabel": "مشاهده همه ظرفیتها",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 17 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "yard",
              "label": "حیاط"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "wardrobe",
              "label": "کمد دیواری"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "gas-stove",
              "label": "گاز رومیزی"
            },
            {
              "id": "hood",
              "label": "هود"
            },
            {
              "id": "oven",
              "label": "فرتوکار"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "pool",
              "label": "استخر"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            },
            {
              "id": "gym",
              "label": "سالن ورزشی"
            },
            {
              "id": "playground",
              "label": "زمین بازی"
            }
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "daily-hotel": {
    "$schema": "./types.ts",
    "formCode": "daily-hotel",
    "title": "اجاره روزانه هتل، اقامتگاه",
    "transaction": "rent",
    "category": "daily-hotel-apartment",
    "create": {
      "specsTitle": "مشخصات هتل و اقامتگاه",
      "basicFields": [
        {
          "key": "accommodationType",
          "title": "نوع اقامتگاه",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "هتل",
            "هتل آپارتمان",
            "متل",
            "مسافر خونه"
          ]
        },
        {
          "key": "hotelStars",
          "title": "رتبه اقامتگاه",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "۱ ستاره",
            "۲ ستاره",
            "۳ ستاره",
            "۴ ستاره",
            "۵ ستاره"
          ]
        }
      ],
      "pricing": {
        "mode": "dailyRent"
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "iranian",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western",
            "label": "سرویس فرنگی"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof",
            "label": "روف گاردن"
          },
          {
            "id": "heated-pool",
            "label": "استخر آب گرم"
          },
          {
            "id": "outdoor-pool",
            "label": "استخرروباز"
          },
          {
            "id": "covered-pool",
            "label": "استخر پوشیده"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          },
          {
            "id": "gym",
            "label": "سالن ورزشی"
          },
          {
            "id": "playground",
            "label": "زمین بازی"
          },
          {
            "id": "cinema",
            "label": "سینما"
          },
          {
            "id": "coffee-shop",
            "label": "کافی شاپ"
          },
          {
            "id": "restaurant",
            "label": "رستوران"
          },
          {
            "id": "shop",
            "label": "فروشگاه"
          },
          {
            "id": "gas-stove",
            "label": "گازرومیزی"
          },
          {
            "id": "hood",
            "label": "هود"
          },
          {
            "id": "oven",
            "label": "فرتوکار"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "camera",
            "label": "دوربین امنیتی"
          },
          {
            "id": "bms",
            "label": "سیستم هوشمند"
          },
          {
            "id": "internet",
            "label": "اینترنت پر سرعت"
          },
          {
            "id": "tv",
            "label": "تلویزیون"
          },
          {
            "id": "audio",
            "label": "سیستم صوتی"
          },
          {
            "id": "washing-machine",
            "label": "ماشین لباسشویی"
          },
          {
            "id": "fridge",
            "label": "یخچال"
          },
          {
            "id": "stove-microwave",
            "label": "اجاق گاز مایکروفر"
          },
          {
            "id": "cookware",
            "label": "لوازم آشپزی"
          },
          {
            "id": "clean-linen",
            "label": "ملحفه و حوله تمیز"
          },
          {
            "id": "hairdryer",
            "label": "سشوار"
          },
          {
            "id": "iron",
            "label": "اتو"
          },
          {
            "id": "dishwasher",
            "label": "ظرفشویی"
          },
          {
            "id": "outdoor-space",
            "label": "فضا بیرونی"
          },
          {
            "id": "ventilation",
            "label": "سیستم تهویه مطبوع"
          },
          {
            "id": "coffee-maker",
            "label": "دستگاه قهوه ساز"
          },
          {
            "id": "security-system",
            "label": "سیستم امنیتی"
          },
          {
            "id": "workspace",
            "label": "فضا کار"
          },
          {
            "id": "bedding",
            "label": "سرویس خواب"
          },
          {
            "id": "bed",
            "label": "تخت خواب"
          },
          {
            "id": "furniture",
            "label": "مبلمان"
          },
          {
            "id": "hygiene-pack",
            "label": "پک بهداشتی"
          },
          {
            "id": "serving-items",
            "label": "ظروف و لوازم پذیرایی"
          },
          {
            "id": "dining-table",
            "label": "میزناهار خوری"
          },
          {
            "id": "kitchen",
            "label": "آشپزخانه"
          },
          {
            "id": "master-room",
            "label": "اتاق مستر"
          },
          {
            "id": "barbecue",
            "label": "باربیکیو"
          },
          {
            "id": "gazebo",
            "label": "آلاچیق"
          },
          {
            "id": "garden",
            "label": "فضا سبز/باغ"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "rentalPeriod",
            "title": "دوره اجاره",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "روزانه",
              "هفتگی",
              "ماهانه",
              "نصف روز",
              "بلند مدت"
            ]
          },
          {
            "key": "checkInTime",
            "title": "ساعت ورود",
            "input": "time",
            "ui": "bottomSheet"
          },
          {
            "key": "minStayDays",
            "title": "حداقل مدت اقامت (روز)",
            "input": "number",
            "leftText": "روز",
            "numeric": true
          },
          {
            "key": "checkOutTime",
            "title": "ساعت خروج",
            "input": "time",
            "ui": "bottomSheet"
          },
          {
            "key": "petPolicy",
            "title": "حیوان خانگی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "مجاز",
              "غیر مجاز"
            ]
          },
          {
            "key": "extraPeopleCapacity",
            "title": "ظرفیت اضافه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱",
              "۲",
              "۳",
              "۴",
              "۵",
              "۶",
              "۷",
              "۸",
              "۹",
              "۱۰",
              "۱۲",
              "۱۵",
              "۲۰",
              "۳۰",
              "۴۰",
              "۵۰+"
            ]
          },
          {
            "key": "floor",
            "title": "طبقه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "همکف",
              "۱",
              "۲",
              "۳",
              "۴",
              "۵",
              "۶",
              "۷",
              "۸ و بیشتر"
            ]
          },
          {
            "key": "evacuationGuarantee",
            "title": "تضمین تخلیه (تومان)",
            "input": "number",
            "ui": "input",
            "numeric": true,
            "leftText": "تومان"
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "dailyPrice",
          "title": "قیمت روزانه",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "single",
          "id": "accommodationType",
          "title": "نوع اقامتگاه",
          "icon": "building",
          "options": [
            "هتل",
            "هتل آپارتمان",
            "متل",
            "مسافر خونه"
          ]
        },
        {
          "kind": "single",
          "id": "hotelStars",
          "title": "رتبه اقامتگاه",
          "icon": "star",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷"
          ]
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 10 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "outdoor-pool",
              "label": "استخر روباز"
            },
            {
              "id": "indoor-pool",
              "label": "استخر سرپوشیده"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            },
            {
              "id": "gym",
              "label": "سالن ورزشی"
            },
            {
              "id": "cinema",
              "label": "سینما"
            },
            {
              "id": "coffee-shop",
              "label": "کافی شاپ"
            },
            {
              "id": "restaurant",
              "label": "رستوران"
            },
            {
              "id": "shop",
              "label": "فروشگاه"
            }
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "daily-office-booth": {
    "$schema": "./types.ts",
    "formCode": "daily-office-booth",
    "title": "اجاره روزانه دفترکار، غرفه",
    "transaction": "rent",
    "category": "daily-workspace",
    "create": {
      "specsTitle": "مشخصات دفترکار و غرفه",
      "basicFields": [
        {
          "key": "spaceType",
          "title": "نوع فضا",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "اتاق کار اشتراکی",
            "اتاق کار خصوصی",
            "اتاق جلسه",
            "کلاس آموزشی",
            "سالن همایش",
            "غرفه نمایشگاه",
            "کانتر"
          ]
        },
        {
          "key": "meterage",
          "title": "متراژ (متر مربع)",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۲۵",
          "required": true
        },
        {
          "key": "rooms",
          "title": "تعداد اتاق",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵+"
          ]
        },
        {
          "key": "standardCapacity",
          "title": "ظرفیت استاندارد",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸",
            "۹",
            "۱۰",
            "۱۲",
            "۱۵",
            "۲۰",
            "۳۰",
            "۴۰",
            "۵۰+"
          ]
        }
      ],
      "pricing": {
        "mode": "dailyRent"
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "internet",
            "label": "اینترنت پر سرعت"
          },
          {
            "id": "projector",
            "label": "ویدئو پرژکتور"
          },
          {
            "id": "whiteboard",
            "label": "تخته وایت برد"
          },
          {
            "id": "audio",
            "label": "سیستم صوتی"
          },
          {
            "id": "printer-scanner",
            "label": "پرینتر/اسکنر"
          },
          {
            "id": "office-furniture",
            "label": "میزوصندلی اداری"
          },
          {
            "id": "reception",
            "label": "پذیرایی"
          },
          {
            "id": "fax",
            "label": "دستگاه فکس"
          },
          {
            "id": "conference-phone",
            "label": "تلفن کنفرانس"
          },
          {
            "id": "computer-laptop",
            "label": "کامپیوتر/لبتاب"
          },
          {
            "id": "monitor",
            "label": "مانیتور"
          },
          {
            "id": "tv",
            "label": "تلویزیون"
          },
          {
            "id": "copier",
            "label": "دستگاه کپی"
          },
          {
            "id": "ventilation",
            "label": "سیستم تهویه مطبوع"
          },
          {
            "id": "filing",
            "label": "قفسه وفایلینگ"
          },
          {
            "id": "meeting-room",
            "label": "اتاق جلسات"
          },
          {
            "id": "rest-room",
            "label": "اتاق استراحت"
          },
          {
            "id": "coffee-maker",
            "label": "دستگاه قهوه ساز"
          },
          {
            "id": "air-purifier",
            "label": "دستگاه تصفیه هوا"
          },
          {
            "id": "camera",
            "label": "دوربین"
          },
          {
            "id": "single-phase-power",
            "label": "برق تک فاز"
          },
          {
            "id": "three-phase-power",
            "label": "برق سه فاز"
          },
          {
            "id": "water",
            "label": "امتیازآب"
          },
          {
            "id": "gas",
            "label": "امتیاز گاز"
          },
          {
            "id": "phone",
            "label": "امتیاز تلفن"
          },
          {
            "id": "voip-cctv",
            "label": "voipمداربسته"
          },
          {
            "id": "private-phone-room",
            "label": "اتاق تلفن خصوصی"
          },
          {
            "id": "phone-system",
            "label": "سیستم تلفن"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "extraPeopleCapacity",
            "title": "ظرفیت اضافه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱",
              "۲",
              "۳",
              "۴",
              "۵",
              "۶",
              "۷",
              "۸",
              "۹",
              "۱۰",
              "۱۲",
              "۱۵",
              "۲۰",
              "۳۰",
              "۴۰",
              "۵۰+"
            ]
          },
          {
            "key": "floor",
            "title": "طبقه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "همکف",
              "۱",
              "۲",
              "۳",
              "۴",
              "۵",
              "۶",
              "۷",
              "۸ و بیشتر"
            ]
          },
          {
            "key": "rentalPeriod",
            "title": "دوره اجاره",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "ساعتی",
              "روزانه",
              "هفتگی",
              "ماهانه",
              "نصف روز",
              "بلند مدت"
            ]
          },
          {
            "key": "checkInTime",
            "title": "ساعت ورود",
            "input": "time",
            "ui": "bottomSheet"
          },
          {
            "key": "checkOutTime",
            "title": "ساعت خروج",
            "input": "time",
            "ui": "bottomSheet"
          },
          {
            "key": "minStayDays",
            "title": "حداقل مدت اقامت (روز)",
            "input": "number",
            "leftText": "روز",
            "numeric": true
          },
          {
            "key": "evacuationGuarantee",
            "title": "تضمین تخلیه (تومان)",
            "input": "currency",
            "leftText": "تومان",
            "numeric": true
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "meterage",
          "title": "متراژ",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "dailyPrice",
          "title": "قیمت روزانه",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "single",
          "id": "spaceType",
          "title": "نوع فضا",
          "icon": "building",
          "options": [
            "اتاق کار اشتراکی",
            "اتاق کار خصوصی",
            "اتاق جلسه",
            "کلاس آموزشی",
            "سالن همایش",
            "غرفه نمایشگاه",
            "کانتر"
          ]
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "single",
          "id": "standardCapacity",
          "title": "ظرفیت استاندارد",
          "icon": "unitBed",
          "options": [
            "۱ نفر",
            "۲ نفر",
            "۳ نفر",
            "۴ نفر",
            "۵ نفر",
            "۶ نفر",
            "۷ نفر",
            "۸ نفر",
            "۹ نفر",
            "۱۰ نفر",
            "۱۲ نفر",
            "۱۵ نفر",
            "۲۰ نفر",
            "۳۰ نفر",
            "۴۰ نفر",
            "۵۰+ نفر"
          ],
          "more": true,
          "moreLimit": 5,
          "moreLabel": "مشاهده همه ظرفیتها",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "floor",
          "title": "طبقه",
          "icon": "floor",
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 6,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 15 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "yard",
              "label": "حیاط"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "wardrobe",
              "label": "کمد دیواری"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "gas-stove",
              "label": "گاز رومیزی"
            },
            {
              "id": "hood",
              "label": "هود"
            },
            {
              "id": "oven",
              "label": "فرتوکار"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "pool",
              "label": "استخر"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            }
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "partnership": {
    "$schema": "./types.ts",
    "formCode": "partnership",
    "title": "مشارکت",
    "transaction": "project",
    "category": "project-partnership",
    "create": {
      "specsTitle": "مشخصات مشارکت",
      "basicFields": [
        {
          "key": "participationType",
          "title": "نوع مشارکت",
          "input": "select",
          "ui": "bottomSheet",
          "options": [
            "مشارکت در ساخت",
            "تهاتر",
            "سرمایه گذاری در خرید",
            "سرمایه گذاری مشترک در ساخت"
          ]
        },
        {
          "key": "currentStatus",
          "title": "وضعیت فعلی ملک",
          "input": "select",
          "ui": "bottomSheet",
          "options": [
            "بنا قدیمی",
            "زمین خالی",
            "درحال ساخت",
            "ساختمان نوساز"
          ]
        },
        {
          "key": "landArea",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۴۰۰",
          "required": true
        },
        {
          "key": "landPosition",
          "title": "موقعیت زمین",
          "input": "select",
          "ui": "bottomSheet",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دوممر",
            "دونبش",
            "سه نبش",
            "چهارنبش"
          ]
        }
      ],
      "pricing": {
        "mode": "partnership"
      },
      "heatingCooling": {
        "enabled": false
      },
      "facilities": {
        "enabled": false
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "documentType",
            "title": "نوع سند",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تک برگ",
              "منگوله دار",
              "آستانه",
              "اوقافی",
              "موقوفه",
              "وکالت محضری",
              "قولنامه",
              "مشاع",
              "در دست اقدام",
              "آماده انتقال"
            ]
          },
          {
            "key": "landWidth",
            "title": "عرض زمین",
            "input": "number",
            "leftText": "متر",
            "numeric": true
          },
          {
            "key": "streetWidth",
            "title": "عرض گذر",
            "input": "number",
            "leftText": "متر",
            "numeric": true
          },
          {
            "key": "constructionPermit",
            "title": "مجوز ساخت",
            "input": "toggle",
            "ui": "toggle"
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "landArea",
          "title": "متراژ زمین",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "single",
          "id": "participationType",
          "title": "نوع مشارکت",
          "icon": "agreement",
          "options": [
            "مشارکت در ساخت",
            "سرمایه گذاری",
            "معاوضه با ملک",
            "پیش خرید"
          ]
        },
        {
          "kind": "single",
          "id": "currentStatus",
          "title": "وضعیت فعلی ملک",
          "icon": "settings",
          "options": [
            "بنا قدیمی",
            "زمین خالی",
            "درحال ساخت",
            "ساختمان نوساز"
          ]
        },
        {
          "kind": "single",
          "id": "landPosition",
          "title": "موقعیت ورودی",
          "icon": "orientation",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دو ممر",
            "دونبش",
            "سه نبش",
            "چهار نبش"
          ]
        },
        {
          "kind": "single",
          "id": "documentType",
          "title": "نوع سند",
          "icon": "agreement",
          "options": [
            "ملکی",
            "آستانه",
            "اوقاف",
            "موقوفه",
            "قولنامه، وکالت"
          ]
        },
        {
          "kind": "toggle",
          "id": "constructionPermit",
          "title": "مجوز ساخت",
          "icon": "agreement"
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "presale-special": {
    "$schema": "./types.ts",
    "formCode": "presale-special",
    "title": "پیش فروش، فروش پروژه",
    "transaction": "project",
    "category": "project-presale",
    "create": {
      "specsTitle": "مشخصات پیش فروش، فروش پروژه",
      "basicFields": [
        {
          "key": "builderCompanyName",
          "title": "نام سازنده/شرکت",
          "input": "text",
          "ui": "input",
          "placeholder": "نام شرکت یا سازنده"
        },
        {
          "key": "projectType",
          "title": "نوع پروژه",
          "input": "select",
          "ui": "bottomSheet",
          "options": [
            "مسکونی",
            "تجاری",
            "اداری"
          ]
        },
        {
          "key": "projectTotalFloors",
          "title": "تعداد کل طبقات",
          "input": "select",
          "ui": "bottomSheet",
          "options": [
            "۱ طبقه",
            "۲ طبقه",
            "۳ طبقه",
            "۴ طبقه",
            "۵ طبقه",
            "۶ طبقه",
            "۷ طبقه",
            "۸ طبقه و بیشتر"
          ]
        },
        {
          "key": "projectTotalUnits",
          "title": "تعداد کل واحد ها",
          "input": "number",
          "numeric": true,
          "placeholder": "مثلا ۲۰"
        },
        {
          "key": "documentType",
          "title": "سند",
          "input": "select",
          "ui": "bottomSheet",
          "options": [
            "تک برگ",
            "منگوله دار",
            "آستانه",
            "اوقافی",
            "موقوفه",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        }
      ],
      "pricing": {
        "mode": "project",
        "saleTerms": true,
        "exchange": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "yard",
            "label": "حیاط"
          },
          {
            "id": "iranian",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western",
            "label": "سرویس فرنگی"
          },
          {
            "id": "wardrobe",
            "label": "کمد دیواری"
          },
          {
            "id": "door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video",
            "label": "آیفون تصویری"
          },
          {
            "id": "gas-stove",
            "label": "گاز رومیزی"
          },
          {
            "id": "hood",
            "label": "هود"
          },
          {
            "id": "oven",
            "label": "فر توکار"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "camera",
            "label": "دوربین امنیتی"
          },
          {
            "id": "bms",
            "label": "سیستم هوشمند"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof",
            "label": "روف گاردن"
          },
          {
            "id": "pool",
            "label": "استخر"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "projectStatus",
            "title": "وضعیت پروژه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "در حال ساخت",
              "آماده تحویل"
            ]
          },
          {
            "key": "projectDeliveryDate",
            "title": "تاریخ تحویل",
            "input": "date"
          },
          {
            "key": "kitchenType",
            "title": "نوع آشپزخانه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "اپن",
              "جزیره",
              "بسته",
              "نیمه اپن"
            ]
          },
          {
            "key": "furnished",
            "title": "با لوازم و مبله",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "facadeMaterial",
            "title": "جنس نما",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سنگ",
              "آجر",
              "سیمان",
              "کامپوزیت",
              "شیشه",
              "رومی",
              "ترکیبی"
            ]
          },
          {
            "key": "floorMaterial",
            "title": "جنس کف",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سرامیک",
              "سنگ",
              "پارکت",
              "لمینت",
              "موزاییک",
              "کفپوش"
            ]
          },
          {
            "key": "cabinetMaterial",
            "title": "جنس کابینت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "MDF",
              "های‌گلاس",
              "ممبران",
              "فلزی",
              "چوبی",
              "ندارد"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "meterage",
          "title": "متراژ",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "projectPrice",
          "title": "قیمت متری",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "single",
          "id": "projectType",
          "title": "نوع پروژه",
          "icon": "building",
          "options": [
            "مسکونی",
            "تجاری",
            "اداری",
            "ویلایی",
            "صنعتی",
            "زمین"
          ]
        },
        {
          "kind": "single",
          "id": "projectStatus",
          "title": "وضعیت پروژه",
          "icon": "settings",
          "options": [
            "گودبرداری",
            "فونداسیون",
            "اسکلت",
            "سفت کاری",
            "نازک کاری",
            "تکمیل شده"
          ]
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 15 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "yard",
              "label": "حیاط"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "wardrobe",
              "label": "کمد دیواری"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "gas-stove",
              "label": "گاز رومیزی"
            },
            {
              "id": "hood",
              "label": "هود"
            },
            {
              "id": "oven",
              "label": "فرتوکار"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "pool",
              "label": "استخر"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "exchangeWith",
          "title": "معاوضه با",
          "icon": "exchange",
          "options": [
            "ویلا",
            "خودرو",
            "آپارتمان",
            "خانه ویلایی",
            "زمین",
            "دفتر کار / اداری",
            "مغازه و تجاری",
            "سایر"
          ]
        },
        {
          "kind": "toggle",
          "id": "saleTermsEnabled",
          "title": "فروش شرایطی"
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "rent-apartment": {
    "$schema": "./types.ts",
    "formCode": "rent-apartment",
    "title": "اجاره آپارتمان",
    "transaction": "rent",
    "category": "apartment",
    "create": {
      "specsTitle": "مشخصات آپارتمان",
      "basicFields": [
        {
          "key": "meterage",
          "title": "متراژ آپارتمان",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۸۵",
          "required": true
        },
        {
          "key": "floor",
          "title": "طبقه",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ]
        },
        {
          "key": "rooms",
          "title": "تعداد اتاق",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵+"
          ]
        },
        {
          "key": "age",
          "title": "سن ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        }
      ],
      "pricing": {
        "mode": "rent",
        "rentConversion": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "yard",
            "label": "حیاط"
          },
          {
            "id": "iranian-toilet",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western-toilet",
            "label": "سرویس فرنگی"
          },
          {
            "id": "wardrobe",
            "label": "کمد دیواری"
          },
          {
            "id": "security-door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video-intercom",
            "label": "آیفون تصویری"
          },
          {
            "id": "gas-stove",
            "label": "گاز رومیزی"
          },
          {
            "id": "hood",
            "label": "هود"
          },
          {
            "id": "oven",
            "label": "فرتوکار"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "cctv",
            "label": "دوربین امنیتی"
          },
          {
            "id": "smart-home",
            "label": "سیستم هوشمند"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof-garden",
            "label": "روف گاردن"
          },
          {
            "id": "pool",
            "label": "استخر"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "suitableFor",
            "title": "مناسب برای",
            "input": "multiSelect",
            "ui": "bottomSheet",
            "options": [
              "خانواده",
              "مجرد",
              "دانشجو",
              "زوج"
            ]
          },
          {
            "key": "totalFloors",
            "title": "تعداد طبقات آپارتمان",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱ طبقه",
              "۲ طبقه",
              "۳ طبقه",
              "۴ طبقه",
              "۵ طبقه",
              "۶ طبقه",
              "۷ طبقه",
              "۸ طبقه و بیشتر"
            ]
          },
          {
            "key": "unitsPerFloor",
            "title": "تعداد واحد در طبقه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱ واحد",
              "۲ واحد",
              "۳ واحد",
              "۴ واحد",
              "۵ واحد",
              "۶ واحد",
              "۷ واحد",
              "۸ واحد",
              "۹ واحد",
              "۱۰ واحد",
              "۱۱ واحد",
              "۱۲ واحد",
              "۱۳ واحد",
              "۱۴ واحد",
              "۱۵ واحد",
              "۱۶ واحد",
              "۱۷ واحد",
              "۱۸ واحد",
              "۱۹ واحد",
              "۲۰ واحد",
              "۲۱ واحد",
              "۲۲ واحد",
              "۲۳ واحد",
              "۲۴ واحد",
              "۲۵ واحد",
              "۲۶ واحد",
              "۲۷ واحد",
              "۲۸ واحد",
              "۲۹ واحد",
              "۳۰ واحد"
            ]
          },
          {
            "key": "unitType",
            "title": "موقعیت ساختمان",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "شمالی",
              "جنوبی",
              "شرقی",
              "غربی",
              "دونبش",
              "سه نبش",
              "دوممر"
            ]
          },
          {
            "key": "unitPosition",
            "title": "موقعیت واحد",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "جلو",
              "عقب",
              "وسط",
              "کنج",
              "دوبلکس",
              "پنت هاوس"
            ]
          },
          {
            "key": "occupancyStatus",
            "title": "وضعیت سکونت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تخلیه",
              "مالک",
              "مستاجر دارد"
            ]
          },
          {
            "key": "readyDeliveryDate",
            "title": "تاریخ آماده تحویل",
            "input": "date"
          },
          {
            "key": "minContractMonths",
            "title": "حداقل مدت قرارداد (ماه)",
            "input": "number",
            "leftText": "ماه",
            "numeric": true
          },
          {
            "key": "petPolicy",
            "title": "حیوان خانگی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "مجاز",
              "غیر مجاز"
            ]
          },
          {
            "key": "kitchenType",
            "title": "نوع آشپزخانه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "اپن",
              "جزیره",
              "بسته",
              "نیمه اپن"
            ]
          },
          {
            "key": "renovated",
            "title": "بازسازی",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "furnished",
            "title": "با لوازم و مبله",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "facadeMaterial",
            "title": "جنس نما",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سنگ",
              "آجر",
              "سیمان",
              "کامپوزیت",
              "شیشه",
              "رومی",
              "ترکیبی"
            ]
          },
          {
            "key": "floorMaterial",
            "title": "جنس کف",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سرامیک",
              "سنگ",
              "پارکت",
              "لمینت",
              "موزاییک",
              "کفپوش"
            ]
          },
          {
            "key": "cabinetMaterial",
            "title": "جنس کابینت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "MDF",
              "های‌گلاس",
              "ممبران",
              "فلزی",
              "چوبی",
              "ندارد"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "meterage",
          "title": "متراژ آپارتمان",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "rentPrice",
          "title": "مبلغ اجاره",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "range",
          "id": "mortgagePrice",
          "title": "مبلغ رهن",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "multi",
          "id": "floor",
          "title": "طبقه",
          "icon": "floor",
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 6,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "multi",
          "id": "suitableFor",
          "title": "مناسب برای",
          "icon": "suitable",
          "options": [
            "شرکت‌ها",
            "مهندسین",
            "بیمه",
            "وکلا",
            "آموزشگاه",
            "خانواده",
            "مجرد",
            "دانشجو",
            "زوج",
            "مطب",
            "موسسه",
            "آتلیه",
            "مزون",
            "اسناد رسمی",
            "دفاتر دولت"
          ],
          "more": true,
          "moreLimit": 5,
          "moreLabel": "مشاهده ۱۰ مورد دیگر",
          "moreIcon": "down"
        },
        {
          "kind": "single",
          "id": "totalFloors",
          "title": "تعداد طبقات آپارتمان",
          "icon": "floor",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 7,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "single",
          "id": "unitsPerFloor",
          "title": "تعداد واحد در طبقه",
          "icon": "floor",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "+۸"
          ]
        },
        {
          "kind": "single",
          "id": "unitType",
          "title": "موقعیت ساختمان",
          "icon": "orientation",
          "options": [
            "شمالی",
            "جنوبی",
            "شرقی",
            "غربی",
            "دونبش",
            "سه نبش",
            "دوممر"
          ]
        },
        {
          "kind": "single",
          "id": "unitPosition",
          "title": "موقعیت واحد",
          "icon": "orientation",
          "options": [
            "جلو",
            "عقب",
            "وسط",
            "کنج",
            "دوبلکس",
            "پنت هاوس"
          ]
        },
        {
          "kind": "single",
          "id": "unitLayout",
          "title": "تیپ واحد",
          "icon": "city02",
          "options": [
            "تک طبقه",
            "دو طبقه",
            "سه طبقه",
            "دوبلکس",
            "فورلکس",
            "پنت هاوس"
          ]
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 15 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "yard",
              "label": "حیاط"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "wardrobe",
              "label": "کمد دیواری"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "gas-stove",
              "label": "گاز رومیزی"
            },
            {
              "id": "hood",
              "label": "هود"
            },
            {
              "id": "oven",
              "label": "فرتوکار"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "pool",
              "label": "استخر"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            }
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "rent-commercial": {
    "$schema": "./types.ts",
    "formCode": "rent-commercial",
    "title": "اجاره واحد تجاری",
    "transaction": "rent",
    "category": "commercial-unit",
    "create": {
      "specsTitle": "مشخصات تجاری",
      "basicFields": [
        {
          "key": "meterage",
          "title": "متراژ",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۴۰",
          "required": true
        },
        {
          "key": "commercialPosition",
          "title": "موقعیت تجاری",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "برخیابان اصلی",
            "داخل پاساژ",
            "داخل کوچه",
            "بازار محله",
            "غرفه"
          ]
        },
        {
          "key": "age",
          "title": "سال ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        },
        {
          "key": "floor",
          "title": "طبقه",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ]
        }
      ],
      "pricing": {
        "mode": "rent",
        "rentConversion": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "iranian",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western",
            "label": "سرویس فرنگی"
          },
          {
            "id": "electric-shutter",
            "label": "کرکره برقی"
          },
          {
            "id": "door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video",
            "label": "آیفون تصویری"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "camera",
            "label": "دوربین امنیتی"
          },
          {
            "id": "bms",
            "label": "سیستم هوشمند"
          },
          {
            "id": "yard",
            "label": "حیاط"
          },
          {
            "id": "single-phase-power",
            "label": "برق تک فاز"
          },
          {
            "id": "three-phase-power",
            "label": "برق سه فاز"
          },
          {
            "id": "water",
            "label": "امتیاز آب"
          },
          {
            "id": "gas",
            "label": "امتیاز گاز"
          },
          {
            "id": "phone",
            "label": "امتیاز تلفن"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "rooms",
            "title": "تعداد اتاق",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "بدون اتاق",
              "۱",
              "۲",
              "۳",
              "۴",
              "۵+"
            ]
          },
          {
            "key": "openingCount",
            "title": "تعداد دهنه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱",
              "۲",
              "۳",
              "۴",
              "۵",
              "۶",
              "۷",
              "۸",
              "۹",
              "۱۰",
              "۱۱",
              "۱۲",
              "۱۳",
              "۱۴",
              "۱۵",
              "۱۶",
              "۱۷",
              "۱۸",
              "۱۹",
              "۲۰"
            ]
          },
          {
            "key": "ceilingHeight",
            "title": "ارتفاع سقف",
            "input": "number",
            "leftText": "متر",
            "numeric": true
          },
          {
            "key": "suitableFor",
            "title": "مناسب برای",
            "input": "multiSelect",
            "ui": "bottomSheet",
            "options": [
              "فروشگاه",
              "تجاری",
              "خدماتی",
              "اداری",
              "صنعتی",
              "آموزشی",
              "درمانی",
              "انباری",
              "همه مشاغل",
              "سایر"
            ]
          },
          {
            "key": "currentStatus",
            "title": "وضعیت فعلی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تخلیه",
              "فعال"
            ]
          },
          {
            "key": "readyDeliveryDate",
            "title": "تاریخ آماده تحویل",
            "input": "date"
          },
          {
            "key": "minContractMonths",
            "title": "حداقل مدت قرارداد (ماه)",
            "input": "number",
            "leftText": "ماه",
            "numeric": true
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "meterage",
          "title": "متراژ",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "rentPrice",
          "title": "مبلغ اجاره",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "range",
          "id": "mortgagePrice",
          "title": "مبلغ رهن",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "single",
          "id": "commercialPosition",
          "title": "موقعیت تجاری",
          "icon": "orientation",
          "options": [
            "بر خیابان اصلی",
            "داخل پاساژ",
            "داخل کوچه",
            "غرفه",
            "مالکیت مشترک",
            "بازار محله"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "multi",
          "id": "floor",
          "title": "طبقه",
          "icon": "floor",
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 6,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "multi",
          "id": "suitableFor",
          "title": "مناسب برای",
          "icon": "suitable",
          "options": [
            "وکلا",
            "مهندسین",
            "مطب",
            "درمانگاه",
            "آموزشگاه",
            "فروشگاه",
            "تجاری",
            "خدماتی",
            "اداری",
            "صنعتی",
            "درمانی",
            "انباری",
            "شرکت ها",
            "موسسه",
            "آتلیه",
            "مزون",
            "اسناد رسمی",
            "دفاتر دولت",
            "همه مشاغل",
            "سایر"
          ],
          "more": true,
          "moreLimit": 6,
          "moreLabel": "مشاهده ۱۴ مورد دیگر",
          "moreIcon": "down"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 6 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "yard",
              "label": "حیاط"
            }
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "rent-factory-workshop": {
    "$schema": "./types.ts",
    "formCode": "rent-factory-workshop",
    "title": "اجاره واحد صنعتی",
    "transaction": "rent",
    "category": "factory-workshop",
    "create": {
      "specsTitle": "مشخصات کارخانه و کارگاه",
      "basicFields": [
        {
          "key": "landArea",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۲۰۰۰",
          "required": true
        },
        {
          "key": "buildingArea",
          "title": "متراژ بنا",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۵۰۰",
          "required": true
        },
        {
          "key": "landPosition",
          "title": "موقعیت زمین",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دوممر",
            "دونبش",
            "سه نبش",
            "چهارنبش"
          ]
        },
        {
          "key": "age",
          "title": "سال ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        }
      ],
      "pricing": {
        "mode": "rent",
        "rentConversion": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "single-phase-power",
            "label": "برق تک فاز"
          },
          {
            "id": "three-phase-power",
            "label": "برق سه فاز"
          },
          {
            "id": "water",
            "label": "امتیاز آب"
          },
          {
            "id": "gas",
            "label": "امتیاز گاز"
          },
          {
            "id": "telephone",
            "label": "امتیاز تلفن"
          },
          {
            "id": "walled",
            "label": "دور دیوار/حصار"
          },
          {
            "id": "old-building",
            "label": "بنا کلنگی"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "well",
            "label": "چاه آب"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "rooms",
            "title": "تعداد اتاق",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "بدون اتاق",
              "۱",
              "۲",
              "۳",
              "۴",
              "۵+"
            ]
          },
          {
            "key": "ceilingHeight",
            "title": "ارتفاع سقف",
            "input": "number",
            "leftText": "متر",
            "numeric": true
          },
          {
            "key": "industrialPropertyType",
            "title": "نوع ملک",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سوله",
              "انبار",
              "کارگاه",
              "کارخانه",
              "گلخانه",
              "سردخانه",
              "گاوداری",
              "مرغداری",
              "سالن صنعتی"
            ]
          },
          {
            "key": "accessType",
            "title": "دست رسی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "جاده آسفالت",
              "جاده خاکی",
              "نزدیک بزرگراه"
            ]
          },
          {
            "key": "currentStatus",
            "title": "وضعیت فعلی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تخلیه",
              "فعال"
            ]
          },
          {
            "key": "commercialLicense",
            "title": "مجوز تجاری",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "دائم",
              "موقت"
            ]
          },
          {
            "key": "readyDeliveryDate",
            "title": "تاریخ آماده تحویل",
            "input": "date"
          },
          {
            "key": "minContractMonths",
            "title": "حداقل مدت قرارداد (ماه)",
            "input": "number",
            "leftText": "ماه",
            "numeric": true
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "buildingArea",
          "title": "متراژ بنا",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "rentPrice",
          "title": "مبلغ اجاره",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "range",
          "id": "mortgagePrice",
          "title": "مبلغ رهن",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "multi",
          "id": "suitableFor",
          "title": "مناسب برای",
          "icon": "suitable",
          "options": [
            "صنایع پلاستیک",
            "صنایع چوب",
            "کارگاه",
            "انبار",
            "تولیدی",
            "سایر"
          ]
        },
        {
          "kind": "single",
          "id": "commercialLicense",
          "title": "مجوز تجاری",
          "icon": "agreement",
          "options": [
            "دائم",
            "موقت",
            "ندارد"
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 3 مورد دیگر",
          "options": [
            {
              "id": "single-phase-power",
              "label": "برق تک فاز"
            },
            {
              "id": "three-phase-power",
              "label": "برق سه فاز"
            },
            {
              "id": "water",
              "label": "امتیاز آب"
            },
            {
              "id": "gas",
              "label": "امتیاز گاز"
            },
            {
              "id": "telephone",
              "label": "امتیاز تلفن"
            },
            {
              "id": "walled",
              "label": "دور دیوار/حصار"
            },
            {
              "id": "old-building",
              "label": "بنا کلنگی"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "well",
              "label": "چاه آب"
            }
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "rent-garden-villa": {
    "$schema": "./types.ts",
    "formCode": "rent-garden-villa",
    "title": "اجاره باغ و ویلا",
    "transaction": "rent",
    "category": "garden-villa",
    "create": {
      "specsTitle": "مشخصات باغ ویلا",
      "basicFields": [
        {
          "key": "landArea",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۵۰۰",
          "required": true
        },
        {
          "key": "buildingArea",
          "title": "متراژ بنا",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۱۲۰",
          "required": true
        },
        {
          "key": "rooms",
          "title": "تعداد اتاق",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵+"
          ]
        },
        {
          "key": "age",
          "title": "سن ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        }
      ],
      "pricing": {
        "mode": "rent",
        "rentConversion": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "yard",
            "label": "حیاط"
          },
          {
            "id": "iranian-toilet",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western-toilet",
            "label": "سرویس فرنگی"
          },
          {
            "id": "wardrobe",
            "label": "کمد دیواری"
          },
          {
            "id": "security-door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video-intercom",
            "label": "آیفون تصویری"
          },
          {
            "id": "gas-stove",
            "label": "گاز رومیزی"
          },
          {
            "id": "hood",
            "label": "هود"
          },
          {
            "id": "oven",
            "label": "فرتوکار"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "cctv",
            "label": "دوربین امنیتی"
          },
          {
            "id": "smart-home",
            "label": "سیستم هوشمند"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof-garden",
            "label": "روف گاردن"
          },
          {
            "id": "pool",
            "label": "استخر"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          },
          {
            "id": "gym",
            "label": "سالن ورزشی"
          },
          {
            "id": "playground",
            "label": "زمین بازی"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "suitableFor",
            "title": "مناسب برای",
            "input": "multiSelect",
            "ui": "bottomSheet",
            "options": [
              "خانواده",
              "برگزاری مراسم",
              "چند خانواده"
            ]
          },
          {
            "key": "landPosition",
            "title": "موقعیت زمین",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "شمالی",
              "جنوبی",
              "غربی",
              "شرقی",
              "دوممر",
              "دونبش",
              "سه نبش",
              "چهارنبش"
            ]
          },
          {
            "key": "buildingType",
            "title": "نوع بنا",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "ویلایی مستقل",
              "شهرکی",
              "آپارتمانی"
            ]
          },
          {
            "key": "villaType",
            "title": "تیپ بنا",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "فلت",
              "تک طبقه",
              "دوبلکس",
              "تریبلکس",
              "خونه باغ"
            ]
          },
          {
            "key": "totalFloors",
            "title": "تعداد طبقات",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱ طبقه",
              "۲ طبقه",
              "۳ طبقه",
              "۴ طبقه",
              "۵ طبقه",
              "۶ طبقه",
              "۷ طبقه",
              "۸ طبقه و بیشتر"
            ]
          },
          {
            "key": "streetWidth",
            "title": "عرض گذر (متر)",
            "input": "number",
            "leftText": "متر",
            "numeric": true
          },
          {
            "key": "petPolicy",
            "title": "حیوان خانگی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "مجاز",
              "غیر مجاز"
            ]
          },
          {
            "key": "kitchenType",
            "title": "نوع آشپزخانه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "اپن",
              "جزیره",
              "بسته",
              "نیمه اپن"
            ]
          },
          {
            "key": "renovated",
            "title": "بازسازی",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "furnished",
            "title": "با لوازم و مبله",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "facadeMaterial",
            "title": "جنس نما",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سنگ",
              "آجر",
              "سیمان",
              "کامپوزیت",
              "شیشه",
              "رومی",
              "ترکیبی"
            ]
          },
          {
            "key": "floorMaterial",
            "title": "جنس کف",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سرامیک",
              "سنگ",
              "پارکت",
              "لمینت",
              "موزاییک",
              "کفپوش"
            ]
          },
          {
            "key": "cabinetMaterial",
            "title": "جنس کابینت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "MDF",
              "های‌گلاس",
              "ممبران",
              "فلزی",
              "چوبی",
              "ندارد"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "landArea",
          "title": "متراژ زمین",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "buildingArea",
          "title": "متراژ بنا",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "rentPrice",
          "title": "مبلغ اجاره",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "range",
          "id": "mortgagePrice",
          "title": "مبلغ رهن",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "multi",
          "id": "suitableFor",
          "title": "مناسب برای",
          "icon": "suitable",
          "options": [
            "خانواده",
            "برگزاری مراسم",
            "چند خانواده",
            "مجرد",
            "دانشجو",
            "زوج",
            "مهمانی",
            "جشن تولد",
            "عروسی",
            "دورهمی",
            "سفر خانوادگی",
            "اقامت گروهی",
            "استراحت"
          ],
          "more": true,
          "moreLimit": 3,
          "moreLabel": "مشاهده ۱۰ مورد دیگر",
          "moreIcon": "down"
        },
        {
          "kind": "single",
          "id": "landPosition",
          "title": "موقعیت زمین",
          "icon": "orientation",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دوممر",
            "دونبش",
            "سه نبش",
            "چهارنبش"
          ]
        },
        {
          "kind": "single",
          "id": "buildingType",
          "title": "نوع بنا",
          "icon": "typeBuilding",
          "options": [
            "ویلایی مستقل",
            "آپارتمانی",
            "شهرکی"
          ]
        },
        {
          "kind": "single",
          "id": "villaType",
          "title": "تیپ بنا",
          "icon": "city02",
          "options": [
            "فلت",
            "تک طبقه",
            "دوبلکس",
            "تریبلکس",
            "خونه باغ"
          ]
        },
        {
          "kind": "single",
          "id": "totalFloors",
          "title": "تعداد طبقات",
          "icon": "floor",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 7,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 17 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "yard",
              "label": "حیاط"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "wardrobe",
              "label": "کمد دیواری"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "gas-stove",
              "label": "گاز رومیزی"
            },
            {
              "id": "hood",
              "label": "هود"
            },
            {
              "id": "oven",
              "label": "فرتوکار"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "pool",
              "label": "استخر"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            },
            {
              "id": "gym",
              "label": "سالن ورزشی"
            },
            {
              "id": "playground",
              "label": "زمین بازی"
            }
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "rent-hotel": {
    "$schema": "./types.ts",
    "formCode": "rent-hotel",
    "title": "اجاره هتل، اقامتگاه",
    "transaction": "rent",
    "category": "hotel-apartment",
    "create": {
      "specsTitle": "مشخصات هتل و اقامتگاه",
      "basicFields": [
        {
          "key": "accommodationType",
          "title": "نوع اقامتگاه",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "هتل",
            "هتل آپارتمان",
            "متل",
            "مسافر خونه",
            "مجتمع توریستی"
          ]
        },
        {
          "key": "hotelStars",
          "title": "رتبه اقامتگاه",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "۱ ستاره",
            "۲ ستاره",
            "۳ ستاره",
            "۴ ستاره",
            "۵ ستاره"
          ]
        },
        {
          "key": "landArea",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۱۰۰۰",
          "required": true
        },
        {
          "key": "buildingArea",
          "title": "متراژ بنا",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۲۰۰۰",
          "required": true
        },
        {
          "key": "age",
          "title": "سن ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        }
      ],
      "pricing": {
        "mode": "rent",
        "rentConversion": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "iranian-toilet",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western-toilet",
            "label": "سرویس فرنگی"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof-garden",
            "label": "روف گاردن"
          },
          {
            "id": "outdoor-pool",
            "label": "استخر روباز"
          },
          {
            "id": "indoor-pool",
            "label": "استخر سرپوشیده"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          },
          {
            "id": "gym",
            "label": "سالن ورزشی"
          },
          {
            "id": "cinema",
            "label": "سینما"
          },
          {
            "id": "cafe",
            "label": "کافی شاپ"
          },
          {
            "id": "restaurant",
            "label": "رستوران"
          },
          {
            "id": "shop",
            "label": "فروشگاه"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "landPosition",
            "title": "موقعیت زمین",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "شمالی",
              "جنوبی",
              "غربی",
              "شرقی",
              "دوممر",
              "دونبش",
              "سه نبش",
              "چهارنبش"
            ]
          },
          {
            "key": "totalFloors",
            "title": "تعداد طبقات",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱ طبقه",
              "۲ طبقه",
              "۳ طبقه",
              "۴ طبقه",
              "۵ طبقه",
              "۶ طبقه",
              "۷ طبقه",
              "۸ طبقه و بیشتر"
            ]
          },
          {
            "key": "singleRoomCount",
            "title": "تعداد اتاق یک تخته",
            "input": "number",
            "numeric": true
          },
          {
            "key": "doubleRoomCount",
            "title": "تعداد اتاق دو تخته",
            "input": "number",
            "numeric": true
          },
          {
            "key": "suiteCount",
            "title": "تعداد سوییت ها",
            "input": "number",
            "numeric": true
          },
          {
            "key": "renovated",
            "title": "بازسازی شده",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "furnished",
            "title": "با لوازم و مبله",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "floorMaterial",
            "title": "جنس کف",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سرامیک",
              "سنگ",
              "پارکت",
              "لمینت",
              "موزاییک",
              "کفپوش"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "buildingArea",
          "title": "متراژ بنا",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "landArea",
          "title": "متراژ زمین",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "single",
          "id": "hotelStars",
          "title": "رتبه اقامتگاه",
          "icon": "star",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷"
          ]
        },
        {
          "kind": "single",
          "id": "accommodationType",
          "title": "نوع اقامتگاه",
          "icon": "building",
          "options": [
            "هتل",
            "هتل آپارتمان",
            "متل",
            "مسافر خونه",
            "مجتمع توریستی"
          ]
        },
        {
          "kind": "range",
          "id": "rentPrice",
          "title": "مبلغ اجاره",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "range",
          "id": "mortgagePrice",
          "title": "مبلغ رهن",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "single",
          "id": "totalFloors",
          "title": "تعداد طبقات",
          "icon": "floor",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ]
        },
        {
          "kind": "single",
          "id": "landPosition",
          "title": "موقعیت زمین",
          "icon": "orientation",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دوممر",
            "دونبش",
            "سه نبش",
            "چهارنبش"
          ]
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 10 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "outdoor-pool",
              "label": "استخر روباز"
            },
            {
              "id": "indoor-pool",
              "label": "استخر سرپوشیده"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            },
            {
              "id": "gym",
              "label": "سالن ورزشی"
            },
            {
              "id": "cinema",
              "label": "سینما"
            },
            {
              "id": "coffee-shop",
              "label": "کافی شاپ"
            },
            {
              "id": "restaurant",
              "label": "رستوران"
            },
            {
              "id": "shop",
              "label": "فروشگاه"
            }
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "rent-office": {
    "$schema": "./types.ts",
    "formCode": "rent-office",
    "title": "اجاره واحد اداری",
    "transaction": "rent",
    "category": "office",
    "create": {
      "specsTitle": "مشخصات اداری",
      "basicFields": [
        {
          "key": "meterage",
          "title": "متراژ",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۷۵",
          "required": true
        },
        {
          "key": "floor",
          "title": "طبقه",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ]
        },
        {
          "key": "rooms",
          "title": "تعداد اتاق",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵+"
          ]
        },
        {
          "key": "age",
          "title": "سال ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        }
      ],
      "pricing": {
        "mode": "rent",
        "rentConversion": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "yard",
            "label": "حیاط"
          },
          {
            "id": "iranian",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western",
            "label": "سرویس فرنگی"
          },
          {
            "id": "wardrobe",
            "label": "کمد دیواری"
          },
          {
            "id": "door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video",
            "label": "آیفون تصویری"
          },
          {
            "id": "gas-stove",
            "label": "گاز رومیزی"
          },
          {
            "id": "hood",
            "label": "هود"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "camera",
            "label": "دوربین امنیتی"
          },
          {
            "id": "bms",
            "label": "سیستم هوشمند"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof",
            "label": "روف گاردن"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "suitableFor",
            "title": "مناسب برای",
            "input": "multiSelect",
            "ui": "bottomSheet",
            "options": [
              "تجاری",
              "خدماتی",
              "اداری",
              "صنعتی",
              "آموزشی",
              "درمانی",
              "انباری",
              "مهندسین",
              "شرکت ها",
              "وکلا",
              "مطب",
              "موسسه",
              "آموزشگاه",
              "آتلیه",
              "مزون",
              "اسناد رسمی",
              "دفاتر دولت",
              "صنایع",
              "خدماتی",
              "ورزشی",
              "فرهنگی",
              "مذهبی",
              "همه مشاغل"
            ]
          },
          {
            "key": "officePosition",
            "title": "موقعیت اداری",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "مجتمع اداری",
              "برج اداری",
              "برخیابان اصلی",
              "موقعیت مسکونی",
              "مجتمع پزشکان"
            ]
          },
          {
            "key": "currentStatus",
            "title": "وضعیت فعلی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تخلیه",
              "فعال"
            ]
          },
          {
            "key": "readyDeliveryDate",
            "title": "تاریخ آماده تحویل",
            "input": "date"
          },
          {
            "key": "minContractMonths",
            "title": "حداقل مدت قرارداد (ماه)",
            "input": "number",
            "leftText": "ماه",
            "numeric": true
          },
          {
            "key": "officeDocumentType",
            "title": "سند اداری",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "دائم",
              "موقت"
            ]
          },
          {
            "key": "managementRoom",
            "title": "اتاق مدیریت",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "conferenceRoom",
            "title": "اتاق کنفرانس",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "receptionHall",
            "title": "سالن پذیرش",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "signboard",
            "title": "تابلو خور",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "kitchen",
            "title": "آشپزخانه",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "separateEntrance",
            "title": "ورودی مجزا",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "renovated",
            "title": "بازسازی شده",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "furnished",
            "title": "با لوازم و مبله",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "hasDocument",
            "title": "سند",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "facadeMaterial",
            "title": "جنس نما",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سنگ",
              "آجر",
              "سیمان",
              "کامپوزیت",
              "شیشه",
              "رومی",
              "ترکیبی"
            ]
          },
          {
            "key": "floorMaterial",
            "title": "جنس کف",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سرامیک",
              "سنگ",
              "پارکت",
              "لمینت",
              "موزاییک",
              "کفپوش"
            ]
          },
          {
            "key": "cabinetMaterial",
            "title": "جنس کابینت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "MDF",
              "های‌گلاس",
              "ممبران",
              "فلزی",
              "چوبی",
              "ندارد"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "meterage",
          "title": "متراژ",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "rentPrice",
          "title": "مبلغ اجاره",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "range",
          "id": "mortgagePrice",
          "title": "مبلغ رهن",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "multi",
          "id": "floor",
          "title": "طبقه",
          "icon": "floor",
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 6,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "multi",
          "id": "suitableFor",
          "title": "مناسب برای",
          "icon": "suitable",
          "options": [
            "تجاری",
            "خدماتی",
            "اداری",
            "صنعتی",
            "آموزشی",
            "درمانی",
            "انباری",
            "مهندسین",
            "شرکت ها",
            "وکلا",
            "مطب",
            "موسسه",
            "آموزشگاه",
            "آتلیه",
            "مزون",
            "اسناد رسمی",
            "دفاتر دولت",
            "ورزشی",
            "فرهنگی",
            "همه مشاغل"
          ],
          "more": true,
          "moreLimit": 5,
          "moreLabel": "مشاهده ۱۰ مورد دیگر",
          "moreIcon": "down"
        },
        {
          "kind": "single",
          "id": "currentStatus",
          "title": "وضعیت فعلی",
          "icon": "settings",
          "options": [
            "تخلیه",
            "فعال",
            "درحال بازسازی"
          ]
        },
        {
          "kind": "single",
          "id": "officePosition",
          "title": "موقعیت اداری",
          "icon": "orientation",
          "options": [
            "مجتمع اداری",
            "برج اداری",
            "بر خیابان اصلی",
            "موقعیت مسکونی",
            "مجتمع پزشکان"
          ]
        },
        {
          "kind": "single",
          "id": "officeDocumentType",
          "title": "سند اداری",
          "icon": "agreement",
          "options": [
            "دائم",
            "موقت"
          ]
        },
        {
          "kind": "toggle",
          "id": "hasOfficeDocument",
          "title": "سند اداری"
        },
        {
          "kind": "toggle",
          "id": "managementRoom",
          "title": "اتاق مدیریت"
        },
        {
          "kind": "toggle",
          "id": "conferenceRoom",
          "title": "اتاق کنفرانس"
        },
        {
          "kind": "toggle",
          "id": "receptionHall",
          "title": "سالن پذیرش"
        },
        {
          "kind": "toggle",
          "id": "signboard",
          "title": "تابلو خور"
        },
        {
          "kind": "toggle",
          "id": "separateEntrance",
          "title": "ورودی مجزا"
        },
        {
          "kind": "toggle",
          "id": "kitchen",
          "title": "آشپزخانه"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 15 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "yard",
              "label": "حیاط"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "wardrobe",
              "label": "کمد دیواری"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "gas-stove",
              "label": "گاز رومیزی"
            },
            {
              "id": "hood",
              "label": "هود"
            },
            {
              "id": "oven",
              "label": "فرتوکار"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "pool",
              "label": "استخر"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            }
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "rent-villa-house": {
    "$schema": "./types.ts",
    "formCode": "rent-villa-house",
    "title": "اجاره خانه، ویلا",
    "transaction": "rent",
    "category": "villa-house",
    "create": {
      "specsTitle": "مشخصات بنا",
      "basicFields": [
        {
          "key": "landArea",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۲۵۰",
          "required": true
        },
        {
          "key": "buildingArea",
          "title": "متراژ بنا",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۱۲۰",
          "required": true
        },
        {
          "key": "rooms",
          "title": "تعداد اتاق",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵+"
          ]
        },
        {
          "key": "age",
          "title": "سن ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        }
      ],
      "pricing": {
        "mode": "rent",
        "rentConversion": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "yard",
            "label": "حیاط"
          },
          {
            "id": "iranian-toilet",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western-toilet",
            "label": "سرویس فرنگی"
          },
          {
            "id": "wardrobe",
            "label": "کمد دیواری"
          },
          {
            "id": "security-door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video-intercom",
            "label": "آیفون تصویری"
          },
          {
            "id": "gas-stove",
            "label": "گاز رومیزی"
          },
          {
            "id": "hood",
            "label": "هود"
          },
          {
            "id": "oven",
            "label": "فرتوکار"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "cctv",
            "label": "دوربین امنیتی"
          },
          {
            "id": "smart-home",
            "label": "سیستم هوشمند"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof-garden",
            "label": "روف گاردن"
          },
          {
            "id": "pool",
            "label": "استخر"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          },
          {
            "id": "gym",
            "label": "سالن ورزشی"
          },
          {
            "id": "playground",
            "label": "زمین بازی"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "suitableFor",
            "title": "مناسب برای",
            "input": "multiSelect",
            "ui": "bottomSheet",
            "options": [
              "خانواده",
              "برگزاری مراسم",
              "چند خانواده"
            ]
          },
          {
            "key": "landPosition",
            "title": "موقعیت زمین",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "شمالی",
              "جنوبی",
              "غربی",
              "شرقی",
              "دوممر",
              "دونبش",
              "سه نبش",
              "چهارنبش"
            ]
          },
          {
            "key": "buildingType",
            "title": "نوع بنا",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "ویلایی مستقل",
              "شهرکی",
              "آپارتمانی"
            ]
          },
          {
            "key": "villaType",
            "title": "تیپ بنا",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "فلت",
              "تک طبقه",
              "دوبلکس",
              "تریبلکس",
              "خونه باغ"
            ]
          },
          {
            "key": "totalFloors",
            "title": "تعداد طبقات",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱ طبقه",
              "۲ طبقه",
              "۳ طبقه",
              "۴ طبقه",
              "۵ طبقه",
              "۶ طبقه",
              "۷ طبقه",
              "۸ طبقه و بیشتر"
            ]
          },
          {
            "key": "streetWidth",
            "title": "عرض گذر (متر)",
            "input": "number",
            "leftText": "متر",
            "numeric": true
          },
          {
            "key": "petPolicy",
            "title": "حیوان خانگی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "مجاز",
              "غیر مجاز"
            ]
          },
          {
            "key": "kitchenType",
            "title": "نوع آشپزخانه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "اپن",
              "جزیره",
              "بسته",
              "نیمه اپن"
            ]
          },
          {
            "key": "renovated",
            "title": "بازسازی",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "furnished",
            "title": "با لوازم و مبله",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "facadeMaterial",
            "title": "جنس نما",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سنگ",
              "آجر",
              "سیمان",
              "کامپوزیت",
              "شیشه",
              "رومی",
              "ترکیبی"
            ]
          },
          {
            "key": "floorMaterial",
            "title": "جنس کف",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سرامیک",
              "سنگ",
              "پارکت",
              "لمینت",
              "موزاییک",
              "کفپوش"
            ]
          },
          {
            "key": "cabinetMaterial",
            "title": "جنس کابینت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "MDF",
              "های‌گلاس",
              "ممبران",
              "فلزی",
              "چوبی",
              "ندارد"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "landArea",
          "title": "متراژ زمین",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "buildingArea",
          "title": "متراژ بنا",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "rentPrice",
          "title": "مبلغ اجاره",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "range",
          "id": "mortgagePrice",
          "title": "مبلغ رهن",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "multi",
          "id": "suitableFor",
          "title": "مناسب برای",
          "icon": "suitable",
          "options": [
            "خانواده",
            "برگزاری مراسم",
            "چند خانواده",
            "مجرد",
            "دانشجو",
            "زوج",
            "مهمانی",
            "جشن تولد",
            "عروسی",
            "دورهمی",
            "سفر خانوادگی",
            "اقامت گروهی",
            "استراحت"
          ],
          "more": true,
          "moreLimit": 3,
          "moreLabel": "مشاهده ۱۰ مورد دیگر",
          "moreIcon": "down"
        },
        {
          "kind": "single",
          "id": "landPosition",
          "title": "موقعیت زمین",
          "icon": "orientation",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دوممر",
            "دونبش",
            "سه نبش",
            "چهارنبش"
          ]
        },
        {
          "kind": "single",
          "id": "buildingType",
          "title": "نوع بنا",
          "icon": "typeBuilding",
          "options": [
            "ویلایی مستقل",
            "آپارتمانی",
            "شهرکی"
          ]
        },
        {
          "kind": "single",
          "id": "villaType",
          "title": "تیپ بنا",
          "icon": "city02",
          "options": [
            "فلت",
            "تک طبقه",
            "دوبلکس",
            "تریبلکس",
            "خونه باغ"
          ]
        },
        {
          "kind": "single",
          "id": "totalFloors",
          "title": "تعداد طبقات",
          "icon": "floor",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 7,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 17 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "yard",
              "label": "حیاط"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "wardrobe",
              "label": "کمد دیواری"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "gas-stove",
              "label": "گاز رومیزی"
            },
            {
              "id": "hood",
              "label": "هود"
            },
            {
              "id": "oven",
              "label": "فرتوکار"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "pool",
              "label": "استخر"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            },
            {
              "id": "gym",
              "label": "سالن ورزشی"
            },
            {
              "id": "playground",
              "label": "زمین بازی"
            }
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "rent-warehouse": {
    "$schema": "./types.ts",
    "formCode": "rent-warehouse",
    "title": "اجاره انبار و سوله",
    "transaction": "rent",
    "category": "warehouse",
    "create": {
      "specsTitle": "مشخصات انبار و سوله",
      "basicFields": [
        {
          "key": "landArea",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۱۰۰۰",
          "required": true
        },
        {
          "key": "buildingArea",
          "title": "متراژ بنا",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۴۰۰",
          "required": true
        },
        {
          "key": "ceilingHeight",
          "title": "ارتفاع سقف",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر",
          "placeholder": "مثلا ۵"
        },
        {
          "key": "age",
          "title": "سال ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        }
      ],
      "pricing": {
        "mode": "rent",
        "rentConversion": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "single-phase-power",
            "label": "برق تک فاز"
          },
          {
            "id": "three-phase-power",
            "label": "برق سه فاز"
          },
          {
            "id": "water",
            "label": "امتیاز آب"
          },
          {
            "id": "gas",
            "label": "امتیاز گاز"
          },
          {
            "id": "telephone",
            "label": "امتیاز تلفن"
          },
          {
            "id": "walled",
            "label": "دور دیوار/حصار"
          },
          {
            "id": "old-building",
            "label": "بنا کلنگی"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "well",
            "label": "چاه آب"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "rooms",
            "title": "تعداد اتاق",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "بدون اتاق",
              "۱",
              "۲",
              "۳",
              "۴",
              "۵+"
            ]
          },
          {
            "key": "accessType",
            "title": "دست رسی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "جاده آسفالت",
              "جاده خاکی",
              "نزدیک بزرگراه"
            ]
          },
          {
            "key": "currentStatus",
            "title": "وضعیت فعلی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تخلیه",
              "فعال"
            ]
          },
          {
            "key": "readyDeliveryDate",
            "title": "تاریخ آماده تحویل",
            "input": "date"
          },
          {
            "key": "minContractMonths",
            "title": "حداقل مدت قرارداد (ماه)",
            "input": "number",
            "leftText": "ماه",
            "numeric": true
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "buildingArea",
          "title": "متراژ بنا",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "rentPrice",
          "title": "مبلغ اجاره",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "range",
          "id": "mortgagePrice",
          "title": "مبلغ رهن",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "multi",
          "id": "suitableFor",
          "title": "مناسب برای",
          "icon": "suitable",
          "options": [
            "صنایع پلاستیک",
            "صنایع چوب",
            "کارگاه",
            "انبار",
            "تولیدی",
            "سایر"
          ]
        },
        {
          "kind": "single",
          "id": "commercialLicense",
          "title": "مجوز تجاری",
          "icon": "agreement",
          "options": [
            "دائم",
            "موقت",
            "ندارد"
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 3 مورد دیگر",
          "options": [
            {
              "id": "single-phase-power",
              "label": "برق تک فاز"
            },
            {
              "id": "three-phase-power",
              "label": "برق سه فاز"
            },
            {
              "id": "water",
              "label": "امتیاز آب"
            },
            {
              "id": "gas",
              "label": "امتیاز گاز"
            },
            {
              "id": "telephone",
              "label": "امتیاز تلفن"
            },
            {
              "id": "walled",
              "label": "دور دیوار/حصار"
            },
            {
              "id": "old-building",
              "label": "بنا کلنگی"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "well",
              "label": "چاه آب"
            }
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "sale-apartment": {
    "$schema": "./types.ts",
    "formCode": "sale-apartment",
    "title": "فروش آپارتمان",
    "transaction": "sale",
    "category": "apartment",
    "create": {
      "specsTitle": "مشخصات آپارتمان",
      "basicFields": [
        {
          "key": "meterage",
          "title": "متراژ آپارتمان",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۸۵",
          "required": true
        },
        {
          "key": "floor",
          "title": "طبقه",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ]
        },
        {
          "key": "rooms",
          "title": "تعداد اتاق",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵+"
          ]
        },
        {
          "key": "age",
          "title": "سن ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        }
      ],
      "pricing": {
        "mode": "sale",
        "loan": true,
        "exchange": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "yard",
            "label": "حیاط"
          },
          {
            "id": "iranian",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western",
            "label": "سرویس فرنگی"
          },
          {
            "id": "wardrobe",
            "label": "کمد دیواری"
          },
          {
            "id": "door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video",
            "label": "آیفون تصویری"
          },
          {
            "id": "gas-stove",
            "label": "گاز رومیزی"
          },
          {
            "id": "hood",
            "label": "هود"
          },
          {
            "id": "oven",
            "label": "فر توکار"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "camera",
            "label": "دوربین امنیتی"
          },
          {
            "id": "bms",
            "label": "سیستم هوشمند"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof",
            "label": "روف گاردن"
          },
          {
            "id": "pool",
            "label": "استخر"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "totalFloors",
            "title": "تعداد طبقات آپارتمان",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱ طبقه",
              "۲ طبقه",
              "۳ طبقه",
              "۴ طبقه",
              "۵ طبقه",
              "۶ طبقه",
              "۷ طبقه",
              "۸ طبقه و بیشتر"
            ]
          },
          {
            "key": "unitsPerFloor",
            "title": "تعداد واحد در طبقه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱ واحد",
              "۲ واحد",
              "۳ واحد",
              "۴ واحد",
              "۵ واحد",
              "۶ واحد",
              "۷ واحد",
              "۸ واحد",
              "۹ واحد",
              "۱۰ واحد",
              "۱۱ واحد",
              "۱۲ واحد",
              "۱۳ واحد",
              "۱۴ واحد",
              "۱۵ واحد",
              "۱۶ واحد",
              "۱۷ واحد",
              "۱۸ واحد",
              "۱۹ واحد",
              "۲۰ واحد",
              "۲۱ واحد",
              "۲۲ واحد",
              "۲۳ واحد",
              "۲۴ واحد",
              "۲۵ واحد",
              "۲۶ واحد",
              "۲۷ واحد",
              "۲۸ واحد",
              "۲۹ واحد",
              "۳۰ واحد"
            ]
          },
          {
            "key": "unitType",
            "title": "موقعیت ساختمان",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "شمالی",
              "جنوبی",
              "شرقی",
              "غربی",
              "دونبش",
              "سه نبش",
              "دوممر"
            ]
          },
          {
            "key": "unitPosition",
            "title": "موقعیت واحد",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "جلو",
              "عقب",
              "وسط",
              "کنج",
              "دوبلکس",
              "پنت هاوس"
            ]
          },
          {
            "key": "documentType",
            "title": "سند",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تک برگ",
              "منگوله دار",
              "آستانه",
              "اوقافی",
              "موقوفه",
              "وکالت محضری",
              "قولنامه",
              "مشاع",
              "در دست اقدام",
              "آماده انتقال"
            ]
          },
          {
            "key": "occupancyStatus",
            "title": "وضعیت سکونت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تخلیه",
              "مالک",
              "مستاجر دارد"
            ]
          },
          {
            "key": "kitchenType",
            "title": "نوع آشپزخانه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "اپن",
              "جزیره",
              "بسته",
              "نیمه اپن"
            ]
          },
          {
            "key": "renovated",
            "title": "بازسازی",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "furnished",
            "title": "با لوازم و مبله",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "facadeMaterial",
            "title": "جنس نما",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سنگ",
              "آجر",
              "سیمان",
              "کامپوزیت",
              "شیشه",
              "رومی",
              "ترکیبی"
            ]
          },
          {
            "key": "floorMaterial",
            "title": "جنس کف",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سرامیک",
              "سنگ",
              "پارکت",
              "لمینت",
              "موزاییک",
              "کفپوش"
            ]
          },
          {
            "key": "cabinetMaterial",
            "title": "جنس کابینت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "MDF",
              "های‌گلاس",
              "ممبران",
              "فلزی",
              "چوبی",
              "ندارد"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "meterage",
          "title": "متراژ",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "price",
          "title": "قیمت",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "loan"
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "multi",
          "id": "floor",
          "title": "طبقه",
          "icon": "floor",
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 6,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "single",
          "id": "unitsPerFloor",
          "title": "تعداد واحد در طبقه",
          "icon": "floor",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "+۸"
          ]
        },
        {
          "kind": "single",
          "id": "documentType",
          "title": "نوع سند",
          "icon": "agreement",
          "options": [
            "تک برگ",
            "منگوله‌دار",
            "آستانه",
            "اوقافی",
            "موقوفه",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        },
        {
          "kind": "single",
          "id": "unitType",
          "title": "موقعیت ساختمان",
          "icon": "orientation",
          "options": [
            "شمالی",
            "جنوبی",
            "شرقی",
            "غربی",
            "دونبش",
            "سه نبش",
            "دوممر"
          ]
        },
        {
          "kind": "single",
          "id": "unitPosition",
          "title": "موقعیت واحد",
          "icon": "orientation",
          "options": [
            "جلو",
            "عقب",
            "وسط",
            "کنج",
            "دوبلکس",
            "پنت هاوس"
          ]
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش ۵ مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش ۱۵ مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "yard",
              "label": "حیاط"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "wardrobe",
              "label": "کمد دیواری"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "gas-stove",
              "label": "گاز رومیزی"
            },
            {
              "id": "hood",
              "label": "هود"
            },
            {
              "id": "oven",
              "label": "فرتوکار"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "pool",
              "label": "استخر"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "exchangeWith",
          "title": "معاوضه با",
          "icon": "exchange",
          "options": [
            "ویلا",
            "خودرو",
            "آپارتمان",
            "خانه ویلایی",
            "زمین",
            "دفتر کار / اداری",
            "مغازه و تجاری",
            "سایر"
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "sale-commercial": {
    "$schema": "./types.ts",
    "formCode": "sale-commercial",
    "title": "فروش واحد تجاری",
    "transaction": "sale",
    "category": "commercial-unit",
    "create": {
      "specsTitle": "مشخصات تجاری",
      "basicFields": [
        {
          "key": "meterage",
          "title": "متراژ",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۴۰",
          "required": true
        },
        {
          "key": "commercialPosition",
          "title": "موقعیت تجاری",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "برخیابان اصلی",
            "داخل پاساژ",
            "داخل کوچه",
            "بازار محله",
            "غرفه"
          ]
        },
        {
          "key": "documentType",
          "title": "سند",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "تک برگ",
            "منگوله دار",
            "سرقفلی",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        },
        {
          "key": "ownershipStatus",
          "title": "وضعیت مالکیت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "مالکیت کامل",
            "فقط سرقفلی",
            "فقط مالکیت",
            "مالکیت مشترک"
          ]
        }
      ],
      "pricing": {
        "mode": "sale",
        "loan": true,
        "exchange": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن‌کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "iranian-toilet",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western-toilet",
            "label": "سرویس فرنگی"
          },
          {
            "id": "security-door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video-intercom",
            "label": "آیفون تصویری"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "cctv",
            "label": "دوربین امنیتی"
          },
          {
            "id": "smart-home",
            "label": "سیستم هوشمند"
          },
          {
            "id": "yard",
            "label": "حیاط"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "age",
            "title": "سال ساخت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "نوساز",
              "۱ سال",
              "۲ سال",
              "۳ سال",
              "۴ سال",
              "۵ سال",
              "۶ سال",
              "۷ سال",
              "۸ سال",
              "۹ سال",
              "۱۰ سال",
              "۱۱ سال",
              "۱۲ سال",
              "۱۳ سال",
              "۱۴ سال",
              "۱۵ سال",
              "۱۶ سال",
              "۱۷ سال",
              "۱۸ سال",
              "۱۹ سال",
              "۲۰ سال",
              "بیشتر از ۲۰ سال"
            ]
          },
          {
            "key": "floor",
            "title": "طبقه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "همکف",
              "۱",
              "۲",
              "۳",
              "۴",
              "۵",
              "۶",
              "۷",
              "۸ و بیشتر"
            ]
          },
          {
            "key": "totalFloors",
            "title": "تعداد کل طبقات",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱ طبقه",
              "۲ طبقه",
              "۳ طبقه",
              "۴ طبقه",
              "۵ طبقه",
              "۶ طبقه",
              "۷ طبقه",
              "۸ طبقه و بیشتر"
            ]
          },
          {
            "key": "rooms",
            "title": "تعداد اتاق",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "بدون اتاق",
              "۱",
              "۲",
              "۳",
              "۴",
              "۵+"
            ]
          },
          {
            "key": "suitableFor",
            "title": "مناسب برای",
            "input": "multiSelect",
            "ui": "bottomSheet",
            "options": [
              "فروشگاه",
              "تجاری",
              "خدماتی",
              "اداری",
              "صنعتی",
              "آموزشی",
              "درمانی",
              "انباری",
              "همه مشاغل"
            ]
          },
          {
            "key": "commercialLicense",
            "title": "مجوز تجاری",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "دائم",
              "موقت"
            ]
          },
          {
            "key": "currentStatus",
            "title": "وضعیت فعلی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تخلیه",
              "فعال"
            ]
          },
          {
            "key": "openingCount",
            "title": "تعداد دهنه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱",
              "۲",
              "۳",
              "۴",
              "۵",
              "۶",
              "۷",
              "۸",
              "۹",
              "۱۰",
              "۱۱",
              "۱۲",
              "۱۳",
              "۱۴",
              "۱۵",
              "۱۶",
              "۱۷",
              "۱۸",
              "۱۹",
              "۲۰"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "meterage",
          "title": "متراژ",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "price",
          "title": "قیمت",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "single",
          "id": "documentType",
          "title": "نوع سند",
          "icon": "agreement",
          "options": [
            "تک برگ",
            "منگوله دار",
            "سرقفلی",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        },
        {
          "kind": "single",
          "id": "commercialPosition",
          "title": "موقعیت تجاری",
          "icon": "orientation",
          "options": [
            "بر خیابان اصلی",
            "داخل پاساژ",
            "داخل کوچه",
            "غرفه",
            "مالکیت مشترک",
            "بازار محله"
          ]
        },
        {
          "kind": "single",
          "id": "ownershipStatus",
          "title": "وضعیت مالکیت",
          "icon": "settings",
          "options": [
            "مالکیت کامل",
            "فقط سرقفلی",
            "فقط مالکیت",
            "مالکیت مشترک"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "multi",
          "id": "floor",
          "title": "طبقه",
          "icon": "floor",
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 6,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "single",
          "id": "totalFloors",
          "title": "تعداد کل طبقات",
          "icon": "floor",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 7,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "multi",
          "id": "suitableFor",
          "title": "مناسب برای",
          "icon": "suitable",
          "options": [
            "پوشاک",
            "متفرقه",
            "کترینگ",
            "ابزار آلات",
            "آشپزخانه",
            "کیف و کفش",
            "سوپر مارکت",
            "موبایل و لوازم جانبی",
            "لوازم خانگی",
            "طلا و جواهر",
            "ساعت",
            "عطر و ادکلن",
            "آرایشی و بهداشتی",
            "داروخانه",
            "تجهیزات پزشکی",
            "عینک",
            "کتاب و لوازم تحریر",
            "اسباب بازی",
            "لوازم ورزشی",
            "دوچرخه و موتورسیکلت",
            "قطعات خودرو",
            "لوازم یدکی",
            "خدمات خودرو",
            "رستوران",
            "کافه",
            "فست فود",
            "نانوایی",
            "قنادی",
            "میوه و تره بار",
            "پروتئینی",
            "لبنیات",
            "خشکبار",
            "گل فروشی",
            "مبلمان",
            "فرش و موکت",
            "دکوراسیون",
            "پرده",
            "روشنایی",
            "الکتریکی",
            "تاسیسات",
            "مصالح ساختمانی",
            "ابزارآلات صنعتی",
            "چاپ و تبلیغات",
            "آتلیه",
            "سالن زیبایی",
            "خیاطی",
            "آموزشگاه",
            "دفتر خدماتی",
            "بیمه",
            "بانک و موسسه مالی",
            "املاک",
            "وکلا",
            "مطب"
          ],
          "more": true,
          "moreLimit": 7,
          "moreLabel": "مشاهده ۴۶ مورد دیگر",
          "moreIcon": "left"
        },
        {
          "kind": "single",
          "id": "commercialLicense",
          "title": "مجوز تجاری",
          "icon": "agreement",
          "options": [
            "دائم",
            "موقت"
          ]
        },
        {
          "kind": "single",
          "id": "currentStatus",
          "title": "وضعیت فعلی",
          "icon": "settings",
          "options": [
            "تخلیه",
            "فعال"
          ]
        },
        {
          "kind": "loan"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 6 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "yard",
              "label": "حیاط"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "exchangeWith",
          "title": "معاوضه با",
          "icon": "exchange",
          "options": [
            "ویلا",
            "خودرو",
            "آپارتمان",
            "خانه ویلایی",
            "زمین",
            "دفتر کار / اداری",
            "مغازه و تجاری",
            "سایر"
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "sale-factory": {
    "$schema": "./types.ts",
    "formCode": "sale-factory",
    "title": "فروش واحد صنعتی",
    "transaction": "sale",
    "category": "factory-workshop",
    "create": {
      "specsTitle": "مشخصات کارخانه و کارگاه",
      "basicFields": [
        {
          "key": "landArea",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۲۰۰۰",
          "required": true
        },
        {
          "key": "landPosition",
          "title": "موقعیت زمین",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دوممر",
            "دونبش",
            "سه نبش",
            "چهارنبش"
          ]
        },
        {
          "key": "age",
          "title": "سال ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        },
        {
          "key": "documentType",
          "title": "سند",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "تک برگ",
            "منگوله دار",
            "آستانه",
            "اوقافی",
            "موقوفه",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        }
      ],
      "pricing": {
        "mode": "sale",
        "loan": true,
        "exchange": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن‌کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "single-phase-power",
            "label": "برق تک فاز"
          },
          {
            "id": "three-phase-power",
            "label": "برق سه فاز"
          },
          {
            "id": "water",
            "label": "امتیاز آب"
          },
          {
            "id": "gas",
            "label": "امتیاز گاز"
          },
          {
            "id": "telephone",
            "label": "امتیاز تلفن"
          },
          {
            "id": "walled",
            "label": "دور دیوار/حصار"
          },
          {
            "id": "old-building",
            "label": "بنا کلنگی"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "well",
            "label": "چاه آب"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "rooms",
            "title": "تعداد اتاق",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "بدون اتاق",
              "۱",
              "۲",
              "۳",
              "۴",
              "۵+"
            ]
          },
          {
            "key": "meterage",
            "title": "متراژ بنا",
            "input": "number",
            "leftText": "متر مربع",
            "numeric": true
          },
          {
            "key": "ceilingHeight",
            "title": "ارتفاع سقف",
            "input": "number",
            "leftText": "متر",
            "numeric": true
          },
          {
            "key": "industrialPropertyType",
            "title": "نوع ملک",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سوله",
              "انبار",
              "کارگاه",
              "کارخانه",
              "گلخانه",
              "گاوداری",
              "مرغداری"
            ]
          },
          {
            "key": "accessType",
            "title": "دست رسی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "جاده آسفالت",
              "جاده خاکی",
              "نزدیک بزرگراه"
            ]
          },
          {
            "key": "currentStatus",
            "title": "وضعیت فعلی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تخلیه",
              "فعال"
            ]
          },
          {
            "key": "commercialLicense",
            "title": "مجوز تجاری",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "دائم",
              "موقت"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "landArea",
          "title": "متراژ زمین",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "buildingArea",
          "title": "متراژ بنا",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "price",
          "title": "قیمت",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "single",
          "id": "landPosition",
          "title": "موقعیت زمین",
          "icon": "orientation",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دوممر",
            "دونبش",
            "سه نبش",
            "چهارنبش"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "single",
          "id": "documentType",
          "title": "نوع سند",
          "icon": "agreement",
          "options": [
            "تک برگ",
            "منگوله‌دار",
            "آستانه",
            "اوقافی",
            "موقوفه",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "single",
          "id": "industrialPropertyType",
          "title": "نوع ملک",
          "icon": "building",
          "options": [
            "سوله",
            "انبار",
            "کارگاه",
            "کارخانه",
            "گلخانه",
            "گاوداری",
            "مرغداری"
          ]
        },
        {
          "kind": "single",
          "id": "accessType",
          "title": "دسترسی",
          "icon": "orientation",
          "options": [
            "جاده آسفالت",
            "جاده خاکی",
            "نزدیک بزرگراه"
          ]
        },
        {
          "kind": "single",
          "id": "currentStatus",
          "title": "وضعیت فعلی",
          "icon": "settings",
          "options": [
            "تخلیه",
            "فعال"
          ]
        },
        {
          "kind": "single",
          "id": "commercialLicense",
          "title": "مجوز تجاری",
          "icon": "agreement",
          "options": [
            "دائم",
            "موقت"
          ]
        },
        {
          "kind": "loan"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 3 مورد دیگر",
          "options": [
            {
              "id": "single-phase-power",
              "label": "برق تک فاز"
            },
            {
              "id": "three-phase-power",
              "label": "برق سه فاز"
            },
            {
              "id": "water",
              "label": "امتیاز آب"
            },
            {
              "id": "gas",
              "label": "امتیاز گاز"
            },
            {
              "id": "telephone",
              "label": "امتیاز تلفن"
            },
            {
              "id": "walled",
              "label": "دور دیوار/حصار"
            },
            {
              "id": "old-building",
              "label": "بنا کلنگی"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "well",
              "label": "چاه آب"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "exchangeWith",
          "title": "معاوضه با",
          "icon": "exchange",
          "options": [
            "ویلا",
            "خودرو",
            "آپارتمان",
            "خانه ویلایی",
            "زمین",
            "دفتر کار / اداری",
            "مغازه و تجاری",
            "سایر"
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "sale-garden-villa": {
    "$schema": "./types.ts",
    "formCode": "sale-garden-villa",
    "title": "فروش باغ و ویلا",
    "transaction": "sale",
    "category": "garden-villa",
    "create": {
      "specsTitle": "مشخصات باغ ویلا",
      "basicFields": [
        {
          "key": "landArea",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۵۰۰",
          "required": true
        },
        {
          "key": "buildingArea",
          "title": "متراژ زیربنا",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۱۲۰",
          "required": true
        },
        {
          "key": "rooms",
          "title": "تعداد اتاق",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵+"
          ]
        },
        {
          "key": "age",
          "title": "سن ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        }
      ],
      "pricing": {
        "mode": "sale",
        "loan": true,
        "exchange": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن‌کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "yard",
            "label": "حیاط"
          },
          {
            "id": "iranian",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western",
            "label": "سرویس فرنگی"
          },
          {
            "id": "wardrobe",
            "label": "کمد دیواری"
          },
          {
            "id": "door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video",
            "label": "آیفون تصویری"
          },
          {
            "id": "gas-stove",
            "label": "گاز رومیزی"
          },
          {
            "id": "hood",
            "label": "هود"
          },
          {
            "id": "oven",
            "label": "فر توکار"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "camera",
            "label": "دوربین امنیتی"
          },
          {
            "id": "bms",
            "label": "سیستم هوشمند"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof",
            "label": "روف گاردن"
          },
          {
            "id": "pool",
            "label": "استخر"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          },
          {
            "id": "gym",
            "label": "سالن ورزشی"
          },
          {
            "id": "playground",
            "label": "زمین بازی"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "landPosition",
            "title": "موقعیت زمین",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "شمالی",
              "جنوبی",
              "غربی",
              "شرقی",
              "دوممر",
              "دونبش",
              "سه نبش",
              "چهارنبش"
            ]
          },
          {
            "key": "buildingType",
            "title": "نوع بنا",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "ویلایی مستقل",
              "شهرکی",
              "آپارتمانی"
            ]
          },
          {
            "key": "villaType",
            "title": "تیپ بنا",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "فلت",
              "تک طبقه",
              "دوبلکس",
              "تریبلکس",
              "خونه باغ"
            ]
          },
          {
            "key": "documentType",
            "title": "سند",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تک برگ",
              "منگوله دار",
              "آستانه",
              "اوقافی",
              "موقوفه",
              "وکالت محضری",
              "قولنامه",
              "مشاع",
              "در دست اقدام",
              "آماده انتقال"
            ]
          },
          {
            "key": "totalFloors",
            "title": "تعداد طبقات",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱ طبقه",
              "۲ طبقه",
              "۳ طبقه",
              "۴ طبقه",
              "۵ طبقه",
              "۶ طبقه",
              "۷ طبقه",
              "۸ طبقه و بیشتر"
            ]
          },
          {
            "key": "streetWidth",
            "title": "عرض گذر (متر)",
            "input": "number",
            "leftText": "متر",
            "numeric": true
          },
          {
            "key": "kitchenType",
            "title": "نوع آشپزخانه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "اپن",
              "جزیره",
              "بسته",
              "نیمه اپن"
            ]
          },
          {
            "key": "renovated",
            "title": "بازسازی",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "furnished",
            "title": "با لوازم و مبله",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "facadeMaterial",
            "title": "جنس نما",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سنگ",
              "آجر",
              "سیمان",
              "کامپوزیت",
              "شیشه",
              "رومی",
              "ترکیبی"
            ]
          },
          {
            "key": "floorMaterial",
            "title": "جنس کف",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سرامیک",
              "سنگ",
              "پارکت",
              "لمینت",
              "موزاییک",
              "کفپوش"
            ]
          },
          {
            "key": "cabinetMaterial",
            "title": "جنس کابینت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "MDF",
              "های‌گلاس",
              "ممبران",
              "فلزی",
              "چوبی",
              "ندارد"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "landArea",
          "title": "متراژ زمین",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "buildingArea",
          "title": "متراژ بنا",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "price",
          "title": "قیمت",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "loan"
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "single",
          "id": "landPosition",
          "title": "موقعیت زمین",
          "icon": "orientation",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دوممر",
            "دونبش",
            "سه نبش",
            "چهارنبش"
          ]
        },
        {
          "kind": "single",
          "id": "buildingType",
          "title": "نوع بنا",
          "icon": "typeBuilding",
          "options": [
            "ویلایی مستقل",
            "شهرکی",
            "آپارتمانی"
          ]
        },
        {
          "kind": "single",
          "id": "villaType",
          "title": "تیپ بنا",
          "icon": "city02",
          "options": [
            "تک طبقه",
            "دو طبقه",
            "سه طبقه",
            "دوبلکس",
            "تریبلکس",
            "فورلکس"
          ]
        },
        {
          "kind": "single",
          "id": "documentType",
          "title": "نوع سند",
          "icon": "agreement",
          "options": [
            "تک برگ",
            "منگوله‌دار",
            "آستانه",
            "اوقافی",
            "موقوفه",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        },
        {
          "kind": "single",
          "id": "totalFloors",
          "title": "تعداد طبقات",
          "icon": "floor",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 7,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 17 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "yard",
              "label": "حیاط"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "wardrobe",
              "label": "کمد دیواری"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "gas-stove",
              "label": "گاز رومیزی"
            },
            {
              "id": "hood",
              "label": "هود"
            },
            {
              "id": "oven",
              "label": "فرتوکار"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "pool",
              "label": "استخر"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            },
            {
              "id": "gym",
              "label": "سالن ورزشی"
            },
            {
              "id": "playground",
              "label": "زمین بازی"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "exchangeWith",
          "title": "معاوضه با",
          "icon": "exchange",
          "options": [
            "ویلا",
            "خودرو",
            "آپارتمان",
            "خانه ویلایی",
            "زمین",
            "دفتر کار / اداری",
            "مغازه و تجاری",
            "سایر"
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "sale-hotel": {
    "$schema": "./types.ts",
    "formCode": "sale-hotel",
    "title": "فروش هتل، اقامتگاه",
    "transaction": "sale",
    "category": "hotel-apartment",
    "create": {
      "specsTitle": "مشخصات هتل و اقامتگاه",
      "basicFields": [
        {
          "key": "accommodationType",
          "title": "نوع اقامتگاه",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "هتل",
            "هتل آپارتمان",
            "متل",
            "مسافر خونه",
            "مجتمع توریستی"
          ]
        },
        {
          "key": "hotelStars",
          "title": "رتبه اقامتگاه",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "۱ ستاره",
            "۲ ستاره",
            "۳ ستاره",
            "۴ ستاره",
            "۵ ستاره"
          ]
        },
        {
          "key": "landArea",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۱۰۰۰",
          "required": true
        },
        {
          "key": "buildingArea",
          "title": "متراژ بنا",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۲۰۰۰",
          "required": true
        },
        {
          "key": "documentType",
          "title": "سند",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "تک برگ",
            "منگوله دار",
            "آستانه",
            "اوقافی",
            "موقوفه",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        }
      ],
      "pricing": {
        "mode": "sale",
        "loan": true,
        "exchange": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن‌کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "iranian-toilet",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western-toilet",
            "label": "سرویس فرنگی"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof-garden",
            "label": "روف گاردن"
          },
          {
            "id": "outdoor-pool",
            "label": "استخر روباز"
          },
          {
            "id": "indoor-pool",
            "label": "استخر سرپوشیده"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          },
          {
            "id": "gym",
            "label": "سالن ورزشی"
          },
          {
            "id": "cinema",
            "label": "سینما"
          },
          {
            "id": "cafe",
            "label": "کافی شاپ"
          },
          {
            "id": "restaurant",
            "label": "رستوران"
          },
          {
            "id": "shop",
            "label": "فروشگاه"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "landPosition",
            "title": "موقعیت زمین",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "شمالی",
              "جنوبی",
              "غربی",
              "شرقی",
              "دوممر",
              "دونبش",
              "سه نبش",
              "چهارنبش"
            ]
          },
          {
            "key": "age",
            "title": "سن ساخت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "نوساز",
              "۱ سال",
              "۲ سال",
              "۳ سال",
              "۴ سال",
              "۵ سال",
              "۶ سال",
              "۷ سال",
              "۸ سال",
              "۹ سال",
              "۱۰ سال",
              "۱۱ سال",
              "۱۲ سال",
              "۱۳ سال",
              "۱۴ سال",
              "۱۵ سال",
              "۱۶ سال",
              "۱۷ سال",
              "۱۸ سال",
              "۱۹ سال",
              "۲۰ سال",
              "بیشتر از ۲۰ سال"
            ]
          },
          {
            "key": "totalFloors",
            "title": "تعداد طبقات",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱ طبقه",
              "۲ طبقه",
              "۳ طبقه",
              "۴ طبقه",
              "۵ طبقه",
              "۶ طبقه",
              "۷ طبقه",
              "۸ طبقه و بیشتر"
            ]
          },
          {
            "key": "singleRoomCount",
            "title": "تعداد اتاق یک تخته",
            "input": "number",
            "numeric": true
          },
          {
            "key": "doubleRoomCount",
            "title": "تعداد اتاق دو تخته",
            "input": "number",
            "numeric": true
          },
          {
            "key": "suiteCount",
            "title": "تعداد سوییت ها",
            "input": "number",
            "numeric": true
          },
          {
            "key": "renovated",
            "title": "بازسازی شده",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "furnished",
            "title": "با لوازم و مبله",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "floorMaterial",
            "title": "جنس کف",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سرامیک",
              "سنگ",
              "پارکت",
              "لمینت",
              "موزاییک",
              "کفپوش"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "landArea",
          "title": "متراژ زمین",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "buildingArea",
          "title": "متراژ بنا",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "price",
          "title": "قیمت",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "single",
          "id": "accommodationType",
          "title": "نوع اقامتگاه",
          "icon": "building",
          "options": [
            "هتل",
            "هتل آپارتمان",
            "متل",
            "مسافر خونه",
            "مجتمع توریستی"
          ]
        },
        {
          "kind": "single",
          "id": "hotelStars",
          "title": "رتبه اقامتگاه",
          "icon": "star",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷"
          ]
        },
        {
          "kind": "single",
          "id": "documentType",
          "title": "نوع سند",
          "icon": "agreement",
          "options": [
            "تک برگ",
            "منگوله‌دار",
            "آستانه",
            "اوقافی",
            "موقوفه",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        },
        {
          "kind": "single",
          "id": "landPosition",
          "title": "موقعیت زمین",
          "icon": "orientation",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دوممر",
            "دونبش",
            "سه نبش",
            "چهارنبش"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "single",
          "id": "totalFloors",
          "title": "تعداد طبقات",
          "icon": "floor",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ]
        },
        {
          "kind": "loan"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 10 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "outdoor-pool",
              "label": "استخر روباز"
            },
            {
              "id": "indoor-pool",
              "label": "استخر سرپوشیده"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            },
            {
              "id": "gym",
              "label": "سالن ورزشی"
            },
            {
              "id": "cinema",
              "label": "سینما"
            },
            {
              "id": "coffee-shop",
              "label": "کافی شاپ"
            },
            {
              "id": "restaurant",
              "label": "رستوران"
            },
            {
              "id": "shop",
              "label": "فروشگاه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "exchangeWith",
          "title": "معاوضه با",
          "icon": "exchange",
          "options": [
            "ویلا",
            "خودرو",
            "آپارتمان",
            "خانه ویلایی",
            "زمین",
            "دفتر کار / اداری",
            "مغازه و تجاری",
            "سایر"
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "sale-land": {
    "$schema": "./types.ts",
    "formCode": "sale-land",
    "title": "فروش زمین، ملک کلنگی",
    "transaction": "sale",
    "category": "land",
    "create": {
      "specsTitle": "مشخصات ملک",
      "basicFields": [
        {
          "key": "meterage",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۳۰۰",
          "required": true
        },
        {
          "key": "documentType",
          "title": "سند",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "تک برگ",
            "منگوله دار",
            "آستانه",
            "اوقافی",
            "موقوفه",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        }
      ],
      "pricing": {
        "mode": "sale",
        "loan": true,
        "exchange": true
      },
      "heatingCooling": {
        "enabled": false
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "power",
            "label": "امتیاز برق"
          },
          {
            "id": "water",
            "label": "امتیاز آب"
          },
          {
            "id": "gas",
            "label": "امتیاز گاز"
          },
          {
            "id": "telephone",
            "label": "امتیاز تلفن"
          },
          {
            "id": "walled",
            "label": "دور دیوار/حصار"
          },
          {
            "id": "old-building",
            "label": "بنا کلنگی"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "well",
            "label": "چاه آب"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "usageType",
            "title": "نوع کاربری",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "مسکونی",
              "اداری",
              "تجاری",
              "صنعتی",
              "کشاورزی",
              "باغی",
              "آموزشی",
              "درمانی",
              "مذهبی",
              "ورزشی",
              "خدماتی",
              "گردشگری و توریستی",
              "پارکینگ",
              "حریم",
              "فاقد کاربری"
            ]
          },
          {
            "key": "landPosition",
            "title": "موقعیت زمین",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "شمالی",
              "جنوبی",
              "غربی",
              "شرقی",
              "دوممر",
              "دونبش",
              "سه نبش",
              "چهارنبش"
            ]
          },
          {
            "key": "density",
            "title": "تراکم زمین",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "کم",
              "متوسط",
              "زیاد"
            ]
          },
          {
            "key": "suitableFor",
            "title": "مناسب برای",
            "input": "multiSelect",
            "ui": "bottomSheet",
            "options": [
              "ساخت آپارتمان",
              "ساخت ویلا",
              "سرمایه گذاری",
              "تجمیع با ملک مجاور"
            ]
          },
          {
            "key": "landWidth",
            "title": "عرض زمین",
            "input": "number",
            "leftText": "متر",
            "numeric": true
          },
          {
            "key": "streetWidth",
            "title": "عرض گذر",
            "input": "number",
            "leftText": "متر",
            "numeric": true
          },
          {
            "key": "constructionPermit",
            "title": "مجوز ساخت",
            "input": "toggle",
            "ui": "toggle"
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "landArea",
          "title": "متراژ زمین",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "landWidth",
          "title": "عرض زمین",
          "variant": "number",
          "unit": "متر",
          "showUnitInTitle": true,
          "icon": "houseDimensions"
        },
        {
          "kind": "range",
          "id": "price",
          "title": "قیمت",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "single",
          "id": "documentType",
          "title": "نوع سند",
          "icon": "agreement",
          "options": [
            "تک برگ",
            "منگوله‌دار",
            "آستانه",
            "اوقافی",
            "موقوفه",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        },
        {
          "kind": "multi",
          "id": "usageType",
          "title": "نوع کاربری",
          "icon": "settings",
          "more": true,
          "moreLimit": 10,
          "moreLabel": "مشاهده ۵ مورد دیگر",
          "moreIcon": "left",
          "options": [
            "مسکونی",
            "اداری",
            "تجاری",
            "صنعتی",
            "کشاورزی",
            "باغی",
            "آموزشی",
            "درمانی",
            "مذهبی",
            "ورزشی",
            "خدماتی",
            "گردشگری و توریستی",
            "پارکینگ",
            "حریم",
            "فاقد کاربری"
          ]
        },
        {
          "kind": "single",
          "id": "landPosition",
          "title": "موقعیت زمین",
          "icon": "orientation",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دوممر",
            "دونبش",
            "سه نبش",
            "چهارنبش"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "single",
          "id": "density",
          "title": "تراکم زمین",
          "icon": "building",
          "options": [
            "کم",
            "متوسط",
            "زیاد"
          ]
        },
        {
          "kind": "multi",
          "id": "suitableFor",
          "title": "مناسب برای",
          "icon": "suitable",
          "options": [
            "ساخت آپارتمان",
            "ساخت ویلا",
            "سرمایه‌گذاری",
            "تجمیع با ملک مجاور"
          ]
        },
        {
          "kind": "toggle",
          "id": "constructionPermit",
          "title": "مجوز ساخت",
          "icon": "agreement"
        },
        {
          "kind": "loan"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش ۵ مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "options": [
            {
              "id": "power",
              "label": "امتیاز برق"
            },
            {
              "id": "water",
              "label": "امتیاز آب"
            },
            {
              "id": "gas",
              "label": "امتیاز گاز"
            },
            {
              "id": "telephone",
              "label": "امتیاز تلفن"
            },
            {
              "id": "walled",
              "label": "دور دیوار/حصار"
            },
            {
              "id": "old-building",
              "label": "بنا کلنگی"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "well",
              "label": "چاه آب"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "exchangeWith",
          "title": "معاوضه با",
          "icon": "exchange",
          "options": [
            "ویلا",
            "خودرو",
            "آپارتمان",
            "خانه ویلایی",
            "زمین",
            "دفتر کار / اداری",
            "مغازه و تجاری",
            "سایر"
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "sale-office": {
    "$schema": "./types.ts",
    "formCode": "sale-office",
    "title": "فروش اداری",
    "transaction": "sale",
    "category": "office",
    "create": {
      "specsTitle": "مشخصات اداری",
      "basicFields": [
        {
          "key": "meterage",
          "title": "متراژ",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۷۵",
          "required": true
        },
        {
          "key": "floor",
          "title": "طبقه",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ]
        },
        {
          "key": "rooms",
          "title": "تعداد اتاق",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵+"
          ]
        },
        {
          "key": "age",
          "title": "سال ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        }
      ],
      "pricing": {
        "mode": "sale",
        "loan": true,
        "exchange": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن‌کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "yard",
            "label": "حیاط"
          },
          {
            "id": "iranian",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western",
            "label": "سرویس فرنگی"
          },
          {
            "id": "wardrobe",
            "label": "کمد دیواری"
          },
          {
            "id": "door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video",
            "label": "آیفون تصویری"
          },
          {
            "id": "gas-stove",
            "label": "گاز رومیزی"
          },
          {
            "id": "hood",
            "label": "هود"
          },
          {
            "id": "oven",
            "label": "فر توکار"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "camera",
            "label": "دوربین امنیتی"
          },
          {
            "id": "bms",
            "label": "سیستم هوشمند"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof",
            "label": "روف گاردن"
          },
          {
            "id": "pool",
            "label": "استخر"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "totalFloors",
            "title": "تعداد کل طبقات",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱ طبقه",
              "۲ طبقه",
              "۳ طبقه",
              "۴ طبقه",
              "۵ طبقه",
              "۶ طبقه",
              "۷ طبقه",
              "۸ طبقه و بیشتر"
            ]
          },
          {
            "key": "suitableFor",
            "title": "مناسب برای",
            "input": "multiSelect",
            "ui": "bottomSheet",
            "options": [
              "مهندسین",
              "شرکت ها",
              "وکلا",
              "مطب",
              "موسسه",
              "آموزشگاه",
              "آتلیه",
              "مزون",
              "اسناد رسمی",
              "دفاتر دولت",
              "صنایع",
              "خدماتی",
              "ورزشی",
              "فرهنگی",
              "مذهبی",
              "همه مشاغل"
            ]
          },
          {
            "key": "currentStatus",
            "title": "وضعیت فعلی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تخلیه",
              "فعال",
              "درحال بازسازی"
            ]
          },
          {
            "key": "officePosition",
            "title": "موقعیت اداری",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "مجتمع اداری",
              "برج اداری",
              "برخیابان اصلی",
              "موقعیت مسکونی",
              "مجتمع پزشکان"
            ]
          },
          {
            "key": "officeDocumentType",
            "title": "سند اداری",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "دائم",
              "موقت"
            ]
          },
          {
            "key": "managementRoom",
            "title": "اتاق مدیریت",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "conferenceRoom",
            "title": "اتاق کنفرانس",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "receptionHall",
            "title": "سالن پذیرش",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "signboard",
            "title": "تابلو خور",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "kitchen",
            "title": "آشپزخانه",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "separateEntrance",
            "title": "ورودی مجزا",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "renovated",
            "title": "بازسازی شده",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "furnished",
            "title": "مبله با لوازم",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "facadeMaterial",
            "title": "جنس نما",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سنگ",
              "آجر",
              "سیمان",
              "کامپوزیت",
              "شیشه",
              "رومی",
              "ترکیبی"
            ]
          },
          {
            "key": "floorMaterial",
            "title": "جنس کف",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سرامیک",
              "سنگ",
              "پارکت",
              "لمینت",
              "موزاییک",
              "کفپوش"
            ]
          },
          {
            "key": "cabinetMaterial",
            "title": "جنس کابینت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "MDF",
              "های‌گلاس",
              "ممبران",
              "فلزی",
              "چوبی",
              "ندارد"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "meterage",
          "title": "متراژ",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "price",
          "title": "قیمت",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "loan"
        },
        {
          "kind": "multi",
          "id": "floor",
          "title": "طبقه",
          "icon": "floor",
          "options": [
            "همکف",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 6,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "multi",
          "id": "suitableFor",
          "title": "مناسب برای",
          "icon": "suitable",
          "options": [
            "شرکت‌ها",
            "مهندسین",
            "بیمه",
            "وکلا",
            "آموزشگاه",
            "مطب",
            "موسسه",
            "آتلیه",
            "مزون",
            "اسناد رسمی",
            "دفاتر دولت",
            "صنایع",
            "خدماتی",
            "ورزشی",
            "فرهنگی"
          ],
          "more": true,
          "moreLimit": 5,
          "moreLabel": "مشاهده ۱۰ مورد دیگر",
          "moreIcon": "down"
        },
        {
          "kind": "single",
          "id": "currentStatus",
          "title": "وضعیت فعلی",
          "icon": "settings",
          "options": [
            "تخلیه",
            "فعال",
            "درحال بازسازی"
          ]
        },
        {
          "kind": "single",
          "id": "officePosition",
          "title": "موقعیت اداری",
          "icon": "orientation",
          "options": [
            "مجتمع اداری",
            "برج اداری",
            "بر خیابان اصلی",
            "موقعیت مسکونی",
            "مجتمع پزشکان"
          ]
        },
        {
          "kind": "single",
          "id": "officeDocumentType",
          "title": "سند اداری",
          "icon": "agreement",
          "options": [
            "دائم",
            "موقت"
          ]
        },
        {
          "kind": "toggle",
          "id": "managementRoom",
          "title": "اتاق مدیریت"
        },
        {
          "kind": "toggle",
          "id": "conferenceRoom",
          "title": "اتاق کنفرانس"
        },
        {
          "kind": "toggle",
          "id": "receptionHall",
          "title": "سالن پذیرش"
        },
        {
          "kind": "toggle",
          "id": "signboard",
          "title": "تابلو خور"
        },
        {
          "kind": "toggle",
          "id": "separateEntrance",
          "title": "ورودی مجزا"
        },
        {
          "kind": "toggle",
          "id": "kitchen",
          "title": "آشپزخانه"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 15 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "yard",
              "label": "حیاط"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "wardrobe",
              "label": "کمد دیواری"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "gas-stove",
              "label": "گاز رومیزی"
            },
            {
              "id": "hood",
              "label": "هود"
            },
            {
              "id": "oven",
              "label": "فرتوکار"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "pool",
              "label": "استخر"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "exchangeWith",
          "title": "معاوضه با",
          "icon": "exchange",
          "options": [
            "ویلا",
            "خودرو",
            "آپارتمان",
            "خانه ویلایی",
            "زمین",
            "دفتر کار / اداری",
            "مغازه و تجاری",
            "سایر"
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "sale-villa-house": {
    "$schema": "./types.ts",
    "formCode": "sale-villa-house",
    "title": "فروش خانه، ویلا",
    "transaction": "sale",
    "category": "villa-house",
    "create": {
      "specsTitle": "مشخصات بنا",
      "basicFields": [
        {
          "key": "landArea",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۲۵۰",
          "required": true
        },
        {
          "key": "buildingArea",
          "title": "متراژ زیربنا",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۱۲۰",
          "required": true
        },
        {
          "key": "rooms",
          "title": "تعداد اتاق",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵+"
          ]
        },
        {
          "key": "age",
          "title": "سن ساخت",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "required": true,
          "options": [
            "نوساز",
            "۱ سال",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۵ سال",
            "۶ سال",
            "۷ سال",
            "۸ سال",
            "۹ سال",
            "۱۰ سال",
            "۱۱ سال",
            "۱۲ سال",
            "۱۳ سال",
            "۱۴ سال",
            "۱۵ سال",
            "۱۶ سال",
            "۱۷ سال",
            "۱۸ سال",
            "۱۹ سال",
            "۲۰ سال",
            "بیشتر از ۲۰ سال"
          ]
        }
      ],
      "pricing": {
        "mode": "sale",
        "loan": true,
        "exchange": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن‌کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "elevator",
            "label": "آسانسور"
          },
          {
            "id": "parking",
            "label": "پارکینگ"
          },
          {
            "id": "warehouse",
            "label": "انباری"
          },
          {
            "id": "terrace",
            "label": "تراس"
          },
          {
            "id": "yard",
            "label": "حیاط"
          },
          {
            "id": "iranian",
            "label": "سرویس ایرانی"
          },
          {
            "id": "western",
            "label": "سرویس فرنگی"
          },
          {
            "id": "wardrobe",
            "label": "کمد دیواری"
          },
          {
            "id": "door",
            "label": "درب ضد سرقت"
          },
          {
            "id": "video",
            "label": "آیفون تصویری"
          },
          {
            "id": "gas-stove",
            "label": "گاز رومیزی"
          },
          {
            "id": "hood",
            "label": "هود"
          },
          {
            "id": "oven",
            "label": "فر توکار"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "camera",
            "label": "دوربین امنیتی"
          },
          {
            "id": "bms",
            "label": "سیستم هوشمند"
          },
          {
            "id": "lobby",
            "label": "لابی"
          },
          {
            "id": "roof",
            "label": "روف گاردن"
          },
          {
            "id": "pool",
            "label": "استخر"
          },
          {
            "id": "jacuzzi",
            "label": "جکوزی"
          },
          {
            "id": "sauna",
            "label": "سونا"
          },
          {
            "id": "gym",
            "label": "سالن ورزشی"
          },
          {
            "id": "playground",
            "label": "زمین بازی"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "landPosition",
            "title": "موقعیت زمین",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "شمالی",
              "جنوبی",
              "غربی",
              "شرقی",
              "دوممر",
              "دونبش",
              "سه نبش",
              "چهارنبش"
            ]
          },
          {
            "key": "buildingType",
            "title": "نوع بنا",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "ویلایی مستقل",
              "شهرکی",
              "آپارتمانی"
            ]
          },
          {
            "key": "villaType",
            "title": "تیپ بنا",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "فلت",
              "تک طبقه",
              "دوبلکس",
              "تریبلکس",
              "خونه باغ"
            ]
          },
          {
            "key": "documentType",
            "title": "سند",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تک برگ",
              "منگوله دار",
              "آستانه",
              "اوقافی",
              "موقوفه",
              "وکالت محضری",
              "قولنامه",
              "مشاع",
              "در دست اقدام",
              "آماده انتقال"
            ]
          },
          {
            "key": "totalFloors",
            "title": "تعداد طبقات",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "۱ طبقه",
              "۲ طبقه",
              "۳ طبقه",
              "۴ طبقه",
              "۵ طبقه",
              "۶ طبقه",
              "۷ طبقه",
              "۸ طبقه و بیشتر"
            ]
          },
          {
            "key": "streetWidth",
            "title": "عرض گذر (متر)",
            "input": "number",
            "leftText": "متر",
            "numeric": true
          },
          {
            "key": "kitchenType",
            "title": "نوع آشپزخانه",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "اپن",
              "جزیره",
              "بسته",
              "نیمه اپن"
            ]
          },
          {
            "key": "renovated",
            "title": "بازسازی",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "furnished",
            "title": "با لوازم و مبله",
            "input": "toggle",
            "ui": "toggle"
          },
          {
            "key": "facadeMaterial",
            "title": "جنس نما",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سنگ",
              "آجر",
              "سیمان",
              "کامپوزیت",
              "شیشه",
              "رومی",
              "ترکیبی"
            ]
          },
          {
            "key": "floorMaterial",
            "title": "جنس کف",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "سرامیک",
              "سنگ",
              "پارکت",
              "لمینت",
              "موزاییک",
              "کفپوش"
            ]
          },
          {
            "key": "cabinetMaterial",
            "title": "جنس کابینت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "MDF",
              "های‌گلاس",
              "ممبران",
              "فلزی",
              "چوبی",
              "ندارد"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "landArea",
          "title": "متراژ زمین",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "buildingArea",
          "title": "متراژ بنا",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "price",
          "title": "قیمت",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "loan"
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "single",
          "id": "landPosition",
          "title": "موقعیت زمین",
          "icon": "orientation",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دوممر",
            "دونبش",
            "سه نبش",
            "چهارنبش"
          ]
        },
        {
          "kind": "single",
          "id": "buildingType",
          "title": "نوع بنا",
          "icon": "typeBuilding",
          "options": [
            "ویلایی مستقل",
            "شهرکی",
            "آپارتمانی"
          ]
        },
        {
          "kind": "single",
          "id": "villaType",
          "title": "تیپ بنا",
          "icon": "city02",
          "options": [
            "تک طبقه",
            "دو طبقه",
            "سه طبقه",
            "دوبلکس",
            "تریبلکس",
            "فورلکس"
          ]
        },
        {
          "kind": "single",
          "id": "documentType",
          "title": "نوع سند",
          "icon": "agreement",
          "options": [
            "تک برگ",
            "منگوله‌دار",
            "آستانه",
            "اوقافی",
            "موقوفه",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        },
        {
          "kind": "single",
          "id": "totalFloors",
          "title": "تعداد طبقات",
          "icon": "floor",
          "options": [
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸ و بیشتر"
          ],
          "more": true,
          "moreLimit": 7,
          "moreLabel": "مشاهده همه طبقات",
          "moreIcon": "left"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 17 مورد دیگر",
          "options": [
            {
              "id": "elevator",
              "label": "آسانسور"
            },
            {
              "id": "parking",
              "label": "پارکینگ"
            },
            {
              "id": "warehouse",
              "label": "انباری"
            },
            {
              "id": "terrace",
              "label": "تراس"
            },
            {
              "id": "yard",
              "label": "حیاط"
            },
            {
              "id": "iranian-toilet",
              "label": "سرویس ایرانی"
            },
            {
              "id": "western-toilet",
              "label": "سرویس فرنگی"
            },
            {
              "id": "wardrobe",
              "label": "کمد دیواری"
            },
            {
              "id": "security-door",
              "label": "درب ضد سرقت"
            },
            {
              "id": "video-intercom",
              "label": "آیفون تصویری"
            },
            {
              "id": "gas-stove",
              "label": "گاز رومیزی"
            },
            {
              "id": "hood",
              "label": "هود"
            },
            {
              "id": "oven",
              "label": "فرتوکار"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "cctv",
              "label": "دوربین امنیتی"
            },
            {
              "id": "smart-home",
              "label": "سیستم هوشمند"
            },
            {
              "id": "lobby",
              "label": "لابی"
            },
            {
              "id": "roof-garden",
              "label": "روف گاردن"
            },
            {
              "id": "pool",
              "label": "استخر"
            },
            {
              "id": "jacuzzi",
              "label": "جکوزی"
            },
            {
              "id": "sauna",
              "label": "سونا"
            },
            {
              "id": "gym",
              "label": "سالن ورزشی"
            },
            {
              "id": "playground",
              "label": "زمین بازی"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "exchangeWith",
          "title": "معاوضه با",
          "icon": "exchange",
          "options": [
            "ویلا",
            "خودرو",
            "آپارتمان",
            "خانه ویلایی",
            "زمین",
            "دفتر کار / اداری",
            "مغازه و تجاری",
            "سایر"
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  },
  "sale-warehouse": {
    "$schema": "./types.ts",
    "formCode": "sale-warehouse",
    "title": "فروش انبار و سوله",
    "transaction": "sale",
    "category": "warehouse",
    "create": {
      "specsTitle": "مشخصات انبار و سوله",
      "basicFields": [
        {
          "key": "landArea",
          "title": "متراژ زمین",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۱۰۰۰",
          "required": true
        },
        {
          "key": "buildingArea",
          "title": "متراژ بنا",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر مربع",
          "placeholder": "مثلا ۵۰۰",
          "required": true
        },
        {
          "key": "ceilingHeight",
          "title": "ارتفاع سقف",
          "input": "text",
          "ui": "input",
          "numeric": true,
          "leftText": "متر",
          "placeholder": "مثلا ۶"
        },
        {
          "key": "documentType",
          "title": "سند",
          "input": "select",
          "ui": "bottomSheet",
          "placeholder": "انتخاب کنید",
          "options": [
            "تک برگ",
            "منگوله دار",
            "آستانه",
            "اوقافی",
            "موقوفه",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        }
      ],
      "pricing": {
        "mode": "sale",
        "loan": true,
        "exchange": true
      },
      "heatingCooling": {
        "enabled": true,
        "items": [
          {
            "id": "water-cooler",
            "label": "کولر آبی"
          },
          {
            "id": "gas-cooler",
            "label": "کولر گازی"
          },
          {
            "id": "duct-split",
            "label": "داکت اسپیلت"
          },
          {
            "id": "chiller",
            "label": "چیلر"
          },
          {
            "id": "fan-coil",
            "label": "فن کوئل"
          },
          {
            "id": "heater",
            "label": "بخاری"
          },
          {
            "id": "radiator",
            "label": "شوفاژ"
          },
          {
            "id": "floor-heating",
            "label": "گرمایش ازکف"
          },
          {
            "id": "fireplace",
            "label": "شومینه"
          },
          {
            "id": "water-heater",
            "label": "آبگرم کن"
          },
          {
            "id": "package",
            "label": "پکیج"
          },
          {
            "id": "central-boiler",
            "label": "موتورخانه"
          }
        ]
      },
      "facilities": {
        "enabled": true,
        "items": [
          {
            "id": "single-phase-power",
            "label": "برق تک فاز"
          },
          {
            "id": "three-phase-power",
            "label": "برق سه فاز"
          },
          {
            "id": "water",
            "label": "امتیاز آب"
          },
          {
            "id": "gas",
            "label": "امتیاز گاز"
          },
          {
            "id": "telephone",
            "label": "امتیاز تلفن"
          },
          {
            "id": "walled",
            "label": "دور دیوار/حصار"
          },
          {
            "id": "old-building",
            "label": "بنا کلنگی"
          },
          {
            "id": "guard",
            "label": "نگهبانی"
          },
          {
            "id": "well",
            "label": "چاه آب"
          }
        ]
      },
      "moreFeatures": {
        "enabled": true,
        "fields": [
          {
            "key": "age",
            "title": "سال ساخت",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "نوساز",
              "۱ سال",
              "۲ سال",
              "۳ سال",
              "۴ سال",
              "۵ سال",
              "۶ سال",
              "۷ سال",
              "۸ سال",
              "۹ سال",
              "۱۰ سال",
              "۱۱ سال",
              "۱۲ سال",
              "۱۳ سال",
              "۱۴ سال",
              "۱۵ سال",
              "۱۶ سال",
              "۱۷ سال",
              "۱۸ سال",
              "۱۹ سال",
              "۲۰ سال",
              "بیشتر از ۲۰ سال"
            ]
          },
          {
            "key": "rooms",
            "title": "تعداد اتاق",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "بدون اتاق",
              "۱",
              "۲",
              "۳",
              "۴",
              "۵+"
            ]
          },
          {
            "key": "accessType",
            "title": "دست رسی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "جاده آسفالت",
              "جاده خاکی",
              "نزدیک بزرگراه"
            ]
          },
          {
            "key": "currentStatus",
            "title": "وضعیت فعلی",
            "input": "select",
            "ui": "bottomSheet",
            "options": [
              "تخلیه",
              "فعال"
            ]
          }
        ]
      }
    },
    "view": {
      "sections": []
    },
    "filter": {
      "sections": [
        {
          "kind": "neighborhood"
        },
        {
          "kind": "range",
          "id": "landArea",
          "title": "متراژ زمین",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "buildingArea",
          "title": "متراژ بنا",
          "variant": "area",
          "unit": "متر مربع",
          "showUnitInTitle": true
        },
        {
          "kind": "range",
          "id": "price",
          "title": "قیمت",
          "variant": "money",
          "unit": "تومان"
        },
        {
          "kind": "single",
          "id": "landPosition",
          "title": "موقعیت زمین",
          "icon": "orientation",
          "options": [
            "شمالی",
            "جنوبی",
            "غربی",
            "شرقی",
            "دوممر",
            "دونبش",
            "سه نبش",
            "چهارنبش"
          ]
        },
        {
          "kind": "multi",
          "id": "age",
          "title": "سن ساخت",
          "icon": "year",
          "options": [
            "۱ سال",
            "نوساز",
            "۲ سال",
            "۳ سال",
            "۴ سال",
            "۱۰ سال",
            "۱۵ سال",
            "۲۰ سال",
            "بیشتر از ۳۰ سال"
          ]
        },
        {
          "kind": "single",
          "id": "documentType",
          "title": "نوع سند",
          "icon": "agreement",
          "options": [
            "تک برگ",
            "منگوله‌دار",
            "آستانه",
            "اوقافی",
            "موقوفه",
            "وکالت محضری",
            "قولنامه",
            "مشاع",
            "در دست اقدام",
            "آماده انتقال"
          ]
        },
        {
          "kind": "multi",
          "id": "rooms",
          "title": "تعداد اتاق",
          "icon": "bed",
          "options": [
            "بدون اتاق",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵ و بیشتر"
          ]
        },
        {
          "kind": "single",
          "id": "industrialPropertyType",
          "title": "نوع ملک",
          "icon": "building",
          "options": [
            "سوله",
            "انبار",
            "کارگاه",
            "کارخانه",
            "گلخانه",
            "گاوداری",
            "مرغداری"
          ]
        },
        {
          "kind": "single",
          "id": "accessType",
          "title": "دسترسی",
          "icon": "orientation",
          "options": [
            "جاده آسفالت",
            "جاده خاکی",
            "نزدیک بزرگراه"
          ]
        },
        {
          "kind": "single",
          "id": "currentStatus",
          "title": "وضعیت فعلی",
          "icon": "settings",
          "options": [
            "تخلیه",
            "فعال"
          ]
        },
        {
          "kind": "single",
          "id": "commercialLicense",
          "title": "مجوز تجاری",
          "icon": "agreement",
          "options": [
            "دائم",
            "موقت"
          ]
        },
        {
          "kind": "loan"
        },
        {
          "kind": "multi",
          "id": "heatingCooling",
          "title": "سرمایش و گرمایش",
          "icon": "temperature",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 5 مورد دیگر",
          "options": [
            {
              "id": "gas-cooler",
              "label": "کولر گازی"
            },
            {
              "id": "water-cooler",
              "label": "کولر آبی"
            },
            {
              "id": "package",
              "label": "پکیج"
            },
            {
              "id": "water-heater",
              "label": "آبگرمکن"
            },
            {
              "id": "heater",
              "label": "بخاری"
            },
            {
              "id": "radiator",
              "label": "شوفاژ"
            },
            {
              "id": "duct-split",
              "label": "داکت اسپیلت"
            },
            {
              "id": "chiller",
              "label": "چیلر"
            },
            {
              "id": "fan-coil",
              "label": "فن کوئل"
            },
            {
              "id": "floor-heating",
              "label": "گرمایش ازکف"
            },
            {
              "id": "fireplace",
              "label": "شومینه"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "facilities",
          "title": "امکانات",
          "icon": "settings",
          "more": true,
          "moreLimit": 6,
          "moreLabel": "نمایش 3 مورد دیگر",
          "options": [
            {
              "id": "single-phase-power",
              "label": "برق تک فاز"
            },
            {
              "id": "three-phase-power",
              "label": "برق سه فاز"
            },
            {
              "id": "water",
              "label": "امتیاز آب"
            },
            {
              "id": "gas",
              "label": "امتیاز گاز"
            },
            {
              "id": "telephone",
              "label": "امتیاز تلفن"
            },
            {
              "id": "walled",
              "label": "دور دیوار/حصار"
            },
            {
              "id": "old-building",
              "label": "بنا کلنگی"
            },
            {
              "id": "guard",
              "label": "نگهبانی"
            },
            {
              "id": "well",
              "label": "چاه آب"
            }
          ]
        },
        {
          "kind": "multi",
          "id": "exchangeWith",
          "title": "معاوضه با",
          "icon": "exchange",
          "options": [
            "ویلا",
            "خودرو",
            "آپارتمان",
            "خانه ویلایی",
            "زمین",
            "دفتر کار / اداری",
            "مغازه و تجاری",
            "سایر"
          ]
        },
        {
          "kind": "advertiser"
        },
        {
          "kind": "publicationTime"
        },
        {
          "kind": "adFlags"
        }
      ]
    }
  }
};

for (const [code, schema] of Object.entries(schemas)) {
  const filePath = path.join(targetDir, `${code}.json`);
  const noNewline = ['partnership', 'sale-land'].includes(code);
  fs.writeFileSync(filePath, JSON.stringify(schema, null, 2) + (noNewline ? '' : '\n'), 'utf8');
  console.log(`Generated: ${code}.json`);
}

console.log('\nSuccessfully updated all ' + Object.keys(schemas).length + ' JSON form schemas.');
