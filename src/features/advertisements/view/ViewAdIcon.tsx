import type { ComponentType, SVGProps } from "react";

import LinearAdd from "../../../shared/icons/LinearAdd";
import LinearAddToList from "../../../shared/icons/LinearAddToList";
import LinearAlbum from "../../../shared/icons/LinearAlbum";
import LinearApartment from "../../../shared/icons/LinearApartment";
import LinearArrowDown1 from "../../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearArrowRight1 from "../../../shared/icons/LinearArrowRight1";
import LinearArrowUp1 from "../../../shared/icons/LinearArrowUp1";
import LinearAttachment from "../../../shared/icons/LinearAttachment";
import LinearBed from "../../../shared/icons/LinearBed";
import BoldBookmarkSolid from "../../../shared/icons/BoldBookmarkSolid";
import LinearBookmarkSolid from "../../../shared/icons/LinearBookmarkSolid";
import LinearBuilding from "../../../shared/icons/LinearBuilding";
import LinearCabinet from "../../../shared/icons/LinearCabinet";
import LinearCalendar from "../../../shared/icons/LinearCalendar";
import LinearCeramic from "../../../shared/icons/LinearCeramic";
import LinearChat from "../../../shared/icons/LinearChat";
import LinearCooler from "../../../shared/icons/LinearCooler";
import LinearDimensions from "../../../shared/icons/LinearDimensions";
import LinearDocument from "../../../shared/icons/LinearDocument";
import LinearEvalator from "../../../shared/icons/LinearEvalator";
import LinearExchange from "../../../shared/icons/LinearExchange";
import LinearFloor from "../../../shared/icons/LinearFloor";
import LinearInformation from "../../../shared/icons/LinearInformation";
import LinearInformationDiamond from "../../../shared/icons/LinearInformationDiamond";
import LinearLocation from "../../../shared/icons/LinearLocation";
import LinearMoney from "../../../shared/icons/LinearMoney";
import LinearMoreVertical from "../../../shared/icons/LinearMoreVertical";
import LinearNavigation from "../../../shared/icons/LinearNavigation";
import LinearNoteAdd from "../../../shared/icons/LinearNoteAdd";
import LinearParking from "../../../shared/icons/LinearParking";
import LinearPayment from "../../../shared/icons/LinearPayment";
import LinearRadiator from "../../../shared/icons/LinearRadiator";
import LinearRanking from "../../../shared/icons/LinearRanking";
import LinearRequestList from "../../../shared/icons/LinearRequestList";
import LinearRuler from "../../../shared/icons/LinearRuler";
import LinearSaveMoney from "../../../shared/icons/LinearSaveMoney";
import LinearShare from "../../../shared/icons/LinearShare";
import LinearStar from "../../../shared/icons/LinearStar";
import LinearTerrace from "../../../shared/icons/LinearTerrace";
import LinearTooman from "../../../shared/icons/LinearTooman";
import LinearUnderfloorHeating from "../../../shared/icons/LinearUnderfloorHeating";
import LinearVideo from "../../../shared/icons/LinearVideo";
import LinearWarehouse from "../../../shared/icons/LinearWarehouse";
import LinearWaterCooler from "../../../shared/icons/LinearWaterCooler";
import LinearWaterHeater from "../../../shared/icons/LinearWaterHeater";
import LinearYard from "../../../shared/icons/LinearYard";
import type { IconName } from "./viewAdTypes";

type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const iconComponents: Record<Exclude<IconName, "bookmark">, SvgIconComponent> = {
  add: LinearAdd,
  addToList: LinearAddToList,
  album: LinearAlbum,
  apartment: LinearApartment,
  area: LinearDimensions,
  attachment: LinearAttachment,
  arrowLeft: LinearArrowLeft1,
  arrowDown: LinearArrowDown1,
  arrowUp: LinearArrowUp1,
  back: LinearArrowRight1,
  bed: LinearBed,
  building: LinearBuilding,
  cabinet: LinearCabinet,
  calendar: LinearCalendar,
  ceramic: LinearCeramic,
  chat: LinearChat,
  checklist: LinearRequestList,
  cooler: LinearCooler,
  document: LinearDocument,
  elevator: LinearEvalator,
  exchange: LinearExchange,
  floor: LinearFloor,
  info: LinearInformation,
  informationDiamond: LinearInformationDiamond,
  loan: LinearSaveMoney,
  location: LinearLocation,
  money: LinearMoney,
  more: LinearMoreVertical,
  navigation: LinearNavigation,
  note: LinearNoteAdd,
  parking: LinearParking,
  payment: LinearPayment,
  radiator: LinearRadiator,
  ranking: LinearRanking,
  ruler: LinearRuler,
  share: LinearShare,
  star: LinearStar,
  terrace: LinearTerrace,
  tooman: LinearTooman,
  underfloorHeating: LinearUnderfloorHeating,
  video: LinearVideo,
  warehouse: LinearWarehouse,
  waterCooler: LinearWaterCooler,
  waterHeater: LinearWaterHeater,
  yard: LinearYard,
};

export function ViewAdIcon({
  className = "",
  filled = false,
  name,
}: {
  className?: string;
  filled?: boolean;
  name: IconName;
}) {
  const resolvedClassName = `h-6 w-6 shrink-0 ${className}`;

  if (name === "bookmark") {
    const BookmarkIcon = filled ? BoldBookmarkSolid : LinearBookmarkSolid;
    return <BookmarkIcon aria-hidden="true" className={resolvedClassName} />;
  }

  const IconComponent = iconComponents[name];
  return <IconComponent aria-hidden="true" className={resolvedClassName} />;
}
