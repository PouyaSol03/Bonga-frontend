# ممیزی تطبیق داده‌های API با نیازمندی‌های کارت‌های آگهی (AdCard)

## پاسخ به پرسش شما
> **آیا تمام داده‌های مورد نیاز در پاسخ API وجود دارد؟**  
> **بله! تمام داده‌های مورد نیاز برای آگهی ارسال‌شده در پاسخ API وجود دارد.** بک‌اند شما همه فیلدها را فرستاده است، اما علت اینکه قبلاً برخی داده‌ها روی کارت نمایش داده نمی‌شدند، **عدم تطابق نام کلیدها (Key Mismatches)** در فرانت‌اند بود که اکنون به طور کامل اصلاح گردید.

---

## بررسی دقیق داده‌های آگهی نمونه شما (ID: 85 - تست روزانه باغ ویلا)

| آیتم مورد نیاز | مقدار در خروجی API شما | کلید ارسال‌شده در API | وضعیت در فرانت‌اند قبلی | وضعیت بعد از اصلاح |
|---|---|---|---|---|
| **قیمت روزانه (x تا y)** | `53453` تا `453435` | `"normal_daily_price"` و `"weekend_daily_price"` | در نقشه از `item.price` (1555555) خوانده می‌شد | **اصلاح شد**: به درستی رنج `۵۳٬۴۵۳ تا ۴۵۳٬۴۳۵ تومان` آبی نمایش می‌یابد. |
| **آیتم ۱: متراژ** | `555` | `"building_area": 555` و `"land_area": 555` | در سطح بالا `item.area` خالی بود | **اصلاح شد**: متراژ از `building_area` یا `land_area` خوانده و به صورت `۵۵۵ متر` نمایش می‌یابد. |
| **آیتم ۲: تعداد اتاق** | `3` | `"rooms": "3"` | به درستی `۳ اتاق` خوانده می‌شد | کاملاً سالم و فعال. |
| **آیتم ۳: ظرفیت استاندارد** | `10` | `"capacity": "10"` | **دلیل عدم نمایش**: فرانت دنبال `"standard_capacity"` می‌گشت ولی API شما `"capacity"` فرستاده بود! | **اصلاح شد**: کلید `"capacity"` به لیست جستجو اضافه شد و اکنون `۱۰ نفر` با آیکون ظرفیت نمایش داده می‌شود. |

---

## جدول جامع کلیدهای API برای تمامی دسته‌بندی‌ها

### ۱. بخش پیش‌فروش و مشارکت (Pre-sale & Partnership)
> [!IMPORTANT]
> **قوانین قیمت‌گذاری این دو بخش**:
> - **پیش‌فروش**: نمایش به صورت `قیمت متری: [x] تا [y] تومان` با اعداد آبی و کلمه «تا».
> - **مشارکت**: به جای قیمت نقدی و آیکون تومان، مستقیماً **`درصد مشارکت: [x]٪`** نمایش داده می‌شود.

| دسته‌بندی | قیمت / درصد | ۳ آیتم مورد نیاز کارت | کلیدهای مورد انتظار در API |
|---|---|---|---|
| **پیش‌فروش** (`presale-special`) | `قیمت متری: x تا y تومان` | **نوع پروژه** (`LinearConstruction`)<br>**تعداد کل طبقات** (`LinearFloor`)<br>**تعداد کل واحد ها** (`LinearApartment`) | قیمت: `min_meter_price` / `meter_price` و `max_meter_price`<br>آیتم ۱: `project_type`<br>آیتم ۲: `project_total_floors` / `total_floors`<br>آیتم ۳: `project_total_units` / `total_units` |
| **مشارکت** (`partnership`) | `درصد مشارکت: [x]٪` | **متراژ زمین** (`AdCardLandAreaIcon`)<br>**موقعیت** (`AdCardLocationIcon`)<br>**وضعیت فعلی ملک** (`LinearSettingBuilding`) | درصد: `builder_share` یا `builder_share_percent`<br>آیتم ۱: `land_area` یا `meterage`<br>آیتم ۲: `land_position`<br>آیتم ۳: `current_status` |

---

### نمونه JSON ارسالی بک‌اند برای پیش‌فروش (`presale-special`)
```json
{
  "id": 101,
  "title": "پروژه لوکس رونیکا پالاس هروی",
  "features": [
    { "label": "form_code", "value": "presale-special" },
    { "label": "project_type", "value": "مسکونی" },
    { "label": "total_floors", "value": "12" },
    { "label": "total_units", "value": "80" },
    { "label": "min_meter_price", "value": 65000000 },
    { "label": "max_meter_price", "value": 85000000 }
  ]
}
```

