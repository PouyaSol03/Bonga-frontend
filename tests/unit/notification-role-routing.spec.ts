import { expect, test } from "vitest";
import { setStoredAuthSession, type AuthRoleSlug } from "../../src/shared/auth/auth-storage";
import { getNotificationPath } from "../../src/features/notifications/notificationRouting";

const roles: Array<[AuthRoleSlug, string]> = [
  ["user", "/account/my-ads"],
  ["real_estate_manager", "/account/manage-ads"],
  ["real_estate_consultant", "/account/manage-ads"],
  ["independent_consultant", "/account/manage-ads"],
];

test.each(roles)("routes advertisement notifications for %s", (role, base) => {
  setStoredAuthSession({
    accessToken: "test-token",
    accountType: role,
    activeRole: role,
    expiresAt: null,
    mobile: "",
    role,
    roles: [{ id: role, name: role, slug: role }],
  });
  for (const payload of [
    { target: "advertise", advertise_id: "ad/123" },
    { advertise_id: "ad/123" },
  ]) {
    expect(getNotificationPath({ id: "notification-1", title: "آگهی", payload })).toBe(
      `${base}/ad%2F123/state-ad`,
    );
  }
});
