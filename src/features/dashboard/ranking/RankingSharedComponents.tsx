import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearInfoCircle from "../../../shared/icons/LinearInfoCircle";

export function SectionHeader({ guideTo, title }: { guideTo?: string; title: string }) {
  return (
    <div className="flex h-6 items-center justify-between [direction:ltr]">
      <GuidePill ariaLabel={`راهنمای ${title}`} to={guideTo} />
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 [direction:rtl]">
        {title}
      </Typography>
    </div>
  );
}

export function GuidePill({ ariaLabel = "راهنما", to }: { ariaLabel?: string; to?: string }) {
  const className =
    "inline-flex h-6 items-center gap-1 rounded-full bg-primary-container px-2 text-xs font-medium leading-4 text-primary no-underline transition active:bg-primary-container/80 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40 [direction:ltr]";
  const content = (
    <>
      <Typography as="span" variant="body" size="medium" weight="regular" className="[direction:rtl]">
        راهنما
      </Typography>
      <LinearInfoCircle className="h-4 w-4" />
    </>
  );

  if (to) {
    return (
      <RouteLink aria-label={ariaLabel} className={className} to={to}>
        {content}
      </RouteLink>
    );
  }

  return (
    <Typography as="span" variant="body" size="medium" weight="regular" className={className}>
      {content}
    </Typography>
  );
}
