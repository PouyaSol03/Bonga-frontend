import type { ReactNode } from "react";
import LinearCancel from "../../../../shared/icons/LinearCancel";
import LinearFlag from "../../../../shared/icons/LinearFlag";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { CrmRecord, CrmReportKind } from "../../api/crm.service";
import { reportStatus } from "../reportHelpers";
import { statusPresentation } from "../types";

export function ReportStatusBadge({ report }: { report: CrmRecord }) {
  const status = reportStatus(report);

  return (
    <Typography
      as="span"
      variant="label"
      size="small"
      weight="semibold"
      className={`inline-flex h-7 items-center rounded-lg px-2.5 text-xs font-bold ${statusPresentation[status.tone]}`}
    >
      {status.label}
    </Typography>
  );
}

export function ReportTableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }, (_, index) => (
        <tr key={index}>
          {Array.from({ length: 7 }, (_, cellIndex) => (
            <td className="border-b border-[#edf0f5] px-4 py-4" key={cellIndex}>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="block h-4 animate-pulse rounded bg-[#eef1f5]"
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function EmptyReports({ isSearch, kind }: { isSearch: boolean; kind: CrmReportKind }) {
  if (isSearch) return <SearchEmptyState className="min-h-64" />;

  return (
    <div className="mx-auto flex min-h-64 w-full flex-col items-center justify-center px-5 text-center">
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="grid h-16 w-16 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]"
      >
        <LinearFlag className="h-8 w-8" />
      </Typography>
      <strong className="mt-4 text-base font-black text-[#344054]">گزارشی پیدا نشد</strong>
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="m-0 mt-2 max-w-md text-sm leading-7 text-[#8a94a3]"
      >
        {kind === "advertise"
          ? "هنوز گزارشی برای آگهی‌ها ثبت نشده یا نتیجه‌ای با جست‌وجوی فعلی وجود ندارد."
          : "هنوز گزارشی برای کاربران ثبت نشده یا نتیجه‌ای با جست‌وجوی فعلی وجود ندارد."}
      </Typography>
    </div>
  );
}

export function QueryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-64 w-full flex-col items-center justify-center px-5 text-center">
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0f1] text-[#c6283a]"
      >
        <LinearCancel className="h-7 w-7" />
      </Typography>
      <strong className="mt-4 text-base font-black text-[#344054]">
        دریافت گزارش‌ها ناموفق بود
      </strong>
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="m-0 mt-2 text-sm leading-7 text-[#8a94a3]"
      >
        اتصال یا دسترسی API گزارش‌ها را بررسی کنید.
      </Typography>
      <Button
        unstyled
        className="mt-4 h-10 rounded-xl bg-[#0048c4] px-5 text-sm font-bold text-white transition hover:bg-[#003ca5]"
        onClick={onRetry}
        type="button"
      >
        تلاش مجدد
      </Button>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <th className="border-b border-[#edf0f5] px-4 py-3 text-right font-bold">{children}</th>;
}

export function TableCell({ children }: { children: ReactNode }) {
  return <td className="border-b border-[#edf0f5] px-4 py-3.5 align-middle">{children}</td>;
}
