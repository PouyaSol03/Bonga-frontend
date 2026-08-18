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
          className={`m-0 text-right text-lg font-semibold leading-6 ${
            mutedTitle ? "text-[#808080]" : "text-[#1a1a1a]"
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

export function PropertyGrid({
  items,
  withLabels = true,
}: {
  items: DetailItem[];
  withLabels?: boolean;
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 [direction:rtl]">
      {items.map((item) => (
        <div className="flex min-w-0 items-start gap-2" key={`${item.icon}-${item.value}`}>
          <DetailItemIcon
            className="h-6 w-6 shrink-0 text-[#4D4D4D]"
            item={item}
          />
          <div className="min-w-0 text-right">
            <Typography variant="label" size="large" weight="medium" className="text-[#1a1a1a]">
              {item.value}
            </Typography>
            {withLabels ? (
              <Typography variant="label" size="small" weight="medium" className="text-[#808080]">
                {item.label}
              </Typography>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
