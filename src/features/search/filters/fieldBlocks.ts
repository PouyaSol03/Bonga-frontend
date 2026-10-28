import { type RangeBlock, type FilterBlock } from "./filterTypes";
import { type BasicPropertyField, type MoreFeatureField } from "../../advertisements/create/types";
import { getFieldIcon } from "./fieldIcon";
import { moreFeatureOptions } from "../../advertisements/create/data";

export function createRangeBlock(
  id: string,
  title: string,
  variant: RangeBlock["variant"],
  unit?: string,
  showUnitInTitle = false,
): RangeBlock {
  return {
    id,
    kind: "range",
    title,
    unit,
    variant,
    showUnitInTitle,
  };
}

export function blockFromBasicField(field: BasicPropertyField): FilterBlock {
  if (field.control === "input") {
    const isAreaField =
      field.leftText?.includes("متر") ||
      field.key === "meterage" ||
      field.key === "landArea" ||
      field.key === "buildingArea";
    const isPercentField = field.leftText?.includes("درصد") || field.key === "density";

    return createRangeBlock(
      field.key,
      field.label,
      isPercentField ? "percent" : isAreaField ? "area" : "number",
      field.leftText,
    );
  }

  if (field.key === "rooms" || field.key === "floor") {
    return {
      icon: getFieldIcon(field.key),
      id: field.key,
      kind: "multi",
      options: (field.options ?? []).map((label) => ({ id: label, label })),
      title: field.label,
    };
  }

  return {
    icon: getFieldIcon(field.key),
    id: field.key,
    kind: "single",
    options: field.options ?? [],
    title: field.label,
  };
}

export function blockFromMoreFeatureField(field: MoreFeatureField): FilterBlock {
  if (field.control === "time") {
    return { id: field.key, kind: "time", title: field.label };
  }

  if (field.control === "date") {
    return { id: field.key, kind: "date", title: field.label };
  }

  if (field.control === "toggle") {
    return {
      id: field.key,
      kind: "toggle",
      title: field.label,
    };
  }

  if (field.control === "number") {
    const isPercentField = field.leftText?.includes("درصد") || field.key === "density";
    const isAreaField = field.key === "buildingArea" || field.leftText === "متر مربع";

    return createRangeBlock(
      field.key,
      field.label,
      isPercentField ? "percent" : isAreaField ? "area" : "number",
      field.leftText,
    );
  }

  if (field.key === "rooms" || field.key === "floor") {
    return {
      icon: getFieldIcon(field.key),
      id: field.key,
      kind: "multi",
      options: (
        field.options ??
        moreFeatureOptions[field.key as keyof typeof moreFeatureOptions] ??
        []
      ).map((label) => ({ id: label, label })),
      title: field.label,
    };
  }

  return {
    icon: getFieldIcon(field.key),
    id: field.key,
    kind: "single",
    options:
      field.options ?? moreFeatureOptions[field.key as keyof typeof moreFeatureOptions] ?? [],
    title: field.label,
  };
}
