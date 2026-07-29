import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { getStoredAuthSession } from "../../../auth/auth-storage";
import { useMyProfileQuery } from "../../../hooks/account.hooks";
import type { NewAdFieldErrorKey, NewAdFieldErrors, NewAdFormValues } from "../types";
import { AdInformationFields } from "../components/AdInformationFields";
import { Footer, InputBox, Section, Toggle } from "../components/NewAdControls";
import { useNewAdDesktopLayout } from "../NewAdLayoutContext";
import { PhotoUploader, VideoUploader } from "../components/MediaUploaders";
import { Typography } from "../../../components/ui/Typography";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 px-4 text-right text-xs font-normal leading-5 text-[#ff3b30]">
      {message}
    </Typography>
  );
}

export function MediaStep({
  errors = {},
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
  const desktop = useNewAdDesktopLayout();
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const values = watch();
  const { data: profile } = useMyProfileQuery();
  const storedMobile = getStoredAuthSession()?.mobile?.trim() ?? "";
  const profileMobile = profile?.mobile?.trim() || storedMobile;
  const profileFullName = [profile?.name, profile?.family]
    .map((part) => part?.trim() ?? "")
    .filter(Boolean)
    .join(" ");
  const isAgencyFlow = values.registrantType === "agency";

  const setField = <T extends keyof NewAdFormValues>(
    key: T,
    value: NewAdFormValues[T],
  ) => {
    setValue(key as never, value as never, { shouldDirty: true });
    onClearError?.(key);

    if (key === "chatEnabled" || key === "phoneEnabled") {
      onClearError?.("contactMethods");
    }
  };

  useEffect(() => {
    if (!isAgencyFlow) return;

    if (!values.chatEnabled) {
      setValue("chatEnabled", true, { shouldDirty: true });
    }
    if (!values.phoneEnabled) {
      setValue("phoneEnabled", true, { shouldDirty: true });
    }
    if (!values.phoneNumber && profileMobile) {
      setValue("phoneNumber", profileMobile, { shouldDirty: true });
    }
    if (!values.ownerFullName && profileFullName) {
      setValue("ownerFullName", profileFullName, { shouldDirty: true });
    }
  }, [
    isAgencyFlow,
    profileFullName,
    profileMobile,
    setValue,
    values.chatEnabled,
    values.ownerFullName,
    values.phoneEnabled,
    values.phoneNumber,
  ]);

  const selectPersonal = () => {
    setField("registrantType", "personal");
    setField("publisherName", "");
    setField("agencyId", "");
    setField("chatEnabled", true);
    setField("phoneEnabled", false);
    setField("phoneNumber", "");
  };

  const selectAgency = () => {
    setField("registrantType", "agency");
    setField("publisherName", "");
    setField("agencyId", "");
    setField("chatEnabled", true);
    setField("phoneEnabled", true);

    if (profileMobile) setField("phoneNumber", profileMobile);
    if (!values.ownerFullName && profileFullName) {
      setField("ownerFullName", profileFullName);
    }
  };

  const primaryLabel = submitDisabled
    ? isAgencyFlow
      ? "در حال آماده‌سازی..."
      : "در حال ثبت..."
    : isAgencyFlow
      ? "انتخاب آژانس"
      : "ثبت آگهی";

  return (
    <>
      <main
        className={
          desktop
            ? "min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f5f7fb] px-6 py-5 [&>section]:mx-auto [&>section]:mb-5 [&>section]:max-w-[1120px]"
            : "min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-3"
        }
        dir="rtl"
      >
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
          {values.hasVideo ? (
            <VideoUploader onChange={() => onClearError?.("video")} />
          ) : null}
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
          <AdInformationFields
            errors={errors}
            label={label}
            mobile={profileMobile || values.phoneNumber}
            onSelectAgency={selectAgency}
            onSelectPersonal={selectPersonal}
            onSetField={setField}
            values={values}
          />
        </Section>
      </main>

      <Footer
        disabled={submitDisabled}
        onBack={onBack}
        onPrimary={onSubmit}
        primary={primaryLabel}
      />
    </>
  );
}
