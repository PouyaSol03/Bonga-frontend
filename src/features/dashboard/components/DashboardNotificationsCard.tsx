import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";

export interface DashboardNotificationItem {
  id: string;
  title: string;
  time: string;
  description: string;
  type: "deal_approval" | "ad_published" | "ad_stopped";
  primaryAction?: { label: string; onClick?: () => void };
  secondaryAction?: { label: string; onClick?: () => void };
  linkAction?: { label: string; to: string };
}

export interface DashboardNotificationsCardProps {
  items?: DashboardNotificationItem[];
  viewAllTo?: string;
}

const defaultNotifications: DashboardNotificationItem[] = [
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

export function DashboardNotificationsCard({
  items = defaultNotifications,
  viewAllTo = "/account/dashboard/messages",
}: DashboardNotificationsCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-surface-container-lowest p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="semibold"
          className="text-on-surface"
        >
          آخرین اعلان‌ها
        </Typography>
        <RouteLink
          className="flex items-center gap-1 text-primary hover:underline"
          to={viewAllTo}
        >
          <Typography as="span" variant="label" size="small" weight="medium" className="text-primary">
            مشاهده همه
          </Typography>
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
              className={`flex flex-col py-3 ${!isLast ? "border-b border-surface-container-high" : ""}`}
            >
              {/* Top row: Title + Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {item.type === "ad_published" && (
                    <span className="h-2 w-2 rotate-45 rounded-xs bg-tertiary" />
                  )}
                  {item.type === "ad_stopped" && (
                    <span className="h-2 w-2 rotate-45 rounded-xs bg-warning" />
                  )}
                  <Typography
                    as="h3"
                    variant="label"
                    size="medium"
                    weight="semibold"
                    className="text-on-surface"
                  >
                    {item.title}
                  </Typography>
                </div>
                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="regular"
                  className="text-outline"
                >
                  {item.time}
                </Typography>
              </div>

              {/* Subtitle / Description */}
              <Typography
                as="p"
                variant="body"
                size="small"
                weight="regular"
                className="mt-1 leading-relaxed text-on-surface-var"
              >
                {item.description}
              </Typography>

              {/* Actions */}
              {item.type === "deal_approval" && (
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={item.primaryAction?.onClick}
                    className="flex h-7 items-center justify-center rounded-[8px] bg-primary px-4 transition hover:opacity-90 active:scale-95 cursor-pointer border-none"
                  >
                    <Typography as="span" variant="label" size="small" weight="medium" className="text-on-primary">
                      {item.primaryAction?.label ?? "تایید"}
                    </Typography>
                  </button>
                  <button
                    type="button"
                    onClick={item.secondaryAction?.onClick}
                    className="flex h-7 items-center justify-center rounded-[8px] border border-surface-container-highest bg-surface-container-lowest px-3 transition hover:bg-surface-container-low active:scale-95 cursor-pointer"
                  >
                    <Typography as="span" variant="label" size="small" weight="medium" className="text-on-surface">
                      {item.secondaryAction?.label ?? "عدم تایید"}
                    </Typography>
                  </button>
                </div>
              )}

              {item.linkAction && (
                <div className="mt-2 flex justify-start">
                  <RouteLink
                    to={item.linkAction.to}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Typography as="span" variant="label" size="small" weight="semibold" className="text-primary">
                      {item.linkAction.label}
                    </Typography>
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
