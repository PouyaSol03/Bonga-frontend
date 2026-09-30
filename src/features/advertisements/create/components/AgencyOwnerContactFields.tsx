import type { NewAdFieldErrors, NewAdFormValues } from "../types";
import { InputBox } from "./NewAdControls";
import { Typography } from "../../../../shared/ui/Typography";

export type SetNewAdField = <T extends keyof NewAdFormValues>(
  key: T,
  value: NewAdFormValues[T],
) => void;

export interface AgencyOwnerContactFieldsProps {
  errors: NewAdFieldErrors;
  onSetField: SetNewAdField;
  ownerExactAddress: string;
  ownerFullName: string;
  ownerPhone: string;
}

export function AgencyOwnerContactFields({
  errors,
  onSetField,
  ownerExactAddress,
  ownerFullName,
  ownerPhone,
}: AgencyOwnerContactFieldsProps) {
  return (
    <div
      className="border-t border-dashed border-outline-var pt-5"
      data-field-key="ownerContact"
    >
      <div className="mb-1 text-right">
        <Typography
          variant="label"
          size="large"
          weight="semibold"
          className="text-on-surface"
        >
          ارتباط با مالک
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="m-0 mb-4 text-right text-xs leading-5 text-on-surface-var"
      >
        این اطلاعات فقط برای منتشرکننده آگهی نمایش داده می‌شود.
      </Typography>

      <div className="space-y-3">
        <div data-field-key="ownerFullName">
          <InputBox
            error={errors.ownerFullName}
            floatingLabel="نام و نام خانوادگی مالک"
            onChange={(value) => onSetField("ownerFullName", value)}
            placeholder="نام و نام خانوادگی مالک"
            value={ownerFullName}
          />
        </div>

        <div data-field-key="ownerPhone">
          <InputBox
            error={errors.ownerPhone}
            floatingLabel="شماره تلفن مالک"
            numeric
            onChange={(value) => onSetField("ownerPhone", value)}
            placeholder="شماره تلفن مالک"
            value={ownerPhone}
          />
        </div>

        <div data-field-key="ownerExactAddress">
          <InputBox
            error={errors.ownerExactAddress}
            floatingLabel="نشانی دقیق آگهی"
            onChange={(value) => onSetField("ownerExactAddress", value)}
            placeholder="نشانی دقیق آگهی"
            value={ownerExactAddress}
          />
        </div>
      </div>
    </div>
  );
}
