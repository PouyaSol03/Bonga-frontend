import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { fullName } from "../../src/features/crm/layout/recordFormatters";
import { normalizePublicAgentListItem } from "../../src/features/agencies/api/agent-public-normalizer";
import { normalizeAgencyConsultant } from "../../src/features/agencies/api/agency-consultants-normalizer";
import { toEnglishDigits } from "../../src/shared/lib/numberUtils";
import { getDefaultValues } from "../../src/features/advertisements/create/utils/defaultValues";
import { getCrmAdvertiseCreatePath } from "../../src/features/crm/crmAdvertiseNavigation";
import { AdInformationFields } from "../../src/features/advertisements/create/components/AdInformationFields";
import { initialNewAdFormValues } from "../../src/features/advertisements/create/constants/initialValues";

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

describe("CRM ad creation defaults: chat disabled & target user phone", () => {
  it("defaults chatEnabled to false in CRM and populates target owner phone", () => {
    window.history.pushState(
      {},
      "",
      "/new-ad?editSource=crm&targetOwnerType=user&targetOwnerId=42&targetOwnerPhone=09123456789&targetOwnerAuthorized=false",
    );
    const defaults = getDefaultValues({ isEditMode: false } as any);

    expect(defaults.chatEnabled).toBe(false);
    expect(defaults.phoneNumber).toBe("09123456789");
    expect(defaults.targetOwnerType).toBe("user");
    expect(defaults.targetOwnerId).toBe("42");
    expect(defaults.targetOwnerAuthorized).toBe(false);
  });

  it("keeps chatEnabled true by default in non-CRM (user client) flow", () => {
    window.history.pushState({}, "", "/new-ad");
    const defaults = getDefaultValues({ isEditMode: false } as any);
    expect(defaults.chatEnabled).toBe(true);
  });

  it("formats targetOwnerPhone and targetOwnerAuthorized in getCrmAdvertiseCreatePath", () => {
    const path = getCrmAdvertiseCreatePath({
      targetOwnerType: "user",
      targetOwnerId: "99",
      targetOwnerName: "رضا محمدی",
      targetOwnerPhone: "09129876543",
      targetOwnerAuthorized: false,
    });

    expect(path).toContain("editSource=crm");
    expect(path).toContain("targetOwnerType=user");
    expect(path).toContain("targetOwnerId=99");
    expect(path).toContain("targetOwnerPhone=09129876543");
    expect(path).toContain("targetOwnerAuthorized=false");
  });

  it("renders disabled chat with warning message when target user is not authorized in CRM", () => {
    const values = {
      ...initialNewAdFormValues,
      registrantType: "personal" as const,
      targetOwnerType: "user" as const,
      targetOwnerId: "42",
      phoneNumber: "09121112233",
      chatEnabled: false,
      phoneEnabled: true,
    };

    const markup = renderToStaticMarkup(
      <AdInformationFields
        errors={{}}
        isCrmSource={true}
        isTargetUserAuthorized={false}
        label="اطلاعات"
        mobile="09121112233"
        profileMobile="09999999999"
        onSelectAgency={() => {}}
        onSelectPersonal={() => {}}
        onSetField={() => {}}
        values={values}
      />,
    );

    // Warning message rendered
    expect(markup).toContain("به دلیل عدم ثبت نام واقعی کاربر فعلا نمی توان با صاحب ملک چت کرد");
    // Target user's mobile is rendered in phone row
    expect(markup).toContain("09121112233");
    // Not admin's mobile
    expect(markup).not.toContain("09999999999");
  });

  it("renders chat without warning when target user is authorized in CRM", () => {
    const values = {
      ...initialNewAdFormValues,
      registrantType: "personal" as const,
      targetOwnerType: "user" as const,
      targetOwnerId: "42",
      phoneNumber: "09121112233",
      chatEnabled: false,
      phoneEnabled: true,
    };

    const markup = renderToStaticMarkup(
      <AdInformationFields
        errors={{}}
        isCrmSource={true}
        isTargetUserAuthorized={true}
        label="اطلاعات"
        mobile="09121112233"
        profileMobile="09999999999"
        onSelectAgency={() => {}}
        onSelectPersonal={() => {}}
        onSetField={() => {}}
        values={values}
      />,
    );

    expect(markup).not.toContain("به دلیل عدم ثبت نام واقعی کاربر فعلا نمی توان با صاحب ملک چت کرد");
    expect(markup).toContain("09121112233");
  });
});
