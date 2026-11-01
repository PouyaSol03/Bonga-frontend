import { Link } from "react-router";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { CrmIcon } from "./CrmIcon";

type Props = {
  isDark: boolean;
  toggleTheme: () => void;
  onRefresh: () => void;
  profileName: string;
  roleLabel: { title: string };
};
export function CrmHeader({ isDark, toggleTheme, onRefresh, profileName, roleLabel }: Props) {
  return (
    <header className="flex h-[80px] shrink-0 items-center justify-between bg-white px-6">
      <img
        className="h-[32px] w-[146px] object-contain"
        src="/images/logo/logo-dashboard.png"
        alt="نشونو"
      />

      <div className="flex items-center gap-3">
        <Button
          unstyled
          aria-label={isDark ? "حالت روشن" : "حالت تاریک"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4e4e4] bg-white text-base transition hover:border-[#0048c4]"
          onClick={toggleTheme}
          title={isDark ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"}
          type="button"
        >
          {isDark ? "☀️" : "🌙"}
        </Button>

        <Button
          unstyled
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e4e4e4] bg-white px-4 text-sm font-semibold text-[#4d4d4d] transition hover:border-[#0048c4] hover:text-[#0048c4]"
          onClick={onRefresh}
          type="button"
        >
          <CrmIcon name="refresh" />
          تازه‌سازی
        </Button>

        <div className="hidden h-10 max-w-[230px] items-center gap-2 rounded-xl bg-[#f5f5f5] px-3 xl:flex">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e4e8f4] text-[#0048c4]"
          >
            <CrmIcon name="account" />
          </Typography>
          <div className="min-w-0">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="medium"
              className="m-0 truncate text-sm font-semibold text-[#1a1a1a]"
            >
              {profileName}
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="medium"
              className="m-0 truncate text-xs font-medium text-[#808080]"
            >
              {roleLabel.title}
            </Typography>
          </div>
        </div>

        <Link
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-semibold text-white no-underline transition hover:bg-[#003ba1]"
          to="/home"
        >
          <CrmIcon name="account" />
          بازگشت به سایت
        </Link>
      </div>
    </header>
  );
}
