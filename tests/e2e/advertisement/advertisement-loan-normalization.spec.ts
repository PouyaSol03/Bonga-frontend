import { expect, test } from "@playwright/test";
import { normalizeAdvertisementLoan } from "../../../src/features/advertisements/api/advertisement.service";
import { mapAdToDetails, buildPropertyDetailSections } from "../../../src/features/advertisements/view/viewAdDetails";
import type { AdvertisementItem } from "../../../src/features/advertisements/api/advertisement.service";

test("extracts loan from features when ad.loan is absent", () => {
  const rawAd: AdvertisementItem = {
    id: 123,
    title: "آپارتمان ۲۲۵ متری",
    form_code: "sale-apartment",
    category_title: "فروش آپارتمان",
    features: [
      { label: "form_code", value: "sale-apartment" },
      { label: "area", value: 225 },
      { label: "loan_amount", value: 123123 },
      { label: "loan_installment", value: 1232 },
    ],
  };

  const normalized = normalizeAdvertisementLoan(rawAd);

  expect(normalized.loan).toBeDefined();
  expect(normalized.loan?.amount).toBe(123123);
  expect(normalized.loan?.installment).toBe(1232);

  const sections = buildPropertyDetailSections(normalized);
  const loanExchangeSection = sections.find((s) => s.title === "وام و معاوضه");
  expect(loanExchangeSection).toBeDefined();

  const loanItem = loanExchangeSection?.items?.find((item) => item.label === "وام");
  expect(loanItem).toBeDefined();
  expect(loanItem?.value).toBe("دارای وام");
  expect(loanItem?.extraRows).toEqual([
    { label: "مبلغ وام:", value: "۱۲۳٬۱۲۳ تومان" },
    { label: "مبلغ قسط:", value: "۱٬۲۳۲ تومان" },
  ]);
});
