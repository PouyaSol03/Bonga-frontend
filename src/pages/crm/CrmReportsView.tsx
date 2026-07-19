import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { getApiErrorMessage } from "../../api/api";
import LinearAdvertisiment from "../../components/(icons)/LinearAdvertisiment";
import LinearArrowLeft1 from "../../components/(icons)/LinearArrowLeft1";
import LinearArrowRight1 from "../../components/(icons)/LinearArrowRight1";
import LinearCancel from "../../components/(icons)/LinearCancel";
import LinearClock from "../../components/(icons)/LinearClock";
import LinearDocument from "../../components/(icons)/LinearDocument";
import LinearFlag from "../../components/(icons)/LinearFlag";
import LinearInformation from "../../components/(icons)/LinearInformation";
import LinearSearch from "../../components/(icons)/LinearSearch";
import LinearUserAccount from "../../components/(icons)/LinearUserAccount";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { RouteLink } from "../../routes/RouteLink";
import {
  getCrmRecordId,
  listCrmReports,
  type CrmRecord,
  type CrmReportKind,
  type CrmReportListResult,
} from "../../services/crm.service";

type CrmReportsViewProps = {
  notify: (message: string, tone?: "error" | "success") => void;
  refreshNonce: number;
};

type ReportQueryState = {
  data?: CrmReportListResult;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  refetch: () => Promise<unknown>;
};

type ReportStatusTone = "danger" | "info" | "neutral" | "success" | "warning";

const PAGE_SIZE = 20;

const tabs: Array<{
  description: string;
  icon: typeof LinearAdvertisiment;
  id: CrmReportKind;
  label: string;
}> = [
  {
    id: "advertise",
    label: "گزارش آگهی‌ها",
    description: "گزارش‌هایی که از صفحه جزئیات آگهی ثبت شده‌اند",
    icon: LinearAdvertisiment,
  },
  {
    id: "user",
    label: "گزارش کاربران",
    description: "گزارش‌هایی که از گفت‌وگو برای کاربر مقابل ثبت شده‌اند",
    icon: LinearUserAccount,
  },
];

const statusPresentation: Record<ReportStatusTone, string> = {
  danger: "bg-[#fff0f1] text-[#c6283a]",
  info: "bg-[#eaf1ff] text-[#0048c4]",
  neutral: "bg-[#f1f2f4] text-[#667085]",
  success: "bg-[#e9f8f0] text-[#087a4b]",
  warning: "bg-[#fff7df] text-[#936200]",
};

function text(record: CrmRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" || typeof value === "number") {
      const normalized = String(value).trim();
      if (normalized) return normalized;
    }
  }

  return fallback;
}

function nestedRecord(record: CrmRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as CrmRecord;
    }
  }

  return {};
}

function firstNestedRecord(record: CrmRecord, groups: string[][]) {
  for (const keys of groups) {
    const value = nestedRecord(record, keys);
    if (Object.keys(value).length > 0) return value;
  }

  return {};
}

function fullName(record: CrmRecord, fallback = "-") {
  const direct = text(record, ["full_name", "fullname", "display_name"]);
  if (direct) return direct;

  const name = [text(record, ["name", "first_name"]), text(record, ["family", "last_name"])]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || fallback;
}

function reportReason(report: CrmRecord) {
  const reason = firstNestedRecord(report, [
    ["report_reason", "reportReason"],
    ["reason_detail", "reasonDetail"],
    ["reason"],
  ]);

  return text(reason, ["name", "title", "label"], text(report, ["reason", "reason_name", "report_reason_name"], "بدون عنوان"));
}

function reportDescription(report: CrmRecord) {
  return text(report, ["description", "message", "details", "note", "comment"], "توضیحی ثبت نشده است.");
}

function reportReporter(report: CrmRecord) {
  return firstNestedRecord(report, [
    ["reporter", "reported_by", "reportedBy"],
    ["creator", "created_by", "createdBy"],
    ["user", "sender"],
  ]);
}

function reportTarget(report: CrmRecord, kind: CrmReportKind) {
  if (kind === "advertise") {
    return firstNestedRecord(report, [
      ["advertise", "advertisement", "ad"],
      ["target", "reported_advertise", "reportedAdvertise"],
    ]);
  }

  return firstNestedRecord(report, [
    ["reported_user", "reportedUser", "target_user", "targetUser"],
    ["participant", "receiver", "target"],
    ["user"],
  ]);
}

