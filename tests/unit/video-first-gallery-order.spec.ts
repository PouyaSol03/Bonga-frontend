import { describe, expect, it } from "vitest";
import { buildGalleryMediaItems } from "../../src/features/advertisements/view/details/adMedia";

describe("Video-first gallery media order", () => {
  it("places video items before image items in buildGalleryMediaItems", () => {
    const items = buildGalleryMediaItems({
      id: 1,
      images: [{ url: "/img1.jpg" }, { url: "/img2.jpg" }],
      video: "/video1.mp4",
    });

    expect(items.map((item) => item.type)).toEqual(["video", "image", "image"]);
  });

  it("reads videos from videos array as well as singular video field", () => {
    const items = buildGalleryMediaItems({
      id: 2,
      images: [{ url: "/img1.jpg" }],
      videos: [{ url: "/v1.mp4" }, "/v2.mp4"],
    } as never);

    expect(items.map((item) => item.type)).toEqual(["video", "video", "image"]);
  });
});
