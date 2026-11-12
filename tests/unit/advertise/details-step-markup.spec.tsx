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
      "sale/apartment/false/false: a8d903a6480aec7279e8cfd66f7f5a07c77211a4388eb43b87f18af92db28933",
      "sale/apartment/false/true: 006fb289084153a6902f31613dbc529995a82a60ffc8d80a1cfb1a5eac7809b1",
      "sale/apartment/true/false: 62532189a9a5c542ece0c61221761920b945c0c8e7957eaf76d5b7c264754dfb",
      "sale/apartment/true/true: ec460f75c883ac610420387a32c01883c8d2651dcf6f5171a8d97af6fc6113b7",
      "sale/garden-villa/false/false: aa553d3559712ca5305c0baf26c7a31d1d825819387612cf6225d77e9e1c7c93",
      "sale/garden-villa/false/true: 9ac49e94c75e66ed94fc6d55580575d8b8ac2e2de5cabbe5075982d30ff469ea",
      "sale/garden-villa/true/false: 36e101d2ce3954c2c86803eefb7c73d2b9afea3617002749df509931e1e2b9b8",
      "sale/garden-villa/true/true: fc69d992e12bdd1682b320dd7df5da68a1903e37582919ce2d2e53b000e40a3e",
      "sale/land/false/false: abe46f0f5692625b3f151c797921957627650ae5cd2a89346e2672442a6871a1",
      "sale/land/false/true: 383533023e376f8658732f9ea7e25d5f1b9669a84a7292168237e8c6a540f2bf",
      "sale/land/true/false: 6f110e035530a383149e061e019b06ffdba1cb50fb30d26260081080d70ae888",
      "sale/land/true/true: 4fbc17ab7d98276ef448f428678f95432badaa9657033071ba529e74bb95d333",
      "sale/office/false/false: c50a44a47ce50d4020f479705f258b7d81b6032f1754b6d30ce787db3316e8c3",
      "sale/office/false/true: 7b2694f0295eb6be88388f775355233276ec0d70a5c2fb5dcbe88092ac079133",
      "sale/office/true/false: 76fc3773f47ffaa38c37351a38d986f0240ba69ac0f6960daf8f110c8733ca8a",
      "sale/office/true/true: d0e0ee162e140f53ad7a449f83d8c75344fd104bb9f52156903277acace7481b",
      "rent/apartment/false/false: 1962ef107216af42e30a8a16caaa82917619b3706f9f7b92f35d8665ee413a12",
      "rent/apartment/false/true: 9d92de3649d65189268664d522de4640bf4d376a646a947c57150f59c0c32445",
      "rent/apartment/true/false: 6d9fae1df3557282726618379d63247608e7ec1bd0f44f224515c5636ef8908b",
      "rent/apartment/true/true: b69f3901a19d162060092a7d03ffa3287a43d1c1fcf6d569d8a87ee7f8463354",
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
      "project/project-presale/false/false: 3d85bceb5e0161570305e729bcf4e39eb714e567129b1fa4691130df0a673474",
      "project/project-presale/false/true: b63a9773447136f919617948b81ec496386f82c7b3b2e2670f2422e14113abf5",
      "project/project-presale/true/false: 4c2b6144ba9ce3852b29ae5007e53221a398a6dc45ca2fe98bedef67752bbdf0",
      "project/project-presale/true/true: 260ff206f30741f3c25636ac59cde6dbe9b25b48639edf00e53cccab19c404fb",
      "project/project-partnership/false/false: fac1e3e4c84a02f36cd2e9b8e41df4f24d3a49b8b8bdae8b1021419f9bda57a1",
      "project/project-partnership/false/true: fac1e3e4c84a02f36cd2e9b8e41df4f24d3a49b8b8bdae8b1021419f9bda57a1",
      "project/project-partnership/true/false: e61e568dbd239b4756ec5b7c9c88f7d634ca5ee9fb9907ab404f35cf5d5e9613",
      "project/project-partnership/true/true: e61e568dbd239b4756ec5b7c9c88f7d634ca5ee9fb9907ab404f35cf5d5e9613",
      "unknown/factory-workshop/false/false: b3b633242f7fae77a5e2c96a2d3055114976c3671dc46c1864d1fdcabc610712",
      "unknown/factory-workshop/false/true: 478512fd992d246a44459788bc531a2ea7f41120d87948e070e30a7c84d33741",
      "unknown/factory-workshop/true/false: abbacfc141479cad527f17a94a45c9cf726f7881ed1f932e77229102ecd1c881",
      "unknown/factory-workshop/true/true: 7a3586ff09f0d156c50029a04ad6abf0b4b769756a033786201f944177f70ce1",
    ]
  `);
}, 60000);