function reportThread(report: CrmRecord) {
  return firstNestedRecord(report, [
    ["thread", "chat", "conversation"],
  ]);
}

function reporterName(report: CrmRecord) {
  const reporter = reportReporter(report);
  return fullName(reporter, text(report, ["reporter_name", "user_name", "sender_name"], "کاربر ناشناس"));
}

function reporterMobile(report: CrmRecord) {
  const reporter = reportReporter(report);
  return text(reporter, ["mobile", "phone", "phone_number"], text(report, ["reporter_mobile", "user_mobile"], "-"));
}

function targetTitle(report: CrmRecord, kind: CrmReportKind) {
  const target = reportTarget(report, kind);

  if (kind === "advertise") {
    return text(target, ["title", "name"], text(report, ["advertise_title", "ad_title"], "آگهی بدون عنوان"));
  }

  return fullName(target, text(report, ["reported_user_name", "target_user_name"], "کاربر بدون نام"));
}

function targetSecondary(report: CrmRecord, kind: CrmReportKind) {
  const target = reportTarget(report, kind);

  if (kind === "advertise") {
    const trackCode = text(target, ["track_code", "tracking_code"], text(report, ["track_code", "advertise_track_code"]));
    return trackCode ? `کد پیگیری: ${trackCode}` : "کد پیگیری ثبت نشده";
  }

  return text(target, ["mobile", "phone", "phone_number"], text(report, ["reported_user_mobile", "target_user_mobile"], "شماره تماس ثبت نشده"));
}

function targetId(report: CrmRecord, kind: CrmReportKind) {
  const target = reportTarget(report, kind);
  return getCrmRecordId(target) || text(report, kind === "advertise" ? ["advertise_id", "ad_id"] : ["reported_user_id", "target_user_id"]);
}

function reportCode(report: CrmRecord) {
  return text(report, ["code", "report_code", "tracking_code"], getCrmRecordId(report) || "-");
}

