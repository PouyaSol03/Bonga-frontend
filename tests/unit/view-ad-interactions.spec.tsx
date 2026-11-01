import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../render";
import { useViewAdBookmark } from "../../src/features/advertisements/view/page/useViewAdBookmark";
import { useViewAdSubmissions } from "../../src/features/advertisements/view/page/useViewAdSubmissions";
import { useViewAdChat } from "../../src/features/advertisements/view/page/useViewAdChat";
import { shareAdvertisement } from "../../src/features/advertisements/view/page/shareAdvertisement";
import type { ViewAdDetails } from "../../src/features/advertisements/view/viewAdTypes";

const mocks = vi.hoisted(() => ({
  badge: vi.fn(),
  note: vi.fn(),
  feedback: vi.fn(),
  report: vi.fn(),
  chat: vi.fn(),
  navigate: vi.fn(),
  login: vi.fn(),
  authorize: vi.fn(),
  toast: vi.fn(),
  reasons: { isError: false, error: null as unknown, data: [] },
}));
vi.mock("react-router", async (original) => ({
  ...(await original<typeof import("react-router")>()),
  useNavigate: () => mocks.navigate,
}));
vi.mock("../../src/features/account/api/account.hooks", () => ({
  useToggleAdvertiseBadgeMutation: () => ({ mutate: mocks.badge, isPending: false }),
  useSaveAdvertiseNoteMutation: () => ({ mutate: mocks.note, isPending: false }),
}));
vi.mock("../../src/features/advertisements/api/advertisement.hooks", () => ({
  useSubmitAdvertiseFeedbackMutation: () => ({ mutate: mocks.feedback, isPending: false }),
  useSubmitAdvertiseReportMutation: () => ({ mutate: mocks.report, isPending: false }),
  useAdvertiseReportReasonsQuery: () => mocks.reasons,
}));
vi.mock("../../src/features/chat/api/chat.hooks", () => ({
  useCreateAdvertiseChatMutation: () => ({ mutate: mocks.chat, isPending: false }),
}));
vi.mock("../../src/shared/api/api", () => ({
  isUnauthorizedApiError: (error: unknown) => error === "unauthorized",
  getApiErrorMessage: (_error: unknown, fallback: string) => fallback,
}));
const props = () => ({
  adId: "12",
  requireAuthorization: mocks.authorize,
  navigateToLoginRequiredPage: mocks.login,
  showToast: mocks.toast,
});
beforeEach(() => {
  vi.clearAllMocks();
  mocks.authorize.mockReturnValue(true);
  mocks.reasons.isError = false;
  mocks.reasons.error = null;
  window.history.replaceState({}, "", "/preview-ad/12");
});

async function submissions() {
  let current!: ReturnType<typeof useViewAdSubmissions>;
  function Host() {
    current = useViewAdSubmissions(props());
    return null;
  }
  await render(<Host />);
  return () => current;
}

