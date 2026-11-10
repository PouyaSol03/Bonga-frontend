import { afterEach, expect, test, vi } from "vitest";
import { getStateActions } from "../../src/features/account/ad-state/stateActions";
import { getManagerActions } from "../../src/features/account/ad-state/managerActions";
import {
  readEntityId,
  createUnavailableAdCard,
  readModerationReasons,
} from "../../src/features/account/ad-state/adModel";
import {
  getAgencyAssignmentStartDate,
  readAgencyDeadlineRemaining,
  readDeadlineRemaining,
} from "../../src/features/account/ad-state/deadlineModel";
const helpers = {
  getStateActions,
  getManagerActions,
  readEntityId,
  createUnavailableAdCard,
  readModerationReasons,
  getAgencyAssignmentStartDate,
  readAgencyDeadlineRemaining,
  readDeadlineRemaining,
} as unknown as {
  getStateActions: (
    status: string,
    id: string,
    assigned?: boolean,
    ad?: Record<string, unknown>,
    stop?: () => void,
  ) => { icon: string; to?: string; onClick?: () => void }[];
  getManagerActions: (
    status: string,
    id: string,
    remove?: () => void,
    deleted?: boolean,
  ) => { icon: string; onClick?: () => void }[];
  readEntityId: (value: unknown) => string | undefined;
  createUnavailableAdCard: (
    id?: string,
    ad?: Record<string, unknown>,
  ) => { id: string; title: string; badges?: unknown[] };
  readModerationReasons: (ad?: Record<string, unknown>) => string[];
  getAgencyAssignmentStartDate: (ad?: Record<string, unknown>) => string | undefined;
  readAgencyDeadlineRemaining: (date: unknown) => string;
  readDeadlineRemaining: (date: unknown, days: number, fallback: unknown) => string;
};

afterEach(() => vi.useRealTimers());

test.each([
  ["published", "preview edit delete upgrade stats history"],
  ["wait_for_agency", "preview edit call chat history"],
  ["wait_for_stop", "preview edit call chat history"],
  ["wait_for_deal_confirmation", "preview history"],
  ["wait_for_repost", "preview delete history"],
  ["rejected_by_agency", "preview delete history"],
  ["archived", "preview delete"],
  ["wait_for_payment", "preview edit payment delete history"],
  ["pending", "preview edit delete history"],
  ["needs_edit", "edit preview history"],
  ["incomplete", "edit payment delete"],
  ["expired", "preview history"],
  ["deleted", "preview history"],
  ["incomplete_deleted", "preview history"],
  ["unknown", "preview history"],
])("personal action ordering: %s", (status, icons) => {
  expect(
    helpers
      .getStateActions(status, "42")
      .map((action) => action.icon)
      .join(" "),
  ).toBe(icons);
});

test.each([
  ["published", "preview edit result delete upgrade history"],
  ["wait_for_stop", "preview edit delete history"],
  ["wait_for_deal_confirmation", "preview edit delete history"],
  ["wait_for_payment", "preview edit payment delete history"],
  ["incomplete", "preview edit payment delete history"],
  ["needs_edit", "preview edit payment delete history"],
  ["pending", "preview edit delete history"],
  ["expired", "preview result delete history"],
  ["deleted", "preview history"],
  ["incomplete_deleted", "preview history"],
  ["unknown", "preview edit history"],
])("manager action ordering: %s", (status, icons) => {
  expect(
    helpers
      .getManagerActions(status, "42")
      .map((action) => action.icon)
      .join(" "),
  ).toBe(icons);
});

test("assigned actions retain callbacks and deleted overrides", () => {
  const stop = vi.fn();
  const actions = helpers.getStateActions("published", "a/b", true, undefined, stop);
  expect(actions.map((action) => action.icon)).toEqual([
    "preview",
    "edit",
    "stop_publish",
    "call",
    "chat",
    "history",
  ]);
  expect(actions[2].onClick).toBe(stop);
  expect(helpers.getStateActions("pending", "42", true).map((action) => action.icon)).toEqual([
    "preview",
    "edit",
    "call",
    "chat",
    "history",
  ]);
  expect(
    helpers.getManagerActions("published", "42", undefined, true).map((action) => action.icon),
  ).toEqual(["preview", "history"]);
});

test("entity aliases preserve precedence, whitespace, zero and invalid leading IDs", () => {
  expect(helpers.readEntityId({ id: " 7 ", _id: "8" })).toBe(" 7 ");
  expect(helpers.readEntityId({ id: 0 })).toBe("0");
  expect(helpers.readEntityId({ advertiseId: 9 })).toBe("9");
  expect(helpers.readEntityId({ id: "", _id: "8" })).toBeUndefined();
  for (const value of [null, [], "8", { id: Infinity }])
    expect(helpers.readEntityId(value)).toBeUndefined();
});

test("fallback card and moderation reason normalization", () => {
  expect(helpers.createUnavailableAdCard(undefined, { id: 9, ad_title: "عنوان" })).toMatchObject({
    id: "9",
    title: "عنوان",
    badges: [],
  });
  expect(helpers.createUnavailableAdCard("", { id: 9 }).id).toBe("");
  expect(
    helpers.readModerationReasons({ rejection_reasons: ["الف", "الف"], edit_reason: "ب" }),
  ).toEqual(["الف", "ب"]);
  expect(helpers.readModerationReasons()).toEqual(["جزئیات اصلاح از سرور دریافت نشده است."]);
});

test("assignment dates choose the latest matching log without mutating input", () => {
  const logs = [
    { status: "wait_for_agency", date: "first" },
    { status: "1", created_at: "last" },
  ];
  expect(helpers.getAgencyAssignmentStartDate({ status_logs: logs, updated_at: "fallback" })).toBe(
    "last",
  );
  expect(logs[0].date).toBe("first");
  expect(
    helpers.getAgencyAssignmentStartDate({ updatedAt: "updated", created_at: "created" }),
  ).toBe("updated");
});

test("deadline boundaries and invalid fallbacks", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
  expect(helpers.readAgencyDeadlineRemaining(null)).toBe("۲۴ ساعت");
  expect(helpers.readAgencyDeadlineRemaining("2025-12-31T12:00:00Z")).toBe(
    "مهلت ۲۴ ساعته به پایان رسیده است",
  );
  expect(helpers.readAgencyDeadlineRemaining("2025-12-31T12:00:30Z")).toBe("کمتر از ۱ دقیقه");
  expect(helpers.readDeadlineRemaining(undefined, 7, undefined)).toBe("۷ روز");
  expect(helpers.readDeadlineRemaining("2026-01-01T12:00:01Z", 7, undefined)).toBe("۱ روز دیگر");
  expect(helpers.readDeadlineRemaining("2026-01-01T12:00:00Z", 7, undefined)).toBe(
    "مهلت به پایان رسیده است",
  );
});
