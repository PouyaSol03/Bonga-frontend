import { Typography } from "../../../../shared/ui/Typography";
import LinearStar from "../../../../shared/icons/LinearStar";
import { FormattedDetailValueView } from "../viewAdComponents";
import { type DetailInfoItem } from "../details/detailCore";
import { parseHotelStarCount } from "../details/advertiserAndPricing";

export function DetailInfoValueView({
  item,
  align = "start",
}: {
  item: DetailInfoItem;
  align?: "start" | "center" | "end";
}) {
  const alignClassName =
    align === "center" ? "justify-center" : align === "end" ? "justify-end" : "justify-start";

  if (Array.isArray(item.value)) {
    return (
      <div className={`flex flex-wrap gap-2 ${alignClassName}`}>
        {item.value.map((value) => (
          <Typography
            as="span"
            variant="label"
            size="large"
            weight="semibold"
            className="bg-surface-container-high text-on-surface rounded-md px-2.5 py-1.5 text-base leading-6 font-semibold"
            key={value}
          >
            {value}
          </Typography>
        ))}
      </div>
    );
  }

  if (
    item.label === "رتبه اقامتگاه" ||
    item.label.includes("رتبه") ||
    item.label.includes("ستاره") ||
    item.icon === "star"
  ) {
    const count = parseHotelStarCount(item.value);
    if (count) {
      return (
        <div
          className="flex items-center gap-0.5 [direction:ltr]"
          aria-label={`${count} ستاره از ۵`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <LinearStar
              aria-hidden="true"
              className={`h-5 w-5 ${star <= count ? "text-warning" : "text-outline-var"}`}
              innerColor={star <= count ? "currentColor" : "transparent"}
              key={star}
            />
          ))}
        </div>
      );
    }
  }

  if (item.badge) {
    const badgeClassName =
      item.tone === "success"
        ? "bg-tertiary-container text-tertiary"
        : item.tone === "danger"
          ? "bg-error-container text-error border border-error"
          : item.tone === "warning"
            ? "bg-warning-container text-on-warning-container border border-on-warning-container"
            : "bg-surface-container-high text-on-surface-var";

    return (
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="semibold"
        className={`rounded-lg p-2 ${badgeClassName}`}
      >
        {item.value}
      </Typography>
    );
  }

  return <FormattedDetailValueView tone={item.tone} value={item.value} />;
}
