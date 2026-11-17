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
      "sale/apartment/false/true: 925012c1de913e100b56ab9a00bf4fedfffdd59cf70beb9ff166bfdd106ec324",
      "sale/apartment/true/false: cb3f53b3ff1a159905f8996dda768bbb052074d128b7ea1e2fc1ec5ce6b793c6",
      "sale/apartment/true/true: 3f6407f069376395fca264cd4511f708a8aedf00f13cea6b2562f31131eaaac2",
      "sale/garden-villa/false/false: 8a8d4dedbb942ae487a5ba8dc0800eec5f65ec4153fa6ab5be64f7b12827f0d7",
      "sale/garden-villa/false/true: e98f8c34d5d24a0ce84cd0ea09330533246a420fa09fc82fa1982895e7f53103",
      "sale/garden-villa/true/false: e0b7f47cdaf3cfff62651d2c3de5870e373629ab87a7d3a68d77130a17e1242a",
      "sale/garden-villa/true/true: e1b721ac24e0073ef5880d0c04b54b3bd7158a488053e115b0b6d32b4b535c77",
      "sale/land/false/false: 7452301a85a8fc3869051b1ce2575fe29137408b74f63da4e47ba5fa86055d19",
      "sale/land/false/true: 6cabf8a2e2a2f8987636c23e759982bc80519b2405e331aa6312c90f989afacd",
      "sale/land/true/false: add58331b1368b2377b40cbb16d9afcc53b340d86e9c508c63bf8987b2fb0f9d",
      "sale/land/true/true: 017ec9d6bca6059b8915826aadcb8cbfdeaaa59da79f829cae77c32019b094e5",
      "sale/office/false/false: 129dc79e4f9e11eb5c79de2e06b6e53b3de2a4018e852124c359c0ec77a7c24d",
      "sale/office/false/true: 585d173019fefe7bc8c6c19672c44c555901984156f849d57330890003908ac0",
      "sale/office/true/false: f52e92f6736b35b05f2e85023d61e17a133a076eeca413e1456397398ca8aa83",
      "sale/office/true/true: 5ca013d1d105b90942259199ea58925bd7d72fb6e5641ce0a83b8567e02562c1",
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
      "project/project-presale/false/false: 7411b4a72e1ea4131458849ec94d2db07c5c04a5b51690ab1f1c47af05d24d7f",
      "project/project-presale/false/true: 011435cb8a8a6a226bf10956c0e86dd84606cc456076e4f8b2558a8d904ddeeb",
      "project/project-presale/true/false: 94d28461249077b211364f7becf5bc902e26b356620890fd5e95f4a87bc80df5",
      "project/project-presale/true/true: bdf6d1d8ade2a079126a370d0fc79422b1cfe1099b3aec0f659c22f67f27a911",
      "project/project-partnership/false/false: fac1e3e4c84a02f36cd2e9b8e41df4f24d3a49b8b8bdae8b1021419f9bda57a1",
      "project/project-partnership/false/true: fac1e3e4c84a02f36cd2e9b8e41df4f24d3a49b8b8bdae8b1021419f9bda57a1",
      "project/project-partnership/true/false: e61e568dbd239b4756ec5b7c9c88f7d634ca5ee9fb9907ab404f35cf5d5e9613",
      "project/project-partnership/true/true: e61e568dbd239b4756ec5b7c9c88f7d634ca5ee9fb9907ab404f35cf5d5e9613",
      "unknown/factory-workshop/false/false: 22ca7e47737468a3a743cccebd11e66ca7064a9bb1fcd60cd584c21eda80912e",
      "unknown/factory-workshop/false/true: 949b29fbfd18026d91eef3cdec35f0a0da156108a8fbde5e281193f0c0d24661",
      "unknown/factory-workshop/true/false: 6988b299157c024e1fa82d2dbb86e178f9fbf86cff6345348b14c289f5db49d2",
      "unknown/factory-workshop/true/true: 29625bf6f26c7b29ca10ef090179225cdc529ff7484dd38fc5f66de08bb69d92",
    ]
  `);
}, 60000);
