import { Typography } from "../../../../shared/ui/Typography";
import { AdCardTomanIcon } from "../AdCardIcons";

export function PriceRange({ label, primary, secondary, hasSecondaryPrice }: {
  label: string;
  primary: string;
  secondary: string;
  hasSecondaryPrice: boolean;
}) {
  return (
      <div className="flex h-6 items-center justify-start gap-1 [direction:rtl]">
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="text-outline text-sm leading-5 font-medium"
        >
          {label}
        </Typography>
        <Typography
          as="p"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-primary whitespace-nowrap"
        >
          {primary}
        </Typography>
        <AdCardTomanIcon className="text-primary h-5 w-5 shrink-0" />
        {hasSecondaryPrice ? (
          <>
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="medium"
              className="text-outline text-sm"
            >
              تا
            </Typography>
            <Typography
              as="p"
              variant="title"
              size="medium"
              weight="semibold"
              className="text-primary whitespace-nowrap"
            >
              {secondary}
            </Typography>
            <AdCardTomanIcon className="text-primary h-5 w-5 shrink-0" />
          </>
        ) : null}
      </div>
  );
}
