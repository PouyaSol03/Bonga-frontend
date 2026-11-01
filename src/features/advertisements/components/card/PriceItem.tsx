import { Typography } from "../../../../shared/ui/Typography";
import { AdCardTomanIcon } from "../AdCardIcons";

export function PriceItem({ label, price }: { label: string; price: string }) {
  return (
    <Typography
      as="span"
      variant="body"
      size="medium"
      weight="regular"
      className="inline-flex min-w-0 items-center gap-0.5"
    >
      {label ? (
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="text-outline text-sm leading-5 font-medium"
        >
          {label}
        </Typography>
      ) : null}
      <Typography
        as="p"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-primary whitespace-nowrap"
      >
        {price}
      </Typography>
      <AdCardTomanIcon className="text-primary h-5 w-5 shrink-0" />
    </Typography>
  );
}
