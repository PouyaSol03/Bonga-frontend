import { useQuery } from "@tanstack/react-query";
import { listCrmAdvertises, listCrmUsers, listCrmAgencies, listCrmAdvertiseForms, getCrmRecordId } from "../../../services/crm.service";
import { RouteLink } from "../../../routes/RouteLink";
import { CrmIcon, EmptyState, ListSkeleton, Panel, PanelHeader, StatusBadge, TextLink, readText, useQueryErrorToast } from "../CrmLayout";
import type { CrmRoutePageProps } from "../CrmLayout";

export function CrmOverviewPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const adsQuery = useQuery({
    queryFn: () => listCrmAdvertises(),
    queryKey: ["crm", "overview", "advertises", refreshNonce],
  });
  const usersQuery = useQuery({
    queryFn: () => listCrmUsers(),
    queryKey: ["crm", "overview", "users", refreshNonce],
  });
  const agenciesQuery = useQuery({
    queryFn: () => listCrmAgencies(),
    queryKey: ["crm", "overview", "agencies", refreshNonce],
  });
  const formsQuery = useQuery({
    queryFn: listCrmAdvertiseForms,
    queryKey: ["crm", "overview", "forms", refreshNonce],
  });

  useQueryErrorToast([adsQuery.error, usersQuery.error, agenciesQuery.error, formsQuery.error], notify);

  const isLoading =
    adsQuery.isLoading || usersQuery.isLoading || agenciesQuery.isLoading || formsQuery.isLoading;

  const metrics = [
    {
      icon: "ads" as const,
      label: "آگهی‌ها",
      path: "/crm/advertises",
      value: adsQuery.data?.length ?? 0,
    },
    {
      icon: "users" as const,
      label: "کاربران",
      path: "/crm/users",
      value: usersQuery.data?.length ?? 0,
    },
    {
      icon: "building" as const,
      label: "آژانس‌ها",
      path: "/crm/agencies",
      value: agenciesQuery.data?.length ?? 0,
    },
    {
      icon: "form" as const,
      label: "فرم‌های آگهی",
      path: "/crm/forms",
      value: formsQuery.data?.length ?? 0,
    },
  ];

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="آمار کلی">
        {metrics.map((metric) => (
          <RouteLink
            className="group rounded-2xl bg-white p-5 no-underline transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,72,196,0.08)]"
            key={metric.label}
            to={metric.path}
          >
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4] transition group-hover:bg-[#0048c4] group-hover:text-white">
                <CrmIcon name={metric.icon} size={22} />
              </span>
              <CrmIcon name="arrow" size={18} />
            </div>
            <strong className="mt-5 block text-3xl font-black text-[#1e2633]">
              {isLoading ? "…" : new Intl.NumberFormat("fa-IR").format(metric.value)}
            </strong>
            <span className="mt-1 block text-sm font-medium text-[#7b8493]">{metric.label}</span>
          </RouteLink>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <Panel>
          <PanelHeader
            action={<TextLink label="مشاهده همه" to="/crm/advertises" />}
            subtitle="آخرین آگهی‌های دریافت‌شده در پنل"
            title="آگهی‌های اخیر"
          />
          <div className="mt-4 divide-y divide-[#edf0f5]">
            {adsQuery.isLoading ? (
              <ListSkeleton count={6} />
            ) : adsQuery.data?.length ? (
              adsQuery.data.slice(0, 6).map((ad) => (
                <RouteLink
                  className="flex min-h-14 items-center justify-between gap-4 py-3 text-[#273142] no-underline transition hover:text-[#0048c4]"
                  key={getCrmRecordId(ad)}
                  to={`/crm/advertises/${encodeURIComponent(getCrmRecordId(ad))}`}
                >
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-bold">{readText(ad, ["title"])}</p>
                    <p className="m-0 mt-1 text-sm text-[#9098a6]">
                      کد پیگیری: {readText(ad, ["track_code"])}
                    </p>
                  </div>
                  <StatusBadge status={ad.status} />
                </RouteLink>
              ))
            ) : (
              <EmptyState compact description="هنوز آگهی‌ای دریافت نشده است." />
            )}
          </div>
        </Panel>

        <Panel>
          <PanelHeader subtitle="دسترسی سریع به عملیات پرتکرار" title="ابزارهای مدیریت" />
          <div className="mt-4 grid gap-3">
            {[
              { description: "بررسی و تعیین وضعیت آگهی‌ها", icon: "ads" as const, label: "صف بررسی آگهی", to: "/crm/advertises" },
              { description: "ساخت و مدیریت حساب‌ها", icon: "users" as const, label: "مدیریت کاربران", to: "/crm/users" },
              { description: "ویرایش شهر، محله و محدوده", icon: "location" as const, label: "موقعیت‌ها", to: "/crm/locations" },
              { description: "مشاهده و پیگیری تراکنش‌های کاربران", icon: "payment" as const, label: "تاریخچه پرداخت‌ها", to: "/crm/payments" },
              { description: "بررسی گزارش‌های آگهی و کاربران", icon: "reports" as const, label: "گزارش‌های تخلف", to: "/crm/reports" },
              { description: "مشاهده و پاسخگویی به درخواست‌های پشتیبانی کاربران", icon: "requests" as const, label: "درخواست‌های پشتیبانی", to: "/crm/requests" },
              { description: "بررسی درخواست‌های کاربران برای یافتن ملک یا آگهی مناسب", icon: "ads" as const, label: "درخواست‌های یافتن آگهی", to: "/crm/property-requests" },
            ].map((item) => (
              <RouteLink
                className="flex items-center gap-3 rounded-xl border border-[#f0f0f0] p-3.5 text-[#273142] no-underline transition hover:border-[#cbd8ed] hover:bg-[#fbfcff]"
                key={item.label}
                to={item.to}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]">
                  <CrmIcon name={item.icon} size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm">{item.label}</strong>
                  <small className="mt-1 block text-sm text-[#8b94a3]">{item.description}</small>
                </span>
                <CrmIcon name="arrow" size={17} />
              </RouteLink>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
