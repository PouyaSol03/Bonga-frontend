import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import TonalInstagram from "../../../../shared/icons/TonalInstagram";
import TonalTelegram from "../../../../shared/icons/TonalTelegram";
import TonalWhatsapp from "../../../../shared/icons/TonalWhatsapp";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { AgentProfileFormProps } from "../types";
import { ActivityAreaSection } from "./ActivityAreaSection";
import { DesktopField, DesktopSectionTitle, FieldError } from "./ProfileFields";
import { ProfileImageUploader } from "./ProfileImageUploader";

export function AgentProfileDesktopForm({
  activityAreas,
  activityAreasError,
  avatarPreviewUrl,
  avatarUrl,
  email,
  instagram,
  isLoading,
  isSaving,
  name,
  nameError,
  onActivityAreaRemove,
  onAvatarChange,
  onEmailChange,
  onInstagramChange,
  onNameChange,
  onOpenActivityAreaPicker,
  onPhoneChange,
  onSave,
  onTelegramChange,
  onWhatsappChange,
  phone,
  telegram,
  whatsapp,
}: AgentProfileFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSave();
      }}
    >
      <DesktopSectionTitle icon={<LinearInfoCircle className="h-5 w-5" />} title="مشخصات" />
      {isLoading ? (
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="medium"
          className="text-outline m-0 mt-5 text-right text-sm font-medium"
        >
          در حال دریافت اطلاعات مشاور...
        </Typography>
      ) : null}

      <div className="mt-7 flex flex-wrap items-end gap-8">
        <ProfileImageUploader
          avatarPreviewUrl={avatarPreviewUrl}
          avatarUrl={avatarUrl}
          desktop
          onChange={onAvatarChange}
        />
        <div className="max-w-[520px] min-w-[280px] flex-1">
          <DesktopField
            label="نام مشاور"
            onChange={onNameChange}
            placeholder="نام مشاور"
            value={name}
          />
          {nameError ? <FieldError message={nameError} /> : null}
        </div>
      </div>

      <section className="mt-14">
        <DesktopSectionTitle title="اطلاعات تماس" />
        <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-2">
          <DesktopField
            label="شماره تماس"
            onChange={onPhoneChange}
            placeholder="شماره تماس"
            value={phone}
          />
          <DesktopField
            label="ایمیل"
            onChange={onEmailChange}
            placeholder="ایمیل"
            value={email}
          />
        </div>

        <Typography
          as="h3"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface m-0 mt-7 text-right text-base leading-6 font-semibold"
        >
          شبکه‌های اجتماعی
        </Typography>
        <div className="mt-4 grid grid-cols-1 gap-7 lg:grid-cols-3">
          <DesktopField
            icon={<TonalTelegram className="h-6 w-6" />}
            onChange={onTelegramChange}
            placeholder="آیدی تلگرام بدون @"
            value={telegram}
          />
          <DesktopField
            icon={<TonalWhatsapp className="h-6 w-6" />}
            onChange={onWhatsappChange}
            placeholder="شماره واتساپ بدون صفر"
            value={whatsapp}
          />
          <DesktopField
            icon={<TonalInstagram className="h-6 w-6" />}
            onChange={onInstagramChange}
            placeholder="آیدی اینستاگرام بدون @"
            value={instagram}
          />
        </div>
      </section>

      <section className="mt-14">
        <ActivityAreaSection
          activityAreas={activityAreas}
          error={activityAreasError}
          onOpenPicker={onOpenActivityAreaPicker}
          onRemoveActivityArea={onActivityAreaRemove}
        />
      </section>

      <div className="mt-14 flex justify-start">
        <Button
          unstyled
          className="bg-primary text-on-primary h-14 rounded-xl px-7 text-base leading-6 font-semibold disabled:opacity-60"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? "در حال ذخیره..." : "ذخیره اطلاعات"}
        </Button>
      </div>
    </form>
  );
}
