import { type IconName } from "./filterTypes";
import LinearSuitable from "../../../shared/icons/LinearSuitable";
import LinearTypeBuilding from "../../../shared/icons/LinearTypeBuilding";
import LinearCity02 from "../../../shared/icons/LinearCity02";
import LinearStar from "../../../shared/icons/LinearStar";
import LinearLocation from "../../../shared/icons/LinearLocation";
import LinearRuler from "../../../shared/icons/LinearRuler";
import LinearHouseDimensions from "../../../shared/icons/LinearHouseDimensions";
import LinearMoney from "../../../shared/icons/LinearMoney";
import LinearBed from "../../../shared/icons/LinearBed";
import LinearBuilding from "../../../shared/icons/LinearBuilding";
import LinearFloor from "../../../shared/icons/LinearFloor";
import LinearApartmentAge from "../../../shared/icons/LinearApartmentAge";
import LinearNavigation from "../../../shared/icons/LinearNavigation";
import LinearTemperature from "../../../shared/icons/LinearTemperature";
import LinearSettingBuilding from "../../../shared/icons/LinearSettingBuilding";
import LinearArrowLeftRight from "../../../shared/icons/LinearArrowLeftRight";
import LinearAgreement from "../../../shared/icons/LinearAgreement";
import LinearArrowDown1 from "../../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearCancelCircle from "../../../shared/icons/LinearCancelCircle";

export function getIcon(icon: IconName) {
  switch (icon) {
    case "bed":
      return <BedIcon />;
    case "building":
      return <BuildingIcon />;
    case "floor":
      return <FloorIcon />;
    case "location":
      return <LocationIcon />;
    case "money":
      return <MoneyIcon />;
    case "orientation":
      return <OrientationIcon />;
    case "ruler":
      return <RulerIcon />;
    case "settings":
      return <SettingsIcon />;
    case "temperature":
      return <TemperatureIcon />;
    case "year":
      return <YearIcon />;
    case "exchange":
      return <ExchangeIcon />;
    case "agreement":
      return <AgreementIcon />;
    case "unitBed":
      return <UnitBedIcon />;
    case "suitable":
      return <LinearSuitable aria-hidden="true" className="h-6 w-6 shrink-0" />;
    case "typeBuilding":
      return <LinearTypeBuilding aria-hidden="true" className="h-6 w-6 shrink-0" />;
    case "city02":
      return <LinearCity02 aria-hidden="true" className="h-6 w-6 shrink-0" />;
    case "houseDimensions":
      return <HouseDimensionsIcon />;
    case "star":
      return <LinearStar aria-hidden="true" className="h-6 w-6 shrink-0" />;
    default:
      return <SettingsIcon />;
  }
}

export function LocationIcon() {
  return <LinearLocation aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function RulerIcon() {
  return <LinearRuler aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function HouseDimensionsIcon() {
  return <LinearHouseDimensions aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function MoneyIcon() {
  return <LinearMoney aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function BedIcon() {
  return <LinearBed aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function BuildingIcon() {
  return <LinearBuilding aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function FloorIcon() {
  return <LinearFloor aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function YearIcon() {
  return <LinearApartmentAge aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function OrientationIcon() {
  return <LinearNavigation aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function TemperatureIcon() {
  return <LinearTemperature aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function SettingsIcon() {
  return <LinearSettingBuilding aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function ExchangeIcon() {
  return <LinearArrowLeftRight aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function AgreementIcon() {
  return <LinearAgreement aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function UnitBedIcon() {
  return <LinearBed aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

export function ChevronDownIcon({ className }: { className?: string } = {}) {
  return (
    <LinearArrowDown1
      aria-hidden="true"
      className={className ?? "text-on-surface-var h-5 w-5 shrink-0"}
    />
  );
}

export function ChevronLeftIcon({ className }: { className?: string } = {}) {
  return (
    <LinearArrowLeft1 aria-hidden="true" className={className ?? "text-primary h-5 w-5 shrink-0"} />
  );
}

export function ClearCircleIcon() {
  return <LinearCancelCircle aria-hidden="true" className="text-primary h-4 w-4 shrink-0" />;
}
