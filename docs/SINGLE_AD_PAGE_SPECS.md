# Single Advertisement View — Backend Contract Specification

This document defines the strict JSON payload schema for the Single Advertisement View (`/ads/:id` and `/ads/:id/property-info`).

---

## 1. Core Contract Rules & Principles

1. **Strict Pure Numbers (`number`)**:
   - All numerical values (`id`, `track_code`, `rooms`, `floor`, `age`, `rank`, `rating_score`, `area`, `price`, counts) MUST be returned as raw JSON numbers.
   - Never wrap numbers in strings (`3`, NOT `"3"` or `"۳"`).
   - Zero values represent valid domain states (`age: 0` = Newly Built / نوساز, `floor: 0` = Ground Floor / همکف, `floor: -1` = Basement / زیرهمکف, `rooms: 0` = Studio / بدون اتاق).

2. **Clean Location Schema**:
   - The UI strictly consumes: `lat`, `lng`, `neighborhood: { id, name }`, and `address`.
   - Redundant or unused fields (`city`, `district`, `sub_neighborhood`) MUST NOT be included.

3. **Domain Block Grouping (No Flat Feature Arrays)**:
   - Do NOT send key-value array fixtures (`features: [{ label, value }]`).
   - Group ad specifications into distinct root domain blocks: `property_info`, `finishing`, `financial`, `counts`, `heating_cooling`, and `facilities`.

4. **Client Flags & Metadata**:
   - Do NOT include client-rendered UI labels like `price_label` in the payload; UI generates them dynamically based on the form code and financial structure.
   - User interaction flags (`is_bookmarked`, `is_mine`, `is_special`) are optional or provided through authenticated session contexts.

---

## 2. Common Root Object Schema

Every single advertisement response adheres to the following root structure:

```json
{
  "id": 100101,
  "track_code": 100101,
  "title": "آپارتمان ۱۴۰ متری نوساز سه خوابه سجاد",
  "description": "واحد جنوبی بسیار خوش نقشه با نورگیر عالی...",
  "form_code": "sale-apartment",
  "price": 8500000000,
  "published_time_ago": "لحظاتی پیش",
  "published_date": "1403/07/20",
  "images": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"
  ],
  "video": null,
  "virtual_tour_link": null,
  "location": {
    "lat": 36.3155,
    "lng": 59.5492,
    "neighborhood": {
      "id": 10,
      "name": "سجاد"
    },
    "address": "خیابان بهار"
  },
  "contacts": {
    "phone": "09120000000",
    "agency_phone": "05137600000",
    "chat_enabled": true
  },
  "social": {
    "instagram": "bonga_agency",
    "telegram": "bonga_support",
    "whatsapp": "989120000000"
  },
  "publisher": {
    "type": "agency",
    "id": 45,
    "name": "املاک صبا",
    "location": "مشهد، سجاد",
    "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100",
    "rank": 5,
    "rating_score": 4.8,
    "consultant": {
      "id": 88,
      "name": "محسن حسینی",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      "phone": "09121111111"
    }
  }
}
```

> **Note on `publisher`**:
> - For agency ads: `"type": "agency"` with optional nested `consultant` object.
> - For independent agents: `"type": "agent"`.
> - For private individuals: `"type": "user"`.

---

## 3. Domain Block Specs

### `financial`
```json
{
  "financial": {
    "price": 8500000000,
    "mortgage_price": 300000000,
    "rent_price": 15000000,
    "is_rent_convertible": true,
    "daily_price": 3500000,
    "normal_daily_price": 3500000,
    "weekend_daily_price": 4500000,
    "special_daily_price": 5000000,
    "extra_person_price": 300000,
    "evacuation_guarantee": 20000000,
    "min_price": 2200000,
    "max_price": 4500000,
    "min_meter_price": 60000000,
    "max_meter_price": 85000000,
    "builder_share": 60,
    "sale_terms_percent": 30,
    "sale_terms_installment_months": 24,
    "loan": {
      "amount": 800000000,
      "installment": 15000000
    },
    "exchange": {
      "items": ["خودرو", "آپارتمان کوچک‌تر"],
      "description": "معاوضه با خودروی خارجی یا واحد زیر ۱۰۰ متر"
    }
  }
}
```

### `counts`
```json
{
  "counts": {
    "elevator": 1,
    "parking": 1,
    "warehouse": 1,
    "terrace": 1
  }
}
```

### `finishing`
```json
{
  "finishing": {
    "kitchen_type": "جزیره",
    "floor_material": "سرامیک",
    "cabinet_material": "های‌گلاس",
    "facade_material": "سنگ"
  }
}
```

---

## 4. Category-Specific Payloads

### 4.1 Daily Rentals (`daily-apartment-suite`, `daily-garden-villa`)

The Single Ad View renders a 2x2 metric grid with icons, followed by tiered daily pricing rows separated by dashed dividers, and a property status section with furnished badge.

```json
{
  "form_code": "daily-garden-villa",
  "price": 3500000,
  "financial": {
    "daily_price": 3500000,
    "normal_daily_price": 3500000,
    "weekend_daily_price": 4500000,
    "special_daily_price": 5000000,
    "extra_person_price": 300000,
    "evacuation_guarantee": 20000000
  },
  "property_info": {
    "accommodation_type": "ویلا",
    "land_area": 1200,
    "building_area": 250,
    "rooms": 3,
    "total_floors": 2,
    "standard_capacity": 8,
    "extra_people_capacity": 8,
    "building_type": "تک طبقه",
    "rental_period": "روزانه",
    "min_stay_days": 1,
    "check_in_time": "۱۰:۰۰",
    "check_out_time": "۱۲:۰۰",
    "view_type": "کوهستان",
    "pet_policy": "مجاز",
    "furnished": "مبله با لوازم"
  },
  "counts": {
    "elevator": 0,
    "parking": 4,
    "warehouse": 1,
    "terrace": 1
  },
  "facilities": ["استخر سرپوشیده", "بیلیارد", "باربیکیو", "آلاچیق"]
}
```

