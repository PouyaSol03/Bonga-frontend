import { describe, expect, it } from "vitest";
import {
  DEFAULT_CENTER,
  agencyStatusTextTone,
  cleanEmptyValues,
  consultantAgencyId,
  consultantAgencyName,
  consultantApiIdentifier,
  consultantStatusLabel,
  consultantStatusTone,
  consultantStatusValue,
  formatMoney,
  fullName,
  normalizeAgencyStatus,
  normalizeCrmUserRoleSlug,
  parseMapPointValue,
  readText,
  stringifyValue,
  userRoleSlugs,
} from "../../src/features/crm/CrmLayout";

describe("CRM record formatting compatibility", () => {
  it("preserves primitive, JSON and missing values", () => {
    expect(stringifyValue(undefined, "missing")).toBe("missing");
    expect(stringifyValue(null)).toBe("");
    expect(stringifyValue(false)).toBe("false");
    expect(stringifyValue(0)).toBe("0");
    expect(stringifyValue("  ")).toBe("  ");
    expect(stringifyValue({ a: [1] })).toBe(JSON.stringify({ a: [1] }, null, 2));
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(() => stringifyValue(cyclic)).toThrow();
  });

  it("uses ordered nonblank text without trimming returned values", () => {
    expect(readText({ a: " ", b: " x ", c: 4 }, ["a", "b", "c"])).toBe(" x ");
    expect(readText({ a: false, b: 0 }, ["a", "b"])).toBe("0");
    expect(readText({}, ["a"])).toBe("-");
    expect(fullName({ name: "Ali", family: "Mousavi" })).toBe("Ali Mousavi");
    expect(fullName({})).toBe("-");
    expect(cleanEmptyValues({ a: "", b: undefined, c: null, d: 0, e: false, f: " " }))
      .toEqual({ c: null, d: 0, e: false, f: " " });
  });

  it.each([0, "0", null, undefined, "invalid", Infinity])("formats absent money %s", (value) => {
    expect(formatMoney(value)).toBe("-");
  });

  it("formats nonzero money in Persian", () => {
    expect(formatMoney("1234567")).toBe(new Intl.NumberFormat("fa-IR").format(1234567));
    expect(formatMoney(-42)).toBe(new Intl.NumberFormat("fa-IR").format(-42));
  });

  it("keeps role source precedence, aliases and deduplication", () => {
    expect(normalizeCrmUserRoleSlug(" Super-Admin ")).toBe("superadmin");
    expect(userRoleSlugs({ roles: [" Super_Admin ", { slug: "USER" }, "user", {}, null] }))
      .toEqual(["superadmin", "user"]);
    expect(userRoleSlugs({ roles: [], role_slugs: ["user"] })).toEqual([]);
    expect(userRoleSlugs({ role_slugs: [" ", "SUPPORT", "support"], role: "user" }))
      .toEqual(["support"]);
    expect(userRoleSlugs({ role: " Independent_Consultant " })).toEqual(["independent_consultant"]);
  });

  it("preserves consultant agency identifier and name precedence", () => {
    expect(consultantAgencyId({ agency_id: 0, agency: { id: 9 } })).toBe("0");
    expect(consultantAgencyId({ real_estate_agency: { id: 9 } })).toBe("9");
    expect(consultantAgencyId({ agency: [] })).toBe("");
    const names = new Map([["9", "mapped"]]);
    expect(consultantAgencyName({ agency_name: "direct", agency_id: 9 }, names)).toBe("direct");
    expect(consultantAgencyName({ agency: { name: "nested" } }, names)).toBe("nested");
    expect(consultantAgencyName({ agency_id: 9 }, names)).toBe("mapped");
    expect(consultantAgencyName({ agency_id: 8 }, names)).toBe("آژانس ثبت‌شده");
    expect(consultantAgencyName({}, names)).toBe("مستقل");
    expect(consultantApiIdentifier(" 0009 ")).toBe(9);
    expect(consultantApiIdentifier(" -9 ")).toBe("-9");
    expect(consultantApiIdentifier(" uuid ")).toBe("uuid");
  });

  it.each(["1", "accept", "accepted", "approved", " ACCEPTED "])("accepts status %s", (status) => {
    expect(consultantStatusValue({ status })).toBe("accept");
    expect(normalizeAgencyStatus(status)).toBe("accept");
  });

  it.each(["2", "reject", "rejected"])("rejects status %s", (status) => {
    expect(consultantStatusValue({ status })).toBe("reject");
    expect(normalizeAgencyStatus(status)).toBe("reject");
  });

  it("preserves unknown statuses, source precedence and tones", () => {
    expect(consultantStatusValue({ consultant_status: "", status: "accepted" })).toBe("pending");
    expect(consultantStatusValue({ consultant_status_text: "approved" })).toBe("accept");
    expect(consultantStatusValue({ status: "denied" })).toBe("pending");
    expect(normalizeAgencyStatus("denied")).toBe("reject");
    expect(normalizeAgencyStatus(null)).toBe("wait");
    expect(consultantStatusLabel("accept")).toBe("تأیید شده");
    expect(consultantStatusLabel("reject")).toBe("رد شده");
    expect(consultantStatusLabel("pending")).toBe("در انتظار");
    expect(consultantStatusTone("accept")).toBe("bg-[#e9f8f0] text-[#0b8b55] border border-[#a3e4c4]");
    expect(consultantStatusTone("reject")).toBe("bg-[#ffebed] text-[#ee3623] border border-[#f7b0b6]");
    expect(consultantStatusTone("pending")).toBe("bg-[#fff7df] text-[#ff6d00] border border-[#ffe099]");
    expect(agencyStatusTextTone("accepted")).toBe("text-[#0b8b55]");
    expect(agencyStatusTextTone("denied")).toBe("text-[#cc3342]");
    expect(agencyStatusTextTone("unknown")).toBe("text-[#303030]");
  });

  it.each(["", "broken", "null", "{}", '{"lat":"bad","lng":4}'])("falls back for point %s", (value) => {
    expect(parseMapPointValue(value)).toEqual({ lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] });
  });

  it("preserves numeric point coercion without range validation", () => {
    expect(parseMapPointValue('{"lat":"35.2","lng":"51.4"}')).toEqual({ lat: 35.2, lng: 51.4 });
    expect(parseMapPointValue('{"lat":null,"lng":false}')).toEqual({ lat: 0, lng: 0 });
    expect(parseMapPointValue('{"lat":200,"lng":500}')).toEqual({ lat: 200, lng: 500 });
  });
});
