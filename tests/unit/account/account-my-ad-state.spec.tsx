import { act } from "react";
import { expect, test, vi } from "vitest";
import {
  AgencyAssignedUserAdView,
  type AgencyAssignedDeletedVariant,
} from "../../../src/features/account/components/AgencyAssignedUserAdView";
import { AgencyDocs_1_Published } from "../../../src/features/account/AccountMyAdStatePage.stories";
import { render } from "../../render";

const card = AgencyDocs_1_Published.args!.card!;
const cases: Array<[string, AgencyAssignedDeletedVariant | undefined, string, string | null]> = [
  ["published", undefined, "منتشر شده", "درخواست توقف انتشار"],
  ["wait_for_agency", undefined, "در انتظار تایید آژانس", "لغو واگذاری آگهی به آژانس"],
  ["wait_for_repost", undefined, "در انتظار ثبت مجدد", "ثبت مجدد آگهی"],
  ["archived", undefined, "بایگانی شده", "بازیابی آگهی"],
  ["wait_for_deal_confirmation", "deal_confirmation", "حذف شده", "ثبت نتیجه درخواست"],
  ["deleted", "recovery_expired", "حذف شده", null],
  ["deleted", "user_stopped", "حذف شده", null],
];

test.each(cases)(
  "renders assigned advertisement state %s / %s",
  async (statusKey, deletedVariant, label, action) => {
    const container = await render(
      <AgencyAssignedUserAdView
        card={card}
        statusKey={statusKey}
        deletedVariant={deletedVariant}
      />,
      statusKey,
    );
    expect(container.textContent).toContain(label);
    const buttons = Array.from(container.querySelectorAll("button"));
    const stateActions = cases.flatMap((item) => (item[3] ? [item[3]] : []));
    const renderedActions = buttons
      .map((button) => button.textContent?.trim())
      .filter((text) => stateActions.includes(text!));
    expect(renderedActions).toEqual(action ? [action] : []);
  },
);

test("renders shared advertisement copy", async () => {
  const container = await render(
    <AgencyAssignedUserAdView
      card={card}
      statusKey="published"
      ad={{
        assigned_agency_name: "آژانس آزمون",
        category_title: "فروش مسکونی / فروش آپارتمان",
        published_time_ago: "۳ روز پیش (۱۴۰۴/۱۱/۰۹)",
        expires_time_ago: "۱۲ روز دیگر (۱۴۰۴/۱۱/۲۱)",
      }}
    />,
  );
  for (const text of ["فروش مسکونی / فروش آپارتمان", "۳ روز پیش", "۱۲ روز دیگر"])
    expect(container.textContent).toContain(text);
});

test.each([
  ["published", "درخواست توقف انتشار", "stop"],
  ["wait_for_deal_confirmation", "ثبت نتیجه درخواست", "deal"],
])("navigates from assigned state %s", async (statusKey, label, target) => {
  const stop = vi.fn();
  const deal = vi.fn();
  const container = await render(
    <AgencyAssignedUserAdView
      card={card}
      statusKey={statusKey}
      onNavigateToStopPublish={stop}
      onNavigateToDealResult={deal}
    />,
    statusKey,
  );
  const button = Array.from(container.querySelectorAll("button")).find((item) =>
    item.textContent?.includes(label),
  );
  expect(button).toBeDefined();
  await act(async () => button!.click());
  expect(target === "stop" ? stop : deal).toHaveBeenCalledOnce();
  expect(target === "stop" ? deal : stop).not.toHaveBeenCalled();
});
