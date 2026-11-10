import { describe, expect, it } from "vitest";
import { areResponseDaysEqual, formatParticipantAvailabilityDays, formatParticipantAvailabilityTime, sortResponseDays } from "../../src/features/chat/home/responseAvailability";
import { dedupeChatMessages, getChatMessageDedupeKey, isOutgoingChatMessage, isReadChatMessage } from "../../src/features/chat/home/messageIdentity";
import { mapChatThreadToChatItem } from "../../src/features/chat/home/mapChatThread";
import { parseChatDate } from "../../src/features/chat/home/chatDates";
import { readChatMessageAttachment, readChatMessageBody, readChatMessageLocation } from "../../src/features/chat/home/messageContent";
import { readPathBoolean } from "../../src/features/chat/home/readChatValues";

describe("chat normalization characterization", () => {
  it("preserves alias precedence, whitespace and boolean coercion", () => {
    expect(readChatMessageBody({ body: "  body  ", text: "fallback" })).toBe("  body  ");
    expect(readChatMessageBody({ body: " ", data: { text: "nested" } })).toBe("nested");
    expect(readPathBoolean({ first: "false", second: true }, ["first", "second"])).toBe(false);
    expect(readPathBoolean({ first: "TRUE" }, ["first"])).toBeUndefined();
  });
  it("normalizes attachment and location metadata without inventing coordinates", () => {
    expect(readChatMessageAttachment({ metadata: { attachment_url: "https://a.test/x" } }))
      .toEqual({ attachmentUrl: "https://a.test/x", imageUrl: "https://a.test/x", fileName: "تصویر ارسالی" });
    expect(readChatMessageLocation({ metadata: { lat: 0, lng: "51.4" } }))
      .toEqual({ latitude: 0, longitude: 51.4, mapsUrl: "https://www.google.com/maps?q=0,51.4" });
    expect(readChatMessageLocation({ lat: "bad" }).mapsUrl).toBe("");
  });
  it("keeps first duplicate identity; stable IDs precede fallback keys", () => {
    const first = { id: "a", body: "first" };
    const second = { id: "a", body: "second" };
    expect(dedupeChatMessages([first, second])).toEqual([first]);
    expect(dedupeChatMessages([first, second])[0]).toBe(first);
    expect(getChatMessageDedupeKey(first)).toBe("id:a");
    expect(dedupeChatMessages([{ body: "x" }, { text: "x" }])).toHaveLength(1);
    expect(dedupeChatMessages([{ body: "x", sender_id: 1 }, { body: "x", sender_id: 2 }])).toHaveLength(2);
  });
  it("preserves strict outgoing/read flags and sender matching", () => {
    expect(isOutgoingChatMessage({ is_mine: "true" } as never, "")).toBe(false);
    expect(isOutgoingChatMessage({ sender: { id: 12 } }, "12")).toBe(true);
    expect(isOutgoingChatMessage({ sender_id: "" }, "")).toBe(false);
    expect(isReadChatMessage({ read_by: [1] })).toBe(true);
    expect(isReadChatMessage({ is_read: "true" } as never)).toBe(false);
    expect(isReadChatMessage({ status: "read" })).toBe(true);
  });
  it("assumes UTC only for zone-less date-times and preserves invalid dates", () => {
    expect(parseChatDate("2026-01-02 03:04:05")?.toISOString()).toBe("2026-01-02T03:04:05.000Z");
    expect(parseChatDate("2026-01-02T03:04:05+03:30")?.toISOString()).toBe("2026-01-01T23:34:05.000Z");
    expect(parseChatDate("invalid")).toBeNull();
    expect(parseChatDate(undefined)).toBeNull();
  });
  it("maps thread aliases, roles, routes and fallback labels", () => {
    const thread = { thread_id: 7, unread_count: "2", ad: { title: "Home", form_title: "Sale", is_mine: "true" }, user: { showing_name: "Name" }, last_message: { body: "  hello  " } };
    const item = mapChatThreadToChatItem(thread, 0);
    expect(item).toMatchObject({ id: "7", detailPath: "/chat/7", detailState: { thread, threadId: "7" }, adTitle: "Home", adCategory: "Sale", adLabel: "آگهی من", message: "  hello  ", userName: "Name", highlighted: true, badgeCount: "۲", category: "advertise" });
    expect(item.detailState?.thread).toBe(thread);
    expect(mapChatThreadToChatItem({ category: "agency_support", blocked: "true" }, 2)).toMatchObject({ id: "3", adTitle: "پشتیبانی آژانس", category: "agency_support", isBlocked: false, userName: "کاربر" });
  });
  it("sorts/deduplicates response days and formats continuous/disjoint ranges", () => {
    expect(sortResponseDays(["monday", "saturday", "monday"])).toEqual(["saturday", "monday"]);
    expect(areResponseDaysEqual(["monday", "saturday"], ["saturday", "monday", "monday"])).toBe(true);
    const availability = (days: Array<"saturday" | "sunday" | "monday">) => ({ days: days.map(day_of_week => ({ day_of_week, day_label: "" })), start_time: null, end_time: null });
    expect(formatParticipantAvailabilityDays(availability([]))).toBe("");
    expect(formatParticipantAvailabilityDays(availability(["saturday", "sunday"]))).toBe("شنبه تا یکشنبه");
    expect(formatParticipantAvailabilityDays(availability(["saturday", "monday"]))).toBe("شنبه و دوشنبه");
  });
  it.each([["00:00", "۱۲ بامداد"], ["06:30", "۶:۳۰ صبح"], ["12:00", "۱۲ ظهر"], ["19:00", "۷ عصر"], ["20:00", "۸ شب"], ["invalid", "invalid"]])("formats availability %s", (value, expected) => {
    expect(formatParticipantAvailabilityTime(value)).toBe(expected);
  });
});
