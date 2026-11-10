import { Typography } from "../../../../shared/ui/Typography";
import { Section, Field, SelectField } from "./AgencyProfileFields";
import { AgencyLogoUpload, LogoHelpText } from "./AgencyLogoUpload";
import type { SelectedNeighborhood } from "../types";

export function OwnerInfoSection({
  agencyName,
  agencyNameError,
  isNeighborhoodLoading,
  logoPreviewUrl,
  logoUrl,
  neighborhood,
  onAgencyNameChange,
  onLogoChange,
  onOpenNeighborhoodPicker,
}: {
  agencyName: string;
  agencyNameError?: string | null;
  isNeighborhoodLoading?: boolean;
  logoPreviewUrl: string | null;
  logoUrl: string | null;
  neighborhood: SelectedNeighborhood | null;
  onAgencyNameChange: (value: string) => void;
  onLogoChange: (file: File | null) => void;
  onOpenNeighborhoodPicker: () => void;
}) {
  return (
    <Section title="اطلاعات ملک">
      <div className="flex items-end justify-between gap-4">
        <AgencyLogoUpload
          logoPreviewUrl={logoPreviewUrl}
          logoUrl={logoUrl}
          onLogoChange={onLogoChange}
        />
        <LogoHelpText />
      </div>

      <div className="mt-4 grid gap-3">
        <Field onChange={onAgencyNameChange} placeholder="نام آژانس" value={agencyName} />
        {agencyNameError ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-error m-0 -mt-1 text-right text-xs leading-5 font-normal"
          >
            {agencyNameError}
          </Typography>
        ) : null}
        <SelectField
          isLoading={isNeighborhoodLoading}
          onClick={onOpenNeighborhoodPicker}
          placeholder="محله"
          value={neighborhood?.name}
        />
      </div>
    </Section>
  );
}
