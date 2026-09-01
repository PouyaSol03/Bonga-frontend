import type { ReactNode } from "react";

import { ColorableSvgIcon } from "../../../shared/components/ColorableSvgIcon";
import { FeaturesIcons } from "../components/FeaturesIcons";
import { TopBar } from "../../../shared/components/TopBar";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import { ViewAdIcon } from "./ViewAdIcon";
import type {
  DetailItem,
  IconName,
} from "./viewAdTypes";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearStar from "../../../shared/icons/LinearStar";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

function DetailItemIcon({
  className = "h-6 w-6 shrink-0",
  item,
}: {
  className?: string;
  item: Pick<
    DetailItem,
    "icon" | "iconSrc" | "featureIconLabel" | "hideFallbackIcon" | "label" | "value"
  >;
}) {
  if (item.featureIconLabel) {
    return (
      <FeaturesIcons
        className={className}
        feature={item.featureIconLabel}
      />
    );
  }

  if (item.iconSrc) {
    return <ColorableSvgIcon className={className} src={item.iconSrc} />;
  }

  if (item.hideFallbackIcon) {
    return <Typography as="span" variant="body" size="medium" weight="regular" aria-hidden="true" className={`block ${className}`} />;
  }

  return <ViewAdIcon className={className} name={item.icon} />;
}

export function ViewAdTopBar({
  actionIcons = ["share", "note", "bookmark"],
  backTo,
  bookmarked = false,
  onBack,
  onAction,
  title,
}: {
  actionIcons?: IconName[];
  backTo?: string;
  bookmarked?: boolean;
  onBack?: () => void;
  onAction?: (icon: IconName) => void;
  title?: string;
}) {
  return (
    <TopBar
      actions={actionIcons.map((icon) => ({
        icon: (
          <ViewAdIcon
            className={icon === "bookmark" && bookmarked ? "text-[#1a1a1a]" : ""}
            filled={icon === "bookmark" && bookmarked}
            name={icon}
          />
        ),
        id: icon,
        label: getActionLabel(icon),
        onClick: onAction ? () => onAction(icon) : undefined,
      }))}
      backTo={backTo}
      onBack={onBack}
      title={title}
    />
  );
}

function getActionLabel(icon: IconName) {
  switch (icon) {
    case "attachment":
      return "پیوست";
    case "bookmark":
      return "نشان کردن";
    case "note":
      return "افزودن یادداشت";
    case "share":
      return "اشتراک‌گذاری";
    default:
      return "اقدام";
  }
}

export function DetailSection({
  children,
  mutedTitle = false,
  title,
}: {
  children: ReactNode;
  icon: IconName;
  mutedTitle?: boolean;
  title: string;
}) {
  return (
    <section className="border-t-8 border-[#f0f0f0] bg-white px-4 py-4">
      <div className="flex h-6 items-center justify-end [direction:ltr]">
        <Typography as="h2" variant="title" size="medium" weight="semibold"
          className={`m-0 text-right text-lg font-semibold leading-6 ${mutedTitle ? "text-[#808080]" : "text-[#1a1a1a]"
            }`}
        >
          {title}
        </Typography>
      </div>
      {children}
    </section>
  );
}

export function MoreLink({
  children,
  to,
}: {
  children: ReactNode;
  to: string;
}) {
  return (
    <RouteLink
      className="mx-auto mt-6 flex h-7 w-fit items-center justify-center gap-1 px-4 text-xs font-medium leading-4 text-[#0048c4] no-underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
      to={to}
    >
      <Typography as="span" variant="body" size="medium" weight="regular">{children}</Typography>
      <LinearArrowLeft1 className="h-4 w-4" name="arrowLeft" />
    </RouteLink>
  );
}

export function MoreButton({
  children,
  icon = "arrowLeft",
  onClick,
}: {
  children: ReactNode;
  icon?: IconName;
  onClick?: () => void;
}) {
  return (
    <Button unstyled
      className="mx-auto mt-6 flex h-7 items-center justify-center gap-2 rounded-[10px] px-4 text-xs font-medium leading-4 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
      onClick={onClick}
      type="button"
    >
      <Typography as="span" variant="body" size="medium" weight="regular">{children}</Typography>
      <ViewAdIcon className="h-4 w-4" name={icon} />
    </Button>
  );
}

const persianDigitMap: Record<string, string> = {
  "0": "۰",
  "1": "۱",
  "2": "۲",
  "3": "۳",
  "4": "۴",
  "5": "۵",
  "6": "۶",
  "7": "۷",
  "8": "۸",
  "9": "۹",
};

export function toPersianDigits(value: unknown): string {
  const text = String(value ?? "");
  return text.replace(/[0-9]/g, (digit) => persianDigitMap[digit] ?? digit);
}

