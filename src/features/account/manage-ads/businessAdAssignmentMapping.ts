import type { AgencyAdvertiseAssignmentDto } from "../../advertisements/api/agency-advertise-assignment.service";
import { mapAdvertisementToAdCard } from "../../advertisements/api/advertisement.service";
import { toPersianDigits } from "../../../shared/lib/numberUtils";
import type { ConsultantAd } from "../adManagement/adManagementData";

export type AssignmentCountdown = { hours: number; minutes: number; isExpired: boolean };

export function mapAssignmentToAd(assignment: AgencyAdvertiseAssignmentDto, index: number): ConsultantAd {
  if (assignment.advertise) {
    return {
      ...mapAdvertisementToAdCard(assignment.advertise, index),
      id: assignment.advertiseId,
      status: "در انتظار انتشار",
    };
  }
  return {
    agency: "",
    area: "-",
    badges: [],
    id: assignment.advertiseId,
    imageClassName: `ad-card__image--${(index % 4) + 1}`,
    imageCount: "0",
    priceLabelPrimary: "",
    priceLabelSecondary: "",
    pricePrimary: "توافقی",
    priceSecondary: "",
    rooms: "-",
    status: "در انتظار انتشار",
    timeAndLocation: "",
    title: `آگهی شماره ${toPersianDigits(assignment.advertiseId)}`,
    year: "-",
  };
}

export function getAssignmentCountdown(
  assignment: AgencyAdvertiseAssignmentDto,
): AssignmentCountdown {
  let targetTime: number | null = assignment.expiresAt ? Date.parse(assignment.expiresAt) : null;
  if (!targetTime || !Number.isFinite(targetTime)) {
    const raw =
      assignment.createdAt ||
      (assignment.metadata?.created_at as string) ||
      (assignment.metadata?.assigned_at as string) ||
      (assignment.advertise?.updated_at as string) ||
      (assignment.advertise?.created_at as string);
    const parsed = raw ? Date.parse(raw) : null;
    targetTime = parsed && Number.isFinite(parsed) ? parsed + 86_400_000 : Date.now() + 86_400_000;
  }
  const diff = targetTime - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, isExpired: true };
  const remaining = Math.ceil(diff / 60_000);
  return { hours: Math.floor(remaining / 60), minutes: remaining % 60, isExpired: false };
}
