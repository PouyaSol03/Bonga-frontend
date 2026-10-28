import type { AdvertisementItem } from "../../api/advertisement.service";
import type { ViewAdDetails } from "../viewAdTypes";
import {
  clearConsultantsSelectedNeighborhood,
  saveConsultantsSelectedNeighborhood,
} from "../../../consultants/consultantsNeighborhoodSelection";
import { getAdvertisementNeighborhood } from "./advertisementNeighborhood";
import type { useViewAdNavigation } from "./useViewAdNavigation";
import type { ShowViewAdToast } from "./useViewAdToast";
import type { useViewAdSubmissions } from "./useViewAdSubmissions";

type Props = Pick<ReturnType<typeof useViewAdNavigation>, "navigate" | "requireAuthorization"> & {
  resolvedAd: AdvertisementItem;
  details: ViewAdDetails;
  showToast: ShowViewAdToast;
  submissions: ReturnType<typeof useViewAdSubmissions>;
};

export function createViewAdRowAction({
  navigate,
  requireAuthorization,
  resolvedAd,
  details,
  showToast,
  submissions,
}: Props) {
  const handleRowAction = (label: string) => {
    if (label.includes("آژانس") && label.includes("محله")) {
      const neighborhood = getAdvertisementNeighborhood(resolvedAd, details);

      if (neighborhood) {
        saveConsultantsSelectedNeighborhood(
          {
            city_id: neighborhood.cityId,
            id: neighborhood.id,
            name: neighborhood.name,
          },
          neighborhood.cityId,
        );
      } else {
        clearConsultantsSelectedNeighborhood();
      }

      navigate("/consultants");
      return;
    }

    if (label.includes("بازخورد")) {
      if (!requireAuthorization("ثبت بازخورد")) return;

      submissions.feedback.setIsOpen(true);
      return;
    }

    if (label.includes("یادداشت")) {
      if (!requireAuthorization("ثبت یادداشت")) return;

      submissions.note.setIsOpen(true);
      return;
    }

    if (label.includes("گزارش") || label.includes("تخلف")) {
      if (!requireAuthorization("ارسال گزارش تخلف")) return;

      submissions.report.setIsOpen(true);
      return;
    }

    showToast(`${label} هنوز به سرویس مربوطه متصل نشده است.`, "اطلاع", "info");
  };

  return handleRowAction;
}