export function AccommodationRatingBanner({
  count,
  label = "رتبه اقامتگاه",
  className = "",
}: {
  count: number;
  label?: string;
  className?: string;
}) {
  const normalizedCount = Math.min(5, Math.max(1, count));

  return (
    <div
      className={`flex w-full items-center justify-start gap-3 rounded-lg border border-on-warning-container/16 bg-on-warning-container/8 p-2 [direction:rtl] ${className}`}
    >
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="medium"
        className="text-on-surface"
      >
        {label}
      </Typography>
      <div
        className="flex items-center gap-1 [direction:ltr]"
        aria-label={`${normalizedCount} ستاره از ۵`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <LinearStar
            aria-hidden="true"
            className={`h-5 w-5 ${star <= normalizedCount ? "text-[#ffb100]" : "text-[#d9d9d9]"}`}
            innerColor={star <= normalizedCount ? "currentColor" : "transparent"}
            key={star}
          />
        ))}
      </div>
    </div>
  );
}

export function FormattedDetailValueView({
  value,
  tone,
  className = "",
}: {
  value: string;
  tone?: "neutral" | "danger" | "success" | "warning";
  className?: string;
}) {
  const text = toPersianDigits(value.trim());

  const match = text.match(/^([\d\u06F0-\u06F9,.\s]+)\s*(مترمربع|متر مربع)$/);
  if (match) {
    const numPart = match[1].trim();
    const unitPart = match[2].trim();
    return (
      <div className={`inline-flex items-baseline gap-1 [direction:rtl] ${className}`}>
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="semibold"
          className={tone === "danger" ? "text-[#ff3b30]" : "text-[#1a1a1a]"}
        >
          {numPart}
        </Typography>
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className={tone === "danger" ? "text-[#ff3b30]" : "text-[#1a1a1a]"}
        >
          {unitPart}
        </Typography>
      </div>
    );
  }

  return (
    <Typography
      as="span"
      variant="label"
      size="large"
      weight="semibold"
      className={`${tone === "danger" ? "text-[#ff3b30]" : "text-[#1a1a1a]"} ${className}`}
    >
      {text}
    </Typography>
  );
}

function parseStarRatingCount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.min(5, Math.max(1, Math.round(value)));
  }
  const text = String(value ?? "").trim();
  if (!text) return null;
  if (text.includes("★")) {
    const count = (text.match(/★/g) || []).length;
    if (count > 0) return count;
  }
  const english = text
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
  const match = english.match(/\d+/);
  if (!match) return null;
  const num = Number(match[0]);
  return Number.isFinite(num) && num > 0 ? Math.min(5, Math.max(1, Math.round(num))) : null;
}

export function PropertyGrid({
  items,
  withLabels = true,
}: {
  items: DetailItem[];
  withLabels?: boolean;
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 [direction:rtl]">
      {items.map((item) => {
        const isStarRating = item.icon === "star" || item.label.includes("رتبه") || item.label.includes("ستاره");
        const starCount = isStarRating ? parseStarRatingCount(item.value) : null;

        return (
          <div className="flex min-w-0 items-start gap-2" key={`${item.icon}-${item.label}-${item.value}`}>
            <DetailItemIcon
              className="h-6 w-6 shrink-0 text-[#4D4D4D]"
              item={item}
            />
            <div className="min-w-0 text-right">
              <div className="flex flex-wrap items-center justify-start gap-1 [direction:rtl]">
                {starCount !== null ? (
                  <div className="flex items-center gap-0.5 [direction:ltr]" aria-label={`${starCount} ستاره از ۵`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <LinearStar
                        aria-hidden="true"
                        className={`h-4 w-4 ${star <= starCount ? "text-[#ffb100]" : "text-[#d9d9d9]"}`}
                        innerColor={star <= starCount ? "currentColor" : "transparent"}
                        key={star}
                      />
                    ))}
                  </div>
                ) : (
                  <FormattedDetailValueView
                    tone={item.tone}
                    value={item.value}
                  />
                )}
                {item.inlineNote ? (
                  <Typography
                    as="span"
                    variant="label"
                    size="small"
                    weight="medium"
                    className="text-[#808080]"
                  >
                    {item.inlineNote}
                  </Typography>
                ) : null}
                {item.statusBadge ? (
                  <Typography
                    as="span"
                    variant="label"
                    size="small"
                    weight="medium"
                    className="rounded-md bg-[#FF3B3014] px-2 py-1 text-[#FF3B30]"
                  >
                    {item.statusBadge}
                  </Typography>
                ) : null}
              </div>
              {withLabels ? (
                <Typography variant="label" size="small" weight="medium" className="text-[#808080]">
                  {item.label}
                </Typography>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
