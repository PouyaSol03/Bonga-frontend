import { useEffect, useState } from "react";
import { useToggleAdvertiseBadgeMutation } from "../../../account/api/account.hooks";
import type { AdvertisementItem } from "../../api/advertisement.service";
import { getApiErrorMessage, isUnauthorizedApiError } from "../../../../shared/api/api";
import { readAdvertisementBookmarkState } from "./advertisementStatus";
import type { useViewAdNavigation } from "./useViewAdNavigation";
import type { ShowViewAdToast } from "./useViewAdToast";

type Props = Pick<
  ReturnType<typeof useViewAdNavigation>,
  "adId" | "requireAuthorization" | "navigateToLoginRequiredPage"
> & { ad?: AdvertisementItem; showToast: ShowViewAdToast };

export function useViewAdBookmark({
  ad,
  adId,
  requireAuthorization,
  navigateToLoginRequiredPage,
  showToast,
}: Props) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const toggleBadge = useToggleAdvertiseBadgeMutation();
  useEffect(() => {
    const bookmarkState = readAdvertisementBookmarkState(ad);

    if (bookmarkState !== undefined) {
      setIsBookmarked(bookmarkState);
    }
  }, [ad]);

  const toggle = () => {
    if (!requireAuthorization("نشان کردن آگهی")) return;

    if (!adId || toggleBadge.isPending) {
      return;
    }

    const previousBookmarkedState = isBookmarked;
    const nextBookmarkedState = !previousBookmarkedState;

    setIsBookmarked(nextBookmarkedState);
    toggleBadge.mutate(adId, {
      onError: (badgeError) => {
        setIsBookmarked(previousBookmarkedState);

        if (isUnauthorizedApiError(badgeError)) {
          navigateToLoginRequiredPage("نشان کردن آگهی");
          return;
        }

        showToast(getApiErrorMessage(badgeError, "ثبت نشان با خطا مواجه شد."), "خطا", "error");
      },
      onSuccess: () => {
        showToast(nextBookmarkedState ? "آگهی به نشان‌ها اضافه شد" : "آگهی از نشان‌ها حذف شد");
      },
    });
  };
  return { isBookmarked, toggle };
}
