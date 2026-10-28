import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { AdvertisementItem } from "../../src/features/advertisements/api/advertisement.service";
import type { ViewAdDetails } from "../../src/features/advertisements/view/viewAdTypes";
import { readAgencyUserContact } from "../../src/features/advertisements/view/page/agencyUserContact";
import { ViewAdContactActions } from "../../src/features/advertisements/view/page/ViewAdContactActions";
import { getPublisherContactActions } from "../../src/features/advertisements/view/details/adContactActions";

const ad = (value: unknown) => value as AdvertisementItem;
const details = { locationTitle: "تهران" } as ViewAdDetails;
const defaults = {
  isPreview: false,
  isPersonalPreview: false,
  useAgencyAllocationPreview: false,
  showAgencyOwnerContact: false,
  usesPublicAdPresentation: true,
  contactInfo: { phone: "123", instagram: "", telegram: "", whatsapp: "", chat: true },
  publisherContact: getPublisherContactActions(ad({ publisher_type: "user" })),
  hasContactSheetData: true,
  hasChatContact: true,
  contactActionCount: 2,
  contactActionsGridClassName: "grid-cols-2",
  isChatPending: false,
  onOpenContactInfo: vi.fn(),
  onOpenChat: vi.fn(),
};
function markup(patch: Partial<typeof defaults> = {}) {
  return renderToStaticMarkup(<ViewAdContactActions {...defaults} {...patch} />);
}

describe("view ad contact presentation", () => {
  it("preserves history override including explicit empty values", () => {
    const contact = readAgencyUserContact(
      ad({ user_name: "نام", phone: "123", address: "آدرس" }),
      details,
      { name: "", phone: "", address: "", social: {} },
    );
    expect(contact).toMatchObject({ name: "", phone: "", address: "", social: {} });
  });
  it("preserves nested name, phone, SMS, address and social precedence", () => {
    const contact = readAgencyUserContact(
      ad({
        user_name: " کاربر ",
        user: { name: "دوم", phone: "222" },
        contacts: { phone: "111", sms: "333", telegram: " @first " },
        owner: { phone: "444" },
        location_address: " آدرس ",
      }),
      details,
    );
    expect(contact).toEqual({
      name: "کاربر",
      phone: "111",
      smsPhone: "333",
      address: "آدرس",
      social: { instagram: undefined, telegram: "@first", whatsapp: undefined },
    });
  });
  it("uses location as last address fallback", () => {
    expect(readAgencyUserContact(ad({}), details).address).toBe("تهران");
  });
  it("renders allocation contact and pending chat in the same LTR action wrapper", () => {
    const html = markup({ isPreview: true, useAgencyAllocationPreview: true, isChatPending: true });
    expect(html).toContain("تماس با کاربر");
    expect(html).toContain("در حال باز کردن چت...");
    expect(html).toContain("flex gap-4 [direction:ltr]");
    expect(html).toContain('disabled=""');
    expect(html.match(/<button/g)).toHaveLength(2);
  });
  it("renders agency-owner preview as one contact button", () => {
    const html = markup({ isPreview: true, showAgencyOwnerContact: true });
    expect(html).toContain("تماس با مالک");
    expect(html.match(/<button/g)).toHaveLength(1);
  });
  it("keeps personal-preview footer but suppresses contact actions", () => {
    const html = markup({
      isPreview: true,
      isPersonalPreview: true,
      contactActionCount: 0,
      usesPublicAdPresentation: false,
    });
    expect(html).toContain("این آگهی برای شماست");
    expect(html).not.toContain("<button");
  });
  it("retains unavailable contact message and normal public action grid", () => {
    expect(markup({ contactActionCount: 0 })).toContain("راه ارتباطی برای این آگهی ثبت نشده است.");
    const html = markup();
    expect(html).toContain("grid grid-cols-2 gap-4 [direction:ltr]");
    expect(html.match(/<button/g)).toHaveLength(2);
  });
});
