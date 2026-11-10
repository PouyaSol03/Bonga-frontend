import { adManagementPaths, type ConsultantAd } from "../adManagementData";
import type { AgencyAdvertiseAssignmentDto } from "../../../advertisements/api/agency-advertise-assignment.service";

export function getAllocationReviewPathForCurrentAd(adId: ConsultantAd["id"] | string) {
  return `${adManagementPaths.allocationReview}/${encodeURIComponent(String(adId))}`;
}

export function getAllocationRejectPathForCurrentAd(adId: ConsultantAd["id"] | string) {
  return `${getAllocationReviewPathForCurrentAd(adId)}/reject`;
}

export function extractAdvertiserPhone(
  ad: ConsultantAd | undefined,
  assignment: AgencyAdvertiseAssignmentDto | undefined,
): string {
  const rawAdvertiserPhone =
    (ad as Record<string, unknown>)?.phone ??
    (ad as Record<string, unknown>)?.user_phone ??
    (ad as Record<string, unknown>)?.advertiser_phone ??
    (ad as Record<string, unknown>)?.owner_phone ??
    (ad as Record<string, unknown>)?.contact_phone ??
    ((ad as Record<string, unknown>)?.contacts as Record<string, unknown> | undefined)?.phone ??
    assignment?.advertise?.contacts?.phone ??
    (assignment?.advertise as Record<string, unknown> | undefined)?.phone ??
    (assignment?.metadata as Record<string, unknown> | undefined)?.advertiserPhone ??
    (assignment?.metadata as Record<string, unknown> | undefined)?.phone;

  return typeof rawAdvertiserPhone === "string" || typeof rawAdvertiserPhone === "number"
    ? String(rawAdvertiserPhone).trim()
    : "";
}
