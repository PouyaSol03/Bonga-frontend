import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import type { AgencyNotificationItem } from "../types";

export interface AgencyNotificationsCardProps {
  items?: AgencyNotificationItem[];
  viewAllTo?: string;
}

const defaultNotifications: AgencyNotificationItem[] = [
  {
    id: "notif_deal",
    title: "نتیجه معامله نیاز به تأیید دارد",
    time: "دیروز ۱۲:۲۰",
    description: "لطفاً نتیجه معامله ثبت‌شده را بررسی و تأیید کنید.",
    type: "deal_approval",
    primaryAction: { label: "تایید", onClick: () => {} },
    secondaryAction: { label: "عدم تایید", onClick: () => {} },
  },
  {
    id: "notif_pub",
    title: "آگهی شما منتشر شد",
    time: "دیروز ۱۲:۲۰",
    description: "آگهی «آپارتمان ۱۲۰ متری سعادت‌آباد» با موفقیت منتشر شد.",
    type: "ad_published",
    linkAction: { label: "مشاهده آگهی", to: "/account/manage-ads" },
  },
  {
    id: "notif_stop",
    title: "انتشار آگهی متوقف شد",
    time: "دیروز ۱۲:۲۰",
    description: "درخواست توقف انتشار آگهی شما تأیید شد.",
    type: "ad_stopped",
    linkAction: { label: "مشاهده آگهی", to: "/account/manage-ads" },
  },
];

export function AgencyNotificationsCard({
  items = defaultNotifications,
  viewAllTo = "/account/dashboard/messages",
}: AgencyNotificationsCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#1A1A1A]">آخرین اعلان‌ها</h2>
        <RouteLink
          className="flex items-center gap-1 text-[12px] font-medium text-[#0048C4] hover:underline"
          to={viewAllTo}
        >
          <span>مشاهده همه</span>
          <LinearArrowLeft1 className="h-3.5 w-3.5" />
        </RouteLink>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <article
              key={item.id}
              className={`flex flex-col py-3 ${!isLast ? "border-b border-[#F1F5F9]" : ""}`}
            >
              {/* Top row: Title + Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {item.type === "ad_published" && (
                    <span className="h-2 w-2 rotate-45 rounded-xs bg-[#10B981]" />
                  )}
                  {item.type === "ad_stopped" && (
                    <span className="h-2 w-2 rotate-45 rounded-xs bg-[#EA580C]" />
                  )}
                  <h3 className="text-[13px] font-bold text-[#1E293B]">
                    {item.title}
                  </h3>
                </div>
                <span className="text-[11px] font-normal text-[#94A3B8]">
                  {item.time}
                </span>
              </div>

              {/* Description */}
              <p className="mt-1 text-[12px] font-normal text-[#475569] leading-relaxed">
                {item.description}
              </p>

              {/* Action buttons */}
              {item.primaryAction && item.secondaryAction && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="h-8 rounded-[8px] bg-[#0048C4] px-4 text-xs font-semibold text-white transition hover:bg-[#003bb0] active:scale-95 cursor-pointer border-none"
                    onClick={item.primaryAction.onClick}
                    type="button"
                  >
                    {item.primaryAction.label}
                  </button>
                  <button
                    className="h-8 rounded-[8px] border border-[#0048C4] bg-transparent px-4 text-xs font-semibold text-[#0048C4] transition hover:bg-[#0048C4]/5 active:scale-95 cursor-pointer"
                    onClick={item.secondaryAction.onClick}
                    type="button"
                  >
                    {item.secondaryAction.label}
                  </button>
                </div>
              )}

              {item.linkAction && (
                <div className="mt-2.5 flex justify-end">
                  <RouteLink
                    className="inline-flex items-center gap-1 rounded-[8px] border border-[#D1D5DB] px-3 py-1 text-[11px] font-medium text-[#1E293B] transition hover:bg-neutral-50 active:scale-95 no-underline"
                    to={item.linkAction.to}
                  >
                    <span>{item.linkAction.label}</span>
                    <LinearArrowLeft1 className="h-3 w-3" />
                  </RouteLink>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
