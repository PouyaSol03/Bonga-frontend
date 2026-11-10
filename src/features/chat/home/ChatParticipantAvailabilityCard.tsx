import LinearSupport from "../../../shared/icons/LinearSupport";
import { Typography } from "../../../shared/ui/Typography";
import { type ChatAvailability } from "../api/chat.service";
import {
  formatParticipantAvailabilityDays,
  formatParticipantAvailabilityTime,
} from "./responseAvailability";

export function ChatParticipantAvailabilityCard({ availability }: { availability?: ChatAvailability }) {
  if (!availability?.days?.length || !availability.start_time || !availability.end_time) {
    return null;
  }

  const daysText = formatParticipantAvailabilityDays(availability);

  if (!daysText) return null;

  return (
    <section
      aria-label="ساعت پاسخگویی آژانس"
      className="border-primary bg-primary-container/20 text-on-surface mb-4 h-[100px] rounded-xl border p-4 text-xs leading-4 font-normal"
    >
      <div className="text-primary flex h-5 items-center gap-2 text-sm leading-5 font-medium">
        <LinearSupport aria-hidden="true" className="h-5 w-5" />
        <Typography as="h2" variant="title" size="small" weight="medium" className="m-0">
          ساعت پاسخگویی آژانس
        </Typography>
      </div>

      <div className="mt-2 space-y-2 [direction:rtl]">
        <div className="flex items-center justify-between gap-4 text-xs">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface-var"
          >
            روزهای هفته:
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface min-w-0 truncate text-left"
          >
            {daysText}
          </Typography>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface-var"
          >
            ساعت:
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface min-w-0 truncate text-left"
          >
            از {formatParticipantAvailabilityTime(availability.start_time)} - تا{" "}
            {formatParticipantAvailabilityTime(availability.end_time)}
          </Typography>
        </div>
      </div>
    </section>
  );
}
