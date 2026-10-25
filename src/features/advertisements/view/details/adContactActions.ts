import type { AdvertisementItem } from "../../api/advertisement.service";

export type PublisherContactType = "user" | "agency" | "agent";

export type PublisherContactActions = {
  category: PublisherContactType;
  callLabel: string;
  chatLabel: string;
  chatActionLabel: string;
};

export function getPublisherContactActions(
  ad?: AdvertisementItem | null,
): PublisherContactActions {
  const publisherType = String(ad?.publisher_type ?? "").trim().toLowerCase();
  const ownerType = String(ad?.owner_type ?? "").trim().toLowerCase();

  // 1. Agency-Consultant / Consultant / Agent
  const isConsultant =
    publisherType === "agent" ||
    publisherType === "consultant" ||
    publisherType === "agency-consultant" ||
    publisherType === "agency_consultant" ||
    publisherType.includes("consultant") ||
    publisherType.includes("مشاور") ||
    (!publisherType &&
      (ownerType === "agent" ||
        ownerType === "consultant" ||
        ownerType === "agency-consultant" ||
        ownerType.includes("consultant") ||
        ownerType.includes("مشاور") ||
        Boolean(ad?.agent || ad?.consultant || ad?.publisher_agent_id)));

  if (isConsultant) {
    return {
      category: "agent",
      callLabel: "تماس با مشاور",
      chatLabel: "چت با مشاور",
      chatActionLabel: "شروع گفتگو با مشاور",
    };
  }

  // 2. Agency
  const isAgency =
    publisherType === "agency" ||
    publisherType.includes("آژانس") ||
    (!publisherType &&
      (ownerType === "agency" ||
        ownerType.includes("آژانس") ||
        Boolean(ad?.agency || ad?.publisher_agency_id)));

  if (isAgency) {
    return {
      category: "agency",
      callLabel: "تماس با آژانس",
      chatLabel: "چت با آژانس",
      chatActionLabel: "شروع گفتگو با آژانس",
    };
  }

  // 3. User / Personal ("publisher_type": "user")
  return {
    category: "user",
    callLabel: "تماس با کاربر",
    chatLabel: "چت",
    chatActionLabel: "شروع گفتگو با کاربر",
  };
}
