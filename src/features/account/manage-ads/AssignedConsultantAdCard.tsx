import { Link } from "react-router";
import type { AgencyAdvertiseAssignmentDto } from "../../advertisements/api/agency-advertise-assignment.service";
import { readFeatureValue } from "../../advertisements/api/advertisement.service";
import { AdCardBody } from "../../advertisements/components/AdCard";
import { AdCardAlbumIcon } from "../../advertisements/components/AdCardIcons";
import { hasTour3d, readVideoUrl } from "../../advertisements/view/viewAdDetails";
import Linear3d from "../../../shared/icons/Linear3d";
import LinearArrowLeft2 from "../../../shared/icons/LinearArrowLeft2";
import LinearClock from "../../../shared/icons/LinearClock";
import LinearImage from "../../../shared/icons/LinearImage";
import LinearUserSolid from "../../../shared/icons/LinearUserSolid";
import LinearVideo from "../../../shared/icons/LinearVideo";
import { Typography } from "../../../shared/ui/Typography";
import {
  adManagementPaths,
  getAllocationReviewPath,
  type ConsultantAd,
} from "../adManagement/adManagementData";
import {
  toPersianDigits,
  type AssignmentCountdown,
} from "./businessAdFilters";

function formatAllocationCountdown({ hours, minutes, isExpired }: AssignmentCountdown) {
  if (isExpired || (hours <= 0 && minutes <= 0)) return "مهلت به پایان رسیده است";
  if (hours <= 0) return `${toPersianDigits(minutes)} دقیقه`;
  return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(minutes)} دقیقه`;
}

function getAllocationCountdownBadge(countdown: AssignmentCountdown) {
  if (countdown.isExpired || (countdown.hours <= 0 && countdown.minutes <= 0)) {
    return {
      className: "bg-error-container text-error",
      text: "مهلت تایید تخصیص به پایان رسیده است",
    };
  }
  const text = `${formatAllocationCountdown(countdown)} تا پایان مهلت تایید تخصیص`;
  if (countdown.hours < 4) return { className: "bg-error-container text-error", text };
  if (countdown.hours < 12) return { className: "bg-warning-container text-on-warning-container", text };
  return { className: "bg-tertiary-container text-tertiary", text };
}

export function AssignedConsultantAdCard({
  ad,
  assignment,
  countdown,
  loadMoreRef,
}: {
  ad: ConsultantAd;
  assignment: AgencyAdvertiseAssignmentDto;
  countdown: AssignmentCountdown;
  loadMoreRef?: (node: HTMLElement | null) => void;
}) {
  const countdownBadge = getAllocationCountdownBadge(countdown);
  const routeState = {
    ad,
    assignment,
    assignmentId: assignment.id,
    returnTo: adManagementPaths.root,
    tab: "status" as const,
  };
  const imageSrc = ad.imageUrl;
  const imageCountNum = Number(ad.imageCount || 1) || 1;
  const rawAd = assignment.advertise;

  const hasVideoMedia = Boolean(
    (rawAd && readVideoUrl(rawAd)) ||
      (rawAd?.videos && Array.isArray(rawAd.videos) && rawAd.videos.length > 0) ||
      (rawAd &&
        (readFeatureValue(rawAd, ["has_video"]) === true ||
          readFeatureValue(rawAd, ["has_video"]) === "true")),
  );

  const hasTour3dMedia = Boolean(
    (rawAd && hasTour3d(rawAd)) ||
      (rawAd &&
        (readFeatureValue(rawAd, ["has_virtual_tour", "virtual_tour", "tour_3d", "tour3d"]) === true ||
          readFeatureValue(rawAd, ["has_virtual_tour"]) === "true")),
  );

  const publisherType = String(
    rawAd?.publisher_type ??
      rawAd?.owner_type ??
      (rawAd ? readFeatureValue(rawAd, ["advertiser_type"]) : "") ??
      "",
  ).toLowerCase();
  const isPersonalAd = Boolean(
    publisherType.includes("user") || publisherType.includes("personal") || publisherType.includes("شخصی"),
  );

  return (
    <article className="bg-surface-container-lowest w-full overflow-hidden rounded-none p-4 [direction:rtl]" ref={loadMoreRef}>
      <div className={`flex h-9 items-center justify-center gap-2 rounded-xl px-3 text-center text-xs font-medium ${countdownBadge.className}`}>
        <LinearClock className="h-4 w-4 shrink-0" />
        <Typography as="span" variant="label" size="small" weight="medium" className="text-xs font-medium">
          {countdownBadge.text}
        </Typography>
      </div>

      <div className="bg-primary-container relative mt-4 aspect-[328/219.3] w-full shrink-0 overflow-hidden rounded-2xl">
        {imageSrc ? (
          <img alt={ad.title} className="h-full w-full object-cover object-center" draggable={false} src={imageSrc} />
        ) : (
          <div className="text-outline absolute inset-0 grid place-items-center" aria-hidden="true">
            <LinearImage className="h-12 w-12" />
          </div>
        )}

        <div className="absolute top-2 right-2 z-10 inline-flex h-7 items-center overflow-hidden rounded-[9px] bg-black/65 text-white shadow-sm [direction:ltr]">
          {hasTour3dMedia ? (
            <div className="grid h-7 min-w-7 place-items-center border-r border-white/30 px-1">
              <Linear3d className="h-4 w-4" />
            </div>
          ) : null}
          {hasVideoMedia ? (
            <div className="grid h-7 min-w-7 place-items-center border-r border-white/30 px-1">
              <LinearVideo className="h-4 w-4" />
            </div>
          ) : null}
          {isPersonalAd ? (
            <div className="grid h-7 min-w-7 place-items-center border-r border-white/30 px-1">
              <LinearUserSolid className="h-4 w-4" />
            </div>
          ) : null}
          <div className="inline-flex h-7 items-center gap-0.5 px-1.5">
            <AdCardAlbumIcon className="h-4 w-4" />
            <Typography as="span" variant="label" size="small" weight="medium" className="text-[10px] leading-none font-medium">
              {toPersianDigits(imageCountNum)}
            </Typography>
          </div>
        </div>
      </div>

      <AdCardBody
        ad={ad}
        className="pt-0"
        hasSecondaryPrice={Boolean(ad.priceSecondary && ad.priceSecondary !== "—")}
        showBadges={Boolean(ad.badges && ad.badges.length > 0)}
      />

      <div className="mt-4 pt-1">
        <Link
          className="border-primary bg-surface-container-lowest text-primary active:bg-primary/10 flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm leading-5 font-medium no-underline"
          state={routeState}
          to={getAllocationReviewPath(ad.id)}
        >
          <Typography as="span" variant="label" size="medium" weight="medium" className="text-primary text-sm font-medium">
            بررسی و تخصیص
          </Typography>
          <LinearArrowLeft2 className="h-5 w-5" />
        </Link>
      </div>
    </article>
  );
}
