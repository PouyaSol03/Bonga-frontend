import TonalInstagram from "../../../../shared/icons/TonalInstagram";
import TonalTelegram from "../../../../shared/icons/TonalTelegram";
import TonalWhatsapp from "../../../../shared/icons/TonalWhatsapp";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { AgentProfileFormProps } from "../types";
import { ActivityAreaSection } from "./ActivityAreaSection";
import { Field, FieldError, Section, Separator } from "./ProfileFields";
import { ProfileImageHelpText, ProfileImageUploader } from "./ProfileImageUploader";

export function AgentProfileMobileForm({
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
    <>
      <main className="min-h-0 flex-1 space-y-2 overflow-x-hidden overflow-y-auto pb-24">
        {isLoading ? (
          <div className="bg-surface-container-lowest text-outline px-4 py-3 text-center text-sm font-medium">
            در حال دریافت اطلاعات مشاور...
          </div>
        ) : null}

        <Section title="اطلاعات مشاور">
          <div className="flex items-end justify-between gap-4">
            <ProfileImageUploader
              avatarPreviewUrl={avatarPreviewUrl}
              avatarUrl={avatarUrl}
              onChange={onAvatarChange}
            />
            <ProfileImageHelpText />
          </div>
          <div className="mt-4">
            <Field onChange={onNameChange} placeholder="نام مشاور" value={name} />
            {nameError ? <FieldError message={nameError} /> : null}
          </div>
        </Section>

        <Section title="اطلاعات تماس">
          <div className="mt-4 grid gap-3">
            <Field onChange={onPhoneChange} placeholder="شماره تماس" value={phone} />
            <Field onChange={onEmailChange} placeholder="ایمیل" value={email} />
          </div>
          <Separator />
          <div className="grid gap-3">
            <Typography
              as="h3"
              variant="title"
              size="medium"
              weight="semibold"
              className="m-0 text-right text-base leading-6 font-semibold"
            >
              شبکه‌های اجتماعی
            </Typography>
            <Field
              icon={<TonalTelegram className="h-6 w-6" />}
              onChange={onTelegramChange}
              placeholder="آیدی تلگرام بدون @"
              value={telegram}
            />
            <Field
              icon={<TonalWhatsapp className="h-6 w-6" />}
              onChange={onWhatsappChange}
              placeholder="شماره واتساپ بدون صفر"
              value={whatsapp}
            />
            <Field
              icon={<TonalInstagram className="h-6 w-6" />}
              onChange={onInstagramChange}
              placeholder="آیدی اینستاگرام بدون @"
              value={instagram}
            />
          </div>
        </Section>

        <ActivityAreaSection
          activityAreas={activityAreas}
          error={activityAreasError}
          onOpenPicker={onOpenActivityAreaPicker}
          onRemoveActivityArea={onActivityAreaRemove}
        />
      </main>

      <footer className="border-outline-var bg-surface-container-lowest absolute inset-x-0 bottom-0 z-10 border-t px-4 pt-3 pb-[max(8px,env(safe-area-inset-bottom))]">
        <Button
          unstyled
          className="bg-primary text-on-primary h-10 w-full rounded-lg text-sm font-medium disabled:opacity-60"
          disabled={isSaving}
          onClick={() => void onSave()}
          type="button"
        >
          {isSaving ? "در حال ذخیره..." : "ذخیره اطلاعات"}
        </Button>
      </footer>
    </>
  );
}