describe("view ad mutation contracts", () => {
  it("optimistically bookmarks, rolls back failures, redirects unauthorized", async () => {
    let current!: ReturnType<typeof useViewAdBookmark>;
    function Host() {
      current = useViewAdBookmark(props());
      return null;
    }
    await render(<Host />);
    await act(async () => current.toggle());
    expect(current.isBookmarked).toBe(true);
    expect(mocks.badge.mock.calls[0][0]).toBe("12");
    await act(async () => mocks.badge.mock.calls[0][1].onError("unauthorized"));
    expect(current.isBookmarked).toBe(false);
    expect(mocks.login).toHaveBeenCalledWith("نشان کردن آگهی");
    expect(mocks.toast).not.toHaveBeenCalled();
  });
  it("trims note payload, rejects whitespace, closes only after success", async () => {
    const current = await submissions();
    await act(async () => current().note.setNoteText("   "));
    current().note.save();
    expect(mocks.note).not.toHaveBeenCalled();
    await act(async () => {
      current().note.setNoteText("  یادداشت  ");
      current().note.setIsOpen(true);
    });
    current().note.save();
    expect(mocks.note.mock.calls[0][0]).toEqual({ advertiseId: "12", note: "یادداشت" });
    expect(current().note.isOpen).toBe(true);
    await act(async () => mocks.note.mock.calls[0][1].onSuccess());
    expect(current().note.isOpen).toBe(false);
    expect(mocks.toast).toHaveBeenCalledWith("یادداشت شما ثبت شد");
  });
  it("retains feedback identity and existing unauthorized authorization checks", async () => {
    const current = await submissions();
    const feedback = { rating: 5 } as unknown as Parameters<
      ReturnType<typeof useViewAdSubmissions>["feedback"]["submit"]
    >[0];
    await act(async () => current().feedback.setIsOpen(true));
    current().feedback.submit(feedback);
    expect(mocks.feedback.mock.calls[0][0]).toEqual({ advertiseId: "12", feedback });
    expect(mocks.feedback.mock.calls[0][0].feedback).toBe(feedback);
    mocks.feedback.mock.calls[0][1].onError("unauthorized");
    expect(mocks.authorize).toHaveBeenLastCalledWith("ثبت بازخورد");
    expect(mocks.login).not.toHaveBeenCalled();
    expect(current().feedback.isOpen).toBe(true);
    await act(async () => mocks.feedback.mock.calls[0][1].onSuccess());
    expect(current().feedback.isOpen).toBe(false);
  });
  it("forwards report fields and closes on API failure", async () => {
    const current = await submissions();
    await act(async () => current().report.setIsOpen(true));
    current().report.submit({ description: "متن", reportReasonId: "3" });
    expect(mocks.report.mock.calls[0][0]).toEqual({
      advertiseId: "12",
      description: "متن",
      reportReasonId: "3",
    });
    await act(async () => mocks.report.mock.calls[0][1].onError(new Error()));
    expect(current().report.isOpen).toBe(false);
    expect(mocks.toast).toHaveBeenCalledWith("ارسال گزارش تخلف با خطا مواجه شد.", "خطا", "error");
  });
  it("redirects unauthorized report-reasons errors and closes report", async () => {
    mocks.reasons.isError = true;
    mocks.reasons.error = "unauthorized";
    const current = await submissions();
    await act(async () => current().report.setIsOpen(true));
    expect(current().report.isOpen).toBe(false);
    expect(mocks.login).toHaveBeenCalledWith("ارسال گزارش تخلف");
  });
  it("opens chat with encoded server thread id and original thread state", async () => {
    let current!: ReturnType<typeof useViewAdChat>;
    function Host() {
      current = useViewAdChat(props());
      return null;
    }
    await render(<Host />);
    current.open("شروع گفتگو با کاربر");
    expect(mocks.chat.mock.calls[0][0]).toBe("12");
    const thread = { id: " a/b " };
    mocks.chat.mock.calls[0][1].onSuccess(thread);
    expect(mocks.navigate).toHaveBeenCalledWith("/chat/a%2Fb", {
      state: { thread, threadId: "a/b" },
    });
    mocks.chat.mock.calls[0][1].onSuccess({});
    expect(mocks.toast).toHaveBeenCalledWith("شناسه گفتگو از سرور دریافت نشد.", "خطا", "error");
  });
});

describe("view ad share contract", () => {
  it("uses public preview URL and suppresses canceled native share", async () => {
    const share = vi.fn().mockRejectedValue(new DOMException("canceled", "AbortError"));
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    const details = { title: "عنوان", locationTitle: "محله", description: "متن" } as ViewAdDetails;
    await shareAdvertisement("12", true, details, mocks.toast);
    expect(share).toHaveBeenCalledWith({
      title: "عنوان",
      text: "محله",
      url: `${window.location.origin}/ads/12`,
    });
    expect(mocks.toast).not.toHaveBeenCalled();
  });
  it("copies current public URL when native sharing is unavailable", async () => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    await shareAdvertisement("12", false, {} as ViewAdDetails, mocks.toast);
    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(mocks.toast).toHaveBeenCalledWith("لینک آگهی کپی شد");
  });
});
