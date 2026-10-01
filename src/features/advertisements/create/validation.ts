import { getBasicPropertyFields, getParams, trimFormValues } from "./utils";
import { parseRentPriceValue, RENT_CONVERSION_MORTGAGE_UNIT } from "./rentPriceConversion";
import type { FlowStep, NewAdFieldErrors, NewAdFormValues } from "./types";

export type NewAdValidationResult = {
  errors: NewAdFieldErrors;
  step: FlowStep;
};

const MAX_SYSTEM_PRICE = 500_000_000_000_000; // 500 Hemmat (500 trillion Tomans)
const MAX_MONTHLY_RENT = 5_000_000_000; // 5 Billion Tomans
const MAX_DAILY_RENT = 200_000_000; // 200 Million Tomans per night

export function toLatinDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export function parseNumericValue(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;

  const normalized = toLatinDigits(value).replace(/,/g, "").trim();
  if (!normalized) return null;

  const num = Number(normalized);
  if (Number.isFinite(num)) return num;

  const match = normalized.match(/-?\d+(?:\.\d+)?/);
  if (match) {
    const extracted = Number(match[0]);
    return Number.isFinite(extracted) ? extracted : null;
  }

  return null;
}

export function parseFloorNumber(floorStr: unknown): number | null {
  if (typeof floorStr !== "string") return null;
  const trimmed = floorStr.trim();
  if (trimmed === "همکف") return 0;
  if (trimmed === "زیرهمکف") return -1;

  const match = toLatinDigits(trimmed).match(/-?\d+/);
  if (!match) return null;

  const num = Number(match[0]);
  return Number.isFinite(num) ? num : null;
}

