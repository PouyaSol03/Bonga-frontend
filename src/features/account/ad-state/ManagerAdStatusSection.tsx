import type { AdCardData } from "../../advertisements/components/AdCard";
import type { getMyAdStatusInfo } from "../myAdsStatus";
import { Typography } from "../../../shared/ui/Typography";
import { ManagerAdSummary } from "./ManagerAdSummary";
import { PublishedMeta } from "./PublishedMeta";
import { ManagerStopRequestNotice } from "./ManagerStopRequestNotice";
import { ManagerDealConfirmationNotice } from "./ManagerDealConfirmationNotice";

export function ManagerAdStatusSection({ ad, card, statusInfo }: {
  ad?: Record<string, unknown>;
  card: AdCardData;
  statusInfo: ReturnType<typeof getMyAdStatusInfo>;
}) {
  return (
    <section className="bg-surface-container-lowest px-4 pt-4 pb-4" aria-label={card.title}>
      <div className="flex justify-start">
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className={`inline-flex h-9 items-center rounded-lg px-3 text-sm leading-5 font-medium ${statusInfo.badgeClassName}`}
        >
          {statusInfo.label}
        </Typography>
      </div>
      <ManagerAdSummary ad={ad} card={card} />
      {["published", "wait_for_stop", "wait_for_deal_confirmation"].includes(statusInfo.key) ? (
        <PublishedMeta ad={ad} />
      ) : null}
      {statusInfo.key === "wait_for_stop" ? <ManagerStopRequestNotice ad={ad} /> : null}
      {statusInfo.key === "wait_for_deal_confirmation" ? (
        <ManagerDealConfirmationNotice />
      ) : null}
    </section>
  );
}
