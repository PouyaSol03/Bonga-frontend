import { useState } from "react";
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
import { InputBox, Section, SelectBox, Tag } from "../../components/NewAdControls";
import { Typography } from "../../../../../shared/ui/Typography";
import { toPersianDigits } from "../../../../../shared/lib/numberUtils";
import LinearBuilding from "../../../../../shared/icons/LinearBuilding";
import LinearArrowDown1 from "../../../../../shared/icons/LinearArrowDown1";
import LinearArrowLeft2 from "../../../../../shared/icons/LinearArrowLeft2";
import { RegisteredMoreFeatures } from "../details/RegisteredMoreFeatures";

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
  const [showAllProjectDetails, setShowAllProjectDetails] = useState(false);

  const validProjectDetails = values.projectDetails.filter(
    (item) => item.meterage || item.minMeterage,
  );
  const visibleProjectDetails = showAllProjectDetails
    ? validProjectDetails
    : validProjectDetails.slice(0, 4);
  const remainingProjectDetailsCount = Math.max(0, validProjectDetails.length - 4);

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

            <RegisteredMoreFeatures
              values={values}
              errors={errors}
              onMoreFeatures={onOpenMoreFeatures}
            />
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
            placeholder="سند *"
            value={values.documentType}
          />

          <RegisteredMoreFeatures
            values={values}
            errors={errors}
            onMoreFeatures={onOpenMoreFeatures}
          />
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

          <div className="border-outline-var text-on-surface-var flex items-center gap-1 rounded-xl border px-3 py-1.5">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface-var"
            >
              انتخاب
            </Typography>
            <LinearArrowLeft2 className="text-on-surface-var h-4 w-4" />
          </div>
        </button>

        {validProjectDetails.length > 0 ? (
          <>
            <div className="mt-3 flex flex-wrap justify-start gap-2" dir="rtl">
              {visibleProjectDetails.map((item) => (
                <Tag
                  key={item.id}
                  label={`متراژ ${toPersianDigits(item.meterage || item.minMeterage || "-")} متر`}
                  onRemove={() =>
                    setField(
                      "projectDetails",
                      values.projectDetails.filter((detail) => detail.id !== item.id),
                    )
                  }
                />
              ))}
            </div>

            {remainingProjectDetailsCount > 0 ? (
              <button
                type="button"
                onClick={() => setShowAllProjectDetails((prev) => !prev)}
                className="text-on-surface mt-3 flex items-center gap-1.5 text-sm font-medium transition active:opacity-70"
              >
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="medium"
                  className="text-on-surface"
                >
                  {showAllProjectDetails
                    ? "مشاهده کمتر"
                    : `${toPersianDigits(remainingProjectDetailsCount)} مورد دیگر`}
                </Typography>
                <LinearArrowDown1
                  aria-hidden="true"
                  className={`text-on-surface h-4 w-4 transition-transform duration-200 ${
                    showAllProjectDetails ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : null}
          </>
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
