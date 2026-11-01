import { type AdvertisementItem } from "./item-types";

export function readRecordText(
  record: Record<string, unknown>,
  keys: string[],
) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

export function getAdvertisementPublisherName(item: AdvertisementItem) {
  const publisherType = String(
    item.publisher_type ?? item.owner_type ?? "user",
  ).toLowerCase();
  const record = item as Record<string, unknown>;

  if (publisherType === "agent") {
    if (item.agent?.name?.trim()) return item.agent.name.trim();
    if (item.consultant?.name?.trim()) return item.consultant.name.trim();

    return readRecordText(record, [
      "agent_name",
      "consultant_name",
      "publisher_agent_name",
    ]);
  }

  if (publisherType === "agency") {
    if (typeof item.agency === "string" && item.agency.trim())
      return item.agency.trim();
    if (
      item.agency &&
      typeof item.agency === "object" &&
      item.agency.name?.trim()
    ) {
      return item.agency.name.trim();
    }

    return readRecordText(record, ["agency_name", "publisher_agency_name"]);
  }

  const ownerProfile = item.owner_profile;
  if (ownerProfile?.display_name?.trim())
    return ownerProfile.display_name.trim();
  if (ownerProfile?.first_name?.trim()) {
    return `${ownerProfile.first_name.trim()} ${ownerProfile.last_name?.trim() ?? ""}`.trim();
  }

  return readRecordText(record, [
    "owner_name",
    "advertiser_name",
    "user_name",
    "publisher_user_name",
  ]);
}
