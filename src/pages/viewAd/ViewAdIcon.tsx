import type { ComponentType, SVGProps } from "react";

import LinearAdd from "../../components/(icons)/LinearAdd";
import LinearAlbum from "../../components/(icons)/LinearAlbum";
import LinearApartment from "../../components/(icons)/LinearApartment";
import LinearArrowDown1 from "../../components/(icons)/LinearArrowDown1";
import LinearArrowLeft1 from "../../components/(icons)/LinearArrowLeft1";
import LinearArrowRight1 from "../../components/(icons)/LinearArrowRight1";
import LinearArrowUp1 from "../../components/(icons)/LinearArrowUp1";
import LinearAttachment from "../../components/(icons)/LinearAttachment";
import LinearBed from "../../components/(icons)/LinearBed";
import LinearBookmarkAll from "../../components/(icons)/LinearBookmarkAll";
import LinearBookmarkSolid from "../../components/(icons)/LinearBookmarkSolid";
import LinearBuilding from "../../components/(icons)/LinearBuilding";
import LinearCabinet from "../../components/(icons)/LinearCabinet";
import LinearCalendar from "../../components/(icons)/LinearCalendar";
import LinearCeramic from "../../components/(icons)/LinearCeramic";
import LinearChat from "../../components/(icons)/LinearChat";
import LinearCooler from "../../components/(icons)/LinearCooler";
import LinearDimensions from "../../components/(icons)/LinearDimensions";
import LinearDocument from "../../components/(icons)/LinearDocument";
import LinearEvalator from "../../components/(icons)/LinearEvalator";
import LinearExchange from "../../components/(icons)/LinearExchange";
import LinearFloor from "../../components/(icons)/LinearFloor";
import LinearInformation from "../../components/(icons)/LinearInformation";
import LinearLocation from "../../components/(icons)/LinearLocation";
import LinearMoney from "../../components/(icons)/LinearMoney";
import LinearMoreVertical from "../../components/(icons)/LinearMoreVertical";
import LinearNavigation from "../../components/(icons)/LinearNavigation";
import LinearNoteAdd from "../../components/(icons)/LinearNoteAdd";
import LinearParking from "../../components/(icons)/LinearParking";
import LinearPayment from "../../components/(icons)/LinearPayment";
import LinearRadiator from "../../components/(icons)/LinearRadiator";
import LinearRanking from "../../components/(icons)/LinearRanking";
import LinearRequestList from "../../components/(icons)/LinearRequestList";
import LinearRuler from "../../components/(icons)/LinearRuler";
import LinearSaveMoney from "../../components/(icons)/LinearSaveMoney";
import LinearShare from "../../components/(icons)/LinearShare";
import LinearStar from "../../components/(icons)/LinearStar";
import LinearTerrace from "../../components/(icons)/LinearTerrace";
import LinearTooman from "../../components/(icons)/LinearTooman";
import LinearUnderfloorHeating from "../../components/(icons)/LinearUnderfloorHeating";
import LinearVideo from "../../components/(icons)/LinearVideo";
import LinearWarehouse from "../../components/(icons)/LinearWarehouse";
import LinearWaterCooler from "../../components/(icons)/LinearWaterCooler";
import LinearWaterHeater from "../../components/(icons)/LinearWaterHeater";
import LinearYard from "../../components/(icons)/LinearYard";
import type { IconName } from "./viewAdTypes";

type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const iconComponents: Record<Exclude<IconName, "bookmark">, SvgIconComponent> = {
  add: LinearAdd,
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
    const BookmarkIcon = filled ? LinearBookmarkSolid : LinearBookmarkAll;
    return <BookmarkIcon aria-hidden="true" className={resolvedClassName} />;
  }

  const IconComponent = iconComponents[name];
  return <IconComponent aria-hidden="true" className={resolvedClassName} />;
}
