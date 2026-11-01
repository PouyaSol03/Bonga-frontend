import { describe, expect, it } from "vitest";
import {
  normalizeWalletAmount,
  formatMoney,
  readPaymentStatus,
  readPaymentStatusColor,
  formatPaymentDate,
} from "../../src/features/account/page-views/common/formatting";
import {
  normalizeNumericInput,
  formatPersianMonthYear,
} from "../../src/features/account/page-views/identity/identityHelpers";
import { getBadgeAdvertiseId } from "../../src/features/account/page-views/bookmarks/BookmarkAdCard";
import { getNoteId, readNoteText } from "../../src/features/account/page-views/notes/noteHelpers";
import {
  AccountPageShell,
  EmptyAccountState,
  AccountProfileForm,
  BookmarkAdCard,
  NoteCard,
  PaymentHistoryCard,
  IdentityPendingState,
  IdentityVerifiedState,
} from "../../src/features/account/accountPageViews";

describe("accountPageViews modular extraction", () => {
  it("re-exports all view components correctly from barrel", () => {
    expect(typeof AccountPageShell).toBe("function");
    expect(typeof EmptyAccountState).toBe("function");
    expect(typeof AccountProfileForm).toBe("function");
    expect(typeof BookmarkAdCard).toBe("function");
    expect(typeof NoteCard).toBe("function");
    expect(typeof PaymentHistoryCard).toBe("function");
    expect(typeof IdentityPendingState).toBe("function");
    expect(typeof IdentityVerifiedState).toBe("function");
  });

  describe("common formatting", () => {
    it("normalizes wallet amount from Persian/Arabic digits", () => {
      expect(normalizeWalletAmount("۵۰۰,۰۰۰")).toBe("500000");
      expect(normalizeWalletAmount("۰۱۲۳")).toBe("123");
      expect(normalizeWalletAmount("00500")).toBe("500");
    });

    it("formats money amounts to Persian locale", () => {
      expect(formatMoney(500000)).toBe("۵۰۰٬۰۰۰");
      expect(formatMoney("1000000")).toBe("۱٬۰۰۰٬۰۰۰");
      expect(formatMoney("invalid")).toBe("invalid");
    });

    it("resolves payment statuses and colors correctly", () => {
      expect(readPaymentStatus({ status: "1" } as any)).toBe("پرداخت شده");
      expect(readPaymentStatus({ status: "0" } as any)).toBe("نا‌موفق");
      expect(readPaymentStatus({ status: "custom" } as any)).toBe("custom");

      expect(readPaymentStatusColor({ status: "1" } as any)).toBe("var(--tertiary)");
      expect(readPaymentStatusColor({ status: "0" } as any)).toBe("var(--error)");
    });

    it("formats payment date to Persian calendar", () => {
      expect(formatPaymentDate(undefined)).toBe("-");
      expect(formatPaymentDate("invalid")).toBe("-");
      expect(formatPaymentDate("2024-03-20T10:00:00Z")).toContain("۱۴۰۳");
    });
  });

  describe("identity helpers", () => {
    it("normalizes numeric input and strips non-digits", () => {
      expect(normalizeNumericInput("۰۹۱۲-abc-۱۲۳")).toBe("0912123");
    });

    it("formats Persian month and year", () => {
      expect(formatPersianMonthYear(undefined)).toBe("");
      expect(formatPersianMonthYear("invalid")).toBe("");
      const formatted = formatPersianMonthYear("2024-03-20T10:00:00Z");
      expect(formatted).toContain("۱۴۰۳");
    });
  });

  describe("bookmark and note helpers", () => {
    it("resolves badge advertisement ID", () => {
      expect(getBadgeAdvertiseId({ advertise_id: 42 } as any)).toBe("42");
      expect(getBadgeAdvertiseId({ ad: { id: "99" } } as any)).toBe("99");
      expect(getBadgeAdvertiseId({} as any)).toBe("");
    });

    it("resolves note ID and reads note text from fields", () => {
      expect(getNoteId({ id: 10 } as any)).toBe("10");
      expect(getNoteId({ noteId: "note-1" } as any)).toBe("note-1");

      expect(readNoteText({ note: "تست یادداشت" } as any)).toBe("تست یادداشت");
      expect(readNoteText({ text: "تست متن" } as any)).toBe("تست متن");
      expect(readNoteText({ description: "توضیح" } as any)).toBe("توضیح");
      expect(readNoteText({} as any)).toBe("");
    });
  });
});
