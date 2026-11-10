import { Section } from "../../components/NewAdControls";
import { ProjectSpecsSection } from "../project/ProjectSpecsSection";
import type { NewAdFormValues, NewAdFieldErrors, SelectKey } from "../../types";
import type { SetDetailsField, OpenDetailsSheet } from "./types";
import { DetailsPropertyFields } from "./DetailsPropertyFields";
import { DailyHotelStayFields } from "./DailyHotelStayFields";
import { RegisteredMoreFeatures } from "./RegisteredMoreFeatures";

export function DetailsProperties({
  values,
  errors,
  setField,
  setSheet,
  desktop,
  isProject,
  isDailyHotelRent,
  title,
  openSelectSheet,
  onProjectDetails,
  onMoreFeatures,
}: {
  values: NewAdFormValues;
  errors: NewAdFieldErrors;
  setField: SetDetailsField;
  setSheet: OpenDetailsSheet;
  desktop: boolean;
  isProject: boolean;
  isDailyHotelRent: boolean;
  title: string;
  openSelectSheet: (key: SelectKey, title: string, options: string[]) => void;
  onProjectDetails?: () => void;
  onMoreFeatures?: () => void;
}) {
  if (isProject)
    return (
      <ProjectSpecsSection
        errors={errors}
        values={values}
        projectDetailsError={errors.projectDetails}
        setField={setField}
        onOpenSelect={openSelectSheet}
        onOpenProjectDetails={onProjectDetails ?? (() => {})}
        onOpenMoreFeatures={onMoreFeatures ?? (() => {})}
      />
    );
  return (
    <Section icon="info.svg" title={title}>
      <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-6"}>
        <DetailsPropertyFields
          values={values}
          errors={errors}
          setField={setField}
          setSheet={setSheet}
        />
        {isDailyHotelRent ? (
          <DailyHotelStayFields
            values={values}
            setField={setField}
            openSelectSheet={openSelectSheet}
          />
        ) : null}
        {!isDailyHotelRent ? (
        <RegisteredMoreFeatures values={values} errors={errors} onMoreFeatures={onMoreFeatures} />
      ) : null}
      </div>
    </Section>
  );
}
