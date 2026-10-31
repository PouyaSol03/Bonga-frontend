import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { DetailsProperties } from "../../../src/features/advertisements/create/steps/details/DetailsProperties";
import { DailyHotelRoomsSection } from "../../../src/features/advertisements/create/steps/dailyHotel/DailyHotelRoomsSection";
import { DailyHotelRoomEditor } from "../../../src/features/advertisements/create/steps/dailyHotel/DailyHotelRoomEditor";

vi.mock("react-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-dom")>()),
  createPortal: () => null,
}));

const formMock = vi.hoisted(() => ({ values: {}, setValue: vi.fn() }));
vi.mock("react-hook-form", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-hook-form")>()),
  useFormContext: () => ({ watch: () => formMock.values, setValue: formMock.setValue, control: {} }),
  useWatch: () => undefined,
}));

describe("daily hotel create ad UI", () => {
  it("hides 'ثبت مشخصات دیگر' button when isDailyHotelRent is true", () => {
    window.history.replaceState(null, "", "?transaction=rent&category=apartment");
    const markupNonHotel = renderToStaticMarkup(
      createElement(DetailsProperties, {
        desktop: false,
        errors: {},
        isDailyHotelRent: false,
        isProject: false,
        openSelectSheet: () => {},
        setField: () => {},
        setSheet: () => {},
        title: "مشخصات آپارتمان",
        values: {} as any,
      }),
    );
    expect(markupNonHotel).toContain("مشخصات دیگر");

    window.history.replaceState(null, "", "?transaction=rent&category=daily-hotel-apartment");
    const markupHotel = renderToStaticMarkup(
      createElement(DetailsProperties, {
        desktop: false,
        errors: {},
        isDailyHotelRent: true,
        isProject: false,
        openSelectSheet: () => {},
        setField: () => {},
        setSheet: () => {},
        title: "مشخصات هتل و اقامتگاه",
        values: {} as any,
      }),
    );
    expect(markupHotel).not.toContain("مشخصات دیگر");
  });

  it("places room label before chevron button in room row with justify-between", () => {
    const markup = renderToStaticMarkup(createElement(DailyHotelRoomsSection));

    expect(markup).toContain("justify-between");
    expect(markup).toContain("اتاق یک تخته");

    // The text 'اتاق یک تخته' should appear before the chevron SVG in the rendered markup
    const labelIndex = markup.indexOf("اتاق یک تخته");
    const chevronSvgIndex = markup.indexOf("<svg", labelIndex);
    expect(labelIndex).toBeGreaterThan(0);
    expect(chevronSvgIndex).toBeGreaterThan(labelIndex);
  });

  it("renders room editor with bounded max-w-[1440px], TopBar and semantic theme backgrounds", () => {
    const markup = renderToStaticMarkup(
      createElement(
        MemoryRouter,
        null,
        createElement(DailyHotelRoomEditor, {
          draftRoom: {
            id: "single",
            label: "اتاق یک تخته",
            guestCount: "1",
            extraGuestCount: "",
            mealPlan: "",
            normalPrice: "1000000",
            weekendPrice: "",
            specialPrice: "",
          },
          onClose: () => {},
          onSave: () => {},
          setDraftRoom: () => {},
        }),
      ),
    );

    // Verify bounded container instead of unconstrained full width
    expect(markup).toContain("max-w-[1440px]");
    // Verify semantic theme backgrounds instead of hardcoded bg-white
    expect(markup).toContain("bg-surface-container");
    expect(markup).not.toContain("bg-white");
    // Verify room title is rendered in standard TopBar
    expect(markup).toContain("اتاق یک تخته");
    // Verify standard action footer buttons
    expect(markup).toContain("تایید");
    expect(markup).toContain("انصراف");
  });
});
