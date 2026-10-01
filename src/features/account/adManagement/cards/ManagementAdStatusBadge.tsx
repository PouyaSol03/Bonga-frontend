import React from "react";
import { getMyAdStatusInfo, type MyAdStatusKey } from "../../myAdsStatus";

const statusStyleMap: Record<string, { bg: string; text: string }> = {
  deal_success: { bg: "bg-[#11A366]/[0.08]", text: "text-[#11A366]" },
  deal_unsuccessful: { bg: "bg-[#DD2B1E]/[0.08]", text: "text-[#DD2B1E]" },
  deleted: { bg: "bg-[#C11004]/[0.08]", text: "text-[#C11004]" },
  expired: { bg: "bg-[#DD2B1E]/[0.08]", text: "text-[#DD2B1E]" },
  incomplete: { bg: "bg-[#FF8D00]/[0.08]", text: "text-[#FF8D00]" },
  incomplete_deleted: { bg: "bg-[#C11004]/[0.08]", text: "text-[#C11004]" },
  needs_edit: { bg: "bg-[#FF8D00]/[0.08]", text: "text-[#FF8D00]" },
  pending: { bg: "bg-[#FF8D00]/[0.08]", text: "text-[#FF8D00]" },
  published: { bg: "bg-[#11A366]/[0.08]", text: "text-[#11A366]" },
  rejected_by_agency: { bg: "bg-[#C11004]/[0.08]", text: "text-[#C11004]" },
  wait_for_agency: { bg: "bg-[#FF8D00]/[0.08]", text: "text-[#FF8D00]" },
  wait_for_deal_confirmation: { bg: "bg-[#FF8D00]/[0.08]", text: "text-[#FF8D00]" },
  wait_for_payment: { bg: "bg-[#FF8D00]/[0.08]", text: "text-[#FF8D00]" },
  wait_for_repost: { bg: "bg-[#FF8D00]/[0.08]", text: "text-[#FF8D00]" },
  wait_for_stop: { bg: "bg-[#FF8D00]/[0.08]", text: "text-[#FF8D00]" },
};

type Props = {
  statusKey?: MyAdStatusKey | string;
  label?: string;
  source?: unknown;
  className?: string;
};

export const ManagementAdStatusBadge: React.FC<Props> = ({
  statusKey,
  label,
  source,
  className = "",
}) => {
  const statusInfo = source ? getMyAdStatusInfo(source) : undefined;
  const key = statusKey || statusInfo?.key || "published";
  const displayLabel = label || statusInfo?.label || "منتشر شده";
  const style = statusStyleMap[key] || { bg: "bg-[#FF8D00]/[0.08]", text: "text-[#FF8D00]" };

  return (
    <span
      className={`inline-flex h-7 items-center justify-center rounded-[8px] px-3 text-[12px] font-normal leading-none shrink-0 ${style.bg} ${style.text} ${className}`}
    >
      {displayLabel}
    </span>
  );
};
