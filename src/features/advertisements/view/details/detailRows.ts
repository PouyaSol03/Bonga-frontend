import type { AdvertisementItem } from "../../api/advertisement.service";
import type { IconName } from "../viewAdTypes";
import { getBuildingInfo } from "../../../../shared/lib/handleBuildingInfo";
import {
  PROPERTY_DETAIL_ICONS,
  toText,
  type DetailInfoItem,
  type DetailInfoSection,
} from "./detailCore";
import { getFirstExistingFeatureValue, isFilledValue, toBooleanLike } from "./featureValues";
import { getDetailIconByLabel } from "./detailIcons";

export function createGridItem({
  features,
  labels,
  label,
  formatter,
  icon,
}: {
  features: NonNullable<AdvertisementItem["features"]>;
  labels: string[];
  label: string;
  formatter?: (value: unknown) => string;
  icon?: IconName;
}): DetailInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, labels);

  if (!isFilledValue(rawValue)) {
    return null;
  }

  const value = formatter ? formatter(rawValue) : toText(rawValue, "-");

  if (!value || value === "-") {
    return null;
  }

  const iconInfo = getBuildingInfo(label, value);

  return {
    icon: icon ?? getDetailIconByLabel(label),
    iconSrc: iconInfo.iconSrc,
    label,
    value,
  };
}

export function createChoiceRow(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
  label: string,
): DetailInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, labels);

  if (!isFilledValue(rawValue)) {
    return null;
  }

  const values = Array.isArray(rawValue)
    ? rawValue.map((item) => toText(item)).filter(Boolean)
    : [toText(rawValue)].filter(Boolean);

  if (!values.length) {
    return null;
  }

  return {
    icon: "apartment",
    iconSrc: PROPERTY_DETAIL_ICONS.selected,
    label,
    value: values,
  };
}

export function createCheckBadge(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
  label: string,
): DetailInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, labels);
  const isActive = toBooleanLike(rawValue);

  if (isActive !== true) {
    return null;
  }

  return {
    badge: true,
    icon: "apartment",
    iconSrc: PROPERTY_DETAIL_ICONS.selected,
    label,
    tone: "neutral",
    value: label,
  };
}

export function filterDetailSections(sections: DetailInfoSection[]) {
  return sections.filter(
    (section) =>
      section.items.length > 0 ||
      Boolean(section.choiceRows && section.choiceRows.length > 0) ||
      Boolean(section.badges && section.badges.length > 0),
  );
}
