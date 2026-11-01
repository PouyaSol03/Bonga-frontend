import { type AdvertisementItem } from "../../api/advertisement.service";
import { toBooleanLike } from ".././viewAdDetails";

export type SingleAdContactInfo = {
  chat: boolean;
  instagram: string;
  phone: string;
  telegram: string;
  whatsapp: string;
};

export function readRawContactText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);

  return "";
}

export function readContactInfo(ad: AdvertisementItem): SingleAdContactInfo {
  const contacts = ad.contacts ?? {};
  const social = ad.social ?? {};
  const contactType = Array.isArray(ad.contact_type)
    ? ad.contact_type.map((item) => readRawContactText(item).toLowerCase())
    : [];

  return {
    chat: toBooleanLike(contacts.chat) ?? contactType.includes("chat"),
    instagram: readRawContactText(contacts.instagram) || readRawContactText(social.instagram),
    phone: readRawContactText(contacts.phone),
    telegram: readRawContactText(contacts.telegram) || readRawContactText(social.telegram),
    whatsapp: readRawContactText(contacts.whatsapp) || readRawContactText(social.whatsapp),
  };
}
