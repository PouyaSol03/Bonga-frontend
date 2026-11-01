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
      "sale/apartment/false/false: cbcfc26f8e0d698d428f3a6d657eefaa39b9e23ecc8db69d29c961373cf8bf51",
      "sale/apartment/false/true: 2c72619ac8d689af5b12152c3b919ed590ebfcb87a1b426230d6379f055adbe7",
      "sale/apartment/true/false: 6828ac9f4d6ccc8c6ba8698e357640fc7689c6937b0aa2a2b93280f6c4ff2a81",
      "sale/apartment/true/true: 5e02b87bfb2c8f8e92d93517e79806dfdd89300ef7012de3decc03eba4dcc3e8",
      "sale/garden-villa/false/false: 37de61c3b7908aabdc1c18f862f71951c229142b196fb5a53c3c5d048bf8ec9c",
      "sale/garden-villa/false/true: d843ecb99aa115158e40ef9eb86ba54f8782e65b7941645babc6dc39f3749229",
      "sale/garden-villa/true/false: 7ee53078b3352fc67f34f92adb13efad2a1cd04848670685c2b69650e0d2e104",
      "sale/garden-villa/true/true: 059ed0a80a70eb2e14be6e508061f8639d19a688b7d34f02308c37c3190a89e6",
      "sale/land/false/false: 3e66b4e331f8df5d9809a4f7e99e3390239d7415174e4525d7e1056ac8d18004",
      "sale/land/false/true: e4675dfaef126b12a951dae0598b8d2a34876212558953a5dbcfe1c1a996393a",
      "sale/land/true/false: 5dee5d97059b07123c29c8631108b792550c7169905799f25c0de88c3c7a9577",
      "sale/land/true/true: 09bd9d6b43a7939c52b696b1604e62bc93dfd52b5b7027703a3e3d6f8f1ce9c1",
      "sale/office/false/false: 2bd41af4c1f2a7467b1c3157f038e2563478de15f5a3aaa1e8cb56922cdf3df1",
      "sale/office/false/true: 964ab16d8b3f3f6608b93624a816ba0236e7263003f227145689607aa78a457c",
      "sale/office/true/false: 7c7255d34f47c66d022ab80eee7e81f1262dceed83818becc9fd800bc10a0ac4",
      "sale/office/true/true: a7e08a9c2f60c676fd24f960e366889ef0f2b2fa909f8edab6124612c90e65a5",
      "rent/apartment/false/false: 2c097d1e123fcb8b662a5ce57898f10d211219166eebcaf74f25e3f325427456",
      "rent/apartment/false/true: 2cb92f9fa43c78a70c0119ceaa954a3541f55c1bd5cd7a2034f78bd1ef2ab70e",
      "rent/apartment/true/false: 1574d427095a392adf02840ad9555116d539cb33f3438d500d7cedb8648dea6d",
      "rent/apartment/true/true: 8dfb4d9afb49e7d2235ed4813ef7c487c66ea9cb3d0adf3ddb2f496355e29ede",
      "rent/daily-apartment-suite/false/false: 6e1815227e2820b8ac2ea1afbf8dc47b414d02a3bae3d1899068b8728e44b405",
      "rent/daily-apartment-suite/false/true: 5c9e45e0af23cc524de35cd484a5fa55d29c15944201065e570814ca47e4d1b6",
      "rent/daily-apartment-suite/true/false: 37573ff7a9a4c98e3681a3ae61cf7f40f5e1e4f0aab135c5f91a65400b7d6a5c",
      "rent/daily-apartment-suite/true/true: 7c89533dfdaea0e15deccac9ae640e74820df1273fe2fc577985588d75aa4098",
      "rent/daily-hotel-apartment/false/false: dea1093d27158ab03f3f571ba1ca2ead4912cc5731929741686db6418564cfef",
      "rent/daily-hotel-apartment/false/true: 8010d87748c48e97b6d8eb6f085028feb45f96cad52110cf5bb58c134e1ab40f",
      "rent/daily-hotel-apartment/true/false: ce72367b0c43c4b574dd46fb5aaf94b5a91725c51f582abec92396c23e153e5b",
      "rent/daily-hotel-apartment/true/true: 5c19866439de8e6a3903b16e09e74e88f283e9415243576927e7112e1a83cada",
      "rent/daily-workspace/false/false: 5b50123f4c388a9813fa0b3c20e7f252ffe4b9e2a2edc21c05d3e4ebf84eacd1",
      "rent/daily-workspace/false/true: 7fd13fa259bd4e836ca83b693172bc64ab06b3f98e42538cdedff47a801569ce",
      "rent/daily-workspace/true/false: 880f25edda5a1cf61b6a823eca65eee4b192facd6b426f2f54a17b0d1a5d89d5",
      "rent/daily-workspace/true/true: af168d0fbf152fde0e2abd6a72ee333298a0c06f3d39e0d7dc5ed74c01950f24",
      "project/project-presale/false/false: b2bd7166ed1549c7dc586a94fa0081b50c9078333eb5be85315ba327f76fecc3",
      "project/project-presale/false/true: 85162ee588206a30ba3f0ffad8fa6b866603e96ffdf80fe0ada667edcd020cf4",
      "project/project-presale/true/false: 03f376bb10059817add4b1178aff09cc575b1da90dfe2a9c0c04f52a591dafc7",
      "project/project-presale/true/true: cb59d16c990f6c2f5094883d54ad1d0a30627af5bbf277f217d369cb3948037d",
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