function hasRequiredText(value: unknown): boolean {
  if (Array.isArray(value)) return value.some((item) => hasRequiredText(item));
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

export function hasErrors(errors: NewAdFieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function getDetailsValidationErrors(values: NewAdFormValues): NewAdFieldErrors {
  const { transaction, category } = getParams();
  const isProject = transaction === "project";
  const isPartnership = isProject && category === "project-partnership";
  const isRent = transaction === "rent";
  const isDailyRent = isRent && category.startsWith("daily-");
  const loanAllowed = transaction === "sale" && category !== "garden-villa";
  const errors: NewAdFieldErrors = {};

  if (!hasRequiredText(values.location)) {
    errors.location = "لطفا محدوده ملک را مشخص کنید.";
  }

  // 1. Required fields check from dynamic/form-code definition
  if (!isProject) {
    getBasicPropertyFields().forEach((field) => {
      if (field.key === "meterage" || field.key === "buildingArea") return;
      if (!field.required) return;
      if (hasRequiredText(values[field.key])) return;

      errors[field.key] = `لطفا ${field.label} را وارد کنید.`;
    });
  }

  // 2. Land Area validation (meterage and buildingArea validations removed)
  const numLandArea = parseNumericValue(values.landArea);
  if (hasRequiredText(values.landArea)) {
    if (numLandArea === null || numLandArea <= 0) {
      errors.landArea = "متراژ زمین باید عددی بزرگتر از صفر باشد.";
    } else if (numLandArea > 1_000_000) {
      errors.landArea = "متراژ زمین نمی‌تواند بیشتر از ۱,۰۰۰,۰۰۰ متر مربع (۱۰۰ هکتار) باشد.";
    }
  }

  // 3. Floors and Units Validation
  const numTotalFloors = parseNumericValue(values.totalFloors);
  if (hasRequiredText(values.totalFloors)) {
    if (numTotalFloors === null || numTotalFloors <= 0) {
      errors.totalFloors = "تعداد کل طبقات باید بزرگتر از صفر باشد.";
    } else if (numTotalFloors > 70) {
      errors.totalFloors = "تعداد کل طبقات نمی‌تواند بیشتر از ۷۰ طبقه باشد.";
    }
  }

  const numFloor = parseFloorNumber(values.floor);
  if (numFloor !== null && numTotalFloors !== null && numFloor > 0 && numTotalFloors > 0) {
    if (numFloor > numTotalFloors) {
      errors.floor = "طبقه واحد نمی‌تواند از تعداد کل طبقات ساختمان بیشتر باشد.";
    }
  }

  const numUnitsPerFloor = parseNumericValue(values.unitsPerFloor);
  if (hasRequiredText(values.unitsPerFloor) && numUnitsPerFloor !== null) {
    if (numUnitsPerFloor <= 0) {
      errors.unitsPerFloor = "تعداد واحد در هر طبقه باید بزرگتر از صفر باشد.";
    } else if (numUnitsPerFloor > 30) {
      errors.unitsPerFloor = "تعداد واحد در هر طبقه نمی‌تواند بیشتر از ۳۰ واحد باشد.";
    }
  }

  // 4. Dimensions & Specifications
  const numCeilingHeight = parseNumericValue(values.ceilingHeight);
  if (hasRequiredText(values.ceilingHeight)) {
    if (numCeilingHeight === null || numCeilingHeight < 1.5) {
      errors.ceilingHeight = "ارتفاع سقف نمی‌تواند کمتر از ۱.۵ متر باشد.";
    } else if (numCeilingHeight > 25) {
      errors.ceilingHeight = "ارتفاع سقف به متر است و حداکثر ۲۵ متر می‌باشد.";
    }
  }

  const numStreetWidth = parseNumericValue(values.streetWidth);
  if (hasRequiredText(values.streetWidth)) {
    const rawDigits = toLatinDigits(values.streetWidth).replace(/\D/g, "");
    if (numStreetWidth === null || numStreetWidth <= 0) {
      errors.streetWidth = "عرض گذر / کوچه باید بزرگتر از صفر باشد.";
    } else if (rawDigits.length > 3 || numStreetWidth > 999) {
      errors.streetWidth = "عرض گذر / کوچه حداکثر ۳ رقم و تا ۹۹۹ متر می‌تواند باشد.";
    }
  }

  const numLandWidth = parseNumericValue(values.landWidth);
  if (hasRequiredText(values.landWidth)) {
    if (numLandWidth === null || numLandWidth <= 0) {
      errors.landWidth = "عرض بر زمین باید بزرگتر از صفر باشد.";
    } else if (numLandWidth > 500) {
      errors.landWidth = "عرض بر زمین نمی‌تواند بیشتر از ۵۰۰ متر باشد.";
    }
  }

  const numOpeningCount = parseNumericValue(values.openingCount);
  if (hasRequiredText(values.openingCount) && numOpeningCount !== null) {
    if (numOpeningCount <= 0 || numOpeningCount > 20) {
      errors.openingCount = "تعداد دهنه مغازه باید بین ۱ تا ۲۰ باشد.";
    }
  }

  // 5. Facility Counts
  const numElevator = parseNumericValue(values.elevatorCount);
  if (hasRequiredText(values.elevatorCount) && numElevator !== null) {
    if (numElevator < 0 || numElevator > 15) {
      errors.elevatorCount = "تعداد آسانسور نمی‌تواند بیشتر از ۱۵ عدد باشد.";
    }
  }

  const numParking = parseNumericValue(values.parkingCount);
  if (hasRequiredText(values.parkingCount) && numParking !== null) {
    if (numParking < 0 || numParking > 100) {
      errors.parkingCount = "تعداد پارکینگ نمی‌تواند بیشتر از ۱۰۰ عدد باشد.";
    }
  }

  const numTerrace = parseNumericValue(values.terraceCount);
  if (hasRequiredText(values.terraceCount) && numTerrace !== null) {
    if (numTerrace < 0 || numTerrace > 5) {
      errors.terraceCount = "تعداد تراس نمی‌تواند بیشتر از ۵ عدد باشد.";
    }
  }

  // 6. Durations
  const numMinContractMonths = parseNumericValue(values.minContractMonths);
  if (hasRequiredText(values.minContractMonths) && numMinContractMonths !== null) {
    if (numMinContractMonths <= 0 || numMinContractMonths > 60) {
      errors.minContractMonths = "حداقل مدت قرارداد باید بین ۱ تا ۶۰ ماه (۵ سال) باشد.";
    }
  }

  const numMinStayDays = parseNumericValue(values.minStayDays);
  if (hasRequiredText(values.minStayDays) && numMinStayDays !== null) {
    if (numMinStayDays <= 0 || numMinStayDays > 30) {
      errors.minStayDays = "حداقل مدت اقامت روزانه باید بین ۱ تا ۳۰ روز باشد.";
    }
  }

  // 7. Partnership & Project Flow
  if (isPartnership) {
    if (!hasRequiredText(values.participationType)) errors.participationType = "لطفا نوع مشارکت را انتخاب کنید.";
    if (!hasRequiredText(values.currentStatus)) errors.currentStatus = "لطفا وضعیت فعلی ملک را انتخاب کنید.";
    if (!hasRequiredText(values.landArea)) errors.landArea = "لطفا متراژ زمین را وارد کنید.";
    if (!hasRequiredText(values.landPosition)) errors.landPosition = "لطفا موقعیت زمین را انتخاب کنید.";

    const shareNum = parseNumericValue(values.builderSharePercent);
    if (shareNum !== null && (shareNum <= 0 || shareNum > 100)) {
      errors.builderSharePercent = "درصد مشارکت / سهم باید بین ۱ تا ۱۰۰ درصد باشد.";
    }
  } else if (isProject) {
    if (!hasRequiredText(values.projectType)) errors.projectType = "لطفا نوع پروژه را انتخاب کنید.";

    const projFloors = parseNumericValue(values.projectTotalFloors);
    if (!hasRequiredText(values.projectTotalFloors)) {
      errors.projectTotalFloors = "لطفا تعداد کل طبقات را وارد کنید.";
    } else if (projFloors === null || projFloors <= 0 || projFloors > 70) {
      errors.projectTotalFloors = "تعداد کل طبقات پروژه باید بین ۱ تا ۷۰ طبقه باشد.";
    }

    const projUnits = parseNumericValue(values.projectTotalUnits);
    if (!hasRequiredText(values.projectTotalUnits)) {
      errors.projectTotalUnits = "لطفا تعداد کل واحدها را وارد کنید.";
    } else if (projUnits === null || projUnits <= 0 || projUnits > 5_000) {
      errors.projectTotalUnits = "تعداد کل واحدها باید بین ۱ تا ۵,۰۰۰ واحد باشد.";
    }

    const minMeterPrice = parseNumericValue(values.minPrice);
    const maxMeterPrice = parseNumericValue(values.maxPrice);

    if (!hasRequiredText(values.minPrice)) {
      errors.minPrice = "لطفا حداقل قیمت متری را وارد کنید.";
    } else if (minMeterPrice === null || minMeterPrice <= 0) {
      errors.minPrice = "حداقل قیمت متری باید بزرگتر از صفر باشد.";
    }

    if (!hasRequiredText(values.maxPrice)) {
      errors.maxPrice = "لطفا حداکثر قیمت متری را وارد کنید.";
    } else if (maxMeterPrice === null || maxMeterPrice <= 0) {
      errors.maxPrice = "حداکثر قیمت متری باید بزرگتر از صفر باشد.";
    }

    if (minMeterPrice !== null && maxMeterPrice !== null && maxMeterPrice < minMeterPrice) {
      errors.maxPrice = "حداکثر قیمت متری نمی‌تواند کمتر از حداقل قیمت متری باشد.";
    }
  } else if (isDailyRent) {
    const minDaily = parseNumericValue(values.minPrice);
    const maxDaily = parseNumericValue(values.maxPrice);

    if (!hasRequiredText(values.minPrice)) {
      errors.minPrice = "لطفا حداقل قیمت را وارد کنید.";
    } else if (minDaily === null || minDaily <= 0) {
      errors.minPrice = "حداقل قیمت باید بزرگتر از صفر باشد.";
    }

    if (!hasRequiredText(values.maxPrice)) {
      errors.maxPrice = "لطفا حداکثر قیمت را وارد کنید.";
    } else if (maxDaily === null || maxDaily <= 0) {
      errors.maxPrice = "حداکثر قیمت باید بزرگتر از صفر باشد.";
    }

    if (minDaily !== null && maxDaily !== null && maxDaily < minDaily) {
      errors.maxPrice = "حداکثر قیمت نمی‌تواند کمتر از حداقل قیمت باشد.";
    }

    if (category !== "daily-hotel-apartment") {
      const normalPrice = parseNumericValue(values.normalDailyPrice);
      const weekendPrice = parseNumericValue(values.weekendDailyPrice);
      const specialPrice = parseNumericValue(values.specialDailyPrice);

      if (!hasRequiredText(values.normalDailyPrice)) {
        errors.normalDailyPrice = "لطفا قیمت روزهای عادی را وارد کنید.";
      } else if (normalPrice === null || normalPrice <= 0 || normalPrice > MAX_DAILY_RENT) {
        errors.normalDailyPrice = "قیمت روزهای عادی نامعتبر است (حداکثر ۲۰۰ میلیون تومان).";
      }

      if (!hasRequiredText(values.weekendDailyPrice)) {
        errors.weekendDailyPrice = "لطفا قیمت آخر هفته را وارد کنید.";
      } else if (weekendPrice === null || weekendPrice <= 0 || weekendPrice > MAX_DAILY_RENT) {
        errors.weekendDailyPrice = "قیمت آخر هفته نامعتبر است (حداکثر ۲۰۰ میلیون تومان).";
      }

      if (!hasRequiredText(values.specialDailyPrice)) {
        errors.specialDailyPrice = "لطفا قیمت روزهای خاص را وارد کنید.";
      } else if (specialPrice === null || specialPrice <= 0 || specialPrice > MAX_DAILY_RENT) {
        errors.specialDailyPrice = "قیمت روزهای خاص نامعتبر است (حداکثر ۲۰۰ میلیون تومان).";
      }
    }
  } else if (isRent) {
    const numMortgage = parseRentPriceValue(values.mortgagePrice);
    if (!hasRequiredText(values.mortgagePrice)) {
      errors.mortgagePrice = "لطفا مبلغ رهن را وارد کنید.";
    } else if (numMortgage <= 0) {
      errors.mortgagePrice = "مبلغ رهن باید بزرگتر از صفر باشد.";
    } else if (numMortgage > MAX_SYSTEM_PRICE) {
      errors.mortgagePrice = "مبلغ رهن وارد شده بیشتر از سقف مجاز (۵۰۰ همت) است.";
    }

    const numRent = parseRentPriceValue(values.rentPrice);
    if (!hasRequiredText(values.rentPrice)) {
      errors.rentPrice = "لطفا مبلغ اجاره را وارد کنید.";
    } else if (numRent < 0) {
      errors.rentPrice = "مبلغ اجاره نمی‌تواند منفی باشد.";
    } else if (numRent > MAX_MONTHLY_RENT) {
      errors.rentPrice = "مبلغ اجاره ماهانه نمی‌تواند بیشتر از ۵ میلیارد تومان باشد.";
    }

    if (values.rentConversionEnabled) {
      if (numMortgage % RENT_CONVERSION_MORTGAGE_UNIT !== 0) {
        errors.rentConversionMortgagePrice = "برای فعال‌سازی تبدیل، مبلغ رهن باید مضربی از یک میلیون تومان باشد.";
      } else if (hasRequiredText(values.rentConversionMortgagePrice)) {
        const conversionMortgage = parseRentPriceValue(values.rentConversionMortgagePrice);
        if (conversionMortgage > numMortgage) {
          errors.rentConversionMortgagePrice = "مبلغ تبدیل رهن نمی‌تواند بیشتر از مبلغ رهن اصلی باشد.";
        }
      }
    }
  } else {
    // Standard Sale Flow
    const numPrice = parseNumericValue(values.price);
    if (!hasRequiredText(values.price)) {
      errors.price = "لطفا قیمت آگهی را وارد کنید.";
    } else if (numPrice === null || numPrice <= 0) {
      errors.price = "قیمت ملک باید بزرگتر از صفر باشد.";
    } else if (numPrice > MAX_SYSTEM_PRICE) {
      errors.price = "مبلغ وارد شده بیشتر از سقف مجاز (۵۰۰ همت) است.";
    }
  }

  // 8. Loan Validation
  if (loanAllowed && values.loanEnabled) {
    const loanAmount = parseNumericValue(values.loanAmount);
    const propertyPrice = parseNumericValue(values.price);

    if (!hasRequiredText(values.loanAmount)) {
      errors.loanAmount = "لطفا مبلغ وام را وارد کنید.";
    } else if (loanAmount === null || loanAmount <= 0) {
      errors.loanAmount = "مبلغ وام باید بزرگتر از صفر باشد.";
    } else if (propertyPrice !== null && propertyPrice > 0 && loanAmount > propertyPrice) {
      errors.loanAmount = "مبلغ وام نمی‌تواند بیشتر از قیمت کل ملک باشد.";
    }

    const loanInstallment = parseNumericValue(values.loanInstallment);
    if (!hasRequiredText(values.loanInstallment)) {
      errors.loanInstallment = "لطفا قسط وام را وارد کنید.";
    } else if (loanInstallment === null || loanInstallment <= 0) {
      errors.loanInstallment = "مبلغ قسط وام باید بزرگتر از صفر باشد.";
    }
  }

  // 9. Exchange Validation
  if (values.exchangeEnabled && values.exchangeTargets.length === 0) {
    errors.exchangeTargets = "لطفا حداقل یک مورد را برای معاوضه انتخاب کنید.";
  }

  // 10. Sale Terms Validation
  if (values.saleTermsEnabled) {
    const termsPercent = parseNumericValue(values.saleTermsPercent);
    if (!hasRequiredText(values.saleTermsPercent)) {
      errors.saleTermsPercent = "لطفا درصد شرایط فروش را وارد کنید.";
    } else if (termsPercent === null || termsPercent <= 0 || termsPercent > 100) {
      errors.saleTermsPercent = "درصد شرایط فروش باید بین ۱ تا ۱۰۰ درصد باشد.";
    }

    const installmentMonths = parseNumericValue(values.saleTermsInstallmentMonths);
    if (!hasRequiredText(values.saleTermsInstallmentMonths)) {
      errors.saleTermsInstallmentMonths = "لطفا تعداد قسط شرایط فروش را وارد کنید.";
    } else if (installmentMonths === null || installmentMonths <= 0 || installmentMonths > 120) {
      errors.saleTermsInstallmentMonths = "تعداد اقساط باید بین ۱ تا ۱۲۰ ماه باشد.";
    }
  }

  return errors;
}

export function getMediaValidationErrors(
  values: NewAdFormValues,
  options: { forceFullEditFields?: boolean } = {},
): NewAdFieldErrors {
  const errors: NewAdFieldErrors = {};
  const shouldRequirePersonalContactFields =
    options.forceFullEditFields || values.registrantType === "personal";

  // 1. Photos
  if (values.photos.length === 0) {
    errors.photos = "لطفا حداقل یک عکس برای آگهی انتخاب کنید.";
  } else if (values.photos.length > 10) {
    errors.photos = "حداکثر ۱۰ عکس برای آگهی مجاز است.";
  }

  // 2. Video
  if (values.hasVideo && !values.video) {
    errors.video = "لطفا ویدیوی آگهی را انتخاب کنید.";
  }

  // 3. Virtual Tour Link
  if (values.hasVirtualTour) {
    if (!hasRequiredText(values.virtualTourLink)) {
      errors.virtualTourLink = "لطفا لینک تور مجازی را وارد کنید.";
    } else {
      const trimmed = values.virtualTourLink.trim();
      if (!/^https?:\/\/.+/i.test(trimmed)) {
        errors.virtualTourLink = "لینک تور مجازی باید با http:// یا https:// شروع شود.";
      }
    }
  }

  // 4. Registrant Type
  if (!values.registrantType) {
    errors.registrantType = "لطفا نوع ثبت کننده آگهی را انتخاب کنید.";
  }

  // 5. Contact Methods & Phone Number
  if (shouldRequirePersonalContactFields && !values.chatEnabled && !values.phoneEnabled) {
    errors.contactMethods = "لطفا حداقل یکی از روش‌های ارتباطی چت با کاربران یا شماره تماس را انتخاب کنید.";
  }

  if (hasRequiredText(values.phoneNumber)) {
    const cleanPhone = toLatinDigits(values.phoneNumber).replace(/[\s-]/g, "");
    if (!/^09\d{9}$/.test(cleanPhone)) {
      errors.phoneNumber = "شماره موبایل وارد شده معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).";
    }
  }

  if (hasRequiredText(values.ownerPhone)) {
    const cleanOwnerPhone = toLatinDigits(values.ownerPhone).replace(/[\s-]/g, "");
    if (!/^0\d{10}$/.test(cleanOwnerPhone) && !/^\+?98\d{10}$/.test(cleanOwnerPhone) && !/^09\d{9}$/.test(cleanOwnerPhone)) {
      errors.ownerPhone = "شماره تلفن مالک معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹ یا ۰۲۱۸۸۸۸۸۸۸۸).";
    }
  }

  // 6. Title (Min 3, Max 50)
  const trimmedTitle = values.title.trim();
  if (!hasRequiredText(trimmedTitle)) {
    errors.title = "لطفا عنوان آگهی را وارد کنید.";
  } else if (trimmedTitle.length < 3) {
    errors.title = "عنوان آگهی باید حداقل ۳ کاراکتر باشد.";
  } else if (trimmedTitle.length > 50) {
    errors.title = "عنوان آگهی حداکثر می‌تواند ۵۰ کاراکتر باشد.";
  }

  // 7. Description (Min 10, Max 500)
  const trimmedDesc = values.description.trim();
  if (!hasRequiredText(trimmedDesc)) {
    errors.description = "لطفا توضیحات آگهی را وارد کنید.";
  } else if (trimmedDesc.length < 10) {
    errors.description = "توضیحات آگهی باید حداقل ۱۰ کاراکتر باشد.";
  } else if (trimmedDesc.length > 500) {
    errors.description = "توضیحات آگهی حداکثر می‌تواند ۵۰۰ کاراکتر باشد.";
  }

  return errors;
}

export function validateNewAdDetails(rawValues: NewAdFormValues): NewAdValidationResult | null {
  const values = trimFormValues(rawValues);
  const errors = getDetailsValidationErrors(values);
  return hasErrors(errors) ? { errors, step: "details" } : null;
}

export function validateNewAd(
  rawValues: NewAdFormValues,
  options: { forceFullEditFields?: boolean } = {},
): NewAdValidationResult | null {
  const values = trimFormValues(rawValues);
  const detailsErrors = getDetailsValidationErrors(values);
  const mediaErrors = getMediaValidationErrors(values, options);

  if (hasErrors(detailsErrors)) {
    return { errors: { ...detailsErrors, ...mediaErrors }, step: "details" };
  }

  return hasErrors(mediaErrors) ? { errors: mediaErrors, step: "media" } : null;
}
