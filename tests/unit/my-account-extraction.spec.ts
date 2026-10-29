import { describe, expect, it } from "vitest";
import {
  isBusinessAccount,
  getProfileDisplayName,
  getAgencyDisplayName,
  getAccountHeader,
  getBusinessAccountHeader,
} from "../../src/features/account/my-account/accountHeaderHelpers";
import {
  getAccountSwitchActions,
  getCreatedBusinessActions,
} from "../../src/features/account/my-account/accountSwitchActions";
import { getBusinessAccountActions } from "../../src/features/account/my-account/businessAccountActions";
import { getLoginRequiredPath } from "../../src/features/account/my-account/navigationHelpers";
import { MyAccountPage } from "../../src/features/account/MyAccountPage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
  USER,
} from "../../src/shared/constants/roles.constants";

describe("MyAccountPage modular extraction", () => {
  it("exports MyAccountPage component", () => {
    expect(typeof MyAccountPage).toBe("function");
  });

  describe("accountHeaderHelpers", () => {
    it("identifies business account roles correctly", () => {
      expect(isBusinessAccount(REAL_ESTATE_MANAGER)).toBe(true);
      expect(isBusinessAccount(REAL_ESTATE_CONSULTANT)).toBe(true);
      expect(isBusinessAccount(INDEPENDENT_CONSULTANT)).toBe(true);
      expect(isBusinessAccount(USER)).toBe(false);
      expect(isBusinessAccount(null)).toBe(false);
    });

    it("formats profile display name", () => {
      expect(getProfileDisplayName({ name: "علی", family: "موسوی" })).toBe("علی موسوی");
      expect(getProfileDisplayName({ name: "علی" })).toBe("علی");
      expect(getProfileDisplayName(undefined)).toBe("");
    });

    it("formats agency display name with fallback", () => {
      expect(getAgencyDisplayName({ name: "املاک تهران" })).toBe("املاک تهران");
      expect(getAgencyDisplayName(undefined)).toBe("آژانس املاک");
    });

    it("resolves account header verification status", () => {
      expect(getAccountHeader(undefined).label).toBe("احراز هویت نشده");
      expect(getAccountHeader({ authorized: 1, name: "پویا" }).label).toBe("پویا");
    });

    it("resolves business account header by role", () => {
      const managerHeader = getBusinessAccountHeader(REAL_ESTATE_MANAGER, undefined, { name: "آژانس مرکزی" });
      expect(managerHeader.name).toBe("آژانس مرکزی");
      expect(managerHeader.subtitle).toBe("آژانس املاک");

      const independentHeader = getBusinessAccountHeader(INDEPENDENT_CONSULTANT, { authorized: 1, name: "رضا", family: "رضایی" });
      expect(independentHeader.name).toBe("رضا رضایی");
      expect(independentHeader.subtitle).toBe("مشاور مستقل");
    });
  });

  describe("navigationHelpers", () => {
    it("generates correct login-required redirect path", () => {
      expect(getLoginRequiredPath("/account/requests", "مدیریت")).toBe(
        "/login-required?returnTo=%2Faccount%2Frequests&action=%D9%85%D8%AF%DB%8C%D8%B1%DB%8C%D8%AA",
      );
    });
  });

  describe("businessAccountActions", () => {
    it("generates manager and consultant action sets", () => {
      const actions = getBusinessAccountActions(REAL_ESTATE_MANAGER);
      expect(actions.some((a) => a.to === "/account/manage-ads")).toBe(true);
      expect(actions.some((a) => a.to === "/account/dashboard")).toBe(true);
    });
  });

  describe("accountSwitchActions", () => {
    it("filters out active role from switch list", () => {
      const session = {
        accessToken: "token",
        activeRole: USER,
        mobile: "09120000000",
        roles: [{ id: 1, name: "کاربر", slug: USER }, { id: 2, name: "مدیر", slug: REAL_ESTATE_MANAGER }],
        userId: "1",
      };
      const switchActions = getAccountSwitchActions(session, USER);
      expect(switchActions.some((a) => a.activeRole === USER)).toBe(false);
      expect(switchActions.some((a) => a.activeRole === REAL_ESTATE_MANAGER)).toBe(true);
    });

    it("returns pending badge action when agency is awaiting approval", () => {
      const session = {
        accessToken: "token",
        activeRole: USER,
        mobile: "09120000000",
        roles: [{ id: 1, name: "کاربر", slug: USER }],
        userId: "1",
      };
      const actions = getCreatedBusinessActions(session, { agency_id: 10, agency_status: "wait" });
      expect(actions[0].badge).toBe("در انتظار");
      expect(actions[0].disabled).toBe(true);
    });
  });
});
