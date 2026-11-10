import { motion } from "motion/react";
import LinearClock from "../../../../shared/icons/LinearClock";
import LinearInformation from "../../../../shared/icons/LinearInformation";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { CrmRecord, CrmReportKind } from "../../api/crm.service";
import {
  reportCode,
  reportDate,
  reportReason,
  reporterMobile,
  reporterName,
  targetSecondary,
  targetTitle,
} from "../reportHelpers";
import { ReportStatusBadge, TableCell } from "./ReportStatusBadge";

export function ReportTableRow({
  activeKind,
  index,
  onSelect,
  prefersReducedMotion,
  report,
}: {
  activeKind: CrmReportKind;
  index: number;
  onSelect: () => void;
  prefersReducedMotion: boolean;
  report: CrmRecord;
}) {
  return (
    <motion.tr
      animate={{ opacity: 1, y: 0 }}
      className="text-sm text-[#344054] transition hover:bg-[#fbfcfe]"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
      transition={{
        delay: prefersReducedMotion ? 0 : Math.min(index, 8) * 0.025,
        duration: 0.16,
      }}
    >
      <TableCell>
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="semibold"
          className="inline-flex max-w-[150px] rounded-lg bg-[#f4f6f9] px-2.5 py-1.5 font-mono text-xs font-bold text-[#4d5b70] [direction:ltr]"
        >
          {reportCode(report)}
        </Typography>
      </TableCell>
      <TableCell>
        <div className="max-w-[250px]">
          <strong className="block truncate text-sm font-bold text-[#263042]">
            {targetTitle(report, activeKind)}
          </strong>
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="mt-1 block truncate text-xs font-medium text-[#8a94a3]"
          >
            {targetSecondary(report, activeKind)}
          </Typography>
        </div>
      </TableCell>
      <TableCell>
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="semibold"
          className="inline-flex max-w-[220px] rounded-lg bg-[#fff7df] px-2.5 py-1.5 text-xs font-bold text-[#805b00]"
        >
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="truncate"
          >
            {reportReason(report)}
          </Typography>
        </Typography>
      </TableCell>
      <TableCell>
        <div className="max-w-[200px]">
          <strong className="block truncate text-sm font-bold text-[#344054]">
            {reporterName(report)}
          </strong>
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="mt-1 block truncate text-right text-xs font-medium text-[#8a94a3] [direction:ltr]"
          >
            {reporterMobile(report)}
          </Typography>
        </div>
      </TableCell>
      <TableCell>
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="semibold"
          className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap text-[#667085]"
        >
          <LinearClock className="h-4 w-4" />
          {reportDate(report)}
        </Typography>
      </TableCell>
      <TableCell>
        <ReportStatusBadge report={report} />
      </TableCell>
      <TableCell>
        <Button
          unstyled
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#c9daf8] bg-[#eef4ff] px-3 text-sm font-bold text-[#0048c4] transition hover:border-[#0048c4] hover:bg-[#e3edff]"
          onClick={onSelect}
          type="button"
        >
          <LinearInformation className="h-4 w-4" />
          جزئیات
        </Button>
      </TableCell>
    </motion.tr>
  );
}
