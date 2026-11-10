import { useState } from "react";
import { FormChoiceChip } from "../../../../../shared/form/FormControls";
import { TopBar } from "../../../../../shared/components/TopBar";
import { PageFrame } from "../../../../../shared/layout/PageFrame";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import {
  adManagementPropertyGroupsByTransaction,
  adManagementPropertyTypeLabels,
  type AdManagementPropertyType,
} from "../../adManagementData";
import type { PropertyTypeSelectionScreenProps } from "../types";

export function PropertyTypeSelectionScreen({
  initialPropertyTypes,
  onBack,
  onConfirm,
  transaction,
}: PropertyTypeSelectionScreenProps) {
  const [draftPropertyTypes, setDraftPropertyTypes] =
    useState<AdManagementPropertyType[]>(initialPropertyTypes);

  const togglePropertyType = (nextPropertyType: AdManagementPropertyType) => {
    setDraftPropertyTypes((current) =>
      current.includes(nextPropertyType)
        ? current.filter((item) => item !== nextPropertyType)
        : [...current, nextPropertyType],
    );
  };

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden"
      variant="flush"
    >
      <div className="bg-surface-container shrink-0">
        <TopBar
          centerClassName="px-0"
          className="bg-surface-container"
          onBack={onBack}
          title="انتخاب دسته‌بندی"
        />
      </div>

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-0">
        {adManagementPropertyGroupsByTransaction[transaction].map((group) => (
          <section key={group.title} className="mb-6 last:mb-0">
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="medium"
              className="border-outline-var text-outline mb-4 border-b pb-2 text-right text-base font-medium"
            >
              {group.title}
            </Typography>

            <div className="flex flex-wrap justify-start gap-2" dir="rtl">
              {group.items.map((item) => (
                <FormChoiceChip
                  key={item}
                  label={adManagementPropertyTypeLabels[item]}
                  onClick={() => togglePropertyType(item)}
                  selected={draftPropertyTypes.includes(item)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="bg-surface-container-lowest shrink-0 px-4 py-3 shadow-[0_-4px_10px_rgba(26,26,26,0.04)]">
        <Button
          unstyled
          className="bg-primary text-on-primary flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!draftPropertyTypes.length}
          onClick={() => {
            if (!draftPropertyTypes.length) return;
            onConfirm(draftPropertyTypes);
          }}
          type="button"
        >
          تایید
        </Button>
      </footer>
    </PageFrame>
  );
}
