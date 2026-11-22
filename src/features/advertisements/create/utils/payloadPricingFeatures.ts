import type { NewAdFormValues } from "../types";
import { toNumber } from "./formatters";
import {
  addFeature,
  buildProjectDetailFeatures,
  type NewAdFeature,
} from "./featureBuilders";

type PayloadParams = {
  category: string;
  transaction: string;
};

export function appendPayloadPricingAndAssignmentFeatures(
  features: NewAdFeature[],
  values: NewAdFormValues,
  params: PayloadParams,
  flags: {
    isDailyRent: boolean;
    isLoanActive: boolean;
    isPartnership: boolean;
    isProject: boolean;
    isRent: boolean;
    isSale: boolean;
    isSaleGardenVilla: boolean;
  },
  options?: { dynamicFieldKeys?: Iterable<string> },
): void {
  const { isDailyRent, isLoanActive, isPartnership, isProject, isRent, isSale, isSaleGardenVilla } = flags;
  const dynamicKeys = options?.dynamicFieldKeys ? new Set(options.dynamicFieldKeys) : null;
  const addDynamicFeature = (key: string, value: unknown) => {
    if (dynamicKeys && !dynamicKeys.has(key)) return;
    addFeature(features, key, value);
  };

  if (isDailyRent) {
    addDynamicFeature("min_price", toNumber(values.minPrice));
    addDynamicFeature("max_price", toNumber(values.maxPrice));
    if (params.category === "daily-hotel-apartment") {
      addDynamicFeature("min_meter_price", toNumber(values.minPrice));
      addDynamicFeature("max_meter_price", toNumber(values.maxPrice));
    } else {
      addDynamicFeature("normal_daily_price", toNumber(values.normalDailyPrice));
      addDynamicFeature("weekend_daily_price", toNumber(values.weekendDailyPrice));
      addDynamicFeature("special_daily_price", toNumber(values.specialDailyPrice));
      addDynamicFeature("extra_person_price", toNumber(values.extraPersonPrice));
    }
  } else if (isRent) {
    addDynamicFeature("mortgage_price", toNumber(values.mortgagePrice));
    addDynamicFeature("rent_price", toNumber(values.rentPrice));
    addDynamicFeature("rent_conversion_enabled", values.rentConversionEnabled);
    addDynamicFeature("rent_convertible", values.rentConversionEnabled);
    if (values.rentConversionEnabled) {
      addDynamicFeature(
        "rent_conversion_mortgage_price",
        toNumber(values.rentConversionMortgagePrice),
      );
      addDynamicFeature("rent_conversion_policy", "قابل تبدیل");
    } else {
      addDynamicFeature("rent_conversion_policy", "غیر قابل تبدیل");
    }
  } else if (isProject) {
    if (!isPartnership) {
      addDynamicFeature("min_meter_price", toNumber(values.minPrice));
      addDynamicFeature("max_meter_price", toNumber(values.maxPrice));
    }
  } else {
    addDynamicFeature("price", toNumber(values.price));
  }

  addDynamicFeature(
    "loan_amount",
    isSale && !isSaleGardenVilla && isLoanActive ? toNumber(values.loanAmount) : null,
  );
  addDynamicFeature(
    "loan_installment",
    isSale && !isSaleGardenVilla && isLoanActive ? toNumber(values.loanInstallment) : null,
  );
  const exchangeAllowed = isSale || (isProject && !isPartnership);
  addDynamicFeature("has_exchange", exchangeAllowed && values.exchangeEnabled);
  addDynamicFeature(
    "exchange_with",
    exchangeAllowed && values.exchangeEnabled ? values.exchangeTargets : [],
  );

  if (isProject && !isPartnership) {
    addDynamicFeature("project_total_floors", toNumber(values.projectTotalFloors));
    addDynamicFeature("project_total_units", toNumber(values.projectTotalUnits));
    addDynamicFeature("project_status", values.projectStatus);
    addDynamicFeature("delivery_date", values.projectDeliveryDate);
    addDynamicFeature("project_details", buildProjectDetailFeatures(values));
    addDynamicFeature("sale_terms_enabled", values.saleTermsEnabled);
    addDynamicFeature(
      "sale_terms_percent",
      values.saleTermsEnabled ? toNumber(values.saleTermsPercent) : null,
    );
    addDynamicFeature(
      "sale_terms_installment_months",
      values.saleTermsEnabled ? toNumber(values.saleTermsInstallmentMonths) : null,
    );
  }

  if (isPartnership) {
    addDynamicFeature("partnership_type", values.participationType);
    addDynamicFeature("builder_share", toNumber(values.builderSharePercent));
  }
}
