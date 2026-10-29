import { Link } from "react-router";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import { Typography } from "../../../../shared/ui/Typography";

export function GuidePill({ to }: { to?: string } = {}) {
  const className =
    "inline-flex px-2 py-1 items-center gap-1 rounded-full bg-primary-container text-primary no-underline [direction:ltr]";
  const content = (
    <>
      <Typography
        as="span"
        variant="label"
        size="small"
        weight="medium"
        className="[direction:rtl]"
      >
        راهنما
      </Typography>
      <LinearInfoCircle className="h-4 w-4" />
    </>
  );

  if (to) {
    return (
      <Link aria-label="راهنمای نشان‌ها" className={className} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <Typography as="span" variant="body" size="medium" weight="regular" className={className}>
      {content}
    </Typography>
  );
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex h-6 items-center justify-between [direction:ltr]">
      <GuidePill to="/account/ranking/badges/guide" />
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 text-base leading-6 font-semibold [direction:rtl]"
      >
        {title}
      </Typography>
    </div>
  );
}
