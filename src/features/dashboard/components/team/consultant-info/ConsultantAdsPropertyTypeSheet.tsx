import { useState } from "react";
import { BottomSheet } from "../../../../../shared/components/BottomSheet";
import LinearArrowLeft1 from "../../../../../shared/icons/LinearArrowLeft1";
import { Chip } from "../../../../../shared/ui/Chip";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import { toPersianNumber } from "../../../../../shared/lib/numberUtils";
import {
  adManagementPropertyGroupsByTransaction,
  adManagementPropertyTypeLabels,
  type AdManagementPropertyType,
  type AdManagementTransaction,
} from "../../../../account/adManagement/adManagementData";

const defaultGroups = [
  ...adManagementPropertyGroupsByTransaction.sale,
  ...adManagementPropertyGroupsByTransaction.rent.filter((g) => g.title === "روزانه"),
  ...adManagementPropertyGroupsByTransaction.project,
];

export function ConsultantAdsPropertyTypeSheet({
  onChange,
  propertyTypes,
  transaction,
}: {
  onChange: (propertyTypes: AdManagementPropertyType[]) => void;
  propertyTypes: AdManagementPropertyType[];
  transaction?: AdManagementTransaction;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const groups = transaction ? adManagementPropertyGroupsByTransaction[transaction] : defaultGroups;

  const togglePropertyType = (item: AdManagementPropertyType) => {
    if (propertyTypes.includes(item)) {
      onChange(propertyTypes.filter((t) => t !== item));
    } else {
      onChange([...propertyTypes, item]);
    }
  };

  const removePropertyType = (item: AdManagementPropertyType) => {
    onChange(propertyTypes.filter((t) => t !== item));
  };

  const isEnabled = Boolean(transaction);

  return (
    <div>
      <Button
        unstyled
        aria-disabled={!isEnabled}
        disabled={!isEnabled}
        className={`flex h-10 w-full items-center justify-between text-right transition-opacity [direction:ltr] ${
          isEnabled ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-30"
        }`}
        onClick={() => {
          if (isEnabled) setIsOpen(true);
        }}
        type="button"
      >
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="text-primary flex items-center gap-1"
        >
          <LinearArrowLeft1 className="text-on-surface-var h-5 w-5" />
          {propertyTypes.length > 0 ? (
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-primary font-medium"
            >
              {`${toPersianNumber(propertyTypes.length)} انتخاب`}
            </Typography>
          ) : null}
        </Typography>

        <Typography
          as="span"
          variant="label"
          size="large"
          weight="medium"
          className="text-on-surface"
        >
          نوع ملک
        </Typography>
      </Button>

      {propertyTypes.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2" dir="rtl">
          {propertyTypes.map((pt) => (
            <Chip key={pt} removable selected onClick={() => removePropertyType(pt)}>
              {(adManagementPropertyTypeLabels as Record<string, string>)[pt] ?? pt}
            </Chip>
          ))}
        </div>
      ) : null}

      <BottomSheet
        ariaLabel="انتخاب نوع ملک"
        contentClassName="flex min-h-0 flex-1 flex-col"
        heightClassName="max-h-[50svh]"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="انتخاب نوع ملک"
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-4" dir="rtl">
          {groups.map((group) => (
            <div key={group.title} className="mb-4 last:mb-0">
              <Typography
                as="h3"
                variant="label"
                size="medium"
                weight="medium"
                className="text-outline mb-2"
              >
                {group.title}
              </Typography>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip
                    key={item}
                    selected={propertyTypes.includes(item)}
                    onClick={() => togglePropertyType(item)}
                  >
                    {(adManagementPropertyTypeLabels as Record<string, string>)[item] ?? item}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>

        <footer className="bg-surface-container-lowest shrink-0 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-6px_16px_rgba(26,26,26,0.06)]">
          <Button
            variant="primary"
            size="x-medium"
            radius="small"
            fullWidth
            onClick={() => setIsOpen(false)}
            type="button"
          >
            تایید
          </Button>
        </footer>
      </BottomSheet>
    </div>
  );
}