### 4.2 Hotels & Multi-Room Suites (`daily-hotel`)

Hotel accommodation units are represented in `daily_hotel_rooms` as dedicated tiers rendered inside an interactive accordion.

```json
{
  "form_code": "daily-hotel",
  "price": 2200000,
  "financial": {
    "min_price": 2200000,
    "max_price": 4500000
  },
  "property_info": {
    "hotel_stars": 4,
    "accommodation_type": "هتل آپارتمان",
    "check_in_time": "۱۴:۰۰",
    "check_out_time": "۱۲:۰۰",
    "total_floors": 6
  },
  "daily_hotel_rooms": [
    {
      "room_type": "single",
      "label": "اتاق یک تخته",
      "guest_count": 1,
      "extra_guest_count": 0,
      "meal_plan": "صبحانه، ناهار",
      "normal_price": 1500000,
      "weekend_price": 2500000,
      "special_price": 5000000
    },
    {
      "room_type": "double",
      "label": "اتاق دو تخته",
      "guest_count": 2,
      "extra_guest_count": 1,
      "meal_plan": "صبحانه",
      "normal_price": 2200000,
      "weekend_price": 3200000,
      "special_price": 6000000
    },
    {
      "room_type": "suite",
      "label": "سوئیت",
      "guest_count": 4,
      "extra_guest_count": 3,
      "meal_plan": "صبحانه، ناهار، شام",
      "normal_price": 6000000,
      "weekend_price": 8000000,
      "special_price": 12000000
    }
  ],
  "counts": {
    "elevator": 3,
    "parking": 20,
    "warehouse": 5,
    "terrace": 2
  },
  "facilities": ["رستوران", "کافی‌شاپ", "لاندری", "اینترنت پرسرعت"]
}
```

### 4.3 Partnership in Construction (`partnership`)

Captures all land, zoning, permit, and contractual share data:

```json
{
  "form_code": "partnership",
  "price": 0,
  "financial": {
    "builder_share": 60
  },
  "property_info": {
    "participation_type": "مسکونی",
    "current_status": "کلنگی قابل سکونت",
    "land_area": 500,
    "land_width": 15,
    "street_width": 16,
    "entrance_position": "شمالی",
    "land_position": "دو کله",
    "density": "زیاد",
    "document_type": "ششدانگ ملکی",
    "construction_license": "دارد"
  },
  "facilities": []
}
```

### 4.4 Presale (`presale-special`)

Presale ads contain building specifications, sales & financing terms, and an independent list of unit variants (`project_details`) hosted on `/ads/:id/project-details`.

```json
{
  "form_code": "presale-special",
  "price": 60000000,
  "financial": {
    "min_meter_price": 60000000,
    "max_meter_price": 85000000,
    "sale_terms_percent": 30,
    "sale_terms_installment_months": 24,
    "exchange": {
      "items": ["ملک کلنگی", "زمین"],
      "description": "قابل معاوضه با زمین یا کلنگی در منطقه ۱"
    }
  },
  "property_info": {
    "project_type": "برج مسکونی",
    "builder_company_name": "شرکت ساختمانی آرامش",
    "project_total_floors": 25,
    "project_total_units": 120,
    "project_status": "اسکلت و تیغه‌چینی",
    "delivery_date": "۱۴۰۵/۰۷",
    "document_type": "تک برگ عرصه و عیان",
    "furnished": "مبله با لوازم"
  },
  "finishing": {
    "kitchen_type": "جزیره",
    "facade_material": "سنگ ترکیبی",
    "floor_material": "سنگ اسلب",
    "cabinet_material": "پلی اورتان"
  },
  "project_details": [
    {
      "meterage": 120,
      "rooms": 2,
      "floor": 5,
      "price": 7200000000
    },
    {
      "meterage": 180,
      "rooms": 3,
      "floor": 12,
      "price": 11700000000
    },
    {
      "meterage": 250,
      "rooms": 4,
      "floor": 22,
      "price": 18750000000
    }
  ],
  "facilities": ["لابی من ۲۴ ساعته", "استخر و سونا", "باشگاه بدنسازی", "روف گاردن"]
}
```

### 4.5 Standard Sales & Long-Term Rentals (`sale-apartment`, `rent-apartment`)

```json
{
  "form_code": "rent-apartment",
  "price": 300000000,
  "financial": {
    "mortgage_price": 300000000,
    "rent_price": 15000000,
    "is_rent_convertible": true
  },
  "property_info": {
    "area": 110,
    "rooms": 2,
    "floor": 2,
    "age": 5,
    "total_floors": 5,
    "units_per_floor": 2,
    "unit_type": "شمالی",
    "unit_position": "رو به نما",
    "suitable_for": ["خانواده", "مجرد موجه"],
    "occupancy_status": "تخلیه",
    "ready_delivery_date": "فوری",
    "min_contract_months": 12,
    "pet_policy": "مجاز نیست",
    "renovated": "بله",
    "furnished": "مبله کامل"
  },
  "finishing": {
    "kitchen_type": "اپن",
    "floor_material": "سرامیک",
    "cabinet_material": "MDF",
    "facade_material": "تراورتن"
  },
  "counts": {
    "elevator": 1,
    "parking": 1,
    "warehouse": 1,
    "terrace": 1
  },
  "heating_cooling": ["کولر آبی", "پکیج"],
  "facilities": ["آسانسور", "پارکینگ", "انباری", "تراس", "درب ضد سرقت"]
}
```

