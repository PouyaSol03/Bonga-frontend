import { Typography } from "../../../shared/ui/Typography";

export interface DashboardReportsTeaserCardProps {
  onViewReports: () => void;
  title?: string;
  subtitle?: string;
  actionText?: string;
}

function ReportsMiniChartSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="183 1750 128 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M183.951 1802H309.573" stroke="currentColor" className="text-outline-var" strokeWidth="0.5" strokeDasharray="3 3" />
      <path d="M183.951 1782H309.573" stroke="currentColor" className="text-outline-var" strokeWidth="0.5" strokeDasharray="3 3" />
      <path d="M183.951 1772H309.573" stroke="currentColor" className="text-outline-var" strokeWidth="0.5" strokeDasharray="3 3" />
      <path d="M183.951 1762H309.573" stroke="currentColor" className="text-outline-var" strokeWidth="0.5" strokeDasharray="3 3" />
      <path d="M183.951 1752H309.573" stroke="currentColor" className="text-outline-var" strokeWidth="0.5" strokeDasharray="3 3" />
      <path d="M193 1755C193 1752.79 194.791 1751 197 1751C199.209 1751 201 1752.79 201 1755V1803H193V1755Z" fill="#0048C4" fillOpacity="0.12" />
      <path d="M206 1762C206 1759.79 207.791 1758 210 1758C212.209 1758 214 1759.79 214 1762V1803H206V1762Z" fill="#0048C4" fillOpacity="0.12" />
      <path d="M219 1778C219 1775.79 220.791 1774 223 1774C225.209 1774 227 1775.79 227 1778V1803H219V1778Z" fill="#0048C4" fillOpacity="0.12" />
      <path d="M232 1768C232 1765.79 233.791 1764 236 1764C238.209 1764 240 1765.79 240 1768V1803H232V1768Z" fill="#0048C4" fillOpacity="0.12" />
      <path d="M245 1758C245 1755.79 246.791 1754 249 1754C251.209 1754 253 1755.79 253 1758V1803H245V1758Z" fill="#0048C4" fillOpacity="0.12" />
      <path d="M258 1767C258 1764.79 259.791 1763 262 1763C264.209 1763 266 1764.79 266 1767V1803H258V1767Z" fill="#0048C4" fillOpacity="0.12" />
      <path d="M271 1785C271 1782.79 272.791 1781 275 1781C277.209 1781 279 1782.79 279 1785V1803H271V1785Z" fill="#0048C4" fillOpacity="0.12" />
      <path d="M284 1767C284 1764.79 285.791 1763 288 1763C290.209 1763 292 1764.79 292 1767V1803H284V1767Z" fill="#0048C4" fillOpacity="0.16" />
      <path d="M297 1790C297 1787.79 298.791 1786 301 1786C303.209 1786 305 1787.79 305 1790V1803H297V1790Z" fill="#0048C4" fillOpacity="0.12" />
      <path d="M196.861 1765L209.771 1780L222.681 1783L235.59 1773L248.5 1777L261.41 1771L274.32 1784L287.229 1783L300.139 1792" stroke="#0048C4" />
      <circle cx="196.861" cy="1765" r="1.5" fill="var(--surface-container-lowest, white)" stroke="#0048C4" />
      <circle cx="209.771" cy="1780" r="1.5" fill="var(--surface-container-lowest, white)" stroke="#0048C4" />
      <circle cx="222.681" cy="1783" r="1.5" fill="var(--surface-container-lowest, white)" stroke="#0048C4" />
      <circle cx="235.591" cy="1773" r="1.5" fill="var(--surface-container-lowest, white)" stroke="#0048C4" />
      <circle cx="248.5" cy="1777" r="1.5" fill="var(--surface-container-lowest, white)" stroke="#0048C4" />
      <circle cx="261.41" cy="1771" r="1.5" fill="var(--surface-container-lowest, white)" stroke="#0048C4" />
      <circle cx="274.319" cy="1784" r="1.5" fill="var(--surface-container-lowest, white)" stroke="#0048C4" />
      <circle cx="287.229" cy="1783" r="1.5" fill="var(--surface-container-lowest, white)" stroke="#0048C4" />
      <circle cx="300.139" cy="1792" r="1.5" fill="var(--surface-container-lowest, white)" stroke="#0048C4" />
    </svg>
  );
}

export function DashboardReportsTeaserCard({
  onViewReports,
  title = "گزارش‌ها و نمودارها",
  subtitle = "تحلیل عملکرد آگهی‌ها و مشاورین",
  actionText = "مشاهده گزارش‌ها",
}: DashboardReportsTeaserCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-surface-container-lowest p-4 shadow-sm [direction:rtl]">
      {/* Header with Typography */}
      <Typography
        as="h2"
        variant="title"
        size="small"
        weight="semibold"
        className="text-on-surface"
      >
        {title}
      </Typography>
      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="mt-0.5 text-outline"
      >
        {subtitle}
      </Typography>

      {/* Content box with mini chart & action button */}
      <div className="mt-3 flex items-center justify-between rounded-[12px] border border-surface-container-highest bg-surface-container-lowest p-3">
        {/* Exact Figma mini chart illustration */}
        <div className="flex h-12 w-32 shrink-0 items-center justify-center">
          <ReportsMiniChartSvg className="h-full w-full" />
        </div>

        {/* Action Button with Typography */}
        <button
          className="flex h-9 items-center justify-center rounded-[10px] bg-primary-container px-4 transition active:scale-95 cursor-pointer border-none"
          onClick={onViewReports}
          type="button"
        >
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="semibold"
            className="text-primary"
          >
            {actionText}
          </Typography>
        </button>
      </div>
    </section>
  );
}
