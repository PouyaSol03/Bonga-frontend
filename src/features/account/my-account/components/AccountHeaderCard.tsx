import { toPersianNumber } from "../../../../shared/lib/numberUtils";
import { formatMobileForDisplay } from "../../../auth/api/auth.service";
import { Typography } from "../../../../shared/ui/Typography";
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
      className="relative flex h-[88px] min-h-[88px] items-center overflow-hidden rounded-[24px] bg-[#F3F3F3] dark:bg-surface-container-high px-4 select-none"
    >
      {/* RTL Content: First child is Avatar on the RIGHT, second is Text to the LEFT */}
      <div className="relative z-10 flex w-full items-center gap-3.5 [direction:rtl]">
        {/* Avatar on the right */}
        <div className="relative shrink-0">
          <AccountProfileAvatar
            avatarUrl={avatarUrl}
            className="h-[72px] w-[72px] rounded-full ring-[3.5px] ring-white shadow-xs overflow-hidden"
            iconClassName="h-8 w-8 text-outline"
            label={name || "کاربر"}
          />
        </div>

        {/* Text next to avatar on the left */}
        <div className="min-w-0 flex-1 text-right">
          <Typography
            as="h2"
            variant="label"
            size="large"
            weight="semibold"
            className="m-0 truncate text-[#1F1F1F] dark:text-on-surface"
          >
            {name || "کاربر شناسا"}
          </Typography>
          {formattedMobile ? (
            <Typography
              as="p"
              variant="label"
              size="medium"
              weight="medium"
              className="m-0 mt-1 text-[#706563] dark:text-outline text-right [direction:ltr]"
            >
              {formattedMobile}
            </Typography>
          ) : null}
        </div>
      </div>
    </div>
  );
}
