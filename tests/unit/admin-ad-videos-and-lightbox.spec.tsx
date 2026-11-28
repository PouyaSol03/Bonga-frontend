import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { AdvertiseGallerySection } from "../../src/features/crm/advertise-detail/components/AdvertiseGallerySection";

describe("Admin Ad Videos, Lightbox, Media Icons, and Persian Form Name", () => {
  let root: Root | null = null;
  let container: HTMLDivElement | null = null;

  afterEach(async () => {
    if (root) {
      await act(async () => root?.unmount());
      root = null;
    }
    container?.remove();
    container = null;
  });

  it("renders admin gallery with video first, lightbox on image click, conditional 3D/video icons, and Persian form name", async () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    await act(async () => {
      root?.render(
        <AdvertiseGallerySection
          area={120}
          createdAt="امروز"
          formCode="sale-villa-house"
          hasVideo
          images={["/img1.jpg"]}
          locationTitle="رضا شهر"
          pricePresentation={{
            primaryLabel: "قیمت",
            primaryValue: "۱۰ میلیارد",
            secondaryLabel: "",
            secondaryValue: "",
          }}
          rooms={2}
          title="ویلایی"
          trackCode="961994"
          videos={["/video1.mp4"]}
          virtualTourLink="https://example.com/tour"
        />,
      );
    });

    expect(container.querySelector("video")).toBeTruthy();
    expect(container.querySelector('[aria-label="دارای ویدیو"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="دارای تور مجازی ۳D"]')).toBeTruthy();
    expect(container.textContent).toContain("فروش خانه ویلایی");
    expect(container.textContent).not.toContain("بدون ویدیو");
    expect(container.textContent).not.toContain("بدون تور");

    const thumbButtons = Array.from(container.querySelectorAll("button"));
    const imageThumb = thumbButtons.find((btn) => btn.querySelector('img[src="/img1.jpg"]'));
    await act(async () => {
      imageThumb?.click();
    });

    const zoomBtn = container.querySelector(
      'button[aria-label="مشاهده تمام تصاویر"]',
    ) as HTMLButtonElement;
    expect(zoomBtn).toBeTruthy();
    await act(async () => {
      zoomBtn.click();
    });

    expect(container.querySelector('button[aria-label="بستن آلبوم"]')).toBeTruthy();
  });
});
