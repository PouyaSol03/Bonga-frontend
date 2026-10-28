import {
  dailyHotelFacilityItems,
  dailyRentHeatingItems,
  dailyStayFacilityItems,
  dailyWorkspaceFacilityItems,
  facilityItems,
  heatingItems,
  landFacilityItems,
  projectFacilityItems,
  projectHeatingItems,
  rentApartmentFacilityItems,
  rentCommercialFacilityItems,
  rentFactoryFacilityItems,
  rentHeatingItems,
  rentHotelFacilityItems,
  rentOfficeFacilityItems,
  rentVillaHouseFacilityItems,
  saleApartmentFacilityItems,
  saleApartmentHeatingItems,
  saleCommercialFacilityItems,
  saleCommercialHeatingItems,
  saleFactoryFacilityItems,
  saleFactoryHeatingItems,
  saleHotelFacilityItems,
  saleHotelHeatingItems,
  saleLandFacilityItems,
  saleOfficeFacilityItems,
  saleOfficeHeatingItems,
  saleVillaHouseFacilityItems,
  saleVillaHouseHeatingItems,
} from "./facilityHeatingItems";

export function getHeatingItemsForListing(transaction: string, category: string) {
  if (transaction === "project" && category === "project-presale") return projectHeatingItems;
  if (transaction === "sale" && category === "apartment") return saleApartmentHeatingItems;
  if (transaction === "sale" && category === "villa-house") return saleVillaHouseHeatingItems;
  if (transaction === "sale" && category === "office") return saleOfficeHeatingItems;
  if (transaction === "sale" && category === "commercial-unit") return saleCommercialHeatingItems;
  if (transaction === "sale" && category === "factory-workshop") return saleFactoryHeatingItems;
  if (transaction === "sale" && category === "hotel-apartment") return saleHotelHeatingItems;
  if (transaction === "rent" && category.startsWith("daily-")) return dailyRentHeatingItems;
  if (
    transaction === "rent" &&
    [
      "apartment",
      "villa-house",
      "office",
      "commercial-unit",
      "factory-workshop",
      "hotel-apartment",
    ].includes(category)
  )
    return rentHeatingItems;

  return heatingItems;
}

export function getFacilityItemsForListing(transaction: string, category: string) {
  if (transaction === "project" && category === "project-presale") return projectFacilityItems;
  if (transaction === "sale" && category === "apartment") return saleApartmentFacilityItems;
  if (transaction === "sale" && category === "villa-house") return saleVillaHouseFacilityItems;
  if (transaction === "sale" && category === "land") return saleLandFacilityItems;
  if (transaction === "sale" && category === "office") return saleOfficeFacilityItems;
  if (transaction === "sale" && category === "commercial-unit") return saleCommercialFacilityItems;
  if (transaction === "sale" && category === "factory-workshop") return saleFactoryFacilityItems;
  if (transaction === "sale" && category === "hotel-apartment") return saleHotelFacilityItems;
  if (transaction === "rent" && category === "apartment") return rentApartmentFacilityItems;
  if (transaction === "rent" && category === "villa-house") return rentVillaHouseFacilityItems;
  if (transaction === "rent" && category === "office") return rentOfficeFacilityItems;
  if (transaction === "rent" && category === "commercial-unit") return rentCommercialFacilityItems;
  if (transaction === "rent" && category === "factory-workshop") return rentFactoryFacilityItems;
  if (transaction === "rent" && category === "hotel-apartment") return rentHotelFacilityItems;
  if (transaction === "rent" && ["daily-apartment-suite", "daily-garden-villa"].includes(category))
    return dailyStayFacilityItems;
  if (transaction === "rent" && category === "daily-hotel-apartment")
    return dailyHotelFacilityItems;
  if (transaction === "rent" && category === "daily-workspace") return dailyWorkspaceFacilityItems;

  return category === "land" || category === "factory-workshop" ? landFacilityItems : facilityItems;
}
