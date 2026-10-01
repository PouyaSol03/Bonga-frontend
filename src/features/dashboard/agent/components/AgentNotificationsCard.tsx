import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";

export interface AgentNotificationItemData {
  id: string;
  title: string;
  time: string;
  description: string;
  type: "deal_approval" | "ad_published" | "ad_stopped";
  primaryAction?: { label: string; onClick?: () => void };
  secondaryAction?: { label: string; onClick?: () => void };
  linkAction?: { label: string; to: string };
}

export interface AgentNotificationsCardProps {
  items?: AgentNotificationItemData[];
  viewAllTo?: string;
}

const defaultNotifications: AgentNotificationItemData[] = [
  {
    id: "notif_deal",
    title: "نتیجه معامله نیاز به تأیید دارد",
    time: "دیروز ۱۲:۲۰",
    description: "لطفاً نتیجه معامله ثبت‌شده را بررسی و تأیید کنید.",
    type: "deal_approval",
    primaryAction: { label: "تایید" },
    secondaryAction: { label: "عدم تایید" },
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

export function AgentNotificationsCard({
  items = defaultNotifications,
  viewAllTo = "/account/dashboard/messages",
}: AgentNotificationsCardProps) {
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
                    <span className="h-2 w-2 rotate-45 rounded-xs bg-[#F97316]" />
                  )}
                  <h3 className="text-[12px] font-bold text-[#1A1A1A]">
                    {item.title}
                  </h3>
                </div>
                <span className="text-[10px] font-normal text-[#9CA3AF]">
                  {item.time}
                </span>
              </div>

              {/* Subtitle / Description */}
              <p className="mt-1 text-[11px] font-normal leading-relaxed text-[#757575]">
                {item.description}
              </p>

              {/* Actions */}
              {item.type === "deal_approval" && (
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={item.primaryAction?.onClick}
                    className="flex h-7 items-center justify-center rounded-[8px] bg-[#0048C4] px-4 text-[11px] font-medium text-white transition hover:bg-[#003bb0] active:scale-95"
                  >
                    {item.primaryAction?.label ?? "تایید"}
                  </button>
                  <button
                    type="button"
                    onClick={item.secondaryAction?.onClick}
                    className="flex h-7 items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white px-3 text-[11px] font-medium text-[#4B5563] transition hover:bg-neutral-50 active:scale-95"
                  >
                    {item.secondaryAction?.label ?? "عدم تایید"}
                  </button>
                </div>
              )}

              {item.linkAction && (
                <div className="mt-2 flex justify-start">
                  <RouteLink
                    to={item.linkAction.to}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#0048C4] hover:underline"
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
