import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";

import { getApiErrorMessage } from "../../api/api";
import {
  getCrmRecordId,
  listCrmPayments,
  type CrmPaymentFilters,
  type CrmRecord,
} from "../../services/crm.service";
import { JalaliDatePickerSheet } from "../newAd/steps/project/JalaliDatePickerSheet";

type CrmPaymentsViewProps = {
  notify: (message: string, tone?: "error" | "success") => void;
  refreshNonce: number;
};

type PaymentStatus = "failed" | "pending" | "success" | "unknown";
type PaymentMethod = "gateway" | "wallet" | "unknown";
type PaymentFilterDraft = {
  status: string;
  paymentFor: string;
  paymentType: string;
  fromDate: string;
  toDate: string;
};

const inputClassName =
  "h-10 w-full rounded-xl border border-[#cccccc] bg-white px-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";

const emptyDraft: PaymentFilterDraft = {
  status: "",
  paymentFor: "",
  paymentType: "",
  fromDate: "",
  toDate: "",
};

export function CrmPaymentsView({ notify, refreshNonce }: CrmPaymentsViewProps) {
  const prefersReducedMotion = useReducedMotion();
  const [draft, setDraft] = useState<PaymentFilterDraft>(emptyDraft);
  const [filters, setFilters] = useState<CrmPaymentFilters>({ page: 1, perPage: 20 });
  const [openPicker, setOpenPicker] = useState<"from" | "to" | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<CrmRecord | null>(null);

  const query = useQuery({
    queryFn: () => listCrmPayments(filters),
    queryKey: ["crm", "payments", filters, refreshNonce],
  });

  useEffect(() => {
    if (!query.error) return;

    notify(getApiErrorMessage(query.error, "دریافت تاریخچه پرداخت‌ها ناموفق بود."), "error");
  }, [notify, query.error]);

  const payments = useMemo(() => query.data?.data ?? [], [query.data]);
  const total = query.data?.total ?? 0;
  const currentPage = query.data?.page ?? filters.page ?? 1;
  const perPage = query.data?.perPage ?? filters.perPage ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const metrics = useMemo(() => buildPaymentMetrics(payments, total), [payments, total]);

  const updateDraft = (key: keyof PaymentFilterDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = () => {
    if (draft.fromDate && draft.toDate && jalaliDateToTimestamp(draft.fromDate) > jalaliDateToTimestamp(draft.toDate)) {
      notify("تاریخ شروع نمی‌تواند بعد از تاریخ پایان باشد.", "error");
      return;
    }

    setFilters((current) => ({
      page: 1,
      perPage: current.perPage ?? 20,
      status: optionalNumber(draft.status),
      paymentFor: optionalNumber(draft.paymentFor),
      paymentType: optionalNumber(draft.paymentType),
      fromDate: draft.fromDate ? jalaliDateToIso(draft.fromDate, false) : undefined,
      toDate: draft.toDate ? jalaliDateToIso(draft.toDate, true) : undefined,
    }));
  };

  const clearFilters = () => {
    setDraft(emptyDraft);
    setFilters((current) => ({ page: 1, perPage: current.perPage ?? 20 }));
  };

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) return;
    setFilters((current) => ({ ...current, page: nextPage }));
  };

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="خلاصه پرداخت‌ها">
        {metrics.map((metric, index) => (
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-5"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            key={metric.label}
            transition={{ delay: prefersReducedMotion ? 0 : index * 0.04, duration: 0.2 }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${metric.iconClassName}`}>
                {metric.icon}
              </span>
              <span className="text-xs font-semibold text-[#a0a7b2]">{metric.caption}</span>
            </div>
            <strong className="mt-5 block text-2xl font-black text-[#1e2633]">
              {query.isLoading ? "…" : metric.value}
            </strong>
            <span className="mt-1 block text-sm font-medium text-[#7b8493]">{metric.label}</span>
          </motion.article>
        ))}
      </section>

      <section className="rounded-2xl bg-white p-5">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-base font-black text-[#263042]">فیلتر پرداخت‌ها</h2>
          <p className="m-0 text-sm leading-6 text-[#8a94a3]">فیلترها مستقیماً به API پرداخت‌های پنل ارسال می‌شوند.</p>
        </div>

        <form
          className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5"
          onSubmit={(event) => {
            event.preventDefault();
            applyFilters();
          }}
        >
          <FilterField label="وضعیت پرداخت">
            <select className={inputClassName} onChange={(event) => updateDraft("status", event.target.value)} value={draft.status}>
              <option value="">همه وضعیت‌ها</option>
              <option value="0">ثبت شده</option>
              <option value="1">پرداخت شده</option>
              <option value="-1">ناموفق</option>
            </select>
          </FilterField>

          <FilterField label="بابت پرداخت">
            <select className={inputClassName} onChange={(event) => updateDraft("paymentFor", event.target.value)} value={draft.paymentFor}>
              <option value="">همه موارد</option>
              <option value="0">آگهی</option>
              <option value="1">شارژ کیف پول</option>
              <option value="2">بسته</option>
              <option value="3">تسویه آگهی</option>
            </select>
          </FilterField>

          <FilterField label="روش پرداخت">
            <select className={inputClassName} onChange={(event) => updateDraft("paymentType", event.target.value)} value={draft.paymentType}>
              <option value="">همه روش‌ها</option>
              <option value="0">درگاه بانکی</option>
              <option value="1">کیف پول</option>
            </select>
          </FilterField>

          <DateFilterButton label="از تاریخ" onClick={() => setOpenPicker("from")} value={draft.fromDate} />
          <DateFilterButton label="تا تاریخ" onClick={() => setOpenPicker("to")} value={draft.toDate} />

          <div className="flex items-end gap-2 md:col-span-2 xl:col-span-5">
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-semibold text-white transition hover:bg-[#003ca5]" type="submit">
              <FilterIcon /> اعمال فیلترها
            </button>
            <button
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dce3ef] bg-white px-3 text-sm font-semibold text-[#657184] transition hover:bg-[#f5f7fa]"
              onClick={clearFilters}
              type="button"
            >
              حذف فیلترها
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white">
        <div className="flex flex-col gap-3 border-b border-[#edf0f5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="m-0 text-base font-black text-[#263042]">همه پرداخت‌ها</h2>
            <p className="m-0 mt-1 text-sm text-[#8a94a3]">
              {query.isLoading ? "در حال دریافت..." : `${formatNumber(total)} تراکنش پیدا شد`}
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-bold text-[#667085]">
            تعداد در صفحه
            <select
              className="h-9 rounded-lg border border-[#dce3ef] bg-white px-2 text-sm font-semibold text-[#303030] outline-none focus:border-[#0048c4]"
              onChange={(event) => setFilters((current) => ({ ...current, page: 1, perPage: Number(event.target.value) }))}
              value={perPage}
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-separate border-spacing-0 text-right">
            <thead>
              <tr className="bg-[#fafbfc] text-sm font-bold text-[#697587]">
                <TableHead>شناسه پرداخت</TableHead>
                <TableHead>بابت پرداخت</TableHead>
                <TableHead>مبلغ</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>روش پرداخت</TableHead>
                <TableHead>زمان ثبت</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </thead>
            <tbody>
              {query.isLoading ? (
                <PaymentTableSkeleton columns={7} />
              ) : query.isError ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f0] text-[#cc3342]">
                        <CloseIcon />
                      </span>
                      <p className="m-0 mt-3 text-sm font-semibold text-[#6f7a8b]">دریافت تاریخچه پرداخت‌ها ناموفق بود.</p>
                      <button className="mt-3 text-sm font-bold text-[#0048c4]" onClick={() => void query.refetch()} type="button">تلاش مجدد</button>
                    </div>
                  </td>
                </tr>
              ) : payments.length ? (
                payments.map((payment, index) => (
                  <motion.tr
                    animate={{ opacity: 1, y: 0 }}
                    className="group text-sm text-[#344054]"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 5 }}
                    key={getCrmRecordId(payment) || `${readPaymentReference(payment)}-${index}`}
                    transition={{ delay: prefersReducedMotion ? 0 : Math.min(index, 8) * 0.025, duration: 0.16 }}
                  >
                    <TableCell>
                      <span className="inline-flex rounded-lg bg-[#f4f6f9] px-2.5 py-1.5 font-mono text-xs font-bold text-[#4d5b70] [direction:ltr]">
                        {readPaymentId(payment)}
                      </span>
                    </TableCell>
                    <TableCell><span className="whitespace-nowrap font-semibold text-[#344054]">{readPaymentPurposeLabel(payment)}</span></TableCell>
                    <TableCell><strong className="whitespace-nowrap text-[#1f2937]">{readPaymentAmount(payment)}</strong></TableCell>
                    <TableCell><PaymentStatusBadge payment={payment} /></TableCell>
                    <TableCell><PaymentMethodBadge payment={payment} /></TableCell>
                    <TableCell><span className="whitespace-nowrap text-[#5f6b7c]">{readPaymentDate(payment)}</span></TableCell>
                    <TableCell>
                      <button
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#c9daf8] bg-[#eef4ff] px-3 text-sm font-bold text-[#0048c4] transition hover:border-[#0048c4] hover:bg-[#e3edff]"
                        onClick={() => setSelectedPayment(payment)}
                        type="button"
                      >
                        <InfoIcon /> جزئیات
                      </button>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]">
                        <ReceiptIcon />
                      </span>
                      <p className="m-0 mt-3 text-sm font-semibold text-[#6f7a8b]">پرداختی مطابق فیلترها پیدا نشد.</p>
                      <button className="mt-3 text-sm font-bold text-[#0048c4]" onClick={clearFilters} type="button">حذف فیلترها</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!query.isLoading && !query.isError && total > 0 ? (
          <div className="flex flex-col gap-3 border-t border-[#edf0f5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-[#7b8493]">
              صفحه {formatNumber(currentPage)} از {formatNumber(totalPages)}
            </span>
            <div className="flex items-center gap-2">
              <button
                className="h-9 rounded-lg border border-[#dce3ef] bg-white px-3 text-sm font-bold text-[#526174] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage <= 1 || query.isFetching}
                onClick={() => changePage(currentPage - 1)}
                type="button"
              >
                قبلی
              </button>
              <span className="grid h-9 min-w-9 place-items-center rounded-lg bg-[#0048c4] px-2 text-sm font-bold text-white">{formatNumber(currentPage)}</span>
              <button
                className="h-9 rounded-lg border border-[#dce3ef] bg-white px-3 text-sm font-bold text-[#526174] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage >= totalPages || query.isFetching}
                onClick={() => changePage(currentPage + 1)}
                type="button"
              >
                بعدی
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <JalaliDatePickerSheet
        isOpen={openPicker === "from"}
        onClose={() => setOpenPicker(null)}
        onConfirm={(value) => { updateDraft("fromDate", value); setOpenPicker(null); }}
        title="انتخاب تاریخ شروع"
        value={draft.fromDate}
      />
      <JalaliDatePickerSheet
        isOpen={openPicker === "to"}
        onClose={() => setOpenPicker(null)}
        onConfirm={(value) => { updateDraft("toDate", value); setOpenPicker(null); }}
        title="انتخاب تاریخ پایان"
        value={draft.toDate}
      />

      <PaymentDetailsModal onClose={() => setSelectedPayment(null)} payment={selectedPayment} />
    </div>
  );
}

function PaymentDetailsModal({ onClose, payment }: { onClose: () => void; payment: CrmRecord | null }) {
  useEffect(() => {
    if (!payment) return undefined;

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
  }, [onClose, payment]);

  const user = payment ? readNestedRecord(payment, ["user", "payer", "customer", "owner"]) : {};
  const agency = payment ? readNestedRecord(payment, ["agency"]) : {};
  const advertise = payment ? readNestedRecord(payment, ["advertise"]) : {};
  const linkedPackage = payment ? readNestedRecord(payment, ["package"]) : {};

  return (
    <AnimatePresence>
      {payment ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#152033]/45 p-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="presentation"
        >
          <motion.section
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-label="جزئیات پرداخت"
            aria-modal="true"
            className="flex h-[calc(100dvh-32px)] max-h-[820px] w-[min(820px,100%)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(18,32,57,0.25)]"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            role="dialog"
            transition={{ duration: 0.18 }}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-[#edf0f5] px-5 py-4">
              <div>
                <h2 className="m-0 text-base font-black text-[#263042]">جزئیات پرداخت</h2>
                <p className="m-0 mt-1 text-sm text-[#8a94a3]">اطلاعات کامل تراکنش و موارد متصل به آن</p>
              </div>
              <button aria-label="بستن" className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f5f8] text-[#596477]" onClick={onClose} type="button">
                <ClosePlainIcon />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              <DetailsSection title="اطلاعات تراکنش">
                <DetailItem label="شناسه پرداخت" value={readPaymentId(payment)} ltr />
                <DetailItem label="کد مرجع بانکی" value={readPaymentReference(payment)} ltr />
                <DetailItem label="شناسه سفارش" value={readPaymentOrderId(payment)} ltr />
                <DetailItem label="مبلغ" value={readPaymentAmount(payment)} />
                <DetailItem label="وضعیت" value={readPaymentStatusLabel(payment)} />
                <DetailItem label="کد پاسخ بانک" value={readPaymentBankCode(payment)} ltr />
                <DetailItem label="پیام بانک" value={readPaymentBankMessage(payment)} ltr />
                <DetailItem label="روش پرداخت" value={readPaymentMethodLabel(payment)} />
                <DetailItem label="بابت پرداخت" value={readPaymentPurposeLabel(payment)} />
                <DetailItem label="زمان ثبت" value={readPaymentDate(payment)} />
                <DetailItem label="آخرین به‌روزرسانی" value={readPaymentUpdatedDate(payment)} />
              </DetailsSection>

              <DetailsSection title="اطلاعات بانکی">
                <DetailItem label="شماره کارت" value={readPaymentCardPan(payment)} ltr />
                <DetailItem label="هش کارت" value={readPaymentCardHash(payment)} ltr wide />
                <DetailItem label="کارمزد درگاه" value={readPaymentFee(payment)} />
                <DetailItem label="نوع پرداخت کارمزد" value={readPaymentFeeType(payment)} ltr />
                <DetailItem label="کارمزد شاپرک" value={readPaymentShaparakFee(payment)} />
                <DetailItem label="دستمزدها" value={readPaymentWages(payment)} />
              </DetailsSection>

              <DetailsSection title="کاربر پرداخت‌کننده">
                <DetailItem label="نام و نام خانوادگی" value={readPaymentUserName(payment)} />
                <DetailItem label="شماره موبایل" value={readPaymentMobile(payment)} ltr />
                <DetailItem label="شناسه کاربر" value={readText(payment, ["user_id"], readText(user, ["id", "_id"], "-"))} ltr />
              </DetailsSection>

              <DetailsSection title="اطلاعات مرتبط">
                <DetailItem label="آژانس" value={readText(agency, ["name", "title"], "-")} />
                <DetailItem label="شناسه آژانس" value={readText(payment, ["agency_id"], readText(agency, ["id", "_id"], "-"))} ltr />
                <DetailItem label="عنوان آگهی" value={readText(advertise, ["title"], "-")} />
                <DetailItem label="شناسه آگهی" value={readText(payment, ["advertise_id"], readText(advertise, ["id", "_id"], "-"))} ltr />
                <DetailItem label="کد پیگیری آگهی" value={readText(advertise, ["track_code"], "-")} ltr />
                <DetailItem label="عنوان بسته" value={readText(linkedPackage, ["title"], "-")} />
                <DetailItem label="شناسه بسته" value={readText(payment, ["package_id"], readText(linkedPackage, ["id", "slug"], "-"))} ltr />
              </DetailsSection>
            </div>

            <footer className="flex shrink-0 justify-end border-t border-[#edf0f5] px-5 py-4">
              <button className="h-10 rounded-xl bg-[#0048c4] px-5 text-sm font-bold text-white" onClick={onClose} type="button">بستن</button>
            </footer>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DetailsSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-xl border border-[#edf0f5] bg-[#fbfcfe] p-4">
      <h3 className="m-0 mb-3 text-sm font-black text-[#344054]">{title}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function DetailItem({ label, ltr = false, value, wide = false }: { label: string; ltr?: boolean; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-lg bg-white px-3 py-2.5 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="block text-xs font-semibold text-[#8a94a3]">{label}</span>
      <strong className={`mt-1 block break-words text-sm font-bold text-[#303846] ${ltr ? "[direction:ltr] text-left" : ""}`}>{value}</strong>
    </div>
  );
}

function DateFilterButton({ label, onClick, value }: { label: string; onClick: () => void; value: string }) {
  return (
    <FilterField label={label}>
      <button className={`${inputClassName} flex items-center justify-between text-right`} onClick={onClick} type="button">
        <span className={value ? "text-[#303030]" : "text-[#999999]"}>{value || "انتخاب تاریخ شمسی"}</span>
        <CalendarIcon />
      </button>
    </FilterField>
  );
}

function optionalNumber(value: string) {
  if (value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function jalaliDateToTimestamp(value: string) {
  return new DateObject({ date: value, format: "YYYY/MM/DD", calendar: persian }).convert(gregorian).toDate().getTime();
}

function jalaliDateToIso(value: string, endOfDay: boolean) {
  const date = new DateObject({ date: value, format: "YYYY/MM/DD", calendar: persian }).convert(gregorian).toDate();
  date.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
  return date.toISOString();
}

function buildPaymentMetrics(payments: CrmRecord[], total: number) {
  const successful = payments.filter((payment) => readPaymentStatus(payment) === "success");
  const pending = payments.filter((payment) => readPaymentStatus(payment) === "pending");
  const failed = payments.filter((payment) => readPaymentStatus(payment) === "failed");
  const successfulAmount = successful.reduce((sum, payment) => sum + readPaymentNumericAmount(payment), 0);

  return [
    {
      caption: "نتیجه فیلتر",
      icon: <ReceiptIcon />,
      iconClassName: "bg-[#eef4ff] text-[#0048c4]",
      label: "کل تراکنش‌ها",
      value: formatNumber(total),
    },
    {
      caption: "در صفحه فعلی",
      icon: <CheckIcon />,
      iconClassName: "bg-[#ebfaf3] text-[#0b8b55]",
      label: "مجموع پرداخت موفق",
      value: `${formatNumber(successfulAmount)} تومان`,
    },
    {
      caption: "در صفحه فعلی",
      icon: <ClockIcon />,
      iconClassName: "bg-[#fff7df] text-[#a06a00]",
      label: "در انتظار پرداخت",
      value: formatNumber(pending.length),
    },
    {
      caption: "در صفحه فعلی",
      icon: <CloseIcon />,
      iconClassName: "bg-[#fff0f0] text-[#cc3342]",
      label: "پرداخت ناموفق",
      value: formatNumber(failed.length),
    },
  ];
}

function readPaymentStatus(payment: CrmRecord): PaymentStatus {
  const status = String(payment.status ?? payment.payment_status ?? "").trim().toLowerCase();

  if (["1", "paid", "success", "successful", "completed", "پرداخت شده", "موفق"].includes(status)) return "success";
  if (["-1", "failed", "error", "rejected", "cancelled", "canceled", "ناموفق", "رد شده"].includes(status)) return "failed";
  if (["0", "pending", "processing", "در انتظار", "در حال پردازش", "ثبت شده"].includes(status)) return "pending";

  return "unknown";
}

function readPaymentStatusLabel(payment: CrmRecord) {
  return readText(payment, ["status", "payment_status"], "نامشخص");
}

function readPaymentMethod(payment: CrmRecord): PaymentMethod {
  const method = String(payment.payment_type ?? payment.method ?? payment.payment_method ?? "").trim().toLowerCase();

  if (["0", "online", "gateway", "bank", "درگاه", "پرداخت آنلاین"].includes(method)) return "gateway";
  if (["1", "wallet", "credit", "کیف پول", "اعتبار"].includes(method)) return "wallet";

  return "unknown";
}

function readPaymentMethodLabel(payment: CrmRecord) {
  return {
    gateway: "درگاه بانکی",
    wallet: "کیف پول / اعتبار",
    unknown: readText(payment, ["method", "payment_method"], "نامشخص"),
  }[readPaymentMethod(payment)];
}

function readPaymentPurposeLabel(payment: CrmRecord) {
  const purpose = String(payment.payment_for ?? "").trim().toLowerCase();
  return ({
    "0": "پرداخت آگهی",
    "1": "شارژ کیف پول",
    "2": "خرید بسته",
    "3": "تسویه آگهی",
    advertise: "پرداخت آگهی",
    advertise_payment: "پرداخت آگهی",
    advertise_settlement: "تسویه آگهی",
    package: "خرید بسته",
    package_purchase: "خرید بسته",
    wallet: "شارژ کیف پول",
    wallet_charge: "شارژ کیف پول",
  } as Record<string, string>)[purpose] ?? readText(payment, ["payment_for"], "نامشخص");
}

function readPaymentUserName(payment: CrmRecord) {
  const user = readNestedRecord(payment, ["user", "payer", "customer", "owner"]);
  const fullName = [
    readText(user, ["name", "first_name"], ""),
    readText(user, ["family", "last_name"], ""),
  ].filter(Boolean).join(" ");

  return fullName || readText(payment, ["user_name", "payer_name", "customer_name", "name"], "-");
}

function readPaymentMobile(payment: CrmRecord) {
  const user = readNestedRecord(payment, ["user", "payer", "customer", "owner"]);
  return readText(payment, ["mobile", "phone", "user_mobile"], readText(user, ["mobile", "phone"], "-"));
}

function readPaymentNumericAmount(payment: CrmRecord) {
  const value = payment.amount ?? payment.price ?? payment.cost ?? payment.total ?? payment.final_price;
  const number = Number(String(value ?? 0).replace(/[^\d.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function readPaymentAmount(payment: CrmRecord) {
  const value = payment.amount ?? payment.price ?? payment.cost ?? payment.total ?? payment.final_price;
  if (typeof value === "string" && /تومان|ریال|﷼/.test(value)) return value;

  const amount = readPaymentNumericAmount(payment);
  return amount ? `${formatNumber(amount)} تومان` : "-";
}

function readPaymentDate(payment: CrmRecord) {
  const value = readText(payment, ["paid_at", "created_at", "payment_date", "date", "updated_at"], "-");
  return formatPaymentDate(value);
}

function readPaymentUpdatedDate(payment: CrmRecord) {
  return formatPaymentDate(readText(payment, ["updated_at"], "-"));
}

function formatPaymentDate(value: string) {
  if (value === "-") return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function readPaymentId(payment: CrmRecord) {
  return readText(payment, ["id", "_id"], "-");
}

function readPaymentResponseValue(payment: CrmRecord, keys: string[], fallback = "-") {
  const bankResponse = readNestedRecord(payment, ["bank_res", "bank_response"]);
  const raw = readNestedRecord(bankResponse, ["raw"]);
  const data = readNestedRecord(raw, ["data"]);

  return readText(payment, keys, readText(bankResponse, keys, readText(data, keys, fallback)));
}

function readPaymentReference(payment: CrmRecord) {
  return readPaymentResponseValue(payment, ["ref_code", "ref_id", "reference_id", "tracking_code", "track_code"]);
}

function readPaymentOrderId(payment: CrmRecord) {
  return readPaymentResponseValue(payment, ["order_id"]);
}

function readPaymentCardPan(payment: CrmRecord) {
  return readPaymentResponseValue(payment, ["card_pan"]);
}

function readPaymentCardHash(payment: CrmRecord) {
  return readPaymentResponseValue(payment, ["card_hash"]);
}

function readPaymentBankCode(payment: CrmRecord) {
  return readPaymentResponseValue(payment, ["code"]);
}

function readPaymentBankMessage(payment: CrmRecord) {
  return readPaymentResponseValue(payment, ["message"]);
}

function readPaymentFeeType(payment: CrmRecord) {
  return readPaymentResponseValue(payment, ["fee_type"]);
}

function readPaymentFee(payment: CrmRecord) {
  return formatPaymentMoney(readPaymentResponseValue(payment, ["fee"]));
}

function readPaymentShaparakFee(payment: CrmRecord) {
  return formatPaymentMoney(readPaymentResponseValue(payment, ["shaparak_fee"]));
}

function readPaymentWages(payment: CrmRecord) {
  return formatPaymentMoney(readPaymentResponseValue(payment, ["wages"]));
}

function formatPaymentMoney(value: string) {
  if (value === "-") return value;
  const amount = Number(value);
  return Number.isFinite(amount) ? `${formatNumber(amount)} تومان` : value;
}

function readText(record: CrmRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }

  return fallback;
}

function readNestedRecord(record: CrmRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (value && typeof value === "object" && !Array.isArray(value)) return value as CrmRecord;
  }

  return {};
}

function PaymentStatusBadge({ payment }: { payment: CrmRecord }) {
  const status = readPaymentStatus(payment);
  const config = {
    failed: "bg-[#fff0f0] text-[#cc3342]",
    pending: "bg-[#fff7df] text-[#a06a00]",
    success: "bg-[#ebfaf3] text-[#0b8b55]",
    unknown: "bg-[#f1f3f6] text-[#697587]",
  }[status];

  return <span className={`inline-flex min-w-[92px] justify-center rounded-full px-2.5 py-1.5 text-xs font-bold ${config}`}>{readPaymentStatusLabel(payment)}</span>;
}

function PaymentMethodBadge({ payment }: { payment: CrmRecord }) {
  const method = readPaymentMethod(payment);
  const config = {
    gateway: { label: "درگاه بانکی", style: "bg-[#eef4ff] text-[#0048c4]" },
    wallet: { label: "کیف پول / اعتبار", style: "bg-[#f3efff] text-[#6a3cc3]" },
    unknown: { label: readText(payment, ["method", "payment_method"], "نامشخص"), style: "bg-[#f1f3f6] text-[#697587]" },
  }[method];

  return <span className={`inline-flex whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-bold ${config.style}`}>{config.label}</span>;
}

function FilterField({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-[#667085]">{label}</span>
      {children}
    </label>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return <th className="border-b border-[#e9edf3] px-4 py-3.5 font-bold first:pr-5 last:pl-5">{children}</th>;
}

function TableCell({ children }: { children: ReactNode }) {
  return <td className="border-b border-[#edf0f5] px-4 py-4 align-middle transition group-hover:bg-[#fbfcff] first:pr-5 last:pl-5">{children}</td>;
}

function PaymentTableSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 7 }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <td className="border-b border-[#edf0f5] px-4 py-4" key={columnIndex}>
              <span className={`block h-4 animate-pulse rounded-full bg-[#edf0f4] ${columnIndex === 0 ? "w-32" : "w-20"}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function SvgIcon({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width={size}>
      {children}
    </svg>
  );
}

function ReceiptIcon() { return <SvgIcon><path d="M6 3h12v18l-2.2-1.5L13.9 21 12 19.5 10.1 21l-1.9-1.5L6 21V3Z" /><path d="M9 8h6M9 12h6M9 16h3" /></SvgIcon>; }
function CheckIcon() { return <SvgIcon><circle cx="12" cy="12" r="9" /><path d="m8 12 2.7 2.7L16.5 9" /></SvgIcon>; }
function ClockIcon() { return <SvgIcon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></SvgIcon>; }
function CloseIcon() { return <SvgIcon><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></SvgIcon>; }
function FilterIcon() { return <SvgIcon size={18}><path d="M4 6h16M7 12h10m-7 6h4" /></SvgIcon>; }
function CalendarIcon() { return <SvgIcon size={18}><rect height="16" rx="2" width="17" x="3.5" y="5" /><path d="M8 3v4m8-4v4M3.5 10h17" /></SvgIcon>; }
function InfoIcon() { return <SvgIcon size={16}><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></SvgIcon>; }
function ClosePlainIcon() { return <SvgIcon size={18}><path d="m7 7 10 10M17 7 7 17" /></SvgIcon>; }
