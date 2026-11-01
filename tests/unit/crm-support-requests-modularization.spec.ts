import { describe, expect, it } from "vitest";
import {
  formatCount,
  mapRequest,
  messageTimestamp,
  normalizeSearch,
  normalizeStatus,
  priorityLabel,
} from "../../src/features/crm/support-requests/supportHelpers";

describe("CRM Support Requests Modularization", () => {
  describe("supportHelpers", () => {
    it("normalizes status correctly", () => {
      expect(normalizeStatus("closed")).toBe("closed");
      expect(normalizeStatus("reviewing")).toBe("reviewing");
      expect(normalizeStatus("in_progress")).toBe("reviewing");
      expect(normalizeStatus("in-progress")).toBe("reviewing");
      expect(normalizeStatus("open")).toBe("open");
      expect(normalizeStatus("")).toBe("open");
      expect(normalizeStatus(null)).toBe("open");
    });

    it("formats count in Persian locale", () => {
      expect(formatCount(1234)).toBe("۱٬۲۳۴");
      expect(formatCount(0)).toBe("۰");
    });

    it("maps priority labels correctly", () => {
      expect(priorityLabel("urgent")).toBe("فوری");
      expect(priorityLabel("فوری")).toBe("فوری");
      expect(priorityLabel("important")).toBe("مهم");
      expect(priorityLabel("مهم")).toBe("مهم");
      expect(priorityLabel("normal")).toBe("عادی");
      expect(priorityLabel("other")).toBe("عادی");
    });

    it("normalizes search query", () => {
      expect(normalizeSearch("  تست پیام  ")).toBe("تست پیام");
    });

    it("extracts timestamp or defaults to 0", () => {
      const now = new Date();
      expect(messageTimestamp({ created_at: now.toISOString() } as any)).toBe(now.getTime());
      expect(messageTimestamp({} as any)).toBe(0);
    });

    it("maps support request item to CrmSupportRequest", () => {
      const item = {
        category_label: "فنی",
        created_at: "2026-03-01T10:00:00Z",
        description: "مشکل در ورود به سیستم",
        id: "req-101",
        priority: "urgent",
        status: "in_progress",
        subject: "خطای ورود",
        thread_id: "thread-55",
        user: {
          family: "موسوی",
          mobile: "09120000000",
          name: "علی",
        },
      } as any;

      const mapped = mapRequest(item);
      expect(mapped.id).toBe("req-101");
      expect(mapped.title).toBe("خطای ورود");
      expect(mapped.category).toBe("فنی");
      expect(mapped.customerName).toBe("علی موسوی");
      expect(mapped.customerMobile).toBe("09120000000");
      expect(mapped.status).toBe("reviewing");
      expect(mapped.priority).toBe("urgent");
      expect(mapped.threadId).toBe("thread-55");
    });
  });
});
