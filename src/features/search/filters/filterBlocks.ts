import { type TransactionType, type CategoryKey } from "./categories";
import { type FilterBlock } from "./filterTypes";
import { getFormSchemaByListing } from "../../advertisements/forms";
import { buildFilterBlocksFromSchema } from "./schemaBlocks";
import {
  getApprovedDailyApartmentFilterBlocks,
  getApprovedDailyVillaFilterBlocks,
  getApprovedDailyHotelFilterBlocks,
  getApprovedDailyWorkspaceFilterBlocks,
} from "./dailyBlocks";
import {
  getApprovedProjectPartnershipFilterBlocks,
  getApprovedProjectPresaleFilterBlocks,
} from "./partnershipBlocks";
import { getApprovedSaleApartmentFilterBlocks } from "./saleApartmentBlocks";
import { getApprovedSaleLandFilterBlocks } from "./saleLandBlocks";
import { getApprovedSaleGardenVillaFilterBlocks } from "./saleGardenVillaBlocks";
import { getApprovedSaleOfficeFilterBlocks } from "./saleOfficeBlocks";
import { getApprovedSaleCommercialFilterBlocks } from "./saleCommercialBlocks";
import { getApprovedSaleIndustrialFilterBlocks } from "./saleIndustrialBlocks";
import { getApprovedSaleHotelFilterBlocks } from "./saleHotelBlocks";
import { getApprovedRentApartmentFilterBlocks } from "./rentApartmentBlocks";
import { getApprovedRentVillaHouseFilterBlocks } from "./rentVillaHouseBlocks";
import { getApprovedRentOfficeFilterBlocks } from "./rentOfficeBlocks";
import { getApprovedRentCommercialFilterBlocks } from "./rentCommercialBlocks";
import { getApprovedRentIndustrialFilterBlocks } from "./rentIndustrialBlocks";
import { getApprovedRentHotelFilterBlocks } from "./rentHotelBlocks";
import { getProjectPresaleBlocks } from "./projectPresaleBlocks";
import { getBasicFields, isProjectCategory, getMoreFields } from "./listingFields";
import { blockFromBasicField, blockFromMoreFeatureField } from "./fieldBlocks";
import { getPriceBlocks } from "./priceBlocks";
import { exchangeTargets } from "../../advertisements/create/data";
import {
  getHeatingItemsForListing as getHeatingItems,
  getFacilityItemsForListing as getFacilityItems,
} from "../../advertisements/create/constants/listingOptions";
import { dedupeBlocks, sortSaleApartmentBlocks, sortSaleResidentialBlocks } from "./blockOrder";

export function getFilterBlocks(
  transaction: TransactionType,
  category?: CategoryKey,
): FilterBlock[] {
  if (!category) return [];

  const schema = getFormSchemaByListing(transaction, category);
  if (schema?.filter?.sections && schema.filter.sections.length > 0) {
    return buildFilterBlocksFromSchema(schema.filter.sections, transaction, category);
  }

  if (transaction === "rent" && category === "daily-apartment-suite") {
    return getApprovedDailyApartmentFilterBlocks();
  }

  if (transaction === "rent" && category === "daily-garden-villa") {
    return getApprovedDailyVillaFilterBlocks();
  }

  if (transaction === "rent" && category === "daily-hotel-apartment") {
    return getApprovedDailyHotelFilterBlocks();
  }

  if (transaction === "rent" && category === "daily-workspace") {
    return getApprovedDailyWorkspaceFilterBlocks();
  }

  if (transaction === "project" && category === "project-partnership") {
    return getApprovedProjectPartnershipFilterBlocks();
  }

  if (transaction === "project" && category === "project-presale") {
    return getApprovedProjectPresaleFilterBlocks();
  }

  if (transaction === "sale" && category === "apartment") {
    return getApprovedSaleApartmentFilterBlocks();
  }

  if (transaction === "sale" && category === "land") {
    return getApprovedSaleLandFilterBlocks();
  }

  if (transaction === "sale" && (category === "garden-villa" || category === "villa-house")) {
    return getApprovedSaleGardenVillaFilterBlocks();
  }

  if (transaction === "sale" && category === "office") {
    return getApprovedSaleOfficeFilterBlocks();
  }

  if (transaction === "sale" && category === "commercial-unit") {
    return getApprovedSaleCommercialFilterBlocks();
  }

  if (transaction === "sale" && (category === "factory-workshop" || category === "warehouse")) {
    return getApprovedSaleIndustrialFilterBlocks();
  }

  if (transaction === "sale" && category === "hotel-apartment") {
    return getApprovedSaleHotelFilterBlocks();
  }

  if (transaction === "rent" && category === "apartment") {
    return getApprovedRentApartmentFilterBlocks();
  }

  if (transaction === "rent" && (category === "villa-house" || category === "garden-villa")) {
    return getApprovedRentVillaHouseFilterBlocks();
  }

  if (transaction === "rent" && category === "office") {
    return getApprovedRentOfficeFilterBlocks();
  }

  if (transaction === "rent" && category === "commercial-unit") {
    return getApprovedRentCommercialFilterBlocks();
  }

  if (transaction === "rent" && (category === "factory-workshop" || category === "warehouse")) {
    return getApprovedRentIndustrialFilterBlocks();
  }

  if (transaction === "rent" && category === "hotel-apartment") {
    return getApprovedRentHotelFilterBlocks();
  }

  const isPartnership = category === "project-partnership";
  const hideHeatingCooling = isPartnership || category === "land";
  const showFacilitiesSection = !isPartnership;

  const blocks: FilterBlock[] = [{ kind: "neighborhood" }];

  if (category === "project-presale") {
    blocks.push(...getProjectPresaleBlocks());
  } else {
    blocks.push(...getBasicFields(transaction, category).map(blockFromBasicField));
  }

  blocks.push(...getPriceBlocks(transaction, category));

  if (!isProjectCategory(category) || category === "project-partnership") {
    blocks.push(...getMoreFields(transaction, category).map(blockFromMoreFeatureField));
  }

  if (transaction === "sale") {
    if (category !== "garden-villa") {
      blocks.push({ kind: "loan" });
    }

    blocks.push({
      icon: "exchange",
      id: "exchangeWith",
      kind: "multi",
      options: exchangeTargets.map((label) => ({ id: label, label })),
      title: "معاوضه با",
    });
  } else if (transaction === "project" && category === "project-presale") {
    blocks.push({
      icon: "exchange",
      id: "exchangeWith",
      kind: "multi",
      options: exchangeTargets.map((label) => ({ id: label, label })),
      title: "معاوضه با",
    });
  }

  if (!hideHeatingCooling) {
    blocks.push({
      icon: "temperature",
      id: "heatingCooling",
      kind: "multi",
      options: getHeatingItems(transaction, category),
      title: "سرمایش و گرمایش",
    });
  }

  if (showFacilitiesSection) {
    blocks.push({
      icon: "settings",
      id: "facilities",
      kind: "multi",
      options: getFacilityItems(transaction, category),
      title: "امکانات",
    });
  }

  blocks.push({ kind: "advertiser" }, { kind: "publicationTime" }, { kind: "adFlags" });

  const dedupedBlocks = dedupeBlocks(blocks);

  if (transaction === "sale" && category === "apartment") {
    return sortSaleApartmentBlocks(dedupedBlocks);
  }

  if (transaction === "sale" && ["villa-house", "land"].includes(category)) {
    return sortSaleResidentialBlocks(dedupedBlocks, category);
  }

  return dedupedBlocks;
}
