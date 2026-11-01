import type { AgencyAssignedDeletedVariant } from "./types";
import {
  getActiveTimelineFallbackEntries,
  type FallbackTimelineEntry,
} from "./timelineActiveFallbackData";
import { getInactiveTimelineFallbackEntries } from "./timelineInactiveFallbackData";

export type { FallbackTimelineEntry } from "./timelineActiveFallbackData";

export function getTimelineFallbackEntries({
  agencyName,
  effectiveDeletedVariant,
  isArchived,
  isDeleted,
  isPublished,
  isWaitForAdmin,
  isWaitForAgency,
  isWaitForDeal,
  isWaitForRepost,
  isWaitForStop,
}: {
  agencyName: string;
  effectiveDeletedVariant: AgencyAssignedDeletedVariant;
  isArchived: boolean;
  isDeleted: boolean;
  isPublished: boolean;
  isWaitForAdmin: boolean;
  isWaitForAgency: boolean;
  isWaitForDeal: boolean;
  isWaitForRepost: boolean;
  isWaitForStop: boolean;
}): FallbackTimelineEntry[] {
  const activeEntries = getActiveTimelineFallbackEntries({
    agencyName,
    isPublished,
    isWaitForAdmin,
    isWaitForAgency,
    isWaitForRepost,
  });

  if (activeEntries) return activeEntries;

  return getInactiveTimelineFallbackEntries({
    agencyName,
    effectiveDeletedVariant,
    isArchived,
    isDeleted,
    isWaitForDeal,
    isWaitForStop,
  });
}
