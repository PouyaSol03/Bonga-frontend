import { agencyInfoCards } from "./data/agencyInfoCards";
import { consultantInfoCards } from "./data/consultantInfoCards";
import type { BusinessType, InfoCard } from "./types";

export const businessInfoCards: Record<BusinessType, InfoCard[]> = {
  agency: agencyInfoCards,
  "independent-consultant": consultantInfoCards,
};
