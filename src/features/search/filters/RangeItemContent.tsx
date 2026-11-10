import { type RangeBlock } from "./filterTypes";
import { MoneyIcon, HouseDimensionsIcon, RulerIcon } from "./filterIcons";
import { Typography } from "../../../shared/ui/Typography";
import { FormTextField } from "../../../shared/form/FormControls";
import {
  normalizeRangeNumber,
  getMoneySupportingText,
  formatMoneyInputValue,
  formatPersianPlainNumber,
} from "./numberValues";
import { RangeSelectField } from "./RangeSelectField";
import { landWidthRangeOptions, areaRangeOptions } from "./rangeOptions";

export function RangeItemContent({
  block,
  maximum,
  minimum,
  onMaximumChange,
  onMinimumChange,
}: {
  block: RangeBlock;
  maximum: string;
  minimum: string;
  onMaximumChange: (value: string) => void;
  onMinimumChange: (value: string) => void;
}) {
  const isWidth = block.id === "landWidth" || block.id === "width" || block.title.includes("عرض");
  const isHouseDimensions = isWidth || block.id === "buildingArea" || block.title.includes("بنا");
  const isArea = block.variant === "area";
  const isMoney = block.variant === "money";
  const icon = isMoney ? (
    <MoneyIcon />
  ) : isHouseDimensions ? (
    <HouseDimensionsIcon />
  ) : (
    <RulerIcon />
  );

  const titleUnit = (block.unit ?? (isArea ? "مترمربع" : isWidth ? "متر" : "")).replace(/\s+/g, "");
  const showUnit =
    block.showUnitInTitle ||
    isArea ||
    isWidth ||
    (block.variant === "number" && Boolean(titleUnit));
  const normalizedTitle =
    showUnit && titleUnit ? (
      <>
        {block.title}{" "}
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="text-outline"
        >
          ({titleUnit})
        </Typography>
      </>
    ) : (
      block.title
    );

  return (
    <div>
      <div className="text-on-surface-var mb-2 flex h-8 items-center justify-start gap-2">
        {icon}
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="medium"
          className="text-on-surface m-0 text-right text-base leading-6 font-medium"
        >
          {normalizedTitle}
        </Typography>
      </div>

      {isMoney ? (
        <div className="flex flex-col gap-4">
          <FormTextField
            badge="تومان"
            label="حداقل"
            onChange={(event) => onMinimumChange(normalizeRangeNumber(event.target.value))}
            onClear={() => onMinimumChange("")}
            placeholder="حداقل"
            supportingText={getMoneySupportingText(minimum)}
            value={formatMoneyInputValue(minimum)}
          />
          <FormTextField
            badge="تومان"
            label="حداکثر"
            onChange={(event) => onMaximumChange(normalizeRangeNumber(event.target.value))}
            onClear={() => onMaximumChange("")}
            placeholder="حداکثر"
            supportingText={getMoneySupportingText(maximum)}
            value={formatMoneyInputValue(maximum)}
          />
        </div>
      ) : isWidth ? (
        <div className="flex items-center gap-3" dir="rtl">
          <RangeSelectField
            label="حداقل"
            onChange={onMinimumChange}
            options={landWidthRangeOptions}
            unit="متر"
            value={minimum}
          />
          <RangeSelectField
            label="حداکثر"
            onChange={onMaximumChange}
            options={landWidthRangeOptions}
            unit="متر"
            value={maximum}
          />
        </div>
      ) : isArea ? (
        <div className="flex items-center gap-3" dir="rtl">
          <RangeSelectField
            label="حداقل"
            onChange={onMinimumChange}
            options={areaRangeOptions}
            unit="متر"
            value={minimum}
          />
          <RangeSelectField
            label="حداکثر"
            onChange={onMaximumChange}
            options={areaRangeOptions}
            unit="متر"
            value={maximum}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3" dir="rtl">
          <FormTextField
            badge={block.unit}
            className="flex-1"
            label="حداقل"
            onChange={(event) => onMinimumChange(formatPersianPlainNumber(event.target.value))}
            onClear={() => onMinimumChange("")}
            placeholder="حداقل"
            value={formatPersianPlainNumber(minimum)}
          />
          <FormTextField
            badge={block.unit}
            className="flex-1"
            label="حداکثر"
            onChange={(event) => onMaximumChange(formatPersianPlainNumber(event.target.value))}
            onClear={() => onMaximumChange("")}
            placeholder="حداکثر"
            value={formatPersianPlainNumber(maximum)}
          />
        </div>
      )}
    </div>
  );
}
