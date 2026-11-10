import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import type { NotificationItem } from "../api/notification.service";
import type {
  AgencyConsultantRequestDecision,
  AgencyConsultantRequestDisplayState,
} from "../types";
import { formatNotificationTime, readRecord } from "../notificationRouting";

export function getAgencyConsultantRequestDisplayState(
  item: NotificationItem,
): AgencyConsultantRequestDisplayState | undefined {
  const status = String(item.payload?.request_status ?? "").toLowerCase();
  if (status === "accept" || status === "reject" || status === "cancel") {
    return status;
  }
  return undefined;
}

export function AgencyConsultantRequestDescription({ item }: { item: NotificationItem }) {
  const description = item.description || "یک آژانس شما را برای همکاری دعوت کرده است.";
  const payload = item.payload ?? {};
  const nestedAgency = readRecord(payload.agency);
  const payloadAgencyName = [
    payload.agency_name,
    payload.agencyName,
    nestedAgency?.name,
    nestedAgency?.title,
  ].find((value): value is string => typeof value === "string" && value.trim().length > 0);
  const displayDescription =
    payloadAgencyName && !description.includes(payloadAgencyName)
      ? `درخواست همکاری از آژانس «${payloadAgencyName}»`
      : description;
  const agencyNameInDescription =
    displayDescription.match(/«[^»]+»/)?.[0] ??
    (payloadAgencyName && displayDescription.includes(payloadAgencyName)
      ? payloadAgencyName
      : undefined);

  if (!agencyNameInDescription) {
    return (
      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface-var m-0 truncate text-xs leading-5 font-normal"
      >
        {displayDescription}
      </Typography>
    );
  }

  const [beforeAgency = "", afterAgency = ""] = displayDescription.split(agencyNameInDescription);

  return (
    <Typography
      as="p"
      variant="body"
      size="small"
      weight="regular"
      className="text-on-surface-var m-0 truncate text-xs leading-5 font-normal"
    >
      {beforeAgency}
      <Typography as="span" variant="body" size="small" weight="regular" className="text-primary">
        {agencyNameInDescription}
      </Typography>
      {afterAgency}
    </Typography>
  );
}

export function AgencyConsultantRequestCardContent({
  decision,
  isResponding,
  item,
  onDecision,
  pendingDecision,
}: {
  decision?: AgencyConsultantRequestDisplayState;
  isResponding: boolean;
  item: NotificationItem;
  onDecision: (decision: AgencyConsultantRequestDecision) => void;
  pendingDecision?: AgencyConsultantRequestDecision;
}) {
  const isResolved = decision !== undefined;

  return (
    <>
      <div className="flex items-start justify-between gap-3 [direction:ltr]">
        <time className="text-outline shrink-0 pt-0.5 text-xs leading-4 font-normal">
          {formatNotificationTime(item.created_at)}
        </time>

        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="semibold"
          className="text-on-surface m-0 min-w-0 truncate text-right text-sm leading-5 font-semibold [direction:rtl]"
        >
          {item.title || "دعوت همکاری جدید"}
        </Typography>
      </div>

      <div className="text-right [direction:rtl]">
        <AgencyConsultantRequestDescription item={item} />
      </div>

      <div className="mt-auto flex items-center justify-start gap-2 [direction:rtl]">
        <Button
          unstyled
          className="bg-primary text-on-primary focus-visible:outline-primary/40 h-7 max-w-full min-w-[106px] shrink-0 rounded-lg px-3 text-center text-xs leading-4 font-medium whitespace-nowrap focus-visible:outline-3 focus-visible:outline-offset-2 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isResponding || isResolved}
          onClick={() => onDecision("accept")}
          onPointerDown={(event) => event.stopPropagation()}
          type="button"
        >
          <Typography as="span" variant="label" size="small" weight="medium">
            {decision === "accept"
              ? "پذیرفته شد"
              : decision === "cancel"
                ? "دعوت لغو شد"
                : isResponding && pendingDecision === "accept"
                  ? "در حال پذیرش..."
                  : "پذیرش همکاری"}
          </Typography>
        </Button>

        <Button
          unstyled
          className="border-primary bg-surface-container-lowest text-primary active:bg-surface-container focus-visible:outline-primary/40 h-7 max-w-full min-w-[76px] shrink-0 rounded-lg border px-3 text-center text-xs leading-4 font-medium whitespace-nowrap focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isResponding || isResolved}
          onClick={() => onDecision("reject")}
          onPointerDown={(event) => event.stopPropagation()}
          type="button"
        >
          <Typography as="span" variant="label" size="small" weight="medium">
            {decision === "reject"
              ? "دعوت رد شد"
              : decision === "cancel"
                ? "دعوت لغو شد"
                : isResponding && pendingDecision === "reject"
                  ? "در حال رد..."
                  : "رد دعوت"}
          </Typography>
        </Button>
      </div>
    </>
  );
}
