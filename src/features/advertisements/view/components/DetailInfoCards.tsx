import { ColorableSvgIcon } from "../../../../shared/components/ColorableSvgIcon";
import { FeaturesIcons } from "../../components/FeaturesIcons";
import { ViewAdIcon } from "../ViewAdIcon";
import { Typography } from "../../../../shared/ui/Typography";
import { type DetailInfoItem, PROPERTY_DETAIL_ICONS } from "../details/detailCore";
import { DetailInfoValueView } from "./DetailInfoValueView";

export function DetailInfoIcon({
  item,
  className = "h-6 w-6 shrink-0 text-on-surface-var",
}: {
  item: DetailInfoItem;
  className?: string;
}) {
  if (item.featureIconLabel) {
    return <FeaturesIcons feature={item.featureIconLabel} className={className} />;
  }

  if (item.iconSrc) {
    return <ColorableSvgIcon className={className} src={item.iconSrc} />;
  }

  if (item.hideFallbackIcon) {
    return (
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        aria-hidden="true"
        className={className}
      />
    );
  }

  return <ViewAdIcon className={className} name={item.icon} />;
}

export { DetailInfoValueView };

export function DetailInfoItemCard({
  item,
  showIcon = false,
}: {
  item: DetailInfoItem;
  showIcon?: boolean;
}) {
  const labelPaddingClassName = showIcon ? "pr-[32px]" : "pr-0";

  return (
    <div className="flex w-full flex-col items-start justify-start text-right [direction:rtl]">
      <div className="flex min-h-7 w-full items-center justify-start gap-2 text-right text-base font-semibold [direction:rtl]">
        {showIcon ? <DetailInfoIcon item={item} /> : null}

        <div className="text-on-surface text-base font-semibold">
          <DetailInfoValueView align="start" item={item} />
        </div>
      </div>

      <Typography
        variant="label"
        size="small"
        weight="medium"
        className={`text-outline ${labelPaddingClassName}`}
      >
        {item.label}
      </Typography>
    </div>
  );
}

export function DetailInfoChoiceRows({ rows }: { rows: DetailInfoItem[] }) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div>
      {rows.map((row) => (
        <div
          className="border-outline-var flex flex-wrap items-center justify-start gap-2 border-t border-dashed py-4 [direction:rtl]"
          key={row.label}
        >
          <div className="text-outline inline-flex shrink-0 items-center gap-1">
            <ColorableSvgIcon
              className="h-5 w-5 shrink-0"
              src={row.iconSrc ?? PROPERTY_DETAIL_ICONS.selected}
            />
            <Typography as="span" variant="label" size="large" weight="medium">
              {row.label}:
            </Typography>
          </div>
          <DetailInfoValueView item={row} />
        </div>
      ))}
    </div>
  );
}

export function DetailInfoCheckBadges({ badges }: { badges: DetailInfoItem[] }) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="border-outline-var border-t border-dashed">
      <div className="flex flex-wrap justify-start gap-2 pt-4 pb-4 [direction:rtl]">
        {badges.map((badge) => (
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="semibold"
            className="bg-surface-container-high text-on-surface-var inline-flex min-h-9 items-center gap-1 rounded-lg p-2 text-sm leading-5 font-semibold"
            key={badge.label}
          >
            <ColorableSvgIcon
              className="h-5 w-5 shrink-0"
              src={badge.iconSrc ?? PROPERTY_DETAIL_ICONS.selected}
            />
            <Typography as="span" variant="label" size="medium" weight="semibold">
              {badge.value}
            </Typography>
          </Typography>
        ))}
      </div>
    </div>
  );
}

export function DetailInfoRowCard({ item, showDivider }: { item: DetailInfoItem; showDivider: boolean }) {
  return (
    <div>
      <div
        className={`flex items-center justify-start ${Array.isArray(item.value) ? "min-h-9" : "h-9"} my-4 text-right [direction:rtl]`}
      >
        {item.iconSrc ? (
          <ColorableSvgIcon className="text-on-surface-var h-6 w-6 shrink-0" src={item.iconSrc} />
        ) : null}

        <Typography
          as="span"
          variant="label"
          size="large"
          weight="medium"
          className="text-outline mr-1 text-base font-medium"
        >
          {item.label}
        </Typography>

        <div className="mr-2">
          <DetailInfoValueView align="start" item={item} />
        </div>
      </div>

      {item.extraRows && item.extraRows.length > 0 ? (
        <div className="space-y-3 pb-5 text-left [direction:ltr]">
          {item.extraRows.map((row) => (
            <div
              className="flex items-center justify-start gap-2 text-sm leading-5 font-medium [direction:rtl]"
              key={row.label}
            >
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="medium"
                className="text-outline text-sm leading-5 font-medium"
              >
                {row.label}
              </Typography>
              <strong className="text-on-surface text-sm leading-5 font-semibold">
                {row.value}
              </strong>
            </div>
          ))}
        </div>
      ) : null}

      {showDivider ? <div aria-hidden="true" className="bg-outline-var h-px w-full" /> : null}
    </div>
  );
}

