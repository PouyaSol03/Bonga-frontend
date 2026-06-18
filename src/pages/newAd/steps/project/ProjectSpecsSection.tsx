import type { NewAdFormValues, SelectKey } from "../../types";
import { projectStatusOptions } from "../../data";
import { InputBox, Section, SelectBox } from "../../components/NewAdControls";

type ProjectSpecsSectionProps = {
  values: NewAdFormValues;
  setField: <T extends keyof NewAdFormValues>(
    key: T,
    value: NewAdFormValues[T],
  ) => void;
  onOpenSelect: (key: SelectKey, title: string, options: string[]) => void;
  onOpenDeliveryDate: () => void;
  onOpenProjectDetails: () => void;
};

export function ProjectSpecsSection({
  values,
  setField,
  onOpenSelect,
  onOpenDeliveryDate,
  onOpenProjectDetails,
}: ProjectSpecsSectionProps) {
  return (
    <Section icon="info.svg" title="مشخصات پروژه">
      <div className="space-y-4">
        <InputBox
          numeric
          onChange={(value) => setField("projectTotalFloors", value)}
          placeholder="تعداد کل طبقات *"
          value={values.projectTotalFloors}
        />

        <InputBox
          numeric
          onChange={(value) => setField("projectTotalUnits", value)}
          placeholder="تعداد کل واحدها *"
          value={values.projectTotalUnits}
        />

        <SelectBox
          onClick={() =>
            onOpenSelect("projectStatus", "وضعیت پروژه", projectStatusOptions)
          }
          placeholder="وضعیت پروژه *"
          value={values.projectStatus}
        />

        <SelectBox
          onClick={onOpenDeliveryDate}
          placeholder="تاریخ تحویل *"
          value={values.projectDeliveryDate}
        />

        {values.projectDetails.length ? (
          <div className="flex flex-wrap justify-start gap-2 pt-2" dir="rtl">
            {values.projectDetails.map((item, index) => (
              <span
                key={item.id}
                className="flex h-9 items-center rounded-[7px] border border-[#0048c4] bg-[#0048c41f] px-3 text-sm font-medium leading-5 text-[#0048c4]"
              >
                {`جزئیات ${index + 1}: ${item.minMeterage || "-"} تا ${item.maxMeterage || "-"} متر`}
              </span>
            ))}
          </div>
        ) : null}

        <button
          className="mx-auto flex h-9 items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4]"
          onClick={onOpenProjectDetails}
          type="button"
        >
          <span>ثبت جزئیات پروژه</span>
          <span>‹</span>
        </button>
      </div>
    </Section>
  );
}