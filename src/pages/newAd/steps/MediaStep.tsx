import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { getActiveAuthRole, getStoredAuthSession } from "../../../auth/auth-storage";
import { REAL_ESTATE_MANAGER } from "../../../constants/roles.constants";
import { PublisherSelectField } from "../../account/adManagement/PublisherSelectField";
import { adManagementPublisherOptions } from "../../account/adManagement/adManagementData";
import type { NewAdFieldErrorKey, NewAdFieldErrors, NewAdFormValues } from "../types";
import { Footer, InputBox, Section, Toggle } from "../components/NewAdControls";
import { CheckRow, RadioCard, SocialInput } from "../components/MediaControls";
import { PhotoUploader, VideoUploader } from "../components/MediaUploaders";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="m-0 mt-2 px-4 text-right text-xs font-normal leading-5 text-[#ff3b30]">
      {message}
    </p>
  );
}

export function MediaStep({
  errors = {},
  forceFullEditFields = false,
  label,
  onBack,
  onClearError,
  onSubmit,
  submitDisabled = false,
}: {
  errors?: NewAdFieldErrors;
  forceFullEditFields?: boolean;
  label: string;
  onBack: () => void;
  onClearError?: (key: NewAdFieldErrorKey) => void;
  onSubmit: () => void;
  submitDisabled?: boolean;
}) {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const values = watch();
  const isRealEstateManager = !forceFullEditFields && getActiveAuthRole(getStoredAuthSession()) === REAL_ESTATE_MANAGER;
  const setField = <T extends keyof NewAdFormValues>(key: T, value: NewAdFormValues[T]) => {
    setValue(key as never, value as never, { shouldDirty: true });
    onClearError?.(key);

    if (key === "chatEnabled" || key === "phoneEnabled") {
      onClearError?.("contactMethods");
    }
  };

  useEffect(() => {
    if (!isRealEstateManager) return;

    if (values.registrantType !== "agency") {
      setField("registrantType", "agency");
    }
    if (!values.publisherName) {
      setField("publisherName", adManagementPublisherOptions[0]?.name ?? "");
    }
    if (values.chatEnabled) setField("chatEnabled", false);
    if (values.phoneEnabled) setField("phoneEnabled", false);
    if (values.phoneNumber) setField("phoneNumber", "");
    if (values.telegram) setField("telegram", "");
    if (values.whatsapp) setField("whatsapp", "");
  }, [
    forceFullEditFields,
    isRealEstateManager,
    values.chatEnabled,
    values.phoneEnabled,
    values.phoneNumber,
    values.publisherName,
    values.registrantType,
    values.telegram,
    values.whatsapp,
  ]);

  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-3" dir="rtl">
        <Section icon="image.svg" title="عکس آگهی" warning>
          <PhotoUploader onChange={() => onClearError?.("photos")} />
          <FieldError message={errors.photos} />
          <div className="mt-5">
            <Toggle
              checked={values.hasVideo}
              label="ویدیو"
              onChange={(checked) => {
                setField("hasVideo", checked);
                onClearError?.("video");
                if (!checked) setField("video", null);
              }}
            />
          </div>
          {values.hasVideo ? <VideoUploader onChange={() => onClearError?.("video")} /> : null}
          <FieldError message={values.hasVideo ? errors.video : undefined} />
          <div className="mt-5">
            <Toggle
              checked={values.hasVirtualTour}
              label="تور مجازی"
              onChange={(checked) => {
                setField("hasVirtualTour", checked);
                onClearError?.("virtualTourLink");
                if (!checked) setField("virtualTourLink", "");
              }}
            />
          </div>
          {values.hasVirtualTour ? (
            <div className="mt-3">
              <InputBox
                error={errors.virtualTourLink}
                onChange={(value) => setField("virtualTourLink", value)}
                placeholder="لینک تور مجازی را وارد کنید"
                value={values.virtualTourLink}
              />
            </div>
          ) : null}
        </Section>

        <Section icon="info.svg" title="اطلاعات آگهی" warning>
          <div className="space-y-4">
            {!isRealEstateManager ? (
              <RegistrantTypeFields
                error={errors.registrantType}
                onSetField={setField}
                publisherName={values.publisherName}
                registrantType={values.registrantType}
              />
            ) : null}

            {!isRealEstateManager ? (
              <ContactFields
                contactError={errors.contactMethods}
                chatEnabled={values.chatEnabled}
                onSetField={setField}
                phoneEnabled={values.phoneEnabled}
                phoneError={errors.phoneNumber}
                phoneNumber={values.phoneNumber}
              />
            ) : null}

            {!isRealEstateManager ? (
              <SocialFields
                onSetField={setField}
                telegram={values.telegram}
                whatsapp={values.whatsapp}
              />
            ) : null}

            <div className={isRealEstateManager ? "" : "border-t border-dashed border-[#cccccc] pt-4"}>
              {isRealEstateManager ? (
                <div className="mb-6">
                  <div className="mb-3 text-right text-base font-medium leading-6 text-[#4d4d4d]">
                    منتشرکننده آگهی
                  </div>
                  <PublisherSelectField
                    onChange={(publisher) => setField("publisherName", publisher?.name ?? "")}
                    value={values.publisherName || adManagementPublisherOptions[0]?.name}
                  />
                  <div className="mt-6 border-t border-dashed border-[#cccccc]" />
                </div>
              ) : null}

              <div className="mb-3 text-right font-semibold leading-7 text-[#1a1a1a]">
                عنوان آگهی <span className="text-[#ff3b30]">*</span>
              </div>
              <InputBox
                error={errors.title}
                onChange={(value) => setField("title", value)}
                placeholder={`مثال: ${label} ۱۲۰ متری، ۲ خوابه، طبقه اول`}
                value={values.title}
              />
            </div>

            <div>
              <div className="mb-3 text-right font-semibold leading-7 text-[#1a1a1a]">
                توضیحات آگهی <span className="text-[#ff3b30]">*</span>
              </div>
              <label className={`block min-h-32 w-full rounded-[12px] border bg-white px-4 py-3 text-right text-base font-normal leading-6 text-[#1a1a1a] focus-within:border-[#0048c4] ${errors.description ? "border-[#ff3b30]" : "border-[#cccccc]"}`}>
                <textarea
                  aria-invalid={Boolean(errors.description)}
                  className="min-h-24 w-full resize-none border-0 bg-transparent p-0 text-right outline-none placeholder:text-[#a6a6a6]"
                  onChange={(event) => setField("description", event.target.value)}
                  placeholder="اطلاعات بیشتر را وارد کنید..."
                  value={values.description}
                />
              </label>
              <FieldError message={errors.description} />
            </div>
          </div>
        </Section>
      </main>
      <Footer
        disabled={submitDisabled}
        onBack={onBack}
        onPrimary={onSubmit}
        primary={submitDisabled ? "در حال ثبت..." : "ثبت اطلاعات"}
      />
    </>
  );
}

