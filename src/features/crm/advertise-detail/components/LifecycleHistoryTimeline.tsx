import LinearClock from "../../../../shared/icons/LinearClock";
import { Typography } from "../../../../shared/ui/Typography";
import { formatDate } from "../formatters";
import { readText } from "../helpers";
import {
  advertiseStatusLabel,
  getActorTypeBadgeClass,
  getActorTypeLabel,
  statusTone,
} from "../statusHelpers";

export function LifecycleHistoryTimeline({ logs }: { logs: unknown[] }) {
  if (!logs || !logs.length) {
    return (
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="m-0 rounded-xl bg-[#f7f7f7] p-4 text-center text-sm text-[#808080]"
      >
        هیچ رویدادی در تاریخچه این آگهی ثبت نشده است.
      </Typography>
    );
  }

  const sortedLogs = [...logs].reverse();

  return (
    <div className="relative mr-3 space-y-4 border-r-2 border-[#e5e5e5] pr-6">
      {sortedLogs.map((item, index) => {
        const log = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        const action = readText(log, ["description", "action", "title"]) || "تغییر وضعیت آگهی";
        const actorType = readText(log, ["actor_type", "actor", "role", "user"]);
        const fromStatus = log.from_status ?? log.from;
        const toStatus = log.to_status ?? log.to;
        const reason = readText(log, ["reason"]);
        const timestamp = log.timestamp ?? log.created_at ?? log.createdAt ?? log.date;
        const formattedDate = formatDate(timestamp);

        return (
          <div key={index} className="group relative">
            <span className="absolute top-1.5 -right-[31px] h-3.5 w-3.5 rounded-full border-2 border-white bg-[#0048c4] ring-4 ring-[#eef4ff]" />

            <div className="rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-4 transition-all hover:bg-white hover:shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getActorTypeBadgeClass(actorType)}`}
                  >
                    {getActorTypeLabel(actorType)}
                  </span>
                  <strong className="text-sm font-bold text-[#1a1a1a]">{action}</strong>
                </div>
                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="regular"
                  className="inline-flex items-center gap-1 text-xs text-[#808080]"
                >
                  <LinearClock className="h-3.5 w-3.5" />
                  {formattedDate}
                </Typography>
              </div>

              {(fromStatus !== undefined || toStatus !== undefined) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#666666]">تغییر وضعیت:</span>
                  {fromStatus !== undefined && (
                    <>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium ${statusTone(fromStatus)}`}
                      >
                        {advertiseStatusLabel(fromStatus)}
                      </span>
                      <span className="text-[#999999]">←</span>
                    </>
                  )}
                  {toStatus !== undefined && (
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium ${statusTone(toStatus)}`}
                    >
                      {advertiseStatusLabel(toStatus)}
                    </span>
                  )}
                </div>
              )}

              {reason && (
                <div className="mt-2.5 rounded-lg bg-[#f0f0f0] p-2.5 text-xs text-[#4d4d4d]">
                  <span className="font-semibold text-[#333333]">علت / توضیحات: </span>
                  {reason}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
