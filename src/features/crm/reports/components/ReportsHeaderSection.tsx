import LinearFlag from "../../../../shared/icons/LinearFlag";
import LinearSearch from "../../../../shared/icons/LinearSearch";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { CrmReportKind } from "../../api/crm.service";
import { formatCount } from "../reportHelpers";
import { tabs } from "../types";

export function ReportsHeaderSection({
  activeKind,
  allowedTabs,
  onKindChange,
  onSearchChange,
  reportCounts,
  search,
  tabLoading,
}: {
  activeKind: CrmReportKind;
  allowedTabs: typeof tabs;
  onKindChange: (kind: CrmReportKind) => void;
  onSearchChange: (value: string) => void;
  reportCounts: Record<CrmReportKind, number>;
  search: string;
  tabLoading: Record<CrmReportKind, boolean>;
}) {
  return (
    <section className="rounded-2xl bg-white p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]"
          >
            <LinearFlag className="h-6 w-6" />
          </Typography>
          <div>
            <Typography
              as="h1"
              variant="title"
              size="medium"
              weight="semibold"
              className="m-0 text-lg font-black text-[#263042]"
            >
              گزارش‌های تخلف
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="m-0 mt-1 text-sm leading-6 text-[#8a94a3]"
            >
              گزارش‌های ثبت‌شده برای آگهی‌ها و کاربران را جداگانه مشاهده و بررسی کنید.
            </Typography>
          </div>
        </div>

        <label className="relative block w-full xl:w-[340px]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="sr-only">
            جست‌وجو در گزارش‌ها
          </Typography>
          <LinearSearch className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[#98a2b3]" />
          <input
            className="h-11 w-full rounded-xl border border-[#d7dce5] bg-white pr-10 pl-3 text-sm font-medium text-[#303030] transition outline-none placeholder:text-[#98a2b3] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="جست‌وجو با نام، موبایل، دلیل یا کد گزارش"
            type="search"
            value={search}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2" role="tablist" aria-label="نوع گزارش تخلف">
        {allowedTabs.map((tab) => {
          const isActive = activeKind === tab.id;
          const Icon = tab.icon;

          return (
            <Button
              unstyled
              aria-controls="crm-reports-panel"
              aria-selected={isActive}
              className={`flex min-h-[78px] items-center gap-3 rounded-xl border px-4 text-right transition ${
                isActive
                  ? "border-[#0048c4] bg-[#f4f7ff] shadow-[0_0_0_2px_rgba(0,72,196,0.05)]"
                  : "border-[#e7eaf0] bg-white hover:border-[#bdc9dc] hover:bg-[#fafcff]"
              }`}
              id={`crm-reports-tab-${tab.id}`}
              key={tab.id}
              onClick={() => onKindChange(tab.id)}
              role="tab"
              type="button"
            >
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                  isActive ? "bg-[#0048c4] text-white" : "bg-[#f1f4f8] text-[#667085]"
                }`}
              >
                <Icon className="h-6 w-6" />
              </Typography>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="min-w-0 flex-1"
              >
                <strong
                  className={`block text-sm font-black ${
                    isActive ? "text-[#0048c4]" : "text-[#344054]"
                  }`}
                >
                  {tab.label}
                </strong>
                <Typography
                  as="span"
                  variant="label"
                  size="small"
                  weight="medium"
                  className="mt-1 block truncate text-xs font-medium text-[#8a94a3]"
                >
                  {tab.description}
                </Typography>
              </Typography>
              <Typography
                as="span"
                variant="label"
                size="small"
                weight="semibold"
                className={`inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-1 text-xs font-black ${
                  isActive ? "bg-white text-[#0048c4]" : "bg-[#f1f2f4] text-[#667085]"
                }`}
              >
                {tabLoading[tab.id]
                  ? "…"
                  : formatCount(reportCounts[tab.id])}
              </Typography>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
