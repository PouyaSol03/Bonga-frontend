import { describe, expect, it } from "vitest";
import {
  asChatRecord,
  formatSupportConversationDate,
  formatSupportMessageTime,
  isOpenSupportThread,
  mergeSupportChatMessages,
  readChatPathText,
  type SupportChatMessage,
} from "../../src/features/account/accountSupportViews";

describe("AccountSupportViews Modularization", () => {
  it("extracts chat record and path text properly", () => {
    expect(asChatRecord(null)).toBeUndefined();
    expect(asChatRecord({ a: 1 })).toEqual({ a: 1 });

    const obj = { meta: { user: { name: "Ali" } } };
    expect(readChatPathText(obj, ["meta.user.name"])).toBe("Ali");
    expect(readChatPathText(obj, ["meta.user.missing", "meta.user.name"])).toBe("Ali");
  });

  it("determines open support thread properly", () => {
    expect(isOpenSupportThread({ status: "open" } as any)).toBe(true);
    expect(isOpenSupportThread({ status: "closed" } as any)).toBe(false);
    expect(isOpenSupportThread({ closed_at: "2026-01-01" } as any)).toBe(false);
    expect(isOpenSupportThread({ is_closed: true } as any)).toBe(false);
  });

  it("formats dates and message times without throwing", () => {
    expect(formatSupportConversationDate(null)).toBe("");
    expect(formatSupportConversationDate("2026-03-21T10:00:00")).toBeTruthy();
    expect(formatSupportMessageTime(null)).toBeTruthy();
  });

  it("deduplicates support messages by id and content", () => {
    const msgs: SupportChatMessage[] = [
      { id: "1", threadId: "t1", direction: "outgoing", type: "text", text: "hi", time: "10:00" },
      { id: "1", threadId: "t1", direction: "outgoing", type: "text", text: "hi", time: "10:00" },
      { id: "2", threadId: "t1", direction: "incoming", type: "text", text: "hello", time: "10:01" },
    ];
    const merged = mergeSupportChatMessages(msgs);
    expect(merged).toHaveLength(2);
    expect(merged[0].id).toBe("1");
    expect(merged[1].id).toBe("2");
  });
});
