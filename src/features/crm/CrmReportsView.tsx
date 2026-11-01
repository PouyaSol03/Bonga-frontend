import { motion, useReducedMotion } from "motion/react";
import { Typography } from "../../shared/ui/Typography";
import { getCrmRecordId } from "./api/crm.service";
import {
  EmptyReports,
  QueryError,
  ReportTableSkeleton,
  TableHead,
} from "./reports/components/ReportStatusBadge";
import { ReportsHeaderSection } from "./reports/components/ReportsHeaderSection";
import { ReportTableRow } from "./reports/components/ReportTableRow";
import { ReportPagination } from "./reports/components/ReportPagination";
import { ReportDetailsModal } from "./reports/components/ReportDetailsModal";
import { formatCount, reportCode } from "./reports/reportHelpers";
import type { CrmReportsViewProps } from "./reports/types";
import { useCrmReports } from "./reports/useCrmReports";

export function CrmReportsView(props: CrmReportsViewProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const r = useCrmReports(props);

  return (
    <div className="space-y-4">
      <ReportsHeaderSection
        activeKind={r.activeKind}
        allowedTabs={r.allowedTabs}
        onKindChange={r.setActiveKind}
        onSearchChange={r.setSearch}
        reportCounts={r.reportCounts}
        search={r.search}
        tabLoading={r.tabLoading}
      />

      <motion.section
        animate={{ opacity: 1, y: 0 }}
        aria-labelledby={`crm-reports-tab-${r.activeKind}`}
        className="overflow-hidden rounded-2xl bg-white"
        id="crm-reports-panel"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        key={r.activeKind}
        role="tabpanel"
        transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
      >
        <div className="flex flex-col gap-3 border-b border-[#edf0f5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="m-0 text-base font-black text-[#263042]"
            >
              {r.activeTab.label}
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="m-0 mt-1 text-sm text-[#8a94a3]"
            >
              {r.activeQuery.isLoading
                ? "در حال دریافت گزارش‌ها..."
                : `${formatCount(r.total)} گزارش پیدا شد`}
            </Typography>
          </div>
          {r.activeQuery.isFetching && !r.activeQuery.isLoading ? (
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="semibold"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#667085]"
            >
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="h-2 w-2 animate-pulse rounded-full bg-[#0048c4]"
              />
              در حال بروزرسانی
            </Typography>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-separate border-spacing-0 text-right">
            <thead>
              <tr className="bg-[#fafbfc] text-sm font-bold text-[#697587]">
                <TableHead>کد گزارش</TableHead>
                <TableHead>
                  {r.activeKind === "advertise" ? "آگهی گزارش‌شده" : "کاربر گزارش‌شده"}
                </TableHead>
                <TableHead>دلیل گزارش</TableHead>
                <TableHead>گزارش‌دهنده</TableHead>
                <TableHead>زمان ثبت</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </thead>
            <tbody>
              {r.activeQuery.isLoading ? (
                <ReportTableSkeleton />
              ) : r.activeQuery.isError ? (
                <tr>
                  <td colSpan={7}>
                    <QueryError onRetry={() => void r.activeQuery.refetch()} />
                  </td>
                </tr>
              ) : r.reports.length ? (
                r.reports.map((report, index) => (
                  <ReportTableRow
                    activeKind={r.activeKind}
                    index={index}
                    key={getCrmRecordId(report) || `${reportCode(report)}-${index}`}
                    onSelect={() => r.setSelectedReport(report)}
                    prefersReducedMotion={prefersReducedMotion}
                    report={report}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyReports isSearch={Boolean(r.debouncedSearch)} kind={r.activeKind} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ReportPagination
          currentPage={r.currentPage}
          isError={r.activeQuery.isError}
          isLoading={r.activeQuery.isLoading}
          onChangePage={r.changePage}
          perPage={r.perPage}
          total={r.total}
          totalPages={r.totalPages}
        />
      </motion.section>

      <ReportDetailsModal
        kind={r.activeKind}
        onClose={() => r.setSelectedReport(null)}
        report={r.selectedReport}
      />
    </div>
  );
}
