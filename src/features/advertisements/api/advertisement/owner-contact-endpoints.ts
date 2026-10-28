import { updateV2OwnerContact } from "../v2/advertisement-v2-lifecycle.service";
import { type AdvertisementItem } from "./item-types";

export async function updateOwnerContact({
  advertiseId,
  ownerContactName,
  ownerContactPhone,
  ownerContactAddress,
}: {
  advertiseId: string;
  ownerContactName?: string;
  ownerContactPhone?: string;
  ownerContactAddress?: string;
}) {
  const jsonBody: Record<string, string> = {};
  if (ownerContactName !== undefined) {
    jsonBody.owner_contact_name = ownerContactName;
  }
  if (ownerContactPhone !== undefined) {
    jsonBody.owner_contact_phone = ownerContactPhone;
  }
  if (ownerContactAddress !== undefined) {
    jsonBody.owner_contact_address = ownerContactAddress;
  }

  const response = await updateV2OwnerContact(advertiseId, jsonBody);
  return ((response as Record<string, unknown>)?.data ??
    (response as Record<string, unknown>)?.result ??
    response) as AdvertisementItem;
}
