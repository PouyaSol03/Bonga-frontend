import { getFormSchemaByListing } from "../../../forms";
import { getParams } from "../../utils";

export function getDetailsListingConfig(label?: string) {
  const { transaction, category } = getParams();
  const formSchema = getFormSchemaByListing(transaction, category);
  const isProject = transaction === "project";
  const isPartnership = isProject && category === "project-partnership";
  const isRent = formSchema?.create?.pricing?.mode === "rent" || transaction === "rent";
  const isDailyRent =
    formSchema?.create?.pricing?.mode === "dailyRent" || (isRent && category.startsWith("daily-"));
  const isDailyHotelRent = isRent && category === "daily-hotel-apartment";
  const isDailyVillaRent = isRent && category === "daily-garden-villa";
  const isSaleGardenVilla = transaction === "sale" && category === "garden-villa";
  const isSaleApartment = transaction === "sale" && category === "apartment";
  const isSaleVillaHouse = transaction === "sale" && category === "villa-house";
  const isSaleOffice = transaction === "sale" && category === "office";
  const isSaleCommercial = transaction === "sale" && category === "commercial-unit";
  const isRentApartment = transaction === "rent" && category === "apartment";
  const isRentVillaHouse = transaction === "rent" && category === "villa-house";
  const isRentOffice = transaction === "rent" && category === "office";
  const isRentCommercial = transaction === "rent" && category === "commercial-unit";
  const isSaleResidential =
    transaction === "sale" && ["apartment", "villa-house", "land"].includes(category);
  const isRentResidential =
    transaction === "rent" && ["apartment", "villa-house", "garden-villa"].includes(category);
  const hideHeatingCooling =
    formSchema?.create?.heatingCooling?.enabled === false || isPartnership || category === "land";
  const showFacilitiesSection = formSchema?.create?.facilities?.enabled !== false && !isPartnership;
  const allowLoan = formSchema?.create?.pricing?.loan ?? !isSaleGardenVilla;
  const allowExchange = formSchema?.create?.pricing?.exchange ?? true;
  const allowRentConversion =
    formSchema?.create?.pricing?.rentConversion !== false && !isPartnership && isRent;

  const specsTitle =
    formSchema?.create?.specsTitle ??
    (formSchema?.title
      ? `مشخصات ${formSchema.title.replace(/^(فروش|اجاره روزانه|اجاره)\s+/, "")}`
      : isDailyVillaRent
        ? "مشخصات ویلا"
        : isSaleApartment || isRentApartment
          ? "مشخصات آپارتمان"
          : isSaleVillaHouse || isRentVillaHouse
            ? "مشخصات خانه و ویلا"
            : isSaleOffice || isRentOffice
              ? "مشخصات اداری"
              : isSaleCommercial || isRentCommercial
                ? "مشخصات تجاری"
                : label
                  ? `مشخصات ${label}`
                  : "مشخصات ملک");
  return {
    transaction,
    category,
    specsTitle,
    isProject,
    isPartnership,
    isRent,
    isDailyRent,
    isDailyHotelRent,
    hideHeatingCooling,
    showFacilitiesSection,
    allowLoan,
    allowExchange,
    allowRentConversion,
    locationTitle: isSaleResidential || isRentResidential ? "موقعیت آگهی" : "موقعیت ملک",
  };
}
