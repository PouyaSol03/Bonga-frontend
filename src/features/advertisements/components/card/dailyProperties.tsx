import type { AdCardData, AdCategoryType, AdCardPropertyValue } from "./types";
import LinearCity from "../../../../shared/icons/LinearCity";
import LinearStar from "../../../../shared/icons/LinearStar";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import { AdCardAreaIcon, AdCardCapacityIcon , AdCardRoomsIcon  } from "../AdCardIcons";


import { formatSquareMeters } from "./propertyFormatters";

export function getDailyProperties(ad: AdCardData, category: AdCategoryType): AdCardPropertyValue[] {
  switch (category) {
    case "daily-apartment-suite":
      return [
        { icon: <LinearCity className="h-5 w-5" />, value: "آپارتمان" },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
      ];

    case "daily-garden-villa":
      return [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardCapacityIcon className="h-5 w-5" />, value: ad.capacity },
      ];

    case "daily-hotel":
      return [
        { icon: <LinearCity className="h-5 w-5" />, value: "هتل" },
        { icon: <LinearStar className="h-5 w-5" />, value: ad.stars },
        { icon: <LinearCalendar className="h-5 w-5" />, value: ad.rentalPeriod },
      ];

    case "daily-office-booth":
      return [
        { icon: <LinearCity className="h-5 w-5" />, value: "اتاق کار خصوصی" },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: formatSquareMeters(ad.area) },
      ];


  }
  return [];
}
