import { type IconName } from "./filterTypes";

export function getFieldIcon(key: string): IconName {
  if (
    key === "floor" ||
    key === "totalFloors" ||
    key === "projectTotalFloors" ||
    key === "unitsPerFloor"
  )
    return "floor";
  if (
    key === "rooms" ||
    key === "singleRoomCount" ||
    key === "doubleRoomCount" ||
    key === "suiteCount"
  )
    return "bed";
  if (
    key === "documentType" ||
    key === "constructionPermit" ||
    key === "commercialPermit" ||
    key === "commercialLicense" ||
    key === "buildPermit" ||
    key === "officeDocumentType" ||
    key === "hasDocument" ||
    key === "participationType"
  )
    return "agreement";
  if (
    key === "unitType" ||
    key === "landPosition" ||
    key === "unitPosition" ||
    key === "buildingPosition" ||
    key === "officePosition" ||
    key === "commercialPosition" ||
    key.toLowerCase().includes("position") ||
    key === "accessType"
  )
    return "orientation";
  if (key === "age" || key === "buildingAge") return "year";
  if (
    key === "density" ||
    key === "projectType" ||
    key === "spaceType" ||
    key === "accommodationType" ||
    key === "industrialPropertyType"
  )
    return "building";
  if (key === "suitableFor") return "suitable";
  if (key === "buildingType") return "typeBuilding";
  if (
    key === "buildingStyle" ||
    key === "buildingTip" ||
    key === "villaType" ||
    key === "unitLayout"
  )
    return "city02";
  if (key === "heatingCooling") return "temperature";
  if (key === "facilities" || key === "usageType") return "settings";
  if (key === "landWidth" || key === "width") return "houseDimensions";
  if (
    key === "meterage" ||
    key === "landArea" ||
    key === "buildingArea" ||
    key === "projectMeterage"
  )
    return "ruler";
  if (key === "hotelStars" || key === "stars") return "star";

  return "settings";
}
