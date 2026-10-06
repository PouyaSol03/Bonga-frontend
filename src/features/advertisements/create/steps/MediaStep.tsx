import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { getActiveAuthRole, getStoredAuthSession } from "../../../../shared/auth/auth-storage";
import { getApiAssetUrl } from "../../../../shared/api/api";
import { useMyAgencyProfileQuery, useMyProfileQuery } from "../../../account/api/account.hooks";
import { useAgencyConsultantsQuery } from "../../../agencies/api/agency.hooks";
import type { NewAdFieldErrorKey, NewAdFieldErrors, NewAdFormValues } from "../types";
import { AdInformationFields } from "../components/AdInformationFields";
import { Footer, InputBox, Section, Toggle } from "../components/NewAdControls";
import { useNewAdDesktopLayout } from "../NewAdLayoutContext";
import { getParams } from "../utils";
import { PhotoUploader, VideoUploader } from "../components/MediaUploaders";
import { Typography } from "../../../../shared/ui/Typography";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 px-4 text-right text-xs font-normal leading-5 text-error" data-field-error="true">
      {message}
    </Typography>
  );
}

export function MediaStep({
  errors = {},
  isAssigned = false,
  label,
  onBack,
  onChangePublisher,
  onClearError,
  onSubmit,
  submitDisabled = false,
}: {
  errors?: NewAdFieldErrors;
  forceFullEditFields?: boolean;
  isAssigned?: boolean;
  label: string;
  onBack: () => void;
  onChangePublisher?: () => void;
  onClearError?: (key: NewAdFieldErrorKey) => void;
  onSubmit: () => void;
  submitDisabled?: boolean;
}) {
  const desktop = useNewAdDesktopLayout();
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const values = watch();
  const publisherType = getParams().publisherType?.toLowerCase() ?? "";
  const session = getStoredAuthSession();
  const activeRole = getActiveAuthRole(session);
  const isProfessionalPublisher =
    publisherType === "agency" ||
    publisherType === "agent" ||
    activeRole === "real_estate_manager" ||
    activeRole === "independent_consultant" ||
    activeRole === "real_estate_consultant";
  const isAgencyPublisher = publisherType === "agency" || activeRole === "real_estate_manager";
  const { data: profile } = useMyProfileQuery();
  const { data: agencyProfile } = useMyAgencyProfileQuery({
    enabled: isAgencyPublisher || activeRole === "real_estate_consultant",
  });
  const { data: consultantsPage } = useAgencyConsultantsQuery({
    enabled: isAgencyPublisher && Boolean(values.consultantId),
    page: 1,
    perPage: 100,
  });
  const allowAssignmentChoice = activeRole === "user";
  const storedMobile = session?.mobile?.trim() ?? "";
  const meShowMobile = profile?.mobile?.trim() || profile?.phone?.trim() || "";
  const profileMobile = profile?.mobile?.trim() || storedMobile;
  const profileFullName = [profile?.name, profile?.family]
    .map((part) => part?.trim() ?? "")
    .filter(Boolean)
    .join(" ");
  const selectedConsultant = values.consultantId
    ? consultantsPage?.data.find(
        (consultant) =>
          String(consultant.agentId) === String(values.consultantId) ||
          String(consultant.userId) === String(values.consultantId),
      )
    : undefined;
  const isIndependent = activeRole === "independent_consultant";
  const isAgencyConsultant =
    Boolean(values.consultantId) || activeRole === "real_estate_consultant";
  const agencyPublisherIsConsultant = isIndependent || isAgencyConsultant;

  const isIndependentUser = activeRole === "independent_consultant";
  const isAgencyConsultantUser =
    activeRole === "real_estate_consultant" ||
    publisherType === "agent" ||
    publisherType === "consultant";
  const canChangePublisher =
    !isIndependentUser &&
    !isAgencyConsultantUser &&
    isAgencyPublisher;

  const agencyPublisherName = agencyPublisherIsConsultant
    ? selectedConsultant?.name?.trim() ||
      (profileFullName ? profileFullName : undefined) ||
      values.publisherName?.trim() ||
      "مشاور"
    : agencyProfile?.name?.trim() ||
      values.publisherName?.trim() ||
      "آژانس";

  const agencyPublisherLogoUrl = getApiAssetUrl(
    agencyPublisherIsConsultant
      ? selectedConsultant?.avatar?.trim() || profile?.avatar?.trim() || ""
      : agencyProfile?.logo?.trim() || agencyProfile?.img?.trim() || "",
  );

  const agencyPublisherSubtitle = isIndependent
    ? "مشاور مستقل"
    : isAgencyConsultant
      ? "مشاور آژانس"
      : "آژانس";
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
    if (allowAssignmentChoice || values.registrantType === "personal") return;
    setValue("registrantType", "personal", { shouldDirty: false });
    setValue("agencyId", "", { shouldDirty: false });
    setValue("publisherName", "", { shouldDirty: false });
  }, [allowAssignmentChoice, setValue, values.registrantType]);

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
    setField("phoneEnabled", true);
    if (profileMobile && !values.phoneNumber) {
      setField("phoneNumber", profileMobile);
    }
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
      : "ثبت اطلاعات";

  const isPersonalFlow = values.registrantType === "personal";
  const hasContactMethod = Boolean(values.chatEnabled || values.phoneEnabled);
  const isButtonDisabled =
    submitDisabled || (isPersonalFlow && !isAgencyPublisher && !hasContactMethod);

  return (
    <>
      <main
        className={
          desktop
            ? "min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container px-6 py-5 [&>section]:mx-auto [&>section]:mb-5 [&>section]:max-w-[1120px]"
            : "min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container-lowest pb-3"
        }
        dir="rtl"
      >
        <Section icon="image.svg" title="عکس آگهی" warning>
          <div data-field-key="photos">
            <PhotoUploader onChange={() => onClearError?.("photos")} />
            <FieldError message={errors.photos} />
          </div>
          <div>
            <Toggle
              checked={values.images_belong_to_ad}
              label="عکسها متعلق به آگهی میباشد"
              onChange={(checked) => setField("images_belong_to_ad", checked)}
            />
          </div>
          <div>
            <Toggle
              checked={values.hasVideo}
              label="فیلم"
              onChange={(checked) => {
                setField("hasVideo", checked);
                onClearError?.("video");
                if (!checked) setField("video", null);
              }}
            />
          </div>
          {values.hasVideo ? (
            <div data-field-key="video">
              <VideoUploader onChange={() => onClearError?.("video")} />
            </div>
          ) : null}
          <FieldError message={values.hasVideo ? errors.video : undefined} />
          <div>
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
            <div data-field-key="virtualTourLink" className="mt-3">
              <InputBox
                error={errors.virtualTourLink}
                floatingLabel="لینک تور مجازی"
                onChange={(value) => setField("virtualTourLink", value)}
                placeholder="لینک تور مجازی را وارد کنید"
                value={values.virtualTourLink}
              />
            </div>
          ) : null}
        </Section>

        <Section icon="info.svg" title="اطلاعات آگهی" warning>
          <AdInformationFields
            agencyPublisherIsConsultant={agencyPublisherIsConsultant}
            agencyPublisherLogoUrl={agencyPublisherLogoUrl}
            agencyPublisherName={agencyPublisherName}
            agencyPublisherSubtitle={agencyPublisherSubtitle}
            allowAssignmentChoice={allowAssignmentChoice}
            canChangePublisher={canChangePublisher}
            errors={errors}
            isAssigned={isAssigned}
            isProfessionalPublisher={isProfessionalPublisher}
            label={label}
            mobile={profileMobile || values.phoneNumber}
            onChangePublisher={canChangePublisher ? onChangePublisher : undefined}
            onSelectAgency={selectAgency}
            onSelectPersonal={selectPersonal}
            onSetField={setField}
            profileMobile={meShowMobile}
            publisherType={publisherType}
            values={values}
          />
        </Section>
      </main>

      <Footer
        disabled={isButtonDisabled}
        onBack={onBack}
        onPrimary={onSubmit}
        primary={primaryLabel}
      />

    </>
  );
}
