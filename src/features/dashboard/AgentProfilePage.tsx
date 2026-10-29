import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { isDesktopDashboard } from "./agent-profile/agentProfileHelpers";
import { AgentProfileForm } from "./agent-profile/components/AgentProfileForm";
import { AgentProfileSkeleton } from "./agent-profile/components/AgentProfileSkeleton";
import { NeighborhoodSelectionSheet } from "./agent-profile/components/NeighborhoodSelectionSheet";
import { useAgentProfileForm } from "./agent-profile/useAgentProfileForm";

export function AgentProfilePage() {
  const desktop = isDesktopDashboard();
  const form = useAgentProfileForm();

  const formContent = form.isLoading ? (
    <AgentProfileSkeleton desktop={desktop} />
  ) : (
    <AgentProfileForm
      activityAreas={form.activityAreas}
      activityAreasError={form.activityAreasError}
      avatarPreviewUrl={form.avatarPreviewUrl}
      avatarUrl={form.avatarUrl}
      desktop={desktop}
      email={form.email}
      instagram={form.instagram}
      isLoading={form.isLoading}
      isSaving={form.isSaving}
      name={form.name}
      nameError={form.nameError}
      onActivityAreaRemove={(id) =>
        form.setSelectedActivityAreas((current) => current.filter((area) => area.id !== id))
      }
      onAvatarChange={form.handleAvatarChange}
      onEmailChange={form.setEmail}
      onInstagramChange={form.setInstagram}
      onNameChange={form.setName}
      onOpenActivityAreaPicker={() => form.setIsNeighborhoodPickerOpen(true)}
      onPhoneChange={form.setPhone}
      onSave={form.handleSave}
      onTelegramChange={form.setTelegram}
      onWhatsappChange={form.setWhatsapp}
      phone={form.phone}
      telegram={form.telegram}
      whatsapp={form.whatsapp}
    />
  );

  return (
    <>
      {desktop ? (
        <div className="bg-surface-container-lowest text-on-surface min-h-full rounded-xl px-6 pt-6 pb-12 [direction:rtl]">
          {formContent}
        </div>
      ) : (
        <PageFrame
          className="bg-surface-container-low text-on-surface relative mx-auto flex min-h-0 max-w-[500px] flex-col overflow-hidden [direction:rtl]"
          variant="flush"
        >
          <TopBar
            backTo="/account"
            centerClassName="px-0"
            reserveStartSpace
            title="مشخصات مشاور"
            titleClassName="text-center text-sm font-semibold leading-5"
          />
          {formContent}
        </PageFrame>
      )}

      <NeighborhoodSelectionSheet
        cityId={form.cityId}
        cityName={form.cityName}
        isOpen={form.isNeighborhoodPickerOpen}
        onChange={form.setSelectedActivityAreas}
        onClose={() => form.setIsNeighborhoodPickerOpen(false)}
        selectedNeighborhoods={form.activityAreas}
      />
    </>
  );
}