function reportDate(report: CrmRecord) {
  const raw = text(report, ["created_at", "createdAt", "date", "reported_at", "reportedAt"]);
  if (!raw) return "زمان ثبت نشده";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function reportStatus(report: CrmRecord): { label: string; tone: ReportStatusTone } {
  const raw = text(report, ["status", "state", "review_status"]).toLowerCase();

  if (["", "0", "new", "open", "pending", "جدید", "باز", "در انتظار"].includes(raw)) {
    return { label: "جدید", tone: "warning" };
  }

  if (["1", "review", "reviewing", "in_progress", "processing", "در حال بررسی"].includes(raw)) {
    return { label: "در حال بررسی", tone: "info" };
  }

  if (["2", "resolved", "closed", "done", "completed", "بررسی شده", "بسته شده"].includes(raw)) {
    return { label: "بررسی شده", tone: "success" };
  }

  if (["-1", "rejected", "dismissed", "رد شده"].includes(raw)) {
    return { label: "رد شده", tone: "danger" };
  }

  return { label: raw || "نامشخص", tone: "neutral" };
}

function formatCount(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function hasMeaningfulValue(value: string) {
  return Boolean(value && value !== "-" && value !== "زمان ثبت نشده" && value !== "توضیحی ثبت نشده است.");
}

function ReportStatusBadge({ report }: { report: CrmRecord }) {
  const status = reportStatus(report);

  return (
    <span className={`inline-flex h-7 items-center rounded-lg px-2.5 text-xs font-bold ${statusPresentation[status.tone]}`}>
      {status.label}
    </span>
  );
}

function ReportTableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }, (_, index) => (
        <tr key={index}>
          {Array.from({ length: 7 }, (_, cellIndex) => (
            <td className="border-b border-[#edf0f5] px-4 py-4" key={cellIndex}>
              <span className="block h-4 animate-pulse rounded bg-[#eef1f5]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function EmptyReports({ kind }: { kind: CrmReportKind }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]">
        <LinearFlag className="h-8 w-8" />
      </span>
      <strong className="mt-4 text-base font-black text-[#344054]">گزارشی پیدا نشد</strong>
      <p className="m-0 mt-2 max-w-md text-sm leading-7 text-[#8a94a3]">
        {kind === "advertise"
          ? "هنوز گزارشی برای آگهی‌ها ثبت نشده یا نتیجه‌ای با جست‌وجوی فعلی وجود ندارد."
          : "هنوز گزارشی برای کاربران ثبت نشده یا نتیجه‌ای با جست‌وجوی فعلی وجود ندارد."}
      </p>
    </div>
  );
}

function QueryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0f1] text-[#c6283a]">
        <LinearCancel className="h-7 w-7" />
      </span>
      <strong className="mt-4 text-base font-black text-[#344054]">دریافت گزارش‌ها ناموفق بود</strong>
      <p className="m-0 mt-2 text-sm leading-7 text-[#8a94a3]">اتصال یا دسترسی API گزارش‌ها را بررسی کنید.</p>
      <button
        className="mt-4 h-10 rounded-xl bg-[#0048c4] px-5 text-sm font-bold text-white transition hover:bg-[#003ca5]"
        onClick={onRetry}
        type="button"
      >
        تلاش مجدد
      </button>
    </div>
  );
}

export function CrmReportsView({ notify, refreshNonce }: CrmReportsViewProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeKind, setActiveKind] = useState<CrmReportKind>("advertise");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const [pages, setPages] = useState<Record<CrmReportKind, number>>({ advertise: 1, user: 1 });
  const [selectedReport, setSelectedReport] = useState<CrmRecord | null>(null);

  useEffect(() => {
    setPages({ advertise: 1, user: 1 });
  }, [debouncedSearch]);

  const advertiseQuery = useQuery({
    enabled: activeKind === "advertise",
    queryFn: () => listCrmReports("advertise", { page: pages.advertise, perPage: PAGE_SIZE, search: debouncedSearch }),
    queryKey: ["crm", "reports", "advertise", pages.advertise, debouncedSearch, refreshNonce],
  });
  const userQuery = useQuery({
    enabled: activeKind === "user",
    queryFn: () => listCrmReports("user", { page: pages.user, perPage: PAGE_SIZE, search: debouncedSearch }),
    queryKey: ["crm", "reports", "user", pages.user, debouncedSearch, refreshNonce],
  });

  useEffect(() => {
    if (advertiseQuery.error) {
      notify(getApiErrorMessage(advertiseQuery.error, "دریافت گزارش‌های آگهی ناموفق بود."), "error");
    }
  }, [advertiseQuery.error, notify]);

  useEffect(() => {
    if (userQuery.error) {
      notify(getApiErrorMessage(userQuery.error, "دریافت گزارش‌های کاربران ناموفق بود."), "error");
    }
  }, [notify, userQuery.error]);

  const activeQuery = (activeKind === "advertise" ? advertiseQuery : userQuery) as ReportQueryState;
  const reports = activeQuery.data?.data ?? [];
  const total = activeQuery.data?.total ?? 0;
  const currentPage = activeQuery.data?.page ?? pages[activeKind];
  const perPage = activeQuery.data?.perPage ?? PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const activeTab = tabs.find((tab) => tab.id === activeKind) ?? tabs[0];

  const reportCounts = useMemo<Record<CrmReportKind, number>>(
    () => ({
      advertise: advertiseQuery.data?.total ?? 0,
      user: userQuery.data?.total ?? 0,
    }),
    [advertiseQuery.data?.total, userQuery.data?.total],
  );

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) return;
    setPages((current) => ({ ...current, [activeKind]: nextPage }));
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]">
              <LinearFlag className="h-6 w-6" />
            </span>
            <div>
              <h1 className="m-0 text-lg font-black text-[#263042]">گزارش‌های تخلف</h1>
              <p className="m-0 mt-1 text-sm leading-6 text-[#8a94a3]">
                گزارش‌های ثبت‌شده برای آگهی‌ها و کاربران را جداگانه مشاهده و بررسی کنید.
              </p>
            </div>
          </div>

          <label className="relative block w-full xl:w-[340px]">
            <span className="sr-only">جست‌وجو در گزارش‌ها</span>
            <LinearSearch className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#98a2b3]" />
            <input
              className="h-11 w-full rounded-xl border border-[#d7dce5] bg-white pr-10 pl-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#98a2b3] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جست‌وجو با نام، موبایل، دلیل یا کد گزارش"
              type="search"
              value={search}
            />
          </label>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2" role="tablist" aria-label="نوع گزارش تخلف">
          {tabs.map((tab) => {
            const isActive = activeKind === tab.id;
            const Icon = tab.icon;
            const tabQuery = tab.id === "advertise" ? advertiseQuery : userQuery;

            return (
              <button
                aria-controls="crm-reports-panel"
                aria-selected={isActive}
                className={`flex min-h-[78px] items-center gap-3 rounded-xl border px-4 text-right transition ${
                  isActive
                    ? "border-[#0048c4] bg-[#f4f7ff] shadow-[0_0_0_2px_rgba(0,72,196,0.05)]"
                    : "border-[#e7eaf0] bg-white hover:border-[#bdc9dc] hover:bg-[#fafcff]"
                }`}
                id={`crm-reports-tab-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveKind(tab.id)}
                role="tab"
                type="button"
              >
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${isActive ? "bg-[#0048c4] text-white" : "bg-[#f1f4f8] text-[#667085]"}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className={`block text-sm font-black ${isActive ? "text-[#0048c4]" : "text-[#344054]"}`}>{tab.label}</strong>
                  <span className="mt-1 block truncate text-xs font-medium text-[#8a94a3]">{tab.description}</span>
                </span>
                <span className={`inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-1 text-xs font-black ${isActive ? "bg-white text-[#0048c4]" : "bg-[#f1f2f4] text-[#667085]"}`}>
                  {tabQuery.isLoading ? "…" : tabQuery.data ? formatCount(reportCounts[tab.id]) : "—"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <motion.section
        animate={{ opacity: 1, y: 0 }}
        aria-labelledby={`crm-reports-tab-${activeKind}`}
        className="overflow-hidden rounded-2xl bg-white"
        id="crm-reports-panel"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        key={activeKind}
        role="tabpanel"
        transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
      >
        <div className="flex flex-col gap-3 border-b border-[#edf0f5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="m-0 text-base font-black text-[#263042]">{activeTab.label}</h2>
            <p className="m-0 mt-1 text-sm text-[#8a94a3]">
              {activeQuery.isLoading
                ? "در حال دریافت گزارش‌ها..."
                : `${formatCount(total)} گزارش پیدا شد`}
            </p>
          </div>
          {activeQuery.isFetching && !activeQuery.isLoading ? (
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#667085]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#0048c4]" />
              در حال بروزرسانی
            </span>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-separate border-spacing-0 text-right">
            <thead>
              <tr className="bg-[#fafbfc] text-sm font-bold text-[#697587]">
                <TableHead>کد گزارش</TableHead>
                <TableHead>{activeKind === "advertise" ? "آگهی گزارش‌شده" : "کاربر گزارش‌شده"}</TableHead>
                <TableHead>دلیل گزارش</TableHead>
                <TableHead>گزارش‌دهنده</TableHead>
                <TableHead>زمان ثبت</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </thead>
            <tbody>
              {activeQuery.isLoading ? (
                <ReportTableSkeleton />
              ) : activeQuery.isError ? (
                <tr>
                  <td colSpan={7}>
                    <QueryError onRetry={() => void activeQuery.refetch()} />
                  </td>
                </tr>
              ) : reports.length ? (
                reports.map((report, index) => (
                  <motion.tr
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-[#344054] transition hover:bg-[#fbfcfe]"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                    key={getCrmRecordId(report) || `${reportCode(report)}-${index}`}
                    transition={{ delay: prefersReducedMotion ? 0 : Math.min(index, 8) * 0.025, duration: 0.16 }}
                  >
                    <TableCell>
                      <span className="inline-flex max-w-[150px] rounded-lg bg-[#f4f6f9] px-2.5 py-1.5 font-mono text-xs font-bold text-[#4d5b70] [direction:ltr]">
                        {reportCode(report)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[250px]">
                        <strong className="block truncate text-sm font-bold text-[#263042]">{targetTitle(report, activeKind)}</strong>
                        <span className="mt-1 block truncate text-xs font-medium text-[#8a94a3]">{targetSecondary(report, activeKind)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex max-w-[220px] rounded-lg bg-[#fff7df] px-2.5 py-1.5 text-xs font-bold text-[#805b00]">
                        <span className="truncate">{reportReason(report)}</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <strong className="block truncate text-sm font-bold text-[#344054]">{reporterName(report)}</strong>
                        <span className="mt-1 block truncate text-xs font-medium text-[#8a94a3] [direction:ltr] text-right">{reporterMobile(report)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-[#667085]">
                        <LinearClock className="h-4 w-4" />
                        {reportDate(report)}
                      </span>
                    </TableCell>
                    <TableCell><ReportStatusBadge report={report} /></TableCell>
                    <TableCell>
                      <button
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#c9daf8] bg-[#eef4ff] px-3 text-sm font-bold text-[#0048c4] transition hover:border-[#0048c4] hover:bg-[#e3edff]"
                        onClick={() => setSelectedReport(report)}
                        type="button"
                      >
                        <LinearInformation className="h-4 w-4" />
                        جزئیات
                      </button>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}><EmptyReports kind={activeKind} /></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!activeQuery.isLoading && !activeQuery.isError && total > perPage ? (
          <div className="flex items-center justify-between gap-3 border-t border-[#edf0f5] px-5 py-4">
            <p className="m-0 text-sm font-semibold text-[#7b8493]">
              صفحه {formatCount(currentPage)} از {formatCount(totalPages)}
            </p>
            <div className="flex items-center gap-2">
              <button
                aria-label="صفحه قبلی"
                className="grid h-9 w-9 place-items-center rounded-lg border border-[#dce3ef] bg-white text-[#596477] transition hover:bg-[#f4f6fa] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage <= 1}
                onClick={() => changePage(currentPage - 1)}
                type="button"
              >
                <LinearArrowRight1 className="h-4 w-4" />
              </button>
              <button
                aria-label="صفحه بعدی"
                className="grid h-9 w-9 place-items-center rounded-lg border border-[#dce3ef] bg-white text-[#596477] transition hover:bg-[#f4f6fa] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage >= totalPages}
                onClick={() => changePage(currentPage + 1)}
                type="button"
              >
                <LinearArrowLeft1 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </motion.section>

      <ReportDetailsModal
        kind={activeKind}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </div>
  );
}

function ReportDetailsModal({
  kind,
  onClose,
  report,
}: {
  kind: CrmReportKind;
  onClose: () => void;
  report: CrmRecord | null;
}) {
  useEffect(() => {
    if (!report) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, report]);

  const target = report ? reportTarget(report, kind) : {};
  const reporter = report ? reportReporter(report) : {};
  const thread = report ? reportThread(report) : {};
  const linkedTargetId = report ? targetId(report, kind) : "";

  return (
    <AnimatePresence>
      {report ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-[#152033]/45 p-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="presentation"
        >
          <motion.section
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-label="جزئیات گزارش تخلف"
            aria-modal="true"
            className="flex max-h-[calc(100dvh-32px)] w-[min(820px,100%)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(18,32,57,0.25)]"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            role="dialog"
            transition={{ duration: 0.18 }}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-[#edf0f5] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]">
                  <LinearFlag className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="m-0 text-base font-black text-[#263042]">جزئیات گزارش تخلف</h2>
                  <p className="m-0 mt-1 text-sm text-[#8a94a3]">کد گزارش: {reportCode(report)}</p>
                </div>
              </div>
              <button
                aria-label="بستن"
                className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f5f8] text-[#596477] transition hover:bg-[#e9edf3]"
                onClick={onClose}
                type="button"
              >
                <LinearCancel className="h-5 w-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              <DetailsSection icon={<LinearDocument className="h-5 w-5" />} title="اطلاعات گزارش">
                <DetailItem label="نوع گزارش" value={kind === "advertise" ? "گزارش آگهی" : "گزارش کاربر"} />
                <DetailItem label="دلیل گزارش" value={reportReason(report)} />
                <DetailItem label="زمان ثبت" value={reportDate(report)} />
                <DetailItem label="وضعیت" value={reportStatus(report).label} />
                <DetailItem label="توضیحات" value={reportDescription(report)} wide />
              </DetailsSection>

              <DetailsSection
                icon={kind === "advertise" ? <LinearAdvertisiment className="h-5 w-5" /> : <LinearUserAccount className="h-5 w-5" />}
                title={kind === "advertise" ? "آگهی گزارش‌شده" : "کاربر گزارش‌شده"}
              >
                <DetailItem label={kind === "advertise" ? "عنوان آگهی" : "نام کاربر"} value={targetTitle(report, kind)} />
                <DetailItem label={kind === "advertise" ? "کد پیگیری" : "شماره موبایل"} value={targetSecondary(report, kind).replace(/^کد پیگیری: /, "")} ltr={kind === "user"} />
                {hasMeaningfulValue(linkedTargetId) ? <DetailItem label="شناسه" value={linkedTargetId} ltr /> : null}
                {kind === "advertise" && linkedTargetId ? (
                  <div className="flex items-end">
                    <RouteLink
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-[#c9daf8] bg-[#eef4ff] px-4 text-sm font-bold text-[#0048c4] no-underline transition hover:border-[#0048c4]"
                      to={`/crm/advertises/${encodeURIComponent(linkedTargetId)}`}
                    >
                      مشاهده آگهی در CRM
                    </RouteLink>
                  </div>
                ) : null}
              </DetailsSection>

              <DetailsSection icon={<LinearUserAccount className="h-5 w-5" />} title="گزارش‌دهنده">
                <DetailItem label="نام و نام خانوادگی" value={reporterName(report)} />
                <DetailItem label="شماره موبایل" value={reporterMobile(report)} ltr />
                {hasMeaningfulValue(getCrmRecordId(reporter)) ? <DetailItem label="شناسه کاربر" value={getCrmRecordId(reporter)} ltr /> : null}
              </DetailsSection>

              {kind === "user" && Object.keys(thread).length > 0 ? (
                <DetailsSection icon={<LinearInformation className="h-5 w-5" />} title="گفت‌وگوی مرتبط">
                  <DetailItem label="شناسه گفت‌وگو" value={getCrmRecordId(thread) || text(report, ["thread_id", "chat_id"], "-")} ltr />
                  <DetailItem label="عنوان گفت‌وگو" value={text(thread, ["title", "subject"], "گفت‌وگوی کاربر")} />
                </DetailsSection>
              ) : null}

              {Object.keys(target).length === 0 && Object.keys(reporter).length === 0 ? (
                <div className="rounded-xl border border-[#f1dfac] bg-[#fffaf0] px-4 py-3 text-sm leading-7 text-[#805b00]">
                  پاسخ API فقط اطلاعات اصلی گزارش را برگردانده است و اطلاعات کاربر یا مورد گزارش‌شده در آن وجود ندارد.
                </div>
              ) : null}
            </div>

            <footer className="flex shrink-0 justify-end border-t border-[#edf0f5] px-5 py-4">
              <button className="h-10 rounded-xl bg-[#0048c4] px-5 text-sm font-bold text-white" onClick={onClose} type="button">
                بستن
              </button>
            </footer>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DetailsSection({ children, icon, title }: { children: ReactNode; icon: ReactNode; title: string }) {
  return (
    <section className="rounded-xl border border-[#edf0f5] bg-[#fbfcfe] p-4">
      <div className="mb-3 flex items-center gap-2 text-[#344054]">
        <span className="text-[#0048c4]">{icon}</span>
        <h3 className="m-0 text-sm font-black">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function DetailItem({ label, ltr = false, value, wide = false }: { label: string; ltr?: boolean; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-lg bg-white px-3 py-2.5 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="block text-xs font-semibold text-[#8a94a3]">{label}</span>
      <strong className={`mt-1 block break-words text-sm font-bold leading-7 text-[#303846] ${ltr ? "[direction:ltr] text-left" : ""}`}>{value}</strong>
    </div>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return <th className="border-b border-[#edf0f5] px-4 py-3 text-right font-bold">{children}</th>;
}

function TableCell({ children }: { children: ReactNode }) {
  return <td className="border-b border-[#edf0f5] px-4 py-3.5 align-middle">{children}</td>;
}
