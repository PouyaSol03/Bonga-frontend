import { Link } from "react-router";
import { ViewAdIcon } from ".././ViewAdIcon";
import { type AdvertiserPreview } from ".././viewAdDetails";
import { Typography } from "../../../../shared/ui/Typography";
import { AgencyAdvertiserCard } from "./AgencyAdvertiserCard";
import { AdvertiserMetrics } from "./AdvertiserMetrics";

export function AdvertiserCard({ preview }: { preview: AdvertiserPreview }) {
  if (preview.kind === "agency") {
    return <AgencyAdvertiserCard preview={preview} />;
  }

  const initial = preview.name.trim().charAt(0) || "م";

  return (
    <section className="border-surface-container bg-surface-container-lowest border-t-8 px-4 py-6 text-center">
      <Link
        className="active:bg-surface-container focus-visible:outline-primary/40 block rounded-2xl px-2 py-2 text-inherit no-underline transition focus-visible:outline-3 focus-visible:outline-offset-2"
        to={preview.href}
      >
        <div className="border-outline-var bg-primary-container mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-full border">
          {preview.logoUrl ? (
            <img alt={preview.name} className="h-full w-full object-cover" src={preview.logoUrl} />
          ) : (
            <Typography
              as="span"
              variant="headline"
              size="small"
              className="text-on-primary-container text-2xl leading-none font-bold"
            >
              {initial}
            </Typography>
          )}
        </div>
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface-var mt-4 text-base leading-6 font-semibold"
        >
          {preview.name}
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="medium"
          className="text-outline m-0 mt-1 text-xs leading-4 font-medium"
        >
          {preview.subtitle}
        </Typography>
        {preview.location ? (
          <div className="text-primary mt-2 flex items-center justify-center gap-1">
            <ViewAdIcon className="h-4 w-4" name="location" />
            <Typography as="span" variant="body" size="medium" weight="regular">
              {preview.location}
            </Typography>
          </div>
        ) : null}
        <AdvertiserMetrics preview={preview} />
      </Link>
    </section>
  );
}
