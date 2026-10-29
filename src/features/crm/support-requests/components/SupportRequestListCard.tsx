import { motion } from "motion/react";
import { Typography } from "../../../../shared/ui/Typography";
import { PriorityChip, StatusChip } from "./SupportRequestChips";
import type { CrmSupportRequest } from "../types";

export function RequestListCard({
  isActive,
  onClick,
  request,
}: {
  isActive: boolean;
  onClick: () => void;
  request: CrmSupportRequest;
}) {
  return (
    <motion.button
      className={`w-full rounded-xl border p-3 text-right transition ${
        isActive ? "border-[#1268d8] bg-[#f3f7ff]" : "border-[#eeeeee] bg-white hover:bg-[#fafcff]"
      }`}
      layout
      onClick={onClick}
      type="button"
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="flex items-start justify-between gap-2"
      >
        <strong className="min-w-0 flex-1 truncate text-sm text-[#1a1a1a]">{request.title}</strong>
        <StatusChip status={request.status} />
      </Typography>
      <Typography
        as="span"
        variant="body"
        size="small"
        weight="regular"
        className="mt-2 block truncate text-xs text-[#666666]"
      >
        {request.customerName} · {request.category}
      </Typography>
      <Typography
        as="span"
        variant="body"
        size="small"
        weight="regular"
        className="mt-2 flex items-center justify-between gap-2 text-[10px] text-[#999999]"
      >
        <Typography as="span" variant="body" size="medium" weight="regular" className="truncate">
          {request.createdAt}
        </Typography>
        <PriorityChip priority={request.priority} />
      </Typography>
    </motion.button>
  );
}
