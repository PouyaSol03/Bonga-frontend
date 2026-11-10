import LinearBubbleChat from "../../../../shared/icons/LinearBubbleChat";
import LinearCheckmark from "../../../../shared/icons/LinearCheckmark";
import LinearClock from "../../../../shared/icons/LinearClock";
import LinearRefresh from "../../../../shared/icons/LinearRefresh";
import LinearRequestList from "../../../../shared/icons/LinearRequestList";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { SummaryCard } from "./SupportRequestChips";

export function SupportRequestsHeader({
  counts,
  onRefresh,
}: {
  counts: { all: number; closed: number; open: number; reviewing: number };
  onRefresh: () => void;
}) {
  return (
    <header className="shrink-0 rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf1ff] text-[#0048c4]"
          >
            <LinearRequestList className="h-6 w-6" />
          </Typography>
          <div>
            <Typography
              as="h1"
              variant="title"
              size="medium"
              weight="semibold"
              className="m-0 text-lg font-bold text-[#1a1a1a]"
            >
              درخواست‌های پشتیبانی
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="m-0 mt-1 text-sm text-[#808080]"
            >
              مشاهده، تخصیص، پاسخگویی و پیگیری درخواست‌های کاربران
            </Typography>
          </div>
        </div>
        <Button
          unstyled
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce3ef] px-4 text-sm font-semibold text-[#4d4d4d] hover:border-[#0048c4] hover:text-[#0048c4]"
          onClick={onRefresh}
          type="button"
        >
          <LinearRefresh className="h-5 w-5" />
          بروزرسانی
        </Button>
      </div>

      <div className="mt-4 flex [scrollbar-width:none] gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <SummaryCard
          icon={<LinearRequestList className="h-5 w-5" />}
          label="کل درخواست‌ها"
          value={counts.all}
        />
        <SummaryCard
          icon={<LinearBubbleChat className="h-5 w-5" />}
          label="درخواست باز"
          value={counts.open}
        />
        <SummaryCard
          icon={<LinearClock className="h-5 w-5" />}
          label="در حال بررسی"
          value={counts.reviewing}
        />
        <SummaryCard
          icon={<LinearCheckmark className="h-5 w-5" />}
          label="بسته شده"
          value={counts.closed}
        />
      </div>
    </header>
  );
}