---

### نمونه JSON ارسالی بک‌اند برای مشارکت (`partnership`)
```json
{
  "id": 102,
  "title": "ملک کلنگی ۶۰۰ متری مناسب مشارکت در ساخت در یوسف‌آباد",
  "features": [
    { "label": "form_code", "value": "partnership" },
    { "label": "builder_share", "value": "60" },
    { "label": "land_area", "value": 600 },
    { "label": "land_position", "value": "دو نبش" },
    { "label": "current_status", "value": "بنا قدیمی" }
  ]
}
```

---

### ۲. بخش فروش (Sale)
| دسته‌بندی | ۳ آیتم مورد نیاز کارت | کلیدهای مورد انتظار در `features` یا مدل اصلی API |
|---|---|---|
| **فروش آپارتمان** | متراژ، تعداد اتاق، سن ساخت | `area` / `meterage` ، `rooms` ، `building_age` / `year` |
| **فروش زمین، کلنگی** | متراژ، متراژ زمین، نوع سند | `meterage` / `area` ، `land_area` ، `document_type` |
| **فروش باغ، ویلا** | متراژ، اتاق، سن ساخت | `meterage` / `building_area` / `land_area` ، `rooms` ، `building_age` |
| **فروش واحد اداری** | متراژ، تعداد اتاق، سن ساخت | `meterage` / `area` ، `rooms` ، `building_age` |
| **فروش واحد تجاری** | متراژ، نوع سند، موقعیت تجاری | `meterage` / `area` ، `document_type` ، `commercial_position` |
| **فروش واحد صنعتی** | متراژ، نوع سند، موقعیت زمین | `meterage` / `area` ، `document_type` ، `land_position` |
| **فروش هتل، اقامتگاه** | متن «هتل»، متراژ زمین، نوع سند | متن ثابت هتل با آیکون شهر، `land_area` ، `document_type` |

### ۳. بخش اجاره (Rent)
| دسته‌بندی | قیمت و ۳ آیتم مورد نیاز کارت | کلیدهای مورد انتظار در API |
|---|---|---|
| **اجاره آپارتمان** | اجاره و رهن \| متراژ، اتاق، سن ساخت | `rent_price` ، `mortgage_price` \| `area` ، `rooms` ، `building_age` |
| **اجاره خانه، ویلا** | اجاره و رهن \| متراژ، اتاق، سن ساخت | `rent_price` ، `mortgage_price` \| `area` ، `rooms` ، `building_age` |
| **اجاره هتل، اقامتگاه** | اجاره و ودیعه \| «هتل»، متراژ زمین، نوع سند | `rent_price` ، `mortgage_price` \| `land_area` ، `document_type` |
| **اجاره واحد اداری** | اجاره و رهن \| متراژ، تعداد اتاق، طبقه | `rent_price` ، `mortgage_price` \| `area` ، `rooms` ، `floor` |
| **اجاره واحد تجاری** | اجاره و رهن \| متراژ، اتاق، طبقه | `rent_price` ، `mortgage_price` \| `area` ، `rooms` ، `floor` |
| **اجاره واحد صنعتی** | اجاره و رهن \| متراژ، زیربنا، موقعیت زمین | `rent_price` ، `mortgage_price` \| `area` ، `building_area` ، `land_position` |

### ۴. بخش اجاره روزانه (Daily Rent)
| دسته‌بندی | قیمت و ۳ آیتم مورد نیاز کارت | کلیدهای مورد انتظار در API |
|---|---|---|
| **اجاره روزانه آپارتمان** | قیمت x تا y \| «آپارتمان»، اتاق، متراژ | `normal_daily_price` ، `weekend_daily_price` \| `rooms` ، `meterage`/`area` |
| **اجاره روزانه باغ ویلا** | قیمت x تا y \| متراژ، اتاق، ظرفیت استاندارد | `normal_daily_price` ، `weekend_daily_price` \| `building_area`/`land_area` ، `rooms` ، `capacity` |
| **اجاره روزانه هتل** | قیمت x تا y \| «هتل»، ستاره، دوره اجاره | `normal_daily_price` ، `weekend_daily_price` \| `hotel_stars` ، `rental_period` |
| **اجاره روزانه دفترکار** | قیمت x تا y \| «اتاق کار خصوصی»، تعداد اتاق، متراژ | `normal_daily_price` ، `weekend_daily_price` \| `rooms` ، `meterage`/`area` |
