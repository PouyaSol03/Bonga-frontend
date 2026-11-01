import { describe, expect, it } from "vitest";
import type { AdvertisementItem } from "../../src/features/advertisements/api/advertisement.service";
import type { ViewAdDetails } from "../../src/features/advertisements/view/viewAdTypes";
import type { ChatThread } from "../../src/features/chat/api/chat.service";
import { isPublishedAdvertisement as published, readAdvertisementBookmarkState } from "../../src/features/advertisements/view/page/advertisementStatus";
import { readContactInfo } from "../../src/features/advertisements/view/page/contactInfo";
import { getAdvertisementNeighborhood } from "../../src/features/advertisements/view/page/advertisementNeighborhood";
import { formatRentNumberText as rent } from "../../src/features/advertisements/view/page/rentNumberText";
import { getChatThreadId } from "../../src/features/advertisements/view/page/chatThreadId";

const contact = (ad: unknown) => readContactInfo(ad as AdvertisementItem);
const neighborhood = (ad: unknown, details: unknown) => getAdvertisementNeighborhood(ad as AdvertisementItem, details as ViewAdDetails);
const threadId = (thread: unknown) => getChatThreadId(thread as ChatThread);
const bookmark = (ad: unknown) => readAdvertisementBookmarkState(ad as AdvertisementItem | undefined);

describe("view ad adapters", () => {
  it.each(["published", "accepted", "3", "منتشر شده"])("recognizes published status %s", (status) => expect(published({ status })).toBe(true));
  it("rejects missing and unpublished ads", () => {
    expect(published(null)).toBe(false);
    expect(published({ status: "draft" })).toBe(false);
  });
  it("preserves contact precedence and explicit disabled chat", () => {
    expect(contact({ contacts: { phone: 123, instagram: " @first ", chat: false }, social: { instagram: "second", telegram: " @fallback " }, contact_type: ["CHAT"] })).toEqual({ phone: "123", instagram: "@first", telegram: "@fallback", whatsapp: "", chat: false });
    expect(contact({ contact_type: [" CHAT "] }).chat).toBe(true);
    expect(contact({}).chat).toBe(false);
  });
  it("preserves neighborhood aliases, numeric ids and location fallback", () => {
    expect(neighborhood({ neighborhood: { id: 12, name: " نیاوران " }, city_id: 7 }, { locationTitle: "تهران" })).toEqual({ id: "12", name: "نیاوران", cityId: "7" });
    expect(neighborhood({ neighborhood_id: "9" }, { locationTitle: "تهران، محله ونک" })).toEqual({ id: "9", name: "ونک", cityId: undefined });
    expect(neighborhood({}, { locationTitle: "ونک" })).toBeNull();
    expect(neighborhood({ neighborhood_id: "9" }, { locationTitle: "تهران" })).toMatchObject({ name: "تهران" });
  });
  it.each([[0, "۰"], [-2, "۰"], [1_000_000, "۱ میلیون"], [1_250_000, "۱.۳ میلیون"], [1_000_000_000, "۱ میلیارد"], [1_250_000_000, "۱۲۵۰ میلیون"]])("formats rental amount %s", (value, expected) => expect(rent(value)).toBe(expected));
  it("normalizes chat ids without losing nullish precedence", () => {
    expect(threadId({ id: " 12 " })).toBe("12");
    expect(threadId({ _id: 4 })).toBe("4");
    expect(threadId({ id: "", _id: 4 })).toBe("");
    expect(threadId({ id: Infinity })).toBe("");
  });
  it("only synchronizes boolean bookmark values", () => {
    expect(bookmark({ is_bookmarked: false })).toBe(false);
    expect(bookmark({ is_bookmarked: true })).toBe(true);
    expect(bookmark({ is_bookmarked: 1 })).toBeUndefined();
    expect(bookmark(undefined)).toBeUndefined();
  });
});
