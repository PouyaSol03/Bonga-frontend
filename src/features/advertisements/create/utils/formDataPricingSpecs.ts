import type { NewAdFormValues } from "../types";
import { toNumber } from "./formatters";
import { getPriceValue } from "./featureBuilders";
import type { FormDataAppenders } from "./formDataAppenders";

export function appendFormDataPricingSpecs(
  appenders: FormDataAppenders,
  values: NewAdFormValues,
  params: { category: string; transaction: string },
  formCode: string,
): void {
  const { appendDynamicValue } = appenders;

  const meterageValue = toNumber(values.meterage);
  const landAreaValue = toNumber(values.landArea);
  const buildingAreaValue = toNumber(values.buildingArea);
  const areaValue = meterageValue ?? buildingAreaValue ?? landAreaValue;
  const apiLandAreaValue =
    formCode === "sale-land" ? (landAreaValue ?? meterageValue) : landAreaValue;

  appendDynamicValue("area", areaValue);
  appendDynamicValue("land_area", apiLandAreaValue);
  appendDynamicValue("building_area", buildingAreaValue);
  appendDynamicValue("price", getPriceValue(values, params.transaction, params.category));
  appendDynamicValue("rent_price", toNumber(values.rentPrice));
  appendDynamicValue("mortgage_price", toNumber(values.mortgagePrice));
  appendDynamicValue("rent_conversion_enabled", values.rentConversionEnabled);
  appendDynamicValue("rent_convertible", values.rentConversionEnabled);
  if (values.rentConversionEnabled) {
    appendDynamicValue(
      "rent_conversion_mortgage_price",
      toNumber(values.rentConversionMortgagePrice),
    );
    appendDynamicValue("rent_conversion_policy", "قابل تبدیل");
  } else {
    appendDynamicValue("rent_conversion_policy", "غیر قابل تبدیل");
  }

  if (params.transaction === "project") {
    appendDynamicValue("min_meter_price", toNumber(values.minPrice));
    appendDynamicValue("max_meter_price", toNumber(values.maxPrice));
  } else {
    appendDynamicValue("daily_price", toNumber(values.minPrice));
    appendDynamicValue("meter_price", toNumber(values.minPrice));
    appendDynamicValue("min_price", toNumber(values.minPrice));
    appendDynamicValue("max_price", toNumber(values.maxPrice));
  }
  appendDynamicValue("normal_daily_price", toNumber(values.normalDailyPrice));
  appendDynamicValue("weekend_daily_price", toNumber(values.weekendDailyPrice));
  appendDynamicValue("special_daily_price", toNumber(values.specialDailyPrice));
  appendDynamicValue("extra_person_price", toNumber(values.extraPersonPrice));
}
