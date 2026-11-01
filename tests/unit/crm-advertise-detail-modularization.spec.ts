import { describe, expect, it } from "vitest";
import {
  formatArea,
  formatDisplayValue,
  formatMoney,
  resolvePricePresentation,
} from "../../src/features/crm/advertise-detail/formatters";
import {
  findRecordNameById,
  getFeatureKey,
  getFormName,
  normalizeFeatures,
  readHumanText,
  readNestedId,
  readNestedName,
  readText,
} from "../../src/features/crm/advertise-detail/helpers";
import {
  advertiseStatusLabel,
  getActorTypeBadgeClass,
  getActorTypeLabel,
  statusTone,
} from "../../src/features/crm/advertise-detail/statusHelpers";

describe("CRM Advertise Detail Modularization", () => {
  describe("statusHelpers", () => {
    it("returns correct Persian status labels", () => {
      expect(advertiseStatusLabel("accepted")).toBe("منتشرشده");
      expect(advertiseStatusLabel("3")).toBe("منتشرشده");
      expect(advertiseStatusLabel("wait_for_admin")).toBe("در انتظار بررسی");
      expect(advertiseStatusLabel("1")).toBe("در انتظار بررسی");
      expect(advertiseStatusLabel("unknown_status")).toBe("نامشخص");
    });

    it("returns correct status tone color classes", () => {
      expect(statusTone("accepted")).toBe("bg-[#eaf8f1] text-[#087d4b]");
      expect(statusTone("rejected")).toBe("bg-[#fff0f1] text-[#c63242]");
      expect(statusTone("archived")).toBe("bg-[#f1f5f9] text-[#64748b]");
      expect(statusTone("other")).toBe("bg-[#fff7df] text-[#9b6800]");
    });

    it("returns correct actor type labels and badge classes", () => {
      expect(getActorTypeLabel("admin")).toBe("مدیر سیستم");
      expect(getActorTypeLabel("user")).toBe("کاربر");
      expect(getActorTypeLabel("consultant")).toBe("مشاور");
      expect(getActorTypeBadgeClass("admin")).toContain("text-[#b45309]");
      expect(getActorTypeBadgeClass("agency")).toContain("text-[#7e22ce]");
    });
  });

  describe("formatters", () => {
    it("formats money and area correctly", () => {
      expect(formatMoney(100000000)).toContain("۱۰۰٬۰۰۰٬۰۰۰ تومان");
      expect(formatMoney(null)).toBe("-");
      expect(formatArea(120)).toContain("۱۲۰ متر مربع");
      expect(formatArea(undefined)).toBe("-");
    });

    it("formats boolean display values", () => {
      expect(formatDisplayValue("has_elevator", true)).toBe("دارد");
      expect(formatDisplayValue("has_elevator", false)).toBe("ندارد");
      expect(formatDisplayValue("has_elevator", "1")).toBe("دارد");
    });

    it("resolves pricing for rent form", () => {
      const presentation = resolvePricePresentation(
        "rent-apartment",
        { mortgage_price: 200000000, rent_price: 15000000 },
        undefined,
        100,
      );
      expect(presentation.primaryLabel).toBe("رهن");
      expect(presentation.primaryValue).toContain("۲۰۰٬۰۰۰٬۰۰۰ تومان");
      expect(presentation.secondaryLabel).toBe("اجاره");
      expect(presentation.secondaryValue).toContain("۱۵٬۰۰۰٬۰۰۰ تومان");
    });

    it("resolves pricing for sale form with price per meter", () => {
      const presentation = resolvePricePresentation(
        "sale-apartment",
        { price: 5000000000 },
        5000000000,
        100,
      );
      expect(presentation.primaryLabel).toBe("قیمت کل");
      expect(presentation.primaryValue).toContain("۵٬۰۰۰٬۰۰۰٬۰۰۰ تومان");
      expect(presentation.secondaryLabel).toBe("قیمت هر متر");
      expect(presentation.secondaryValue).toContain("۵۰٬۰۰۰٬۰۰۰ تومان");
    });
  });

  describe("helpers", () => {
    it("resolves form names from code", () => {
      expect(getFormName("sale-apartment")).toBe("فروش آپارتمان");
      expect(getFormName("rent-garden-villa")).toBe("اجاره باغ و ویلا");
      expect(getFormName("presale-special")).toBe("پیش‌فروش پروژه");
    });

    it("finds record name recursively by id", () => {
      const records = [
        { id: "1", name: "City 1", children: [{ id: "10", name: "District 10" }] },
        { id: "2", title: "City 2" },
      ];
      expect(findRecordNameById(records, "1")).toBe("City 1");
      expect(findRecordNameById(records, "10")).toBe("District 10");
      expect(findRecordNameById(records, "99")).toBe("");
    });

    it("reads human text with priority fallback", () => {
      expect(
        readHumanText(
          { first_name: "Ali", full_name: "Ali Mousavi" },
          ["full_name", "first_name"],
        ),
      ).toBe("Ali Mousavi");
      expect(readText({ title: "Villa" }, ["title"])).toBe("Villa");
      expect(readNestedName({ user: { name: "Reza" } }, ["user"])).toBe("Reza");
      expect(readNestedId({ neighborhood: { id: "42" } }, ["neighborhood"])).toBe("42");
    });

    it("normalizes features array and map extraction", () => {
      const features = normalizeFeatures({
        features: [
          { key: "rooms", value: 3 },
          { code: "parking", value: true },
        ],
      });
      expect(features).toHaveLength(2);
      expect(getFeatureKey(features[0])).toBe("rooms");
      expect(getFeatureKey(features[1])).toBe("parking");
    });
  });
});
