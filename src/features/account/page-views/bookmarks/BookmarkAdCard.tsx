import {
  mapAdvertisementToAdCard,
  type AdvertisementItem,
} from "../../../advertisements/api/advertisement.service";
import type { BadgeItem } from "../../api/account.service";
import { AdCard, type AdCardData } from "../../../advertisements/components/AdCard";
import { Button } from "../../../../shared/ui/Button";
import LinearDelete from "../../../../shared/icons/LinearDelete";

export function getBadgeAdvertiseSource(badge: BadgeItem): AdvertisementItem {
  return badge.ad ?? badge.advertise ?? badge.advertisement ?? (badge as AdvertisementItem);
}

export function getBadgeAdvertiseId(badge: BadgeItem) {
  const ad = getBadgeAdvertiseSource(badge);
  const id = badge.advertiseId ?? badge.advertise_id ?? ad.id ?? ad._id ?? badge.id ?? badge._id;

  return id === undefined || id === null ? "" : String(id);
}

export function BookmarkAdCard({
  badge,
  disabled,
  onDelete,
}: {
  badge: BadgeItem;
  disabled: boolean;
  onDelete: (advertiseId: string) => void;
}) {
  const advertiseId = getBadgeAdvertiseId(badge);
  const mappedAd = mapAdvertisementToAdCard(getBadgeAdvertiseSource(badge), 0);
  const card = {
    ...mappedAd,
    id: advertiseId || mappedAd.id,
  } satisfies AdCardData;

  return (
    <div className="bg-surface-container-lowest relative">
      <AdCard ad={card} />

      <Button
        unstyled
        aria-label="حذف نشان"
        className="bg-surface-container-lowest text-on-surface absolute top-6 left-6 z-10 grid h-10 w-10 place-items-center rounded-xl shadow-[0_2px_8px_rgba(26,26,26,0.16)] disabled:opacity-50"
        disabled={disabled || !advertiseId}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (advertiseId) {
            onDelete(advertiseId);
          }
        }}
        type="button"
      >
        <LinearDelete className="text-on-surface-var h-6 w-6" />
      </Button>
    </div>
  );
}
