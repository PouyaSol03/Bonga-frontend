import type { NewAdFormValues, SelectKey } from "../../types";
import {
  constructionLicenseOptions,
  documentTypeOptions,
  participationTypeOptions,
  projectStatusOptions,
} from "../../data";
import { getParams } from "../../utils";
import { InputBox, Section, SelectBox } from "../../components/NewAdControls";
import { Typography } from "../../../../components/ui/Typography";

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
  const { category } = getParams();
  const isPartnership = category === "project-partnership";

  if (isPartnership) {
    return (
      <Section icon="info.svg" title="مشخصات مشارکت">
        <div className="space-y-4">
          <SelectBox
            onClick={() =>
              onOpenSelect("participationType", "نوع مشارکت", participationTypeOptions)
            }
            placeholder="نوع مشارکت *"
            value={values.participationType}
          />

          <InputBox
            numeric
            leftText="متر مربع"
            onChange={(value) => setField("landArea", value)}
            placeholder="متراژ زمین *"
            value={values.landArea}
          />

          <SelectBox
            onClick={() =>
              onOpenSelect("constructionLicense", "مجوز ساخت", constructionLicenseOptions)
            }
            placeholder="مجوز ساخت *"
            value={values.constructionLicense}
          />

          <SelectBox
            onClick={() =>
              onOpenSelect("documentType", "نوع سند", documentTypeOptions)
            }
            placeholder="نوع سند *"
            value={values.documentType}
          />
        </div>
      </Section>
    );
  }

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
              <Typography as="span" variant="label" size="medium" weight="medium"
                key={item.id}
                className="flex h-9 items-center rounded-[7px] border border-[#0048c4] bg-[#0048c41f] px-3 text-sm font-medium leading-5 text-[#0048c4]"
              >
                {`جزئیات ${index + 1}: ${item.meterage || item.minMeterage || "-"} متر`}
              </Typography>
            ))}
          </div>
        ) : null}

        <button
          className="mx-auto flex h-9 items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4]"
          onClick={onOpenProjectDetails}
          type="button"
        >
          <Typography as="span" variant="body" size="medium" weight="regular">ثبت جزئیات پروژه</Typography>
          <Typography as="span" variant="body" size="medium" weight="regular">‹</Typography>
        </button>
      </div>
    </Section>
  );
}
