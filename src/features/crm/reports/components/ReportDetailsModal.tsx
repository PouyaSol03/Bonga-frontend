import { useEffect } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import LinearAdvertisiment from "../../../../shared/icons/LinearAdvertisiment";
import LinearDocument from "../../../../shared/icons/LinearDocument";
import LinearInformation from "../../../../shared/icons/LinearInformation";
import LinearUserAccount from "../../../../shared/icons/LinearUserAccount";
import {
  getCrmRecordId,
  type CrmRecord,
  type CrmReportKind,
} from "../../api/crm.service";
import {
  hasMeaningfulValue,
  reportCode,
  reportDate,
  reportDescription,
  reportReason,
  reportReporter,
  reportStatus,
  reportTarget,
  reportThread,
  reporterMobile,
  reporterName,
  targetId,
  targetSecondary,
  targetTitle,
  text,
} from "../reportHelpers";
import {
  DetailItem,
  DetailsSection,
  ReportModalFooter,
  ReportModalHeader,
} from "./ReportDetailSections";

export function ReportDetailsModal({
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
            <ReportModalHeader code={reportCode(report)} onClose={onClose} />

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              <DetailsSection icon={<LinearDocument className="h-5 w-5" />} title="اطلاعات گزارش">
                <DetailItem
                  label="نوع گزارش"
                  value={kind === "advertise" ? "گزارش آگهی" : "گزارش کاربر"}
                />
                <DetailItem label="دلیل گزارش" value={reportReason(report)} />
                <DetailItem label="زمان ثبت" value={reportDate(report)} />
                <DetailItem label="وضعیت" value={reportStatus(report).label} />
                <DetailItem label="توضیحات" value={reportDescription(report)} wide />
              </DetailsSection>

              <DetailsSection
                icon={
                  kind === "advertise" ? (
                    <LinearAdvertisiment className="h-5 w-5" />
                  ) : (
                    <LinearUserAccount className="h-5 w-5" />
                  )
                }
                title={kind === "advertise" ? "آگهی گزارش‌شده" : "کاربر گزارش‌شده"}
              >
                <DetailItem
                  label={kind === "advertise" ? "عنوان آگهی" : "نام کاربر"}
                  value={targetTitle(report, kind)}
                />
                <DetailItem
                  label={kind === "advertise" ? "کد پیگیری" : "شماره موبایل"}
                  value={targetSecondary(report, kind).replace(/^کد پیگیری: /, "")}
                  ltr={kind === "user"}
                />
                {hasMeaningfulValue(linkedTargetId) ? (
                  <DetailItem label="شناسه" value={linkedTargetId} ltr />
                ) : null}
                {kind === "advertise" && linkedTargetId ? (
                  <div className="flex items-end">
                    <Link
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-[#c9daf8] bg-[#eef4ff] px-4 text-sm font-bold text-[#0048c4] no-underline transition hover:border-[#0048c4]"
                      to={`/crm/advertises/${encodeURIComponent(linkedTargetId)}`}
                    >
                      مشاهده آگهی در CRM
                    </Link>
                  </div>
                ) : null}
              </DetailsSection>

              <DetailsSection icon={<LinearUserAccount className="h-5 w-5" />} title="گزارش‌دهنده">
                <DetailItem label="نام و نام خانوادگی" value={reporterName(report)} />
                <DetailItem label="شماره موبایل" value={reporterMobile(report)} ltr />
                {hasMeaningfulValue(getCrmRecordId(reporter)) ? (
                  <DetailItem label="شناسه کاربر" value={getCrmRecordId(reporter)} ltr />
                ) : null}
              </DetailsSection>

              {kind === "user" && Object.keys(thread).length > 0 ? (
                <DetailsSection
                  icon={<LinearInformation className="h-5 w-5" />}
                  title="گفت‌وگوی مرتبط"
                >
                  <DetailItem
                    label="شناسه گفت‌وگو"
                    value={getCrmRecordId(thread) || text(report, ["thread_id", "chat_id"], "-")}
                    ltr
                  />
                  <DetailItem
                    label="عنوان گفت‌وگو"
                    value={text(thread, ["title", "subject"], "گفت‌وگوی کاربر")}
                  />
                </DetailsSection>
              ) : null}

              {Object.keys(target).length === 0 && Object.keys(reporter).length === 0 ? (
                <div className="rounded-xl border border-[#f1dfac] bg-[#fffaf0] px-4 py-3 text-sm leading-7 text-[#805b00]">
                  پاسخ API فقط اطلاعات اصلی گزارش را برگردانده است و اطلاعات کاربر یا مورد گزارش‌شده
                  در آن وجود ندارد.
                </div>
              ) : null}
            </div>

            <ReportModalFooter onClose={onClose} />
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
