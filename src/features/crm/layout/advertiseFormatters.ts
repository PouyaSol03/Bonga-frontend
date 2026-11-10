import type { CrmRecord } from "../api/crm.service";
import { truncateAdCardText, type AdCardData } from "../../advertisements/components/AdCard";
import {
  mapAdvertisementToAdCard,
  type AdvertisementItem,
} from "../../advertisements/api/advertisement.service";
import { readText, readNestedText, readArray, formatMoney } from "./recordFormatters";

export function advertiseLocationLabel(advertise: CrmRecord, fallback = "موقعیت ثبت نشده") {
  const city = readText(advertise, ["city_name"], "") || readNestedText(advertise, ["city"]);
  const neighborhood =
    readText(advertise, ["neighborhood_name", "district_name"], "") ||
    readNestedText(advertise, ["neighborhood", "district"]);
  const address = readText(advertise, ["address", "full_address", "formatted_address"], "");

  return address || [city, neighborhood].filter(Boolean).join("، ") || fallback;
}
export function advertiseStatusLabel(status: unknown) {
  const key = String(status ?? "")
    .trim()
    .toLowerCase();

  return (
    {
      accepted: "منتشر شده",
      deleted: "حذف شده",
      expired: "منقضی شده",
      needs_edit: "نیازمند ویرایش",
      rejected: "رد شده",
      wait_for_admin: "در انتظار بررسی",
      wait_for_agency: "در انتظار آژانس",
      wait_for_payment: "در انتظار پرداخت",
      incomplete: "نیمه کاره",
      "-3": "منقضی شده",
      "-2": "حذف شده",
      "-1": "رد شده",
      "-4": "نیازمند ویرایش",
      "0": "در انتظار پرداخت",
      "1": "در انتظار بررسی",
      "2": "در انتظار آژانس",
      "3": "منتشر شده",
    }[key] ??
    key ??
    "-"
  );
}
export function mapCrmAdvertiseToCard(advertise: CrmRecord, index: number): AdCardData {
  const mapped = mapAdvertisementToAdCard(advertise as AdvertisementItem, index);
  const rawPrice = formatMoney(advertise.price);

  return {
    ...mapped,
    agency: readText(advertise, ["agency_name", "publisher_name"], mapped.agency),
    imageCount: mapped.imageCount || String(readArray(advertise, "images").length || 1),
    pricePrimary:
      mapped.pricePrimary && mapped.pricePrimary !== "-" ? mapped.pricePrimary : rawPrice,
    status: advertiseStatusLabel(advertise.status),
    title: truncateAdCardText(mapped.title),
    timeAndLocation: truncateAdCardText(advertiseLocationLabel(advertise, mapped.timeAndLocation)),
  };
}
