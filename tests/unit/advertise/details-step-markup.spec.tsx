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
      "sale/apartment/false/false: c34e3f02d487bf739cd184e2933683fe795e44ce2ba7da77861642886ec45ea8",
      "sale/apartment/false/true: 08ff964739df18b09bdc0dbaa23dcd399466adce3750429d666d8a9d0205f76a",
      "sale/apartment/true/false: cb3f53b3ff1a159905f8996dda768bbb052074d128b7ea1e2fc1ec5ce6b793c6",
      "sale/apartment/true/true: 6d3674ac700012815552ffc6e76c9d3d70b49adb360b2ee317e16bdb2ed85e07",
      "sale/garden-villa/false/false: 8a8d4dedbb942ae487a5ba8dc0800eec5f65ec4153fa6ab5be64f7b12827f0d7",
      "sale/garden-villa/false/true: 0e7b18ece33ce07785dbe69a552101eea4863dca7794bbed6f50525a98e095f3",
      "sale/garden-villa/true/false: e0b7f47cdaf3cfff62651d2c3de5870e373629ab87a7d3a68d77130a17e1242a",
      "sale/garden-villa/true/true: f36001f21fc468f0e965b4127f390f736bc4d16fb5858be7e7db060473e338c0",
      "sale/land/false/false: 7452301a85a8fc3869051b1ce2575fe29137408b74f63da4e47ba5fa86055d19",
      "sale/land/false/true: ab5d6d9f6b9bb112893600f9b06207574ea09b61f103d3fb10641d2d576e4ed2",
      "sale/land/true/false: add58331b1368b2377b40cbb16d9afcc53b340d86e9c508c63bf8987b2fb0f9d",
      "sale/land/true/true: 46fc5cfbbc3e23819ec741dd6d14de6aa58e861e15f2317560516b9dc10d0185",
      "sale/office/false/false: 129dc79e4f9e11eb5c79de2e06b6e53b3de2a4018e852124c359c0ec77a7c24d",
      "sale/office/false/true: ebe5dda09d5093abbbb842567601cf2b8bfe218dd2f89c1b85f12f9e2a963bd1",
      "sale/office/true/false: f52e92f6736b35b05f2e85023d61e17a133a076eeca413e1456397398ca8aa83",
      "sale/office/true/true: 71d929787c1961abcf8a5c87f86581a054c3583cdef5ed9e3f3a47a2b7dd77d9",
      "rent/apartment/false/false: ad6524212fc58b49be19079a20611a1de6382a9af813deff2501623c28263be8",
      "rent/apartment/false/true: e335fd611da953f0fa2443f8e9f9056350e3b974d46cd03048b835a9dabe7ad1",
      "rent/apartment/true/false: 712f247af43c10d1bf08875f555983189ac8153a00b469e2bf6f9e03ef1081da",
      "rent/apartment/true/true: d88bfe129d36853a03d3da55cc10a3d3dd70a26a90b27c807521329d0c73dc69",
      "rent/daily-apartment-suite/false/false: eaacf6d6781c03553ad0756c4ef30efeb20b9be2306cd54b33dd6f1371b47942",
      "rent/daily-apartment-suite/false/true: f99c1239006bb14831e96edb4f709daa1fcc3108e0d8019e628a6b431daaa735",
      "rent/daily-apartment-suite/true/false: 7e5028442af5c5403e69280acc45f93a969c1d27ac2946884c0febca0eee9be4",
      "rent/daily-apartment-suite/true/true: 70cf6fef7b0e5a54f3a55aa193ab45e6bf4fa5137fd8c58befa5b6f17fa2bc0a",
      "rent/daily-hotel-apartment/false/false: d64431db07dd70460d7223339cfd46b3a037e71e9c680194a0bf5f86502d456f",
      "rent/daily-hotel-apartment/false/true: 7c18f96fcb81aa734cc3f4e9d14f4c31b76548b635146dcc41b9740f3026247b",
      "rent/daily-hotel-apartment/true/false: fcf1e228fb4469897b9fffea62a5045bd5989929680cec1affa9c4c64b5008f5",
      "rent/daily-hotel-apartment/true/true: c7376ff69608c6c27d2a5f727e3da9d386edd114d188cf0af5277e4abe40f034",
      "rent/daily-workspace/false/false: 989bc53d15fe7711c6c9c453dab7a1b82c1ceb7c9a63472f7c29a3090c61d637",
      "rent/daily-workspace/false/true: 1666132651a33c2e66df6ab1e485573a81aa22b86ad77a74bcbb22eea0b0bbbd",
      "rent/daily-workspace/true/false: be679cd40641f045f54fb25a22b048f66ce3ee8ebb035cee1380f44ccbd180c6",
      "rent/daily-workspace/true/true: ce1e83eda711f11b44f9e07404049b3cf1a99df517e3fd8da46165f4d53fcf20",
      "project/project-presale/false/false: 7e11135274695aee79ed6e70f73e37c068540618d40db84156dcdb9b732f0d84",
      "project/project-presale/false/true: bc2b6442d855487670c4b02a7226c87002656536fc9d40325c5e33e521c225f7",
      "project/project-presale/true/false: 4a52bdd47f28f89beae79e22d518d697df89ad284629c73bfd8994d2c40f21a1",
      "project/project-presale/true/true: e45b4735fef332b3f7415258dc9303ce0f56707b988b457ad3ff6e38a42b9f2a",
      "project/project-partnership/false/false: fac1e3e4c84a02f36cd2e9b8e41df4f24d3a49b8b8bdae8b1021419f9bda57a1",
      "project/project-partnership/false/true: fac1e3e4c84a02f36cd2e9b8e41df4f24d3a49b8b8bdae8b1021419f9bda57a1",
      "project/project-partnership/true/false: e61e568dbd239b4756ec5b7c9c88f7d634ca5ee9fb9907ab404f35cf5d5e9613",
      "project/project-partnership/true/true: e61e568dbd239b4756ec5b7c9c88f7d634ca5ee9fb9907ab404f35cf5d5e9613",
      "unknown/factory-workshop/false/false: 22ca7e47737468a3a743cccebd11e66ca7064a9bb1fcd60cd584c21eda80912e",
      "unknown/factory-workshop/false/true: 1bc063c51255239fd045ee386ad0c863037cd36566ac961c9910792edbe2a7f7",
      "unknown/factory-workshop/true/false: 6988b299157c024e1fa82d2dbb86e178f9fbf86cff6345348b14c289f5db49d2",
      "unknown/factory-workshop/true/true: 1aa4a64d2606b129ab9e1670d1ebb3704e094e071126fb883001f248b353236c",
    ]
  `);
}, 60000);
