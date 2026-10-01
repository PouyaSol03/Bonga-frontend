import React from "react";
import LinearViewOn from "../../../../shared/icons/LinearViewOn";
import LinearSearch from "../../../../shared/icons/LinearSearch";
import LinearCall from "../../../../shared/icons/LinearCall";
import LinearBubbleChat from "../../../../shared/icons/LinearBubbleChat";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";
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
      : readStat(sourceAd, ["chat_count", "chats_count", "chats", "conversation_count", "message_count"]);

  const items = [
    { icon: <LinearViewOn className="h-5 w-5 text-[#4D4D4D]" />, label: "بازدید", value: views },
    { icon: <LinearSearch className="h-5 w-5 text-[#4D4D4D]" />, label: "نمایش", value: impressions },
    { icon: <LinearCall className="h-5 w-5 text-[#4D4D4D]" />, label: "تماس", value: calls },
    { icon: <LinearBubbleChat className="h-5 w-5 text-[#4D4D4D]" />, label: "چت", value: chats },
  ];

  return (
    <div className="grid grid-cols-4 pt-4 pb-2 [direction:rtl]">
      {items.map((item, idx) => (
        <div className="flex flex-col items-center justify-center text-center" key={idx}>
          <div className="flex h-5 w-5 items-center justify-center mb-1">{item.icon}</div>
          <span className="text-sm font-bold text-[#1A1A1A] leading-tight mb-0.5">{item.value}</span>
          <span className="text-xs text-[#808080] font-normal">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
