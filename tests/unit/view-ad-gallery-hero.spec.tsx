import { describe, expect, it, vi } from "vitest";
import { render } from "../render";
import { GalleryHero } from "../../src/features/advertisements/view/page/GalleryHero";
import type { AlbumMediaItem } from "../../src/features/advertisements/view/viewAdDetails";

describe("GalleryHero dots navigation & media count", () => {
  it("renders total image count in badge and shows all dots for media items", async () => {
    const mediaItems: AlbumMediaItem[] = [
      { src: "/img1.jpg", type: "image" },
      { src: "/img2.jpg", type: "image" },
      { src: "/img3.jpg", type: "image" },
      { src: "/img4.jpg", type: "image" },
    ];

    const container = await render(
      <GalleryHero mediaItems={mediaItems} onOpenAlbum={vi.fn()} />,
    );

    // Check top badge text shows total image count (۴)
    const badgeText = container.textContent;
    expect(badgeText).toContain("۴");

    // Check that dots exist for all items
    const dots = container.querySelectorAll('button[aria-label^="نمایش تصویر"]');
    expect(dots.length).toBe(4);

    // First dot should be active (wider width w-5)
    expect(dots[0].className).toContain("w-5");
    expect(dots[1].className).toContain("w-1.5");
  });

  it("renders all dots when there are more than 4 images (e.g. 6 images)", async () => {
    const mediaItems: AlbumMediaItem[] = [
      { src: "/img1.jpg", type: "image" },
      { src: "/img2.jpg", type: "image" },
      { src: "/img3.jpg", type: "image" },
      { src: "/img4.jpg", type: "image" },
      { src: "/img5.jpg", type: "image" },
      { src: "/img6.jpg", type: "image" },
    ];

    const container = await render(
      <GalleryHero mediaItems={mediaItems} onOpenAlbum={vi.fn()} />,
    );

    // Check top badge text shows total (۶)
    expect(container.textContent).toContain("۶");

    // All 6 dots should be rendered, not sliced to 4
    const dots = container.querySelectorAll('button[aria-label^="نمایش تصویر"]');
    expect(dots.length).toBe(6);
  });

  it("does not render pagination dots when there is only 1 image", async () => {
    const mediaItems: AlbumMediaItem[] = [{ src: "/img1.jpg", type: "image" }];

    const container = await render(
      <GalleryHero mediaItems={mediaItems} onOpenAlbum={vi.fn()} />,
    );

    // With 1 image, badge shows "۱"
    expect(container.textContent).toContain("۱");

    // Dots should not be rendered
    const dots = container.querySelectorAll('button[aria-label^="نمایش تصویر"]');
    expect(dots.length).toBe(0);
  });
});
