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

type ProjectSpecsSectionProps = {
  errors?: NewAdFieldErrors;
  values: NewAdFormValues;
  projectDetailsError?: string;
  setField: <T extends keyof NewAdFormValues>(
    key: T,
    value: NewAdFormValues[T],
  ) => void;
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
          <div className="space-y-4">
            <SelectBox
              onClick={() => onOpenSelect("participationType", "نوع مشارکت", participationTypeOptions)}
              error={errors.participationType}
              placeholder="نوع مشارکت *"
              value={values.participationType}
            />

            <SelectBox
              onClick={() => onOpenSelect("currentStatus", "وضعیت فعلی ملک", partnershipCurrentStatusOptions)}
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

            <Button unstyled
              className="mx-auto flex py-2.5 items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4] active:text-[#00379a]"
              onClick={onOpenMoreFeatures}
              type="button"
            >
              <Typography as="span" variant="label" size="medium" weight="medium">ثبت ۴ مشخصات دیگر</Typography>
              <Typography as="span" variant="title" size="large" weight="medium">‹</Typography>
            </Button>

            {errors.documentType || errors.landWidth || errors.streetWidth ? (
              <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-right text-xs text-[#ff3b30]">
                لطفا مشخصات بیشتر مشارکت را تکمیل کنید.
              </Typography>
            ) : null}
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <Section icon="info.svg" title="سازنده/شرکت">
        <InputBox
          onChange={(value) => setField("builderCompanyName", value)}
          error={errors.builderCompanyName}
          placeholder="نام سازنده/شرکت *"
          value={values.builderCompanyName}
        />
      </Section>

      <Section icon="info.svg" title="مشخصات پروژه">
        <div className="space-y-4">
          <SelectBox
            onClick={() => onOpenSelect("projectType", "نوع پروژه", projectTypeOptions)}
            error={errors.projectType}
            placeholder="نوع پروژه *"
            value={values.projectType}
          />

          <SelectBox
            onClick={() => onOpenSelect("projectTotalFloors", "تعداد کل طبقات", projectCountOptions)}
            error={errors.projectTotalFloors}
            placeholder="تعداد کل طبقات *"
            value={values.projectTotalFloors}
          />

          <SelectBox
            onClick={() => onOpenSelect("projectTotalUnits", "تعداد کل واحد ها", projectCountOptions)}
            error={errors.projectTotalUnits}
            placeholder="تعداد کل واحد ها *"
            value={values.projectTotalUnits}
          />

          <SelectBox
            onClick={() => onOpenSelect("documentType", "سند", documentTypeOptions)}
            error={errors.documentType}
            placeholder="سند *"
            value={values.documentType}
          />
        </div>
      </Section>

      <Section icon="info.svg" title="مشخصات بیشتر">
        <Button unstyled
          className="mx-auto flex py-2.5 items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4]"
          onClick={onOpenMoreFeatures}
          type="button"
        >
          <Typography as="span" variant="label" size="medium" weight="medium">ثبت مشخصات بیشتر</Typography>
          <Typography as="span" variant="title" size="large" weight="medium">‹</Typography>
        </Button>
        {errors.projectStatus || errors.projectDeliveryDate ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-right text-xs text-[#ff3b30]">
            لطفا مشخصات بیشتر پروژه را تکمیل کنید.
          </Typography>
        ) : null}
      </Section>

      <Section icon="info.svg" title="ثبت جزییات پروژه">
        <div className="space-y-3">
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-right text-sm text-[#666]">
            حداقل یک مورد از جزییات پروژه را تکمیل کنید
          </Typography>

          {values.projectDetails.some((item) => item.meterage || item.minMeterage) ? (
            <div className="flex flex-wrap justify-start gap-2" dir="rtl">
              {values.projectDetails
                .filter((item) => item.meterage || item.minMeterage)
                .map((item, index) => (
                  <Typography as="span" variant="label" size="medium" weight="medium"
                    key={item.id}
                    className="flex h-9 items-center rounded-[7px] border border-[#0048c4] bg-[#0048c41f] px-3 text-sm font-medium leading-5 text-[#0048c4]"
                  >
                    {`جزئیات ${index + 1}: ${item.meterage || item.minMeterage || "-"} متر`}
                  </Typography>
                ))}
            </div>
          ) : null}

          <Button unstyled
            className="mx-auto flex h-9 items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4]"
            onClick={onOpenProjectDetails}
            type="button"
          >
            <Typography as="span" variant="body" size="medium" weight="regular">جزییات پروژه</Typography>
            <Typography as="span" variant="body" size="medium" weight="regular">‹</Typography>
          </Button>

          {projectDetailsError ? (
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-right text-xs text-[#ff3b30]">
              {projectDetailsError}
            </Typography>
          ) : null}
        </div>
      </Section>
    </>
  );
}
