import type { NewAdFieldErrors, NewAdFormValues } from "../types";
import { InputBox } from "./NewAdControls";
import { Typography } from "../../../../shared/ui/Typography";
import { toEnglishDigits } from "../../../../shared/lib/numberUtils";

export type SetNewAdField = <T extends keyof NewAdFormValues>(
  key: T,
  value: NewAdFormValues[T],
) => void;

interface AgencyOwnerContactFieldsProps {
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
    <div className="border-outline-var border-t border-dashed pt-5" data-field-key="ownerContact">
      <div className="mb-1 text-right">
        <Typography variant="label" size="large" weight="semibold" className="text-on-surface">
          ارتباط با مالک
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface-var m-0 mb-4 text-right text-xs leading-5"
      >
        این اطلاعات فقط برای منتشرکننده آگهی نمایش داده می‌شود.
      </Typography>

      <div className="space-y-3">
        <div data-field-key="ownerFullName">
          <InputBox
            error={errors.ownerFullName}
            floatingLabel="نام و نام خانوادگی مالک"
            maxLength={50}
            onChange={(value) => onSetField("ownerFullName", value.slice(0, 50))}
            placeholder="نام و نام خانوادگی مالک"
            value={ownerFullName}
          />
        </div>

        <div data-field-key="ownerPhone">
          <InputBox
            error={errors.ownerPhone}
            floatingLabel="شماره تلفن مالک"
            maxLength={11}
            numeric
            onChange={(value) => {
              const digits = toEnglishDigits(value).replace(/\D/g, "").slice(0, 11);
              onSetField("ownerPhone", digits);
            }}
            placeholder="شماره تلفن مالک"
            value={ownerPhone}
          />
        </div>

        <div data-field-key="ownerExactAddress">
          <label
            className={`bg-surface-container-lowest text-on-surface focus-within:border-primary block min-h-[92px] w-full rounded-[12px] border px-4 py-2.5 text-right transition-colors ${
              errors.ownerExactAddress ? "border-error" : "border-outline-var"
            }`}
          >
            <span className="text-on-surface-var block text-xs leading-5 font-normal mb-1">
              نشانی دقیق آگهی
            </span>
            <textarea
              aria-invalid={Boolean(errors.ownerExactAddress)}
              className="placeholder:text-outline text-on-surface min-h-[56px] w-full resize-none border-0 bg-transparent p-0 text-right text-sm leading-6 outline-none break-words"
              maxLength={300}
              onChange={(e) => onSetField("ownerExactAddress", e.target.value.slice(0, 300))}
              placeholder="نشانی دقیق آگهی را وارد کنید..."
              rows={2}
              value={ownerExactAddress}
            />
          </label>
          {errors.ownerExactAddress ? (
            <p className="text-error mt-1 text-right text-xs leading-5 font-normal">
              {errors.ownerExactAddress}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
