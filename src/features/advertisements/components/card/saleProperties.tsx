import type { AdCardData, AdCategoryType, AdCardPropertyValue } from "./types";
import LinearCity from "../../../../shared/icons/LinearCity";
import LinearHouseDimensions from "../../../../shared/icons/LinearHouseDimensions";
import { AdCardAreaIcon, AdCardPositionIcon , AdCardRoomsIcon , AdCardSanadIcon , AdCardYearIcon  } from "../AdCardIcons";




import { formatSquareMeters, formatBuildingAgeClean } from "./propertyFormatters";

export function getSaleProperties(ad: AdCardData, category: AdCategoryType): AdCardPropertyValue[] {
  switch (category) {
    case "sale-apartment":
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardYearIcon className="h-5 w-5" />, value: formatBuildingAgeClean(ad.year) },
      ];

    case "sale-land":
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        {
          icon: <LinearHouseDimensions className="h-5 w-5" />,
          value: formatSquareMeters(ad.landArea),
        },
        { icon: <AdCardSanadIcon className="h-5 w-5" />, value: ad.documentType },
      ];

    case "sale-garden-villa":
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardYearIcon className="h-5 w-5" />, value: formatBuildingAgeClean(ad.year) },
      ];

    case "sale-office":
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardYearIcon className="h-5 w-5" />, value: formatBuildingAgeClean(ad.year) },
      ];

    case "sale-commercial":
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        { icon: <AdCardSanadIcon className="h-5 w-5" />, value: ad.documentType },
        { icon: <AdCardPositionIcon className="h-5 w-5" />, value: ad.commercialPosition },
      ];

    case "sale-factory":
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        { icon: <AdCardSanadIcon className="h-5 w-5" />, value: ad.documentType },
        { icon: <AdCardPositionIcon className="h-5 w-5" />, value: ad.landPosition },
      ];

    case "sale-hotel":
      return [
        { icon: <LinearCity className="h-5 w-5" />, value: "هتل" },
        {
          icon: <LinearHouseDimensions className="h-5 w-5" />,
          value: formatSquareMeters(ad.landArea || ad.area),
        },
        { icon: <AdCardSanadIcon className="h-5 w-5" />, value: ad.documentType },
      ];

    default:
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardYearIcon className="h-5 w-5" />, value: formatBuildingAgeClean(ad.year) },
      ];
  }
}
