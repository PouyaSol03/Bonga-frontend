import type { AdvertisementItem } from "../../api/advertisement.service";

export type PublisherContactType = "personal" | "agency" | "agency-consultant";

export type PublisherContactActions = {
  category: PublisherContactType;
  callLabel: string;
  chatLabel: string;
  chatActionLabel: string;
};

export function getPublisherContactActions(
  ad?: AdvertisementItem | null,
): PublisherContactActions {
  const type = String(ad?.publisher_type ?? ad?.owner_type ?? "").trim().toLowerCase();

  if (type === "agency-consultant") {
    return {
      category: "agency-consultant",
      callLabel: "تماس با مشاور",
      chatLabel: "چت با مشاور",
      chatActionLabel: "شروع گفتگو با مشاور",
    };
  }

  if (type === "agency") {
    return {
      category: "agency",
      callLabel: "تماس با آژانس",
      chatLabel: "چت با آژانس",
      chatActionLabel: "شروع گفتگو با آژانس",
    };
  }

  return {
    category: "personal",
    callLabel: "تماس با کاربر",
    chatLabel: "چت",
    chatActionLabel: "شروع گفتگو با کاربر",
  };
}
