import type { AgencyAssignedDeletedVariant } from "../types";
import { getTimelineFallbackEntries } from "../timelineFallbackData";
import { TimelineItem } from "./TimelineItem";

export function TimelineFallbackList({
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
}) {
  const entries = getTimelineFallbackEntries({
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
  });

  return (
    <>
      {entries.map((entry, index) => (
        <TimelineItem
          description={entry.description}
          key={`${entry.time}-${index}`}
          time={entry.time}
          title={entry.title}
        />
      ))}
    </>
  );
}
