import type { AdvertisementItem } from "../../api/advertisement.service";
import { AgencyUserContactBottomSheet } from "../components/AgencyUserContactBottomSheet";
import { AgencyOwnerContactBottomSheet } from "../components/AgencyOwnerContactBottomSheet";
import { ContactInfoBottomSheet } from "./ContactInfoBottomSheet";
import type { useViewAdContact } from "./useViewAdContact";
import type { ViewAdPresentation } from "./viewAdPresentation";

type Props = Pick<ViewAdPresentation, "agencyUserContact" | "contactInfo"> & {
  ad: AdvertisementItem;
  adId: string;
  isPreview: boolean;
  useAgencyAllocationPreview: boolean;
  showAgencyOwnerContact: boolean;
  refetch: () => unknown;
  contact: ReturnType<typeof useViewAdContact>;
};

export function ViewAdContactSheets({
  ad,
  adId,
  isPreview,
  useAgencyAllocationPreview,
  showAgencyOwnerContact,
  agencyUserContact,
  contactInfo,
  refetch,
  contact,
}: Props) {
  return (
    <>
      {useAgencyAllocationPreview ? (
        <AgencyUserContactBottomSheet
          contact={agencyUserContact}
          isOpen={contact.isAgencyContactSheetOpen}
          onClose={contact.closeAgency}
        />
      ) : isPreview ? (
        showAgencyOwnerContact ? (
          <AgencyOwnerContactBottomSheet
            adId={String(ad?.id ?? adId)}
            isOpen={contact.isOwnerContactSheetOpen}
            onClose={contact.closeOwner}
            onUpdated={() => {
              void refetch();
            }}
            ownerContactAddress={
              typeof ad?.owner_contact_address === "string" ? ad.owner_contact_address : undefined
            }
            ownerContactName={
              typeof ad?.owner_contact_name === "string" ? ad.owner_contact_name : undefined
            }
            ownerContactPhone={
              typeof ad?.owner_contact_phone === "string" ? ad.owner_contact_phone : undefined
            }
          />
        ) : null
      ) : (
        <ContactInfoBottomSheet
          contactInfo={contactInfo}
          isOpen={contact.isContactSheetOpen}
          onClose={contact.closeContact}
        />
      )}
    </>
  );
}