type SetNewAdField = <T extends keyof NewAdFormValues>(key: T, value: NewAdFormValues[T]) => void;

function RegistrantTypeFields({
  error,
  onSetField,
  publisherName,
  registrantType,
}: {
  error?: string;
  onSetField: SetNewAdField;
  publisherName: string;
  registrantType: NewAdFormValues["registrantType"];
}) {
  return (
    <div>
      <div className="mb-3 text-right leading-7 text-[#1a1a1a]">
        ثبت کننده آگهی <span className="text-[#ff3b30]">*</span>
      </div>
      <div className="space-y-3">
        <RadioCard
          checked={registrantType === "personal"}
          label="شخصی"
          description={`با فعال بودن این گزینه، می‌توانید آگهی خود را به صورت شخصی ثبت نمایید.
بعد از ثبت اطلاعات به صفحه وضعیت آگهی می‌روید.`}
          onClick={() => {
            onSetField("registrantType", "personal");
            onSetField("publisherName", "");
          }}
        />

        <RadioCard
          badge="رایگان"
          checked={registrantType === "agency"}
          label="آژانس"
          description={`با فعال بودن این گزینه، می‌توانید آگهی خود را به آژانس املاکی مورد نظر خود بسپارید.
بعد از ثبت اطلاعات به صفحه انتخاب آژانس املاک هدایت می‌روید.`}
          onClick={() => {
            onSetField("registrantType", "agency");
            if (!publisherName) {
              onSetField("publisherName", adManagementPublisherOptions[0]?.name ?? "");
            }
          }}
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}

function ContactFields({
  chatEnabled,
  contactError,
  onSetField,
  phoneEnabled,
  phoneError,
  phoneNumber,
}: {
  chatEnabled: boolean;
  contactError?: string;
  onSetField: SetNewAdField;
  phoneEnabled: boolean;
  phoneError?: string;
  phoneNumber: string;
}) {
  return (
    <div className="border-t border-dashed border-[#cccccc] pt-4">
      <div className="mb-2 flex items-center justify-start gap-1 font-semibold leading-7 text-[#1a1a1a]">
        <span>
          روش‌های ارتباطی <span className="text-[#ff3b30]">*</span>
        </span>
        <img src="/icons/add_advertisement/warning.svg" alt="" />
      </div>
      <CheckRow checked={chatEnabled} label="چت با کاربران" onChange={(checked) => onSetField("chatEnabled", checked)} />
      <CheckRow
        checked={phoneEnabled}
        label="شماره تماس"
        onChange={(checked) => {
          onSetField("phoneEnabled", checked);
          if (!checked) onSetField("phoneNumber", "");
        }}
      />
      <FieldError message={contactError} />
      {phoneEnabled ? (
        <div className="mt-3">
          <InputBox
            error={phoneError}
            numeric
            onChange={(value) => onSetField("phoneNumber", value)}
            placeholder="شماره تماس را وارد کنید *"
            value={phoneNumber}
          />
        </div>
      ) : null}
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
      <div className="mb-3 text-right font-semibold leading-7 text-[#1a1a1a]">
        شبکه‌های اجتماعی
      </div>
      <div className="space-y-3">
        <SocialInput icon="telegram" onChange={(value) => onSetField("telegram", value)} placeholder="آیدی تلگرام خود را وارد کنید" value={telegram} />
        <SocialInput icon="whatsapp" onChange={(value) => onSetField("whatsapp", value)} placeholder="شماره واتساپ خود را بدون صفر وارد کنید" value={whatsapp} />
      </div>
    </div>
  );
}
