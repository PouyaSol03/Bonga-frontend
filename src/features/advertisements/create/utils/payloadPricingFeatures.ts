import type { NewAdFormValues } from "../types";
import { toNumber } from "./formatters";
import {
  addFeature,
  buildProjectDetailFeatures,
  shouldSendConsultantAssignment,
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
): void {
  const { isDailyRent, isLoanActive, isPartnership, isProject, isRent, isSale, isSaleGardenVilla } = flags;

  if (isDailyRent) {
    addFeature(features, "min_price", toNumber(values.minPrice));
    addFeature(features, "max_price", toNumber(values.maxPrice));
    if (params.category === "daily-hotel-apartment") {
      addFeature(features, "min_meter_price", toNumber(values.minPrice));
      addFeature(features, "max_meter_price", toNumber(values.maxPrice));
    } else {
      addFeature(features, "normal_daily_price", toNumber(values.normalDailyPrice));
      addFeature(features, "weekend_daily_price", toNumber(values.weekendDailyPrice));
      addFeature(features, "special_daily_price", toNumber(values.specialDailyPrice));
      addFeature(features, "extra_person_price", toNumber(values.extraPersonPrice));
    }
  } else if (isRent) {
    addFeature(features, "mortgage_price", toNumber(values.mortgagePrice));
    addFeature(features, "rent_price", toNumber(values.rentPrice));
    addFeature(features, "rent_conversion_enabled", values.rentConversionEnabled);
    addFeature(features, "rent_convertible", values.rentConversionEnabled);
    if (values.rentConversionEnabled) {
      addFeature(
        features,
        "rent_conversion_mortgage_price",
        toNumber(values.rentConversionMortgagePrice),
      );
      addFeature(features, "rent_conversion_policy", "قابل تبدیل");
    } else {
      addFeature(features, "rent_conversion_policy", "غیر قابل تبدیل");
    }
  } else if (isProject) {
    if (!isPartnership) {
      addFeature(features, "min_meter_price", toNumber(values.minPrice));
      addFeature(features, "max_meter_price", toNumber(values.maxPrice));
    }
  } else {
    addFeature(features, "price", toNumber(values.price));
  }

  addFeature(
    features,
    "loan_amount",
    isSale && !isSaleGardenVilla && isLoanActive ? toNumber(values.loanAmount) : null,
  );
  addFeature(
    features,
    "loan_installment",
    isSale && !isSaleGardenVilla && isLoanActive ? toNumber(values.loanInstallment) : null,
  );
  const exchangeAllowed = isSale || (isProject && !isPartnership);
  addFeature(features, "has_exchange", exchangeAllowed && values.exchangeEnabled);
  addFeature(
    features,
    "exchange_with",
    exchangeAllowed && values.exchangeEnabled ? values.exchangeTargets : [],
  );

  addFeature(features, "has_image", values.photos.length > 0);
  addFeature(features, "has_video", values.hasVideo);
  addFeature(features, "has_virtual_tour", values.hasVirtualTour);
  addFeature(features, "publisher", values.registrantType === "agency" ? values.publisherName : "");
  addFeature(features, "agency_id", values.registrantType === "agency" ? values.agencyId : "");
  if (shouldSendConsultantAssignment(values)) {
    addFeature(features, "consultant_id", values.consultantId ? values.consultantId : "");
  }

  if (isProject && !isPartnership) {
    addFeature(features, "project_total_floors", toNumber(values.projectTotalFloors));
    addFeature(features, "project_total_units", toNumber(values.projectTotalUnits));
    addFeature(features, "project_status", values.projectStatus);
    addFeature(features, "delivery_date", values.projectDeliveryDate);
    addFeature(features, "project_details", buildProjectDetailFeatures(values));
    addFeature(features, "sale_terms_enabled", values.saleTermsEnabled);
    addFeature(
      features,
      "sale_terms_percent",
      values.saleTermsEnabled ? toNumber(values.saleTermsPercent) : null,
    );
    addFeature(
      features,
      "sale_terms_installment_months",
      values.saleTermsEnabled ? toNumber(values.saleTermsInstallmentMonths) : null,
    );
  }

  if (isPartnership) {
    addFeature(features, "partnership_type", values.participationType);
    addFeature(features, "builder_share", toNumber(values.builderSharePercent));
  }
}
