import type { AdvertisementItem } from "../../api/advertisement.service";
import type { AgencyUserContactData } from "../components/AgencyUserContactBottomSheet";
import type { ViewAdDetails } from "../viewAdTypes";
import { readContactInfo } from "./contactInfo";
import { toNonEmptyText } from "./advertisementNeighborhood";

export function readAgencyUserContact(
  ad: AdvertisementItem,
  details: ViewAdDetails,
  historyContact?: AgencyUserContactData,
): AgencyUserContactData {
  const contactInfo = readContactInfo(ad);
  const rawAgencyUserContact = historyContact;
  const rawAd = ad as Record<string, unknown> | undefined;
  const rawUser = (rawAd?.user && typeof rawAd.user === "object" ? rawAd.user : undefined) as
    Record<string, unknown> | undefined;
  const rawAdvertiser = (
    rawAd?.advertiser && typeof rawAd.advertiser === "object" ? rawAd.advertiser : undefined
  ) as Record<string, unknown> | undefined;
  const rawOwner = (rawAd?.owner && typeof rawAd.owner === "object" ? rawAd.owner : undefined) as
    Record<string, unknown> | undefined;
  const rawContacts = (
    rawAd?.contacts && typeof rawAd.contacts === "object" ? rawAd.contacts : undefined
  ) as Record<string, unknown> | undefined;

  const agencyUserContact: AgencyUserContactData = {
    name:
      rawAgencyUserContact?.name ??
      (toNonEmptyText(rawAd?.user_name) ||
        toNonEmptyText(rawUser?.name) ||
        toNonEmptyText(rawUser?.full_name) ||
        toNonEmptyText(rawAdvertiser?.name) ||
        toNonEmptyText(rawAd?.advertiser_name) ||
        toNonEmptyText(rawOwner?.name) ||
        toNonEmptyText(rawAd?.owner_name) ||
        toNonEmptyText(rawAd?.contact_name) ||
        toNonEmptyText(rawAd?.contact_person) ||
        undefined),
    phone:
      rawAgencyUserContact?.phone ??
      (toNonEmptyText(contactInfo.phone) ||
        toNonEmptyText(rawAd?.phone) ||
        toNonEmptyText(rawAd?.user_phone) ||
        toNonEmptyText(rawAd?.mobile) ||
        toNonEmptyText(rawUser?.phone) ||
        toNonEmptyText(rawUser?.mobile) ||
        toNonEmptyText(rawAdvertiser?.phone) ||
        toNonEmptyText(rawAdvertiser?.mobile) ||
        toNonEmptyText(rawOwner?.phone) ||
        toNonEmptyText(rawOwner?.mobile) ||
        undefined),
    smsPhone:
      rawAgencyUserContact?.smsPhone ??
      (toNonEmptyText(rawAd?.sms_phone) ||
        toNonEmptyText(rawContacts?.sms) ||
        toNonEmptyText(contactInfo.phone) ||
        toNonEmptyText(rawAd?.phone) ||
        toNonEmptyText(rawAd?.user_phone) ||
        toNonEmptyText(rawUser?.phone) ||
        undefined),
    address:
      rawAgencyUserContact?.address ??
      (toNonEmptyText(rawAd?.address) ||
        toNonEmptyText(rawAd?.location_address) ||
        toNonEmptyText(details.locationTitle) ||
        undefined),
    social: rawAgencyUserContact?.social ?? {
      instagram: contactInfo.instagram || undefined,
      telegram: contactInfo.telegram || undefined,
      whatsapp: contactInfo.whatsapp || undefined,
    },
  };
  return agencyUserContact;
}
