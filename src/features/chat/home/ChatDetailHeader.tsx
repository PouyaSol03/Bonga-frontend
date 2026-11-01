import { TopBar } from "../../../shared/components/TopBar";
import { Typography } from "../../../shared/ui/Typography";
import { MoreVerticalIcon } from "./listIcons";

export function ChatDetailHeader({
  onOpenMenu,
  subtitle,
  title,
}: {
  onOpenMenu: () => void;
  subtitle?: string;
  title: string;
}) {
  return (
    <TopBar
      actions={[
        {
          icon: <MoreVerticalIcon className="h-6 w-6" />,
          id: "more",
          label: "گزینه‌های بیشتر",
          onClick: onOpenMenu,
        },
      ]}
      backLabel="بازگشت به چت‌ها"
      backTo="/chat"
      centerSlot={
        <div className="min-w-0 text-right">
          <Typography
            as="h1"
            variant="title"
            size="medium"
            weight="semibold"
            className="text-on-surface m-0 truncate text-base leading-5 font-semibold"
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-outline mt-0.5 truncate text-[10px] leading-4 font-normal"
            >
              {subtitle}
            </Typography>
          ) : null}
        </div>
      }
      className="border-outline-var border-b"
      contentClassName="px-0"
      heightClassName={subtitle ? "h-[60px]" : "h-[52px]"}
    />
  );
}
