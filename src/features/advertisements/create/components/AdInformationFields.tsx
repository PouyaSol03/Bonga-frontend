import type { NewAdFieldErrors, NewAdFormValues } from "../types";
import { InputBox } from "./NewAdControls";
import { CheckRow, RadioCard } from "./MediaControls";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import { Typography } from "../../../../shared/ui/Typography";
import { TextField } from "../../../../shared/ui/TextField";

type SetNewAdField = <T extends keyof NewAdFormValues>(
  key: T,
  value: NewAdFormValues[T],
) => void;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 px-4 text-right text-xs font-normal leading-5 text-error" data-field-error="true">
      {message}
    </Typography>
  );
}


function SectionHeading({ required = false, title }: { required?: boolean; title: string }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <Typography variant="label" size="large" className="text-on-surface">
        {title} {required ? <Typography as="span" variant="body" size="medium" weight="regular" className="text-error">*</Typography> : null}
      </Typography>
      <LinearInfoCircle className="w-6 h-6 text-on-surface-var" />
    </div>
  );
}

function RegistrantTypeFields({
  error,
  onSelectAgency,
  onSelectPersonal,
  registrantType,
}: {
  error?: string;
  onSelectAgency: () => void;
  onSelectPersonal: () => void;
  registrantType: NewAdFormValues["registrantType"];
}) {
  return (
    <div>
      <div className="mb-3 text-right text-base font-medium leading-7 text-on-surface">
        ثبت کننده آگهی <Typography as="span" variant="body" size="medium" weight="regular" className="text-error">*</Typography>
      </div>

      <div className="space-y-3">
        <RadioCard
          checked={registrantType === "personal"}
          description={
            "با فعال بودن این گزینه، می‌توانید آگهی خود را به صورت شخصی ثبت نمایید.\nبعد از ثبت اطلاعات به صفحه وضعیت آگهی می‌روید."
          }
          label="شخصی"
          onClick={onSelectPersonal}
        />

        <RadioCard
          badge="رایگان"
          checked={registrantType === "agency"}
          description={
            "با فعال بودن این گزینه، می‌توانید آگهی خود را به آژانس املاکی مورد نظر خود بسپارید.\nبعد از ثبت اطلاعات به صفحه انتخاب آژانس املاک هدایت می‌شوید."
          }
          label="آژانس"
          onClick={onSelectAgency}
        />
      </div>

      <FieldError message={error} />
    </div>
  );
}

function PersonalContactFields({
  chatEnabled,
  contactError,
  mobile,
  onSetField,
  phoneEnabled,
}: {
  chatEnabled: boolean;
  contactError?: string;
  mobile: string;
  onSetField: SetNewAdField;
  phoneEnabled: boolean;
}) {
  return (
    <div className="border-t border-dashed border-outline-var pt-5">
      <SectionHeading required title="روش‌های ارتباطی" />

      <CheckRow
        checked={chatEnabled}
        label="چت با کاربران"
        onChange={(checked) => onSetField("chatEnabled", checked)}
      />
      <CheckRow
        checked={phoneEnabled}
        label={mobile ? `شماره تماس (${mobile})` : "شماره تماس"}
        onChange={(checked) => {
          onSetField("phoneEnabled", checked);
          onSetField("phoneNumber", "");
        }}
      />

      <FieldError message={contactError} />
    </div>
  );
}

function AgencyContactFields({
  errors,
  mobile,
  onSetField,
  ownerExactAddress,
  ownerFullName,
}: {
  errors: NewAdFieldErrors;
  mobile: string;
  onSetField: SetNewAdField;
  ownerExactAddress: string;
  ownerFullName: string;
}) {
  return (
    <div className="border-t border-outline-var pt-5">
      <SectionHeading title="روش‌های ارتباطی" />

      <div className="space-y-1 text-right text-sm font-normal leading-6 text-outline">
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">
          شما با شماره{" "}
          <Typography as="span" variant="label" size="medium" weight="medium" className="font-medium text-tertiary [direction:ltr]" dir="ltr">
            {mobile || "شماره ثبت‌شده شما"}
          </Typography>{" "}
          وارد شده‌اید.
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">
          شماره تماس با چت آگهی هر دو فعال بوده و آژانس از این طریق با شما در ارتباط می‌باشد.
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">
          محتوای نام و نام خانوادگی و آدرس دقیق منزل توسط آژانس محفوظ است.
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">
          در صورت تمایل می‌توانید لینک شبکه‌های اجتماعی خود را جهت تعامل بیشتر وارد کنید.
        </Typography>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-3 text-right text-base font-semibold leading-7 text-on-surface">
            نام و نام خانوادگی <Typography as="span" variant="body" size="medium" weight="regular" className="text-error">*</Typography>
          </div>
          <InputBox
            error={errors.ownerFullName}
            floatingLabel="نام و نام خانوادگی *"
            onChange={(value) => onSetField("ownerFullName", value)}
            placeholder="نام و نام خانوادگی خودتان را وارد کنید"
            value={ownerFullName}
          />
        </div>

        <div>
          <div className="mb-3 text-right text-base font-semibold leading-7 text-on-surface">
            آدرس دقیق منزل <Typography as="span" variant="body" size="medium" weight="regular" className="text-error">*</Typography>
          </div>
          <InputBox
            error={errors.ownerExactAddress}
            floatingLabel="آدرس دقیق منزل *"
            onChange={(value) => onSetField("ownerExactAddress", value)}
            placeholder="مثال: بلوار هاشمیه، هاشمیه ۲۰، پلاک ۲۰، طبقه ۲"
            value={ownerExactAddress}
          />
        </div>
      </div>
    </div>
  );
}

