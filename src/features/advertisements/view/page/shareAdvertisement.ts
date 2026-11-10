import type { ViewAdDetails } from "../viewAdTypes";
import type { ShowViewAdToast } from "./useViewAdToast";

export async function shareAdvertisement(
  adId: string | null,
  isPreview: boolean,
  details: ViewAdDetails,
  showToast: ShowViewAdToast,
) {
  const shareUrl =
    isPreview && adId ? `${window.location.origin}/ads/${adId}` : window.location.href;
  const shareTitle = details.title || document.title;

  try {
    if (navigator.share) {
      await navigator.share({
        text: details.locationTitle || details.description,
        title: shareTitle,
        url: shareUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    showToast("لینک آگهی کپی شد");
  } catch (shareError) {
    if (shareError instanceof DOMException && shareError.name === "AbortError") {
      return;
    }

    showToast("اشتراک‌گذاری با خطا مواجه شد.", "خطا", "error");
  }
}
