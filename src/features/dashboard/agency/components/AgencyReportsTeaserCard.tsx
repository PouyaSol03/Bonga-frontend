export interface AgencyReportsTeaserCardProps {
  onViewReports: () => void;
}

export function AgencyReportsTeaserCard({
  onViewReports,
}: AgencyReportsTeaserCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <h2 className="text-[14px] font-bold text-[#1F1F1F]">
        گزارش‌ها و نمودارها
      </h2>
      <p className="mt-0.5 text-[11px] font-normal text-[#757575]">
        تحلیل عملکرد آگهی‌ها و مشاورین
      </p>

      {/* Content box with mini chart & action button */}
      <div className="mt-3 flex items-center justify-between rounded-[12px] border border-[#E5E7EB] bg-white p-3">
        {/* Decorative mini chart illustration */}
        <div className="flex h-12 items-end gap-1.5 px-2">
          <div className="h-6 w-2 rounded-t-sm bg-[#DCE7F9]" />
          <div className="h-9 w-2 rounded-t-sm bg-[#DCE7F9]" />
          <div className="h-7 w-2 rounded-t-sm bg-[#DCE7F9]" />
          <div className="h-11 w-2 rounded-t-sm bg-[#4A7EDC]" />
          <div className="h-8 w-2 rounded-t-sm bg-[#DCE7F9]" />
          <div className="h-10 w-2 rounded-t-sm bg-[#DCE7F9]" />
          <div className="h-5 w-2 rounded-t-sm bg-[#DCE7F9]" />
        </div>

        {/* Action Button: مشاهده گزارش‌ها */}
        <button
          className="flex h-9 items-center justify-center rounded-[10px] bg-[#E8F0FE] px-4 text-[12px] font-semibold text-[#0048C4] transition hover:bg-[#D4E4FC] active:scale-95 cursor-pointer border-none"
          onClick={onViewReports}
          type="button"
        >
          مشاهده گزارش‌ها
        </button>
      </div>
    </section>
  );
}
