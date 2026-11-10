import { useFormContext } from "react-hook-form";
import { formatMinStayDaysLabel, formatUnitsPerFloorLabel, getMoreFeatureFields } from "../../utils";
import { formatNumber } from "../../../../../shared/lib/numberUtils";
import type { MoreFeatureFormKey, NewAdFormValues } from "../../types";

export function useRegisteredMoreFeatures(values: NewAdFormValues) {
  const { setValue } = useFormContext<NewAdFormValues>();
  const moreFeatureFields = getMoreFeatureFields();
  const registeredMoreFeatures = moreFeatureFields
    .map((field) => {
      const value = values[field.key];

      const cleanLabel =
        field.key === "minStayDays"
          ? "حداقل مدت اقامت"
          : field.key === "evacuationGuarantee"
            ? "تضمین تخلیه"
            : field.label;

      if (field.control === "toggle") {
        return value === true ? { key: field.key, label: cleanLabel } : null;
      }

      if (Array.isArray(value) && value.length) {
        const displayValue = value.filter(Boolean).join("، ");
        return displayValue ? { key: field.key, label: `${cleanLabel}: ${displayValue}` } : null;
      }

      if (typeof value === "string" && value.trim()) {
        const displayValue =
          field.key === "unitsPerFloor"
            ? formatUnitsPerFloorLabel(value)
            : field.key === "minStayDays"
              ? formatMinStayDaysLabel(value)
              : field.key === "evacuationGuarantee"
                ? `${formatNumber(value)} تومان`
                : value;

        if (!displayValue) return null;

        return { key: field.key, label: `${cleanLabel}: ${displayValue}` };
      }

      return null;
    })
    .filter((item): item is { key: MoreFeatureFormKey; label: string } => Boolean(item));
  const initialVisibleMoreFeatureTagCount = 4;
  const initialMoreFeatureTags = registeredMoreFeatures.slice(0, initialVisibleMoreFeatureTagCount);
  const extraMoreFeatureTags = registeredMoreFeatures.slice(initialVisibleMoreFeatureTagCount);
  const hiddenMoreFeatureCount = extraMoreFeatureTags.length;
  const removeMoreFeature = (key: MoreFeatureFormKey) => {
    const field = moreFeatureFields.find((item) => item.key === key);

    const emptyValue =
      field?.control === "toggle" ? false : field?.control === "multiSelect" ? [] : "";

    setValue(key as never, emptyValue as never, {
      shouldDirty: true,
    });
  };

  return {
    moreFeatureFields,
    initialMoreFeatureTags,
    extraMoreFeatureTags,
    hiddenMoreFeatureCount,
    registeredMoreFeatures,
    removeMoreFeature,
  };
}
