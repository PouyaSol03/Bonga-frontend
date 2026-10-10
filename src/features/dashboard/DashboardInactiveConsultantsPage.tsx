import { useState } from "react";
import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";
import { RouteLink } from "../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import { toPersianNumber } from "../../shared/lib/numberUtils";

export interface InactiveConsultantItem {
  id: string;
  name: string;
  avatarUrl: string;
  inactiveDays: number;
  phone?: string;
  consultantId?: string;
}

const defaultConsultants: InactiveConsultantItem[] = [
  {
    id: "consultant-1",
    name: "حسین رفیعی",
    avatarUrl: "/figma/dashboard/consultant-avatar.jpg",
    inactiveDays: 7,
    consultantId: "1",
  },
  {
    id: "consultant-2",
    name: "حسین رفیعی",
    avatarUrl: "/figma/dashboard/consultant-avatar.jpg",
    inactiveDays: 10,
    consultantId: "2",
  },
];

export function DashboardInactiveConsultantsPage() {
  const [showNotice, setShowNotice] = useState(true);
  const [consultants] = useState<InactiveConsultantItem[]>(defaultConsultants);

  return (
    <PageFrame
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-white text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/dashboard"
        backIconDirection="right"
        className="bg-[#F0F0F0] border-b border-[#E0E0E0]"
        contentClassName="px-3"
        title="مشاور بدون فعالیت"
      />

      <main className="min-h-0 flex-1 overflow-y-auto p-4 bg-white">
        {/* Notice Box */}
        {showNotice && (
          <div className="relative mb-4 flex flex-col rounded-[16px] bg-[#0048C4]/[0.08] p-4 text-right">
            {/* Header: Warning Icon + Title + Close Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0 text-[#0048C4]"
                >
                  <path
                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="semibold"
                  className="font-bold text-[#0048C4]"
                >
                  توجه!
                </Typography>
              </div>

              <button
                type="button"
                onClick={() => setShowNotice(false)}
                className="text-[#0048C4] transition-opacity p-0.5"
                aria-label="بستن پیام"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Description */}
            <Typography
              as="p"
              variant="label"
              size="small"
              weight="medium"
              className="mt-2 text-[#002099] text-xs leading-5"
            >
              در ۷ روز گذشته هیچگونه فعالیت موثری از این مشاوران مشاهده نشده
            </Typography>

            <Typography
              as="p"
              variant="label"
              size="small"
              weight="semibold"
              className="mt-2 font-bold text-[#002099] text-xs"
            >
              نوع فعالیت های موثر:
            </Typography>

            <Typography
              as="p"
              variant="label"
              size="small"
              weight="medium"
              className="mt-1 text-[#002099] text-[11px] leading-relaxed"
            >
              • ثبت آگهی • بازدید سرنخ • پیگیری سرنخ • پاسخ به مشتری
            </Typography>
          </div>
        )}

        {/* Consultants List */}
        <div className="flex flex-col gap-3">
          {consultants.map((consultant) => (
            <RouteLink
              key={consultant.id}
              to={`/account/dashboard/team`}
              className="flex h-[88px] items-center justify-between rounded-[16px] border border-[#F0F0F0] bg-white p-4 shadow-2xs transition-transform active:scale-[0.99]"
            >
              {/* Right: Avatar + Name + Inactive Badge */}
              <div className="flex items-center gap-3">
                <img
                  src={consultant.avatarUrl}
                  alt={consultant.name}
                  className="h-14 w-14 shrink-0 rounded-full object-cover bg-gray-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";
                  }}
                />

                <div className="flex flex-col items-start gap-1.5 text-right">
                  <Typography
                    as="span"
                    variant="label"
                    size="medium"
                    weight="semibold"
                    className="font-bold text-sm text-[#1A1A1A]"
                  >
                    {consultant.name}
                  </Typography>

                  <span className="inline-flex items-center rounded-[8px] bg-[#DD2B1E]/[0.08] px-2.5 py-1 text-center">
                    <Typography
                      as="span"
                      variant="label"
                      size="small"
                      weight="medium"
                      className="text-[11px] font-bold text-[#DD2B1E]"
                    >
                      {toPersianNumber(consultant.inactiveDays)} روز بدون فعالیت
                    </Typography>
                  </span>
                </div>
              </div>

              {/* Left: Arrow icon */}
              <LinearArrowLeft1 className="h-5 w-5 shrink-0 text-[#808080]" />
            </RouteLink>
          ))}
        </div>
      </main>
    </PageFrame>
  );
}
export default DashboardInactiveConsultantsPage;
