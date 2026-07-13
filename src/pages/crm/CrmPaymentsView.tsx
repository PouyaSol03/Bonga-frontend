import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";

import { getApiErrorMessage } from "../../api/api";
import {
  getCrmRecordId,
  hasCrmPaymentsApi,
  listCrmPayments,
  type CrmRecord,
} from "../../services/crm.service";

type CrmPaymentsViewProps = {
  notify: (message: string, tone?: "error" | "success") => void;
  refreshNonce: number;
};

type PaymentStatus = "failed" | "pending" | "success" | "unknown";
type PaymentMethod = "gateway" | "wallet" | "unknown";

const inputClassName =
  "h-10 w-full rounded-xl border border-[#cccccc] bg-white px-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";

export function CrmPaymentsView({ notify, refreshNonce }: CrmPaymentsViewProps) {
  const prefersReducedMotion = useReducedMotion();
  const [queryText, setQueryText] = useState("");
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [service, setService] = useState("");
  const [filters, setFilters] = useState({ method: "", query: "", service: "", status: "" });

  const query = useQuery({
    queryFn: () => listCrmPayments(filters),
    queryKey: ["crm", "payments", filters, refreshNonce],
  });

  useEffect(() => {
    if (!query.error) return;

    notify(getApiErrorMessage(query.error, "دریافت تاریخچه پرداخت‌ها ناموفق بود."), "error");
  }, [notify, query.error]);

  const payments = useMemo(() => query.data ?? [], [query.data]);
  const services = useMemo(
    () => Array.from(new Set(payments.map(readPaymentService).filter((value) => value !== "-"))),
    [payments],
  );
  const metrics = useMemo(() => buildPaymentMetrics(payments), [payments]);
  const isUsingApi = hasCrmPaymentsApi();

  const applyFilters = () => {
    setFilters({ method, query: queryText.trim(), service, status });
  };

  const clearFilters = () => {
    setQueryText("");
    setStatus("");
    setMethod("");
    setService("");
    setFilters({ method: "", query: "", service: "", status: "" });
  };

  return (
    <div className="space-y-4">
      {!isUsingApi ? (
        <section className="flex items-start gap-3 rounded-2xl border border-[#f0ddb1] bg-[#fffaf0] px-4 py-3 text-[#805800]">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#fff0c7]">
            <InfoIcon />
          </span>
          <div>
            <p className="m-0 text-sm font-bold">نمایش موقت با داده‌های نمونه</p>
            <p className="m-0 mt-1 text-sm leading-6 text-[#8d6b23]">
              تا زمان دریافت API، اطلاعات نمونه برای بررسی ظاهر و رفتار صفحه نمایش داده می‌شود. پس از اتصال سرویس، داده‌های واقعی جایگزین خواهند شد.
            </p>
          </div>
        </section>
      ) : null}

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
          <p className="m-0 text-sm leading-6 text-[#8a94a3]">
            جستجو بر اساس نام، موبایل، شناسه یا کد پیگیری پرداخت
          </p>
        </div>

        <form
          className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(260px,1.5fr)_repeat(3,minmax(160px,0.75fr))_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            applyFilters();
          }}
        >
          <FilterField label="جستجو">
            <div className="relative">
              <input
                className={`${inputClassName} pl-10`}
                onChange={(event) => setQueryText(event.target.value)}
                placeholder="نام، موبایل یا کد پیگیری"
                value={queryText}
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8893a3]">
                <SearchIcon />
              </span>
            </div>
          </FilterField>

          <FilterField label="وضعیت">
            <Select value={status} onChange={setStatus}>
              <option value="">همه وضعیت‌ها</option>
              <option value="success">پرداخت شده</option>
              <option value="pending">در انتظار</option>
              <option value="failed">ناموفق</option>
            </Select>
          </FilterField>

          <FilterField label="روش پرداخت">
            <Select value={method} onChange={setMethod}>
              <option value="">همه روش‌ها</option>
              <option value="gateway">درگاه بانکی</option>
              <option value="wallet">کیف پول / اعتبار</option>
            </Select>
          </FilterField>

          <FilterField label="نوع سرویس">
            <Select value={service} onChange={setService}>
              <option value="">همه سرویس‌ها</option>
              {services.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Select>
          </FilterField>

          <div className="flex items-end gap-2">
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-semibold text-white transition hover:bg-[#003ca5]" type="submit">
              <FilterIcon />
              اعمال
            </button>
            <button
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dce3ef] bg-white px-3 text-sm font-semibold text-[#657184] transition hover:bg-[#f5f7fa]"
              onClick={clearFilters}
              type="button"
            >
              حذف
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-[#edf0f5] px-5 py-4">
          <div>
            <h2 className="m-0 text-base font-black text-[#263042]">همه پرداخت‌ها</h2>
            <p className="m-0 mt-1 text-sm text-[#8a94a3]">
              {query.isLoading ? "در حال دریافت..." : `${formatNumber(payments.length)} تراکنش نمایش داده شده`}
            </p>
          </div>
          <span className="rounded-full bg-[#eef4ff] px-3 py-1.5 text-xs font-bold text-[#0048c4]">
            تاریخچه پرداخت
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-separate border-spacing-0 text-right">
            <thead>
              <tr className="bg-[#fafbfc] text-sm font-bold text-[#697587]">
                <TableHead>کاربر</TableHead>
                <TableHead>نوع سرویس</TableHead>
                <TableHead>مبلغ</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>زمان پرداخت</TableHead>
                <TableHead>روش پرداخت</TableHead>
                <TableHead>شناسه پرداخت</TableHead>
              </tr>
            </thead>
            <tbody>
              {query.isLoading ? (
                <PaymentTableSkeleton />
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
                    key={getCrmRecordId(payment) || `${readPaymentTrackingCode(payment)}-${index}`}
                    transition={{ delay: prefersReducedMotion ? 0 : Math.min(index, 8) * 0.025, duration: 0.16 }}
                  >
                    <TableCell>
                      <div className="flex min-w-[170px] items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eef4ff] font-black text-[#0048c4]">
                          {readPaymentUserName(payment).charAt(0) || "ک"}
                        </span>
                        <span className="min-w-0">
                          <strong className="block truncate text-sm text-[#273142]">{readPaymentUserName(payment)}</strong>
                          <small className="mt-1 block text-xs text-[#8b95a5] [direction:ltr]">{readPaymentMobile(payment)}</small>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell><span className="font-semibold text-[#344054]">{readPaymentService(payment)}</span></TableCell>
                    <TableCell><strong className="whitespace-nowrap text-[#1f2937]">{readPaymentAmount(payment)}</strong></TableCell>
                    <TableCell><PaymentStatusBadge payment={payment} /></TableCell>
                    <TableCell><span className="whitespace-nowrap text-[#5f6b7c]">{readPaymentDate(payment)}</span></TableCell>
                    <TableCell><PaymentMethodBadge payment={payment} /></TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-lg bg-[#f4f6f9] px-2.5 py-1.5 font-mono text-xs text-[#4d5b70] [direction:ltr]">
                        {readPaymentTrackingCode(payment)}
                      </span>
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
      </section>
    </div>
  );
}

function buildPaymentMetrics(payments: CrmRecord[]) {
  const successful = payments.filter((payment) => readPaymentStatus(payment) === "success");
  const pending = payments.filter((payment) => readPaymentStatus(payment) === "pending");
  const failed = payments.filter((payment) => readPaymentStatus(payment) === "failed");
  const successfulAmount = successful.reduce((sum, payment) => sum + readPaymentNumericAmount(payment), 0);

  return [
    {
      caption: "کل تراکنش‌ها",
      icon: <ReceiptIcon />,
      iconClassName: "bg-[#eef4ff] text-[#0048c4]",
      label: "تعداد پرداخت‌ها",
      value: formatNumber(payments.length),
    },
    {
      caption: "مجموع موفق",
      icon: <CheckIcon />,
      iconClassName: "bg-[#ebfaf3] text-[#0b8b55]",
      label: "مبلغ پرداخت‌شده",
      value: `${formatNumber(successfulAmount)} تومان`,
    },
    {
      caption: "نیازمند پیگیری",
      icon: <ClockIcon />,
      iconClassName: "bg-[#fff7df] text-[#a06a00]",
      label: "در انتظار پرداخت",
      value: formatNumber(pending.length),
    },
    {
      caption: "تراکنش ناموفق",
      icon: <CloseIcon />,
      iconClassName: "bg-[#fff0f0] text-[#cc3342]",
      label: "پرداخت‌های ناموفق",
      value: formatNumber(failed.length),
    },
  ];
}

function readPaymentStatus(payment: CrmRecord): PaymentStatus {
  const status = String(payment.status ?? payment.payment_status ?? "").trim().toLowerCase();

  if (["1", "paid", "success", "successful", "completed", "پرداخت شده", "موفق"].includes(status)) return "success";
  if (["-1", "failed", "error", "rejected", "cancelled", "canceled", "ناموفق", "رد شده"].includes(status)) return "failed";
  if (["0", "pending", "processing", "در انتظار", "در حال پردازش"].includes(status)) return "pending";

  return "unknown";
}

function readPaymentMethod(payment: CrmRecord): PaymentMethod {
  const method = String(payment.method ?? payment.payment_method ?? "").trim().toLowerCase();

  if (["online", "gateway", "bank", "درگاه", "پرداخت آنلاین"].includes(method)) return "gateway";
  if (["wallet", "credit", "کیف پول", "اعتبار"].includes(method)) return "wallet";

  return "unknown";
}

function readPaymentUserName(payment: CrmRecord) {
  const user = readNestedRecord(payment, ["user", "payer", "customer", "owner"]);
  const fullName = [
    readText(user, ["name", "first_name"], ""),
    readText(user, ["family", "last_name"], ""),
  ].filter(Boolean).join(" ");

  return fullName || readText(payment, ["user_name", "payer_name", "customer_name", "name"], "کاربر ناشناس");
}

function readPaymentMobile(payment: CrmRecord) {
  const user = readNestedRecord(payment, ["user", "payer", "customer", "owner"]);
  return readText(payment, ["mobile", "phone", "user_mobile"], readText(user, ["mobile", "phone"], "-"));
}

function readPaymentService(payment: CrmRecord) {
  return readText(payment, ["service_name", "service", "package_name", "plan_name", "title", "type"], "-");
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
  if (value === "-") return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function readPaymentTrackingCode(payment: CrmRecord) {
  return readText(payment, ["tracking_code", "track_code", "ref_id", "reference_id", "authority", "id", "_id"], "-");
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
    failed: { label: "ناموفق", style: "bg-[#fff0f0] text-[#cc3342]" },
    pending: { label: "در انتظار", style: "bg-[#fff7df] text-[#a06a00]" },
    success: { label: "پرداخت شده", style: "bg-[#ebfaf3] text-[#0b8b55]" },
    unknown: { label: readText(payment, ["status", "payment_status"], "نامشخص"), style: "bg-[#f1f3f6] text-[#697587]" },
  }[status];

  return <span className={`inline-flex min-w-[92px] justify-center rounded-full px-2.5 py-1.5 text-xs font-bold ${config.style}`}>{config.label}</span>;
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

function Select({ children, onChange, value }: { children: ReactNode; onChange: (value: string) => void; value: string }) {
  return (
    <span className="relative block">
      <select className={`${inputClassName} appearance-none pl-9`} onChange={(event) => onChange(event.target.value)} value={value}>
        {children}
      </select>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#778295]">
        <ChevronDownIcon />
      </span>
    </span>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return <th className="border-b border-[#e9edf3] px-4 py-3.5 font-bold first:pr-5 last:pl-5">{children}</th>;
}

function TableCell({ children }: { children: ReactNode }) {
  return <td className="border-b border-[#edf0f5] px-4 py-4 align-middle transition group-hover:bg-[#fbfcff] first:pr-5 last:pl-5">{children}</td>;
}

function PaymentTableSkeleton() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: 7 }).map((__, columnIndex) => (
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
function SearchIcon() { return <SvgIcon size={18}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></SvgIcon>; }
function FilterIcon() { return <SvgIcon size={18}><path d="M4 6h16M7 12h10m-7 6h4" /></SvgIcon>; }
function InfoIcon() { return <SvgIcon size={18}><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></SvgIcon>; }
function ChevronDownIcon() { return <SvgIcon size={16}><path d="m6 9 6 6 6-6" /></SvgIcon>; }
