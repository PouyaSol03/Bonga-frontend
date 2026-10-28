import { act, useEffect, type ComponentProps, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { afterEach, expect, test, vi } from "vitest";
import { DetailsAmenities } from "../../../src/features/advertisements/create/steps/details/DetailsAmenities";
import { DetailsSheet } from "../../../src/features/advertisements/create/steps/details/DetailsSheet";
import { useDetailsForm } from "../../../src/features/advertisements/create/steps/details/useDetailsForm";
import { useRegisteredMoreFeatures } from "../../../src/features/advertisements/create/steps/details/useRegisteredMoreFeatures";
import { blankValues } from "../../../src/features/advertisements/create/constants/initialValues";
import { locationKey } from "../../../src/features/advertisements/create/data";
import type { NewAdFormValues } from "../../../src/features/advertisements/create/types";
import type { BottomSheetActionList } from "../../../src/shared/components/BottomSheet";

vi.mock("../../../src/shared/lib/useTwoRowVisibleCount", () => ({
  useTwoRowVisibleCount: () => 1,
}));
vi.mock("../../../src/shared/components/BottomSheet", () => ({
  BottomSheet: ({ isOpen, children }: { isOpen: boolean; children: ReactNode }) =>
    isOpen ? <div data-sheet>{children}</div> : null,
  BottomSheetActionList: ({ items, onSelect }: ComponentProps<typeof BottomSheetActionList>) =>
    <>{items.map((item) => <button key={item.id} onClick={() => onSelect?.(item)}>{item.title}</button>)}</>,
}));

let root: Root;
let container: HTMLDivElement;
let form: UseFormReturn<NewAdFormValues>;
const clearError = vi.fn();

function Harness() {
  const { values, sheet, setSheet, setField, handleLoanToggle } = useDetailsForm(clearError);
  const { removeMoreFeature } = useRegisteredMoreFeatures(values);
  return <>
    <DetailsAmenities transaction="sale" category="apartment" values={values}
      errors={{ facilities: "خطا", heatingCooling: "خطا" }} setField={setField}
      setSheet={setSheet} hideHeatingCooling={false} showFacilitiesSection />
    <DetailsSheet values={values} sheet={sheet} setSheet={setSheet} setField={setField} />
    <button onClick={() => handleLoanToggle(false)}>remove loan</button>
    <button onClick={() => removeMoreFeature("renovated")}>remove toggle</button>
    <button onClick={() => removeMoreFeature("unitsPerFloor")}>remove select</button>
  </>;
}

function Form({ values }: { values: Partial<NewAdFormValues> }) {
  const methods = useForm<NewAdFormValues>({ defaultValues: { ...blankValues, ...values } });
  useEffect(() => { form = methods; }, [methods]);
  return <FormProvider {...methods}><Harness /></FormProvider>;
}

async function mount(values: Partial<NewAdFormValues> = {}) {
  window.history.replaceState({}, "", "/new-ad/details?transaction=sale&category=apartment");
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<Form values={values} />));
}

async function click(text: string, sheet = false) {
  const scope = sheet ? container.querySelector("[data-sheet]")! : container;
  const button = Array.from(scope.querySelectorAll("button"))
    .find((node) => !node.closest('[aria-hidden="true"]') && node.textContent?.trim() === text);
  expect(button, text).toBeDefined();
  await act(async () => button!.click());
}

afterEach(async () => {
  if (root) await act(async () => root.unmount());
  container?.remove();
  localStorage.clear();
  clearError.mockClear();
});

test("error-revealed facility chips retain count sheets, selection and removal", async () => {
  await mount();
  for (const [label, id, key] of [
    ["آسانسور", "elevator", "elevatorCount"],
    ["پارکینگ", "parking", "parkingCount"],
    ["تراس", "terrace", "terraceCount"],
  ] as const) {
    await click(label);
    expect(form.getValues("facilities")).not.toContain(id);
    const count = container.querySelector("[data-sheet] button")!.textContent!;
    await click(count, true);
    expect(form.getValues(key)).toBe(count);
    expect(form.getValues("facilities")).toContain(id);
    expect(container.querySelector("[data-sheet]")).toBeNull();
    await click(label);
    expect(form.getValues(key)).toBe("");
    expect(form.getValues("facilities")).not.toContain(id);
    expect(clearError).toHaveBeenCalledWith(key);
    expect(clearError).toHaveBeenCalledWith("facilities");
  }
});

test("location hydration, loan resets and tag removal preserve form write behavior", async () => {
  localStorage.setItem(locationKey, "  تهران  ");
  await mount({ loanEnabled: true, loanAmount: "100", loanInstallment: "10", renovated: true, unitsPerFloor: "2" });
  expect(form.getValues("location")).toBe("تهران");
  expect(form.getFieldState("location").isDirty).toBe(false);
  await click("remove loan");
  expect(form.getValues("loanEnabled")).toBe(false);
  expect(form.getValues("loanAmount")).toBe("");
  expect(form.getValues("loanInstallment")).toBe("");
  expect(clearError.mock.calls.map(([key]) => key)).toEqual(["loanEnabled", "loanAmount", "loanInstallment"]);
  clearError.mockClear();
  await click("remove toggle");
  await click("remove select");
  expect(form.getValues("renovated")).toBe(false);
  expect(form.getValues("unitsPerFloor")).toBe("");
  expect(form.getFieldState("renovated").isDirty).toBe(true);
  expect(clearError).not.toHaveBeenCalled();
});
