import { Link } from "react-router";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearCall from "../../../../shared/icons/LinearCall";
import LinearQuestion from "../../../../shared/icons/LinearQuestion";
import LinearRequestList from "../../../../shared/icons/LinearRequestList";
import LinearSupport from "../../../../shared/icons/LinearSupport";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { SUPPORT_CHAT_PATH, type SupportMenuItemProps } from "../types";

export function SupportMenuItem({
  description,
  icon: Icon,
  showDivider = true,
  title,
  to,
}: SupportMenuItemProps) {
  const content = (
    <>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="bg-primary-container text-primary grid h-10 w-10 shrink-0 place-items-center rounded-full"
      >
        <Icon className="text-on-surface-var h-6 w-6" />
      </Typography>

      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="min-w-0 flex-1 text-right"
      >
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface block"
        >
          {title}
        </Typography>
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="text-outline block text-sm leading-none font-normal"
        >
          {description}
        </Typography>
      </Typography>

      <LinearArrowLeft1 className="text-on-surface-var ml-5 h-6 w-6 shrink-0" />
      {showDivider ? (
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="bg-outline-var pointer-events-none absolute inset-x-4 bottom-0 h-px"
        />
      ) : null}
    </>
  );

  const className =
    "relative flex py-5.5 w-full items-center gap-3 bg-surface-container-lowest px-4 text-right outline-none transition-colors active:bg-surface-container focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/20";

  if (to) {
    return (
      <Link className={className} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <Button unstyled className={className} type="button">
      {content}
    </Button>
  );
}

export const supportItems: SupportMenuItemProps[] = [
  {
    description: "همین حالا با پشتیبان گفتگو کنید",
    icon: LinearSupport,
    title: "گفتگوی آنلاین",
    to: SUPPORT_CHAT_PATH,
  },
  {
    description: "پیگیری و مشاهده درخواست‌ها",
    icon: LinearRequestList,
    title: "درخواست‌های من",
    to: "/account/support/requests",
  },
  {
    description: "پاسخ سوالات رایج شما",
    icon: LinearQuestion,
    title: "سوالات متداول",
    to: "/account/support/faq",
  },
  {
    description: "سوالتان بی‌پاسخ ماند؟ تماس بگیرید",
    icon: LinearCall,
    title: "تماس با پشتیبانی",
  },
];
