import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { InputBox } from "../../src/features/advertisements/create/components/NewAdControls";
import { buildCategoryNeighborhoodLabel } from "../../src/features/advertisements/view/details/advertiserAndPricing";
import { mapAdToDetails } from "../../src/features/advertisements/view/details/mapAdToDetails";
import { PreSaleViewContent } from "../../src/features/advertisements/view/PreSaleViewContent";
import { MemoryRouter } from "react-router";
import { getSaleTermsSupportingText } from "../../src/features/advertisements/create/steps/project/ProjectSaleTermsFields";

describe("Bug fixes: Presale display, Owner Phone formatting, and Project Facilities", () => {
  it("does not format numeric input with commas when formatNumeric is not passed (e.g. owner phone)", () => {
    const markup = renderToStaticMarkup(
      <InputBox
        placeholder="شماره تلفن مالک"
        numeric
        value="09123456789"
        onChange={() => {}}
      />,
    );

    expect(markup).toContain('value="09123456789"');
    expect(markup).not.toContain("09,123,456,789");
  });

  it("formats numeric input with commas when formatNumeric is passed (e.g. prices)", () => {
    const markup = renderToStaticMarkup(
      <InputBox
        placeholder="قیمت"
        numeric
        formatNumeric
        value="50000000"
        onChange={() => {}}
      />,
    );

    expect(markup).toContain('value="۵۰,۰۰۰,۰۰۰"');
  });

  it("normalizes and separates 'پیشفروش' or 'پیش‌فروش' into 'پیش فروش'", () => {
    const label = buildCategoryNeighborhoodLabel("presale-special", "فرمانیه", "");
    expect(label).toBe("پیش فروش در محله فرمانیه");

    const mapped = mapAdToDetails({
      form_code: "presale-special",
      category_neighborhood: "پیشفروش در محله نیاوران",
    } as any);
    expect(mapped.categoryNeighborhood).toBe("پیش فروش در محله نیاوران");

    const mappedHalfSpace = mapAdToDetails({
      form_code: "presale-special",
      category_neighborhood: "پیش‌فروش در محله نیاوران",
    } as any);
    expect(mappedHalfSpace.categoryNeighborhood).toBe("پیش فروش در محله نیاوران");
  });

  it("renders facilities with expand button in PreSaleViewContent when items exceed limit", () => {
    const mockDetails = {
      propertyInfoPreview: [],
      projectDetails: [],
      features: [
        { id: "1", label: "آسانسور", icon: "elevator", value: "دارد" },
        { id: "2", label: "پارکینگ", icon: "parking", value: "دارد" },
        { id: "3", label: "انباری", icon: "warehouse", value: "دارد" },
        { id: "4", label: "تراس", icon: "terrace", value: "دارد" },
        { id: "5", label: "حیاط", icon: "yard", value: "دارد" },
        { id: "6", label: "کولر", icon: "cooler", value: "دارد" },
        { id: "7", label: "رادیاتور", icon: "radiator", value: "دارد" },
        { id: "8", label: "تنظیمات", icon: "settings", value: "دارد" },
      ],
      description: "توضیحات پروژه",
    } as any;

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <PreSaleViewContent adId="123" details={mockDetails} />
      </MemoryRouter>,
    );

    expect(markup).toContain("تجهیزات و امکانات");
    expect(markup).toContain("مشاهده 4 امکانات");
  });

  it("calculates sale terms supporting text correctly including zero percent", () => {
    expect(getSaleTermsSupportingText("0")).toBe("۰ درصد اقساط، ۱۰۰ درصد نقد");
    expect(getSaleTermsSupportingText("30")).toBe("۳۰ درصد اقساط، ۷۰ درصد نقد");
    expect(getSaleTermsSupportingText("100")).toBe("۱۰۰ درصد اقساط، ۰ درصد نقد");
    expect(getSaleTermsSupportingText("")).toBeUndefined();
    expect(getSaleTermsSupportingText(undefined)).toBeUndefined();
    expect(getSaleTermsSupportingText("101")).toBeUndefined();
    expect(getSaleTermsSupportingText("-5")).toBeUndefined();
  });

  it("maps and renders presale project info with full-width project type and project status", () => {
    const mapped = mapAdToDetails({
      id: 99,
      form_code: "presale-special",
      features: [
        { key: "project_type", label: "نوع پروژه", value: "مسکونی، اداری، تجاری" },
        { key: "document_type", label: "سند", value: "ملکی" },
        { key: "project_total_units", label: "تعداد کل واحدها", value: "256" },
        { key: "project_total_floors", label: "تعداد کل طبقات", value: "14" },
        { key: "project_status", label: "وضعیت پروژه", value: "در حال ساخت" },
      ],
    } as any);

    expect(mapped.propertyInfoPreview.map((item) => item.label)).toEqual([
      "نوع پروژه",
      "سند",
      "تعداد کل واحدها",
      "تعداد کل طبقات",
      "وضعیت پروژه",
    ]);

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <PreSaleViewContent adId="99" details={mapped} />
      </MemoryRouter>,
    );

    expect(markup).toContain("اطلاعات پروژه");
    expect(markup).toContain("col-span-2");
    expect(markup).toContain("مسکونی، اداری، تجاری");
    expect(markup).toContain("وضعیت پروژه");
    expect(markup).toContain("در حال ساخت");
  });
});