function SocialFields({
  onSetField,
  telegram,
  whatsapp,
}: {
  onSetField: SetNewAdField;
  telegram: string;
  whatsapp: string;
}) {
  return (
    <div>
      <div className="mb-3 text-right text-base font-semibold leading-7 text-on-surface">
        شبکه‌های اجتماعی
      </div>
      <div className="space-y-3">
        <TextField
          label="آیدی تلگرام"
          onChange={(event) => onSetField("telegram", event.target.value)}
          placeholder="آیدی تلگرام خود را وارد کنید"
          trailingSlot={<img src="/icons/socials/telegram.svg" alt="" />}
          value={telegram}
        />
        <TextField
          inputMode="numeric"
          label="شماره واتساپ"
          onChange={(event) => onSetField("whatsapp", event.target.value)}
          placeholder="شماره واتساپ خود را بدون صفر وارد کنید"
          trailingSlot={<img src="/icons/socials/whatsApp.svg" alt="" />}
          value={whatsapp}
        />
      </div>
    </div>
  );
}

export function AdInformationFields({
  errors,
  label,
  mobile,
  profileMobile,
  onSelectAgency,
  onSelectPersonal,
  onSetField,
  values,
  allowAssignmentChoice = true,
}: {
  errors: NewAdFieldErrors;
  label: string;
  mobile: string;
  profileMobile: string;
  onSelectAgency: () => void;
  onSelectPersonal: () => void;
  onSetField: SetNewAdField;
  values: NewAdFormValues;
  allowAssignmentChoice?: boolean;
}) {
  const isAgency = values.registrantType === "agency";
  const isPersonal = values.registrantType === "personal";

  return (
    <div className="space-y-4">
      {allowAssignmentChoice ? (
        <RegistrantTypeFields
          error={errors.registrantType}
          onSelectAgency={onSelectAgency}
          onSelectPersonal={onSelectPersonal}
          registrantType={values.registrantType}
        />
      ) : null}

      {isPersonal ? (
        <PersonalContactFields
          chatEnabled={values.chatEnabled}
          contactError={errors.contactMethods}
          mobile={profileMobile}
          onSetField={onSetField}
          phoneEnabled={values.phoneEnabled}
        />
      ) : null}

      {isAgency ? (
        <AgencyContactFields
          errors={errors}
          mobile={mobile}
          onSetField={onSetField}
          ownerExactAddress={values.ownerExactAddress}
          ownerFullName={values.ownerFullName}
        />
      ) : null}

      {values.registrantType ? (
        <SocialFields
          onSetField={onSetField}
          telegram={values.telegram}
          whatsapp={values.whatsapp}
        />
      ) : null}

      <div className="border-t border-dashed border-outline-var pt-5">
        <div className="mb-3 text-right text-base font-semibold leading-7 text-on-surface">
          عنوان آگهی <Typography as="span" variant="body" size="medium" weight="regular" className="text-error">*</Typography>
        </div>
        <InputBox
          error={errors.title}
          floatingLabel="عنوان آگهی *"
          maxLength={50}
          onChange={(value) => onSetField("title", value.slice(0, 50))}
          placeholder={`مثال: ${label || "آپارتمان"} ۱۲۰ متری، ۲ خوابه، طبقه اول`}
          value={values.title}
        />
      </div>

      <div>
        <div className="mb-3 text-right text-base font-semibold leading-7 text-on-surface">
          توضیحات آگهی <Typography as="span" variant="body" size="medium" weight="regular" className="text-error">*</Typography>
        </div>
        <label
          className={`block min-h-32 w-full rounded-[12px] border bg-surface-container-lowest px-4 py-3 text-right text-base font-normal leading-6 text-on-surface focus-within:border-primary ${
            errors.description ? "border-error" : "border-outline-var"
          }`}
        >
          <textarea
            aria-invalid={Boolean(errors.description)}
            className="min-h-24 w-full resize-none border-0 bg-transparent p-0 text-right outline-none placeholder:text-outline"
            maxLength={500}
            onChange={(event) => onSetField("description", event.target.value.slice(0, 500))}
            placeholder="اطلاعات بیشتر را وارد کنید..."
            value={values.description}
          />
        </label>
        <FieldError message={errors.description} />
      </div>
    </div>
  );
}
