import { toPersianNumber } from "../../../../shared/lib/numberUtils";
import { formatMobileForDisplay } from "../../../auth/api/auth.service";
import { AccountProfileAvatar } from "./AccountProfileAvatar";

interface AccountHeaderCardProps {
  avatarUrl?: string;
  name: string;
  mobile?: string;
}

export function AccountHeaderCard({ avatarUrl, name, mobile }: AccountHeaderCardProps) {
  const formattedMobile = mobile
    ? toPersianNumber(formatMobileForDisplay(mobile))
    : "";

  return (
    <div
      aria-label="مشخصات حساب کاربری"
      className="relative overflow-hidden rounded-[24px] bg-[#F3F3F3] dark:bg-surface-container-high px-4 py-3.5 select-none"
    >
      {/* RTL Content: First child is Avatar on the RIGHT, second is Text to the LEFT */}
      <div className="relative z-10 flex items-center gap-3.5 [direction:rtl]">
        {/* Avatar on the right */}
        <div className="relative shrink-0">
          <AccountProfileAvatar
            avatarUrl={avatarUrl}
            className="h-[74px] w-[74px] rounded-full ring-[3.5px] ring-white shadow-xs overflow-hidden"
            iconClassName="h-8 w-8 text-outline"
            label={name || "کاربر"}
          />
        </div>

        {/* Text next to avatar on the left */}
        <div className="min-w-0 flex-1 text-right">
          <h2 className="m-0 truncate text-base sm:text-lg font-bold text-[#1F1F1F] dark:text-on-surface">
            {name || "کاربر شناسا"}
          </h2>
          {formattedMobile ? (
            <p className="m-0 mt-1 text-xs sm:text-sm font-medium text-[#706563] dark:text-outline text-right [direction:ltr]">
              {formattedMobile}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
