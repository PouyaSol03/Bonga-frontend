import "leaflet/dist/leaflet.css";
import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Toast } from "../../shared/components/Toast";
import { OwnerInfoSection } from "./agency-profile/components/OwnerInfoSection";
import { ContactInfoSection } from "./agency-profile/components/ContactInfoSection";
import { ActivityAreaSection } from "./agency-profile/components/ActivityAreaSection";
import { AboutSection } from "./agency-profile/components/AboutSection";
import { LocationSection } from "./agency-profile/components/LocationSection";
import { AgencyFooterActions } from "./agency-profile/components/AgencyFooterActions";
import { NeighborhoodSelectionSheet } from "./agency-profile/components/NeighborhoodSelectionSheet";
import { useAgencyProfileForm } from "./agency-profile/useAgencyProfileForm";

export function AgencyProfilePage() {
  const form = useAgencyProfileForm();

  return (
    <PageFrame
      className="bg-surface-container-low text-on-surface relative mx-auto flex min-h-0 max-w-[500px] flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account"
        centerClassName="px-0"
        reserveStartSpace
        title="مشخصات آژانس"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <Toast onDismiss={() => form.setToast(null)} toast={form.toast} />

      <main className="min-h-0 flex-1 space-y-2 overflow-x-hidden overflow-y-auto pb-28">
        {form.isAgencyLoading ? (
          <div className="bg-surface-container-lowest text-outline px-4 py-3 text-center text-sm font-medium">
            در حال دریافت اطلاعات آژانس...
          </div>
        ) : null}

        <OwnerInfoSection
          agencyName={form.agencyName}
          agencyNameError={form.agencyNameError}
          isNeighborhoodLoading={form.isNeighborhoodResolving}
          logoPreviewUrl={form.logoPreviewUrl}
          logoUrl={form.logoUrl}
          neighborhood={form.selectedNeighborhood}
          onAgencyNameChange={form.setAgencyName}
          onLogoChange={form.handleLogoChange}
          onOpenNeighborhoodPicker={() => form.setActivePicker("neighborhood")}
        />

        <ContactInfoSection
          address={form.address}
          onAddressChange={form.setAddress}
          onPhone1Change={form.setPhone1}
          onPhone2Change={form.setPhone2}
          onPhone3Change={form.setPhone3}
          onTelegramChange={form.setTelegram}
          onWhatsappChange={form.setWhatsapp}
          onInstagramChange={form.setInstagram}
          phone1={form.phone1}
          phone2={form.phone2}
          phone3={form.phone3}
          telegram={form.telegram}
          whatsapp={form.whatsapp}
          instagram={form.instagram}
        />

        <ActivityAreaSection
          activityAreas={form.selectedActivityAreas}
          error={form.activityAreasError}
          onOpenPicker={() => form.setActivePicker("activity")}
          onRemoveActivityArea={form.removeActivityArea}
        />

        <AboutSection aboutUs={form.aboutUs} onAboutUsChange={form.setAboutUs} />

        <LocationSection mapCenter={form.mapCenter} onMapCenterChange={form.handleMapCenterChange} />
      </main>

      <AgencyFooterActions isSaving={form.isSaving} onSave={form.handleSave} />

      <NeighborhoodSelectionSheet
        mode="single"
        onChange={form.handleNeighborhoodChange}
        onClose={() => form.setActivePicker(null)}
        selectedNeighborhood={form.selectedNeighborhood}
        title="محله"
        isOpen={form.activePicker === "neighborhood"}
      />

      <NeighborhoodSelectionSheet
        mode="multiple"
        onChange={form.setSelectedActivityAreas}
        onClose={() => form.setActivePicker(null)}
        selectedNeighborhoods={form.selectedActivityAreas}
        title="محدوده فعالیت"
        isOpen={form.activePicker === "activity"}
      />
    </PageFrame>
  );
}

export default AgencyProfilePage;
