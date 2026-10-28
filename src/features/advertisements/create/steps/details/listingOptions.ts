import {
  facilityItems,
  heatingItems,
  landFacilityItems,
  saleApartmentFacilityItems,
  saleApartmentHeatingItems,
  saleLandFacilityItems,
  saleCommercialFacilityItems,
  saleCommercialHeatingItems,
  saleFactoryFacilityItems,
  saleFactoryHeatingItems,
  saleOfficeFacilityItems,
  saleOfficeHeatingItems,
  saleHotelFacilityItems,
  saleHotelHeatingItems,
  saleVillaHouseFacilityItems,
  saleVillaHouseHeatingItems,
  rentApartmentFacilityItems,
  rentCommercialFacilityItems,
  rentFactoryFacilityItems,
  rentVillaHouseFacilityItems,
  rentOfficeFacilityItems,
  rentHotelFacilityItems,
  rentHeatingItems,
  dailyRentHeatingItems,
  dailyStayFacilityItems,
  dailyHotelFacilityItems,
  dailyWorkspaceFacilityItems,
  projectFacilityItems,
  projectHeatingItems,
} from "../../data";
import { getFormSchemaByListing } from "../../../forms";

export function getDetailsListingOptions(transaction: string, category: string) {
  const formSchema = getFormSchemaByListing(transaction, category);
  const isProject = transaction === "project";
  const isRent = formSchema?.create?.pricing?.mode === "rent" || transaction === "rent";
  const isDailyRent =
    formSchema?.create?.pricing?.mode === "dailyRent" || (isRent && category.startsWith("daily-"));
  const isDailyHotelRent = isRent && category === "daily-hotel-apartment";
  const isDailyApartmentRent = isRent && category === "daily-apartment-suite";
  const isDailyVillaRent = isRent && category === "daily-garden-villa";
  const isDailyWorkspaceRent = isRent && category === "daily-workspace";
  const isSaleApartment = transaction === "sale" && category === "apartment";
  const isSaleVillaHouse = transaction === "sale" && category === "villa-house";
  const isSaleLand = transaction === "sale" && category === "land";
  const isSaleOffice = transaction === "sale" && category === "office";
  const isSaleCommercial = transaction === "sale" && category === "commercial-unit";
  const isSaleFactory = transaction === "sale" && category === "factory-workshop";
  const isSaleHotel = transaction === "sale" && category === "hotel-apartment";
  const isRentApartment = transaction === "rent" && category === "apartment";
  const isRentVillaHouse = transaction === "rent" && category === "villa-house";
  const isRentOffice = transaction === "rent" && category === "office";
  const isRentHotel = transaction === "rent" && category === "hotel-apartment";
  const isRentCommercial = transaction === "rent" && category === "commercial-unit";
  const isRentFactory = transaction === "rent" && category === "factory-workshop";
  const heatingItemsForListing =
    formSchema?.create?.heatingCooling?.items ??
    (isProject
      ? projectHeatingItems
      : isSaleApartment
        ? saleApartmentHeatingItems
        : isSaleVillaHouse
          ? saleVillaHouseHeatingItems
          : isSaleOffice
            ? saleOfficeHeatingItems
            : isSaleCommercial
              ? saleCommercialHeatingItems
              : isSaleFactory
                ? saleFactoryHeatingItems
                : isSaleHotel
                  ? saleHotelHeatingItems
                  : isDailyRent
                    ? dailyRentHeatingItems
                    : isRentApartment ||
                        isRentVillaHouse ||
                        isRentOffice ||
                        isRentHotel ||
                        isRentCommercial ||
                        isRentFactory
                      ? rentHeatingItems
                      : heatingItems);

  const schemaFacilities = formSchema?.create?.facilities?.items;
  const facilityItemsForCategory = (() => {
    if (schemaFacilities) {
      return schemaFacilities;
    }
    if (isProject) return projectFacilityItems;
    if (isSaleApartment) return saleApartmentFacilityItems;
    if (isSaleVillaHouse) return saleVillaHouseFacilityItems;
    if (isSaleLand) return saleLandFacilityItems;
    if (isSaleOffice) return saleOfficeFacilityItems;
    if (isSaleCommercial) return saleCommercialFacilityItems;
    if (isSaleFactory) return saleFactoryFacilityItems;
    if (isSaleHotel) return saleHotelFacilityItems;
    if (isRentApartment) return rentApartmentFacilityItems;
    if (isRentVillaHouse) return rentVillaHouseFacilityItems;
    if (isRentOffice) return rentOfficeFacilityItems;
    if (isRentHotel) return rentHotelFacilityItems;
    if (isRentCommercial) return rentCommercialFacilityItems;
    if (isRentFactory) return rentFactoryFacilityItems;
    if (isDailyApartmentRent || isDailyVillaRent) return dailyStayFacilityItems;
    if (isDailyHotelRent) return dailyHotelFacilityItems;
    if (isDailyWorkspaceRent) return dailyWorkspaceFacilityItems;

    return category === "land" || category === "factory-workshop"
      ? landFacilityItems
      : facilityItems;
  })();

  return { heatingItemsForListing, facilityItemsForCategory };
}
