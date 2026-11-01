import { getBuildingInfo } from "../../../../shared/lib/handleBuildingInfo";
import { normalizeDetailValue } from "./propertyValueFormatting";

import type { AdvertisementItem } from "../../api/advertisement.service";
import type { IconName } from "../viewAdTypes";
import { getDetailIconByLabel } from "./detailIcons";
export { getDetailIconByLabel } from "./detailIcons";
import { toText } from "./detailCore";

import { getFeatureValue, getFirstExistingFeatureValue, isFilledValue } from "./featureValues";
import {
  type PropertyPreviewField,
  propertyPreviewFieldsByFormCode,
} from "./propertyPreviewFields";
import { ignoredFeatureLabels, propertyInfoLabelMap, propertyInfoOrder } from "./propertyInfoMaps";

export function buildPropertyPreviewItem(
  features: NonNullable<AdvertisementItem["features"]>,
  field: PropertyPreviewField,
): PropertyInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, field.labels);

  if (!isFilledValue(rawValue)) return null;

  const value = field.formatter
    ? field.formatter(rawValue)
    : Array.isArray(rawValue)
      ? rawValue
          .map((item) => toText(item))
          .filter(Boolean)
          .join("، ")
      : normalizeDetailValue(field.labels[0], rawValue).toString();

  if (!value || value === "-") return null;

  const { formattedValue, iconSrc } = getBuildingInfo(field.labels[0], value);

  return {
    icon: field.icon ?? getDetailIconByLabel(field.label),
    iconSrc: iconSrc ?? null,
    label: field.label,
    value: field.formatter ? value : formattedValue,
  };
}

export function buildPropertyInfoPreviewItems(
  features: NonNullable<AdvertisementItem["features"]>,
) {
  const formCode = toText(getFeatureValue(features, "form_code"));
  const config = propertyPreviewFieldsByFormCode[formCode];

  if (!config) {
    return buildPropertyInfoItems(features).slice(0, 4);
  }

  const items = config
    .map((field) => buildPropertyPreviewItem(features, field))
    .filter((item): item is PropertyInfoItem => item !== null);

  return items.length ? items : buildPropertyInfoItems(features).slice(0, 4);
}

export function buildPropertyInfoItems(features: NonNullable<AdvertisementItem["features"]>) {
  const orderedItems = propertyInfoOrder
    .map((label) => {
      const feature = features.find((item) => item.label === label);

      if (!feature) {
        return null;
      }

      return buildPropertyInfoItem(label, feature.value);
    })
    .filter((item): item is PropertyInfoItem => item !== null);

  const extraItems = features
    .filter((feature) => {
      const label = feature.label ?? "";

      return label && !propertyInfoOrder.includes(label) && !ignoredFeatureLabels.has(label);
    })
    .map((feature) => buildPropertyInfoItem(feature.label ?? "", feature.value))
    .filter((item): item is PropertyInfoItem => item !== null);

  return [...orderedItems, ...extraItems];
}

type PropertyInfoItem = {
  icon: IconName;
  iconSrc: string | null;
  label: string;
  value: string;
};

function buildPropertyInfoItem(label: string, rawValue: unknown) {
  const displayLabel = propertyInfoLabelMap[label] ?? label;
  const normalizedValue = normalizeDetailValue(label, rawValue);
  const iconLookupLabel = propertyInfoLabelMap[label] ? label : displayLabel;
  const { formattedValue, iconSrc } = getBuildingInfo(
    iconLookupLabel,
    Array.isArray(normalizedValue) ? normalizedValue.join("، ") : normalizedValue,
  );

  return {
    icon: getDetailIconByLabel(displayLabel),
    iconSrc: iconSrc ?? null,
    label: displayLabel,
    value: formattedValue,
  };
}
