import type { AdCardData, AdCategoryType, AdCardPropertyValue } from "./types";
import LinearApartment from "../../../../shared/icons/LinearApartment";
import LinearFloor from "../../../../shared/icons/LinearFloor";
import LinearConstruction from "../../../../shared/icons/LinearConstruction";
import LinearSettingBuilding from "../../../../shared/icons/LinearSettingBuilding";
import LinearHouseDimensions from "../../../../shared/icons/LinearHouseDimensions";
import { AdCardPositionIcon } from "../AdCardIcons";
import { formatSquareMeters } from "./propertyFormatters";

export function getProjectProperties(ad: AdCardData, category: AdCategoryType): AdCardPropertyValue[] {
  switch (category) {
    case "project-presale":
      return [
        { icon: <LinearConstruction className="h-5 w-5" />, value: ad.projectType || "مسکونی" },
        { icon: <LinearFloor className="h-5 w-5" />, value: ad.totalFloors },
        { icon: <LinearApartment className="h-5 w-5" />, value: ad.totalUnits },
      ];

    case "project-partnership":
      return [
        {
          icon: <LinearHouseDimensions className="h-5 w-5" />,
          value: formatSquareMeters(ad.landArea || ad.area),
        },
        { icon: <AdCardPositionIcon className="h-5 w-5" />, value: ad.landPosition },
        { icon: <LinearSettingBuilding className="h-5 w-5" />, value: ad.currentStatus },
      ];


  }
  return [];
}
