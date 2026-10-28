import { FilterSection } from "./FilterSection";
import LinearAgreement from "../../../shared/icons/LinearAgreement";
import { TextField } from "../../../shared/ui/TextField";
import { useState } from "react";
import { Button } from "../../../shared/ui/Button";
import LinearArrowDown1 from "../../../shared/icons/LinearArrowDown1";
import { JalaliDatePickerSheet } from "../../advertisements/create/steps/project/JalaliDatePickerSheet";

export function TimeFilterSection({
  sectionId,
  title,
  value,
  onChange,
}: {
  sectionId?: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FilterSection
      icon={<LinearAgreement aria-hidden="true" className="h-6 w-6 shrink-0" />}
      sectionId={sectionId}
      title={title}
    >
      <TextField
        className="text-sm"
        containerClassName="w-full"
        dir="ltr"
        label={title}
        onChange={(event) => onChange(event.target.value)}
        onClear={() => onChange("")}
        placeholder={title}
        type="time"
        value={value}
      />
    </FilterSection>
  );
}

export function DateFilterSection({
  onChange,
  sectionId,
  title,
  value,
}: {
  sectionId?: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FilterSection
        icon={<LinearAgreement aria-hidden="true" className="h-6 w-6 shrink-0" />}
        sectionId={sectionId}
        title={title}
      >
        <Button
          unstyled
          className="border-outline-var bg-surface-container-lowest text-on-surface flex h-12 w-full items-center justify-between rounded-xl border px-4 text-right text-sm"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <span>{value || "انتخاب تاریخ"}</span>
          <LinearArrowDown1 aria-hidden="true" className="text-on-surface-var h-5 w-5" />
        </Button>
      </FilterSection>
      <JalaliDatePickerSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={(nextValue) => {
          onChange(nextValue);
          setIsOpen(false);
        }}
        title={title}
        value={value}
      />
    </>
  );
}
