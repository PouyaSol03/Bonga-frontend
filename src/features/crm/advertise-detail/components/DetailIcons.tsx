import type { ReactNode } from "react";
import LinearApartment from "../../../../shared/icons/LinearApartment";
import LinearBuilding from "../../../../shared/icons/LinearBuilding";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import LinearDocument from "../../../../shared/icons/LinearDocument";
import LinearHouseDimensions from "../../../../shared/icons/LinearHouseDimensions";
import LinearLocation from "../../../../shared/icons/LinearLocation";
import LinearMoney from "../../../../shared/icons/LinearMoney";
import LinearOwner from "../../../../shared/icons/LinearOwner";

export function getFeatureIcon(key: string): ReactNode {
  const className = "h-5 w-5";

  if (key.includes("area") || key.includes("meter"))
    return <LinearHouseDimensions className={className} />;
  if (key.includes("price") || key.includes("mortgage") || key.includes("rent"))
    return <LinearMoney className={className} />;
  if (key.includes("floor") || key.includes("building") || key.includes("project"))
    return <LinearBuilding className={className} />;
  if (key.includes("document") || key.includes("permit") || key.includes("license"))
    return <LinearDocument className={className} />;
  if (key.includes("location") || key.includes("position"))
    return <LinearLocation className={className} />;
  if (key.includes("date") || key.includes("year") || key.includes("age"))
    return <LinearCalendar className={className} />;
  if (key.includes("owner") || key.includes("advertiser"))
    return <LinearOwner className={className} />;

  return <LinearApartment className={className} />;
}
