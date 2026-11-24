import { describe, expect, it } from "vitest";
import { fullName } from "../../src/features/crm/layout/recordFormatters";
import { normalizePublicAgentListItem } from "../../src/features/agencies/api/agent-public-normalizer";
import { normalizeAgencyConsultant } from "../../src/features/agencies/api/agency-consultants-normalizer";
import { toEnglishDigits } from "../../src/shared/lib/numberUtils";

describe("CRM and Agency fullName & Persian digit normalization", () => {
  it("converts Persian and Arabic phone digits to English digits cleanly", () => {
    const persianPhone = "۰۹۱۲۳۴۵۶۷۸۹";
    const arabicPhone = "٠٩١٢٣٤٥٦٧٨٩";

    expect(toEnglishDigits(persianPhone).replace(/\D/g, "")).toBe("09123456789");
    expect(toEnglishDigits(arabicPhone).replace(/\D/g, "")).toBe("09123456789");
  });

  it("extracts both first name and last name in fullName formatter", () => {
    // Both first and last name present
    expect(fullName({ name: "علی", family: "محمدی" })).toBe("علی محمدی");
    expect(fullName({ first_name: "رضا", last_name: "احمدی" })).toBe("رضا احمدی");
    expect(fullName({ firstName: "سارا", lastName: "کریمی" })).toBe("سارا کریمی");

    // Only one part present
    expect(fullName({ name: "مهدی" })).toBe("مهدی");
    expect(fullName({ family: "کاظمی" })).toBe("کاظمی");

    // full_name fallback
    expect(fullName({ full_name: "امید ناصری" })).toBe("امید ناصری");

    // Empty object
    expect(fullName({})).toBe("-");
  });

  it("normalizes public consultant list items displaying both first and last name", () => {
    const item = normalizePublicAgentListItem({
      id: "agent-123",
      first_name: "سهراب",
      last_name: "سپهری",
    });

    expect(item).not.toBeNull();
    expect(item?.fullName).toBe("سهراب سپهری");
  });

  it("normalizes agency consultant items with full name", () => {
    const item = normalizeAgencyConsultant({
      id: 456,
      name: "حسین",
      family: "رضایی",
    });

    expect(item).not.toBeNull();
    expect(item?.name).toBe("حسین رضایی");
  });
});
