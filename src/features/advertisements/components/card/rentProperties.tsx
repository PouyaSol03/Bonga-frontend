import type { AdCardData, AdCategoryType, AdCardPropertyValue } from "./types";
import LinearCity from "../../../../shared/icons/LinearCity";
import LinearFloor from "../../../../shared/icons/LinearFloor";
import LinearHouseDimensions from "../../../../shared/icons/LinearHouseDimensions";
import { AdCardAreaIcon, AdCardPositionIcon , AdCardRoomsIcon , AdCardSanadIcon , AdCardYearIcon  } from "../AdCardIcons";




import { formatSquareMeters, formatBuildingAgeClean } from "./propertyFormatters";

export function getRentProperties(ad: AdCardData, category: AdCategoryType): AdCardPropertyValue[] {
  switch (category) {
    case "rent-apartment":
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardYearIcon className="h-5 w-5" />, value: formatBuildingAgeClean(ad.year) },
      ];

    case "rent-villa-house":
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardYearIcon className="h-5 w-5" />, value: formatBuildingAgeClean(ad.year) },
      ];

    case "rent-hotel":
      return [
        { icon: <LinearCity className="h-5 w-5" />, value: "هتل" },
        {
          icon: <LinearHouseDimensions className="h-5 w-5" />,
          value: formatSquareMeters(ad.landArea || ad.area),
        },
        { icon: <AdCardSanadIcon className="h-5 w-5" />, value: ad.documentType },
      ];

    case "rent-office":
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <LinearFloor className="h-5 w-5" />, value: ad.floor },
      ];

    case "rent-commercial":
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <LinearFloor className="h-5 w-5" />, value: ad.floor },
      ];

    case "rent-factory":
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        {
          icon: <LinearHouseDimensions className="h-5 w-5" />,
          value: formatSquareMeters(ad.buildingArea || ad.landArea),
        },
        { icon: <AdCardPositionIcon className="h-5 w-5" />, value: ad.landPosition },
      ];


  }
  return [];
}
