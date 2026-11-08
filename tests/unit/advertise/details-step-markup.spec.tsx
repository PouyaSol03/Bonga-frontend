import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import { DetailsStep } from "../../../src/features/advertisements/create/steps/DetailsStep";
import { blankValues } from "../../../src/features/advertisements/create/constants/initialValues";
import { NewAdDesktopLayoutContext } from "../../../src/features/advertisements/create/NewAdLayoutContext";

vi.mock("react-dom", async (importOriginal) => ({
  ...await importOriginal<typeof import("react-dom")>(),
  createPortal: () => null,
}));

const form = vi.hoisted(() => ({ values: {}, setValue: vi.fn() }));
vi.mock("react-hook-form", async (importOriginal) => ({
  ...await importOriginal<typeof import("react-hook-form")>(),
  useFormContext: () => ({ watch: () => form.values, setValue: form.setValue }),
  useWatch: ({ name }: { name: keyof typeof blankValues }) => (form.values as typeof blankValues)[name],
}));
vi.mock("react-router", async (importOriginal) => ({
  ...await importOriginal<typeof import("react-router")>(),
  useNavigate: () => vi.fn(),
}));

test("preserves initial markup across listing modes, layouts, populated values and errors", () => {
  const results: string[] = [];
  for (const [transaction, category] of [
    ["sale", "apartment"], ["sale", "garden-villa"], ["sale", "land"],
    ["sale", "office"], ["rent", "apartment"], ["rent", "daily-apartment-suite"],
    ["rent", "daily-hotel-apartment"], ["rent", "daily-workspace"],
    ["project", "project-presale"], ["project", "project-partnership"],
    ["unknown", "factory-workshop"],
  ]) {
    for (const desktop of [false, true]) {
      for (const filled of [false, true]) {
        window.history.replaceState({}, "", `/new-ad/details?transaction=${transaction}&category=${category}`);
        form.values = { ...blankValues, ...(filled ? {
          price: "1,200,000", minPrice: "1,000", maxPrice: "2,000", loanEnabled: true,
          loanAmount: "100", loanInstallment: "10", exchangeEnabled: true,
          exchangeTargets: ["آپارتمان"], facilities: ["elevator", "parking"],
          elevatorCount: "۲", parkingCount: "3", renovated: true, unitsPerFloor: "2",
        } : {}) };
        const markup = renderToStaticMarkup(createElement(NewAdDesktopLayoutContext.Provider,
          { value: desktop }, createElement(DetailsStep, {
            label: "آپارتمان", onNext: () => {},
            errors: filled ? { price: "خطای قیمت", exchangeTargets: "خطای معاوضه", meterage: "خطای متراژ" } : {},
          })));
        results.push(`${transaction}/${category}/${desktop}/${filled}: ${createHash("sha256").update(markup).digest("hex")}`);
      }
    }
  }
  expect(results).toMatchInlineSnapshot(`
    [
      "sale/apartment/false/false: 644de95356f4ed8a0c4cf149087666c14e292d59e85e74d3ba867ac4a210a935",
      "sale/apartment/false/true: 18187ce1906cfe37949fcc8b9d46c2dae1a067b7a2bc7775a718ead11e8e916a",
      "sale/apartment/true/false: 35323dc47f82fc93bfda289f19c43ff72a169ec459edfcd4c27d8012c741f639",
      "sale/apartment/true/true: f1ed1cca76745ae941971520c03558f32add44f158ffa1ddb9cb7756fee9c5d8",
      "sale/garden-villa/false/false: 91c3ee0f871446d384af8da9a9c1cdf2107823e4494ec0285e2b1c425f806e9e",
      "sale/garden-villa/false/true: b3ac8362dccb82a7db37e60cec4b7ed8c25b976a1b834fc79b80c86a64046135",
      "sale/garden-villa/true/false: a429338767a1f792dfa5c94d539ff03d61c709039f976191f238b71f3d0884f7",
      "sale/garden-villa/true/true: 9bd87861a849b5b6b291a80ef2c20f3d8e026ec0f23e8a9d93e45a47b893e6cc",
      "sale/land/false/false: 3e66b4e331f8df5d9809a4f7e99e3390239d7415174e4525d7e1056ac8d18004",
      "sale/land/false/true: e4675dfaef126b12a951dae0598b8d2a34876212558953a5dbcfe1c1a996393a",
      "sale/land/true/false: 5dee5d97059b07123c29c8631108b792550c7169905799f25c0de88c3c7a9577",
      "sale/land/true/true: 09bd9d6b43a7939c52b696b1604e62bc93dfd52b5b7027703a3e3d6f8f1ce9c1",
      "sale/office/false/false: 0f0eb2f06264d0ac23fb16940a9f4cda774781445fb85f505c5a9782dabde2ea",
      "sale/office/false/true: a112b1be533d6407df108570182918b113bb548a080259828d85cfd7baf13429",
      "sale/office/true/false: e8939874d0e77940892c1a7d6d666c6f477730032dc9df77f8d22e926d0f9a2e",
      "sale/office/true/true: 5675d32494405e6cead1e254ffa35829cc3ea30a15ba08a5258ea2261c3a0c91",
      "rent/apartment/false/false: f25bd6cb2c15f5ecf360b743feacd660779c84ffc20d3213385a8046b38c089b",
      "rent/apartment/false/true: 904f73c3187482af2c77d3ef8aaa757cf31bbcd47c363d931c441bd70c1496dc",
      "rent/apartment/true/false: 8a9a8d7068e1fc1062d261ae6bd016081b6536ea5caaba09024390a30a6c7cb9",
      "rent/apartment/true/true: e9df7055bfdc57076a0e00be30936ef49b898fd140d65fb4c1357eda24597057",
      "rent/daily-apartment-suite/false/false: fd9a17bd32143cfb521b60f94089477648fde4e780dfb6e5f4c55c9fc6361035",
      "rent/daily-apartment-suite/false/true: 9f24b07e073fa7e0dea841fe67b387cc06d80f4593a0cd3870ba7470dd5752ef",
      "rent/daily-apartment-suite/true/false: de245e98c20ae7b68a2e9e5104226d19bdb1f0c14537fe6711e1e4cc03dd7f86",
      "rent/daily-apartment-suite/true/true: 755570cb86b9ebbb4aca2823554b0153c1a0d94e8202d78155d2d062b51b4d94",
      "rent/daily-hotel-apartment/false/false: 2c71b69ed9911ac5dd6f89ba0320de8604f302737ab7dc06c8bdbc846e73a086",
      "rent/daily-hotel-apartment/false/true: d0e9d66152b08f530460d84b0c0c0944fdb6281fa05dd9de700981fdc68b119d",
      "rent/daily-hotel-apartment/true/false: 52f2428e02404bcdca8fa1424ffee997cf0689a662e0649dd37dd38d31c5dc36",
      "rent/daily-hotel-apartment/true/true: 45483ee75438cca93d4d12b82e6ba0b9109b69bac598c7eefcc7e5b0d4f4ba6c",
      "rent/daily-workspace/false/false: 3dc8908eed4e4ff279fa07dcb3f3d681e31773f974220277281650e92b64acbd",
      "rent/daily-workspace/false/true: fb1ae68e9c008628c90a67eb142b1ea8ffa986590c72ec8fca3ad0189c8ca941",
      "rent/daily-workspace/true/false: 909bb81cbdef5f72d076ae82a80ed9c50983ccfc88b36b5ccf8dd6b777a357fa",
      "rent/daily-workspace/true/true: 4c62bac160501d5c28e9fce2d65cc7f898061fdd0d26728daae367b6d513e7e5",
      "project/project-presale/false/false: ce7a55856d4e3fa39f17c8a7c940650e93a72bb081489a4089265f60fde87e37",
      "project/project-presale/false/true: 9a0d03f391d8a8ca28cf9a15074dad71460fbc5190800fdfb7bf7053cb4b01c6",
      "project/project-presale/true/false: 5f1b036db6ea1a95ea557daf9873d33dad72ca13b6a1e1276d17e05176786a29",
      "project/project-presale/true/true: c68d7d97a1b4b12da49eb279325576c91535c1acb49e59c59127f9faec47eb61",
      "project/project-partnership/false/false: 6a59522fe9db85003178e0238efc9b9080bb3a860c8429e3079c83359af8baef",
      "project/project-partnership/false/true: 6a59522fe9db85003178e0238efc9b9080bb3a860c8429e3079c83359af8baef",
      "project/project-partnership/true/false: 091a4a65ee7bcc75eebb5b86638b9002235efbfb560a3b3499c23b662e5c735d",
      "project/project-partnership/true/true: 091a4a65ee7bcc75eebb5b86638b9002235efbfb560a3b3499c23b662e5c735d",
      "unknown/factory-workshop/false/false: c2147aa9581a825f420a4bac214a4f6660045fd87caf395c31f9ef873d3b8192",
      "unknown/factory-workshop/false/true: b1a575a7498c24c97840b4f4d987c7c05e6f6b426037dd116bd11aa465982e1d",
      "unknown/factory-workshop/true/false: 17b668c0330c61bbd38a90a23a2c0b860b0404f3b2183c1f7a89f7a8e9b1f38d",
      "unknown/factory-workshop/true/true: c382138bcdaef91b2b453bbd899ec2b28d87723ba41fb494b4bc658e1b4abe0d",
    ]
  `);
}, 60000);
