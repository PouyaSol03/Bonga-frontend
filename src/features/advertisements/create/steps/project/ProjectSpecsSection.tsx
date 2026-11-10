import type { NewAdFieldErrors, NewAdFormValues, SelectKey } from "../../types";
import {
  documentTypeOptions,
  projectCountOptions,
  participationTypeOptions,
  partnershipCurrentStatusOptions,
  projectTypeOptions,
  saleLandPositionOptions,
} from "../../data";
import { getParams } from "../../utils";
import { InputBox, Section, SelectBox } from "../../components/NewAdControls";
import { Typography } from "../../../../../shared/ui/Typography";
import { Button } from "../../../../../shared/ui/Button";
import LinearBuilding from "../../../../../shared/icons/LinearBuilding";
import LinearArrowLeft2 from "../../../../../shared/icons/LinearArrowLeft2";

type ProjectSpecsSectionProps = {
  errors?: NewAdFieldErrors;
  values: NewAdFormValues;
  projectDetailsError?: string;
  setField: <T extends keyof NewAdFormValues>(key: T, value: NewAdFormValues[T]) => void;
  onOpenSelect: (key: SelectKey, title: string, options: string[]) => void;
  onOpenProjectDetails: () => void;
  onOpenMoreFeatures: () => void;
};

export function ProjectSpecsSection({
  errors = {},
  values,
  projectDetailsError,
  setField,
  onOpenSelect,
  onOpenProjectDetails,
  onOpenMoreFeatures,
}: ProjectSpecsSectionProps) {
  const { category } = getParams();
  const isPartnership = category === "project-partnership";

  if (isPartnership) {
    return (
      <>
        <Section icon="info.svg" title="مشخصات مشارکت">
          <div className="space-y-6">
            <SelectBox
              onClick={() =>
                onOpenSelect("participationType", "نوع مشارکت", participationTypeOptions)
              }
              error={errors.participationType}
              placeholder="نوع مشارکت *"
              value={values.participationType}
            />

            <SelectBox
              onClick={() =>
                onOpenSelect("currentStatus", "وضعیت فعلی ملک", partnershipCurrentStatusOptions)
              }
              error={errors.currentStatus}
              placeholder="وضعیت فعلی ملک *"
              value={values.currentStatus}
            />

            <InputBox
              numeric
              leftText="متر مربع"
              onChange={(value) => setField("landArea", value)}
              error={errors.landArea}
              placeholder="متراژ زمین *"
              value={values.landArea}
            />

            <SelectBox
              onClick={() => onOpenSelect("landPosition", "موقعیت زمین", saleLandPositionOptions)}
              error={errors.landPosition}
              placeholder="موقعیت زمین *"
              value={values.landPosition}
            />

            <Button
              unstyled
              className="text-primary mx-auto flex items-center justify-center gap-2 py-2.5 text-base leading-6 font-medium active:opacity-80"
              onClick={onOpenMoreFeatures}
              type="button"
            >
              <Typography as="span" variant="label" size="medium" weight="medium">
                ثبت ۴ مشخصات دیگر
              </Typography>
              <Typography as="span" variant="title" size="large" weight="medium">
                ‹
              </Typography>
            </Button>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <Section icon="info.svg" title="مشخصات پروژه">
        <div className="space-y-6">
          <SelectBox
            onClick={() => onOpenSelect("projectType", "نوع پروژه", projectTypeOptions)}
            error={errors.projectType}
            placeholder="نوع پروژه *"
            value={values.projectType}
          />

          <SelectBox
            onClick={() =>
              onOpenSelect("projectTotalFloors", "تعداد کل طبقات", projectCountOptions)
            }
            error={errors.projectTotalFloors}
            placeholder="تعداد کل طبقات *"
            value={values.projectTotalFloors}
          />

          <SelectBox
            onClick={() =>
              onOpenSelect("projectTotalUnits", "تعداد کل واحدها", projectCountOptions)
            }
            error={errors.projectTotalUnits}
            placeholder="تعداد کل واحدها *"
            value={values.projectTotalUnits}
          />

          <SelectBox
            onClick={() => onOpenSelect("documentType", "سند", documentTypeOptions)}
            error={errors.documentType}
            placeholder="سند"
            value={values.documentType}
          />

          <Button
            unstyled
            className="text-primary mx-auto flex items-center justify-center gap-2 py-2.5 text-base leading-6 font-medium active:opacity-80"
            onClick={onOpenMoreFeatures}
            type="button"
          >
            <Typography as="span" variant="label" size="medium" weight="medium">
              ثبت ۸ مشخصات دیگر
            </Typography>
            <LinearArrowLeft2 className="text-primary h-4 w-4" />
          </Button>
        </div>
      </Section>

      <section className="border-surface-container bg-surface-container-lowest border-b-[10px] p-4 text-right [direction:rtl] last:border-b-0">
        <button
          className="flex w-full items-center justify-between transition active:opacity-70"
          onClick={onOpenProjectDetails}
          type="button"
        >
          <div className="flex items-center gap-2">
            <LinearBuilding className="text-on-surface-var h-6 w-6" />
            <Typography variant="label" size="large" weight="medium" className="text-on-surface">
              جزییات پروژه
            </Typography>
          </div>

          <div className="text-primary flex items-center gap-1">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-primary"
            >
              انتخاب
            </Typography>
            <LinearArrowLeft2 className="text-primary h-4 w-4" />
          </div>
        </button>

        {values.projectDetails.some((item) => item.meterage || item.minMeterage) ? (
          <div className="mt-3 flex flex-wrap justify-start gap-2" dir="rtl">
            {values.projectDetails
              .filter((item) => item.meterage || item.minMeterage)
              .map((item, index) => (
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="medium"
                  key={item.id}
                  className="border-primary bg-primary-container text-primary flex h-9 items-center rounded-[7px] border px-3 text-sm leading-5 font-medium"
                >
                  {`جزئیات ${index + 1}: ${item.meterage || item.minMeterage || "-"} متر`}
                </Typography>
              ))}
          </div>
        ) : null}

        {projectDetailsError ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-error mt-2 text-right text-xs"
          >
            {projectDetailsError}
          </Typography>
        ) : null}
      </section>
    </>
  );
}
