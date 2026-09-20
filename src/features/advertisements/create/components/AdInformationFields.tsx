import type { NewAdFieldErrors, NewAdFormValues } from "../types";
import { InputBox } from "./NewAdControls";
import { CheckRow, RadioCard } from "./MediaControls";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearBuilding2 from "../../../../shared/icons/LinearBuilding2";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import LinearUserSolid from "../../../../shared/icons/LinearUserSolid";
import { Button } from "../../../../shared/ui/Button";
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
            نام و نام خانوادگی مالک (اختیاری)
          </div>
          <InputBox
            error={errors.ownerFullName}
            floatingLabel="نام و نام خانوادگی مالک (اختیاری)"
            onChange={(value) => onSetField("ownerFullName", value)}
            placeholder="نام و نام خانوادگی خودتان را وارد کنید"
            value={ownerFullName}
          />
        </div>

        <div>
          <div className="mb-3 text-right text-base font-semibold leading-7 text-on-surface">
            آدرس دقیق ملک (اختیاری)
          </div>
          <InputBox
            error={errors.ownerExactAddress}
            floatingLabel="آدرس دقیق ملک (اختیاری)"
            onChange={(value) => onSetField("ownerExactAddress", value)}
            placeholder="مثال: بلوار هاشمیه، هاشمیه ۲۰، پلاک ۲۰، طبقه ۲"
            value={ownerExactAddress}
          />
        </div>
      </div>
    </div>
  );
}

function AgencyPublisherFields({
  isConsultant = false,
  logoUrl,
  name,
  onChangePublisher,
  subtitle = "مالک",
}: {
  isConsultant?: boolean;
  logoUrl?: string;
  name: string;
  onChangePublisher: () => void;
  subtitle?: string;
}) {
  return (
    <div>
      <Typography
        as="p"
        variant="body"
        size="large"
        weight="medium"
        className="m-0 mb-3 text-right text-on-surface-var"
      >
        منتشرکننده آگهی
      </Typography>

      <div className="flex min-h-[84px] items-center gap-3 rounded-[16px] bg-surface-container px-4 py-3 [direction:rtl]">
        <div className={`grid h-14 w-14 shrink-0 place-items-center overflow-hidden bg-surface-container-lowest text-on-surface-var ${isConsultant ? "rounded-full" : "rounded-xl"}`}>
          {logoUrl ? (
            <img
              alt=""
              className="h-full w-full object-cover"
              src={logoUrl}
            />
          ) : isConsultant ? (
            <LinearUserSolid aria-hidden="true" className="h-7 w-7" />
          ) : (
            <LinearBuilding2 aria-hidden="true" className="h-7 w-7" />
          )}
        </div>

        <div className="min-w-0 flex-1 text-right">
          <Typography
            as="p"
            variant="body"
            size="large"
            weight="medium"
            className="m-0 truncate text-on-surface"
          >
            {name || "آژانس"}
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="m-0 mt-1 text-on-surface-var"
          >
            {subtitle}
          </Typography>
        </div>
      </div>

      <Button
        className="mt-4 w-full"
        fullWidth
        onClick={onChangePublisher}
        size="medium"
        trailingIcon={<LinearArrowLeft1 aria-hidden="true" className="h-5 w-5" />}
        type="button"
        variant="secondary"
      >
        تغییر منتشر کننده
      </Button>
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
  agencyPublisherIsConsultant,
  agencyPublisherLogoUrl,
  agencyPublisherName,
  agencyPublisherSubtitle,
  errors,
  label,
  mobile,
  profileMobile,
  onChangePublisher,
  onSelectAgency,
  onSelectPersonal,
  onSetField,
  publisherType,
  values,
  allowAssignmentChoice = true,
}: {
  agencyPublisherIsConsultant?: boolean;
  agencyPublisherLogoUrl?: string;
  agencyPublisherName?: string;
  agencyPublisherSubtitle?: string;
  errors: NewAdFieldErrors;
  label: string;
  mobile: string;
  profileMobile: string;
  onChangePublisher?: () => void;
  onSelectAgency: () => void;
  onSelectPersonal: () => void;
  onSetField: SetNewAdField;
  publisherType?: string;
  values: NewAdFormValues;
  allowAssignmentChoice?: boolean;
}) {
  const isAgencyPublisher = publisherType === "agency";
  const isAgency = !isAgencyPublisher && values.registrantType === "agency";
  const isPersonal = !isAgencyPublisher && values.registrantType === "personal";

  return (
    <div className="space-y-4">
      {isAgencyPublisher ? (
        <AgencyPublisherFields
          isConsultant={agencyPublisherIsConsultant}
          logoUrl={agencyPublisherLogoUrl}
          name={agencyPublisherName || values.publisherName || "آژانس"}
          onChangePublisher={onChangePublisher ?? (() => undefined)}
          subtitle={agencyPublisherSubtitle}
        />
      ) : allowAssignmentChoice ? (
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

      {!isAgencyPublisher && values.registrantType ? (
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
