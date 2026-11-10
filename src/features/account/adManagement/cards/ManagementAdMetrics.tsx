import React from "react";
import LinearViewOn from "../../../../shared/icons/LinearViewOn";
import LinearCall from "../../../../shared/icons/LinearCall";
import LinearChat from "../../../../shared/icons/LinearChat";
import { LinearDocumentSearch } from "../../../../shared/icons/LinearDocumentSearch";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";
import { Typography } from "../../../../shared/ui/Typography";
import type { ManagementAdMetrics as MetricsType } from "./types";

type Props = {
  metrics?: MetricsType;
  sourceAd?: Record<string, unknown>;
};

function readStat(
  source: Record<string, unknown> | undefined,
  keys: string[],
  fallback: number | string = 0,
): string {
  if (!source) return toPersianNumber(fallback);
  const containers = [source, source.statistics, source.stats, source.analytics].filter(
    (c): c is Record<string, unknown> => Boolean(c && typeof c === "object" && !Array.isArray(c)),
  );

  for (const container of containers) {
    for (const key of keys) {
      const val = container[key];
      if (val !== undefined && val !== null && val !== "") {
        return toPersianNumber(val);
      }
    }
  }

  return toPersianNumber(fallback);
}

export const ManagementAdMetrics: React.FC<Props> = ({ metrics, sourceAd }) => {
  const views =
    metrics?.views !== undefined
      ? toPersianNumber(metrics.views)
      : readStat(sourceAd, ["total_views", "views_count", "views", "visit_count", "view_count"]);

  const impressions =
    metrics?.impressions !== undefined
      ? toPersianNumber(metrics.impressions)
      : readStat(sourceAd, [
          "search_display_count",
          "impressions",
          "impression_count",
          "display_count",
          "shown_count",
        ]);

  const calls =
    metrics?.calls !== undefined
      ? toPersianNumber(metrics.calls)
      : readStat(sourceAd, ["call_count", "calls_count", "calls", "phone_clicks", "contact_count"]);

  const chats =
    metrics?.chats !== undefined
      ? toPersianNumber(metrics.chats)
      : readStat(sourceAd, [
          "chat_count",
          "chats_count",
          "chats",
          "conversation_count",
          "message_count",
        ]);

  const items = [
    {
      icon: <LinearViewOn className="text-on-surface-var h-6 w-6" />,
      label: "بازدید",
      value: views,
    },
    {
      icon: <LinearDocumentSearch className="text-on-surface-var h-6 w-6" />,
      label: "نمایش",
      value: impressions,
    },
    { icon: <LinearCall className="text-on-surface-var h-6 w-6" />, label: "تماس", value: calls },
    { icon: <LinearChat className="text-on-surface-var h-6 w-6" />, label: "چت", value: chats },
  ];

  return (
    <div className="grid grid-cols-4 px-1 pt-6 pb-5 [direction:rtl]">
      {items.map((item, idx) => (
        <div className="flex flex-col items-center justify-center text-center" key={idx}>
          <div className="flex h-6 w-6 items-center justify-center">{item.icon}</div>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="medium"
            className="text-on-surface mt-2 mb-1 text-[15px] leading-tight font-bold"
          >
            {item.value}
          </Typography>
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-on-surface-var text-xs font-normal"
          >
            {item.label}
          </Typography>
        </div>
      ))}
    </div>
  );
};
