import type { AdFormSchema } from "./types";
import {
  ageOptions,
  exchangeTargets,
  floorOptions,
  roomOptions,
  saleVillaHouseTypeOptions,
  totalFloorsOptions,
  unitsPerFloorOptions,
  villaTotalFloorsOptions,
} from "../create/data";

import saleApartment from "./sale-apartment.json" with { type: "json" };
import saleVillaHouse from "./sale-villa-house.json" with { type: "json" };
import saleGardenVilla from "./sale-garden-villa.json" with { type: "json" };
import saleLand from "./sale-land.json" with { type: "json" };
import saleOffice from "./sale-office.json" with { type: "json" };
import saleCommercial from "./sale-commercial.json" with { type: "json" };
import saleFactory from "./sale-factory.json" with { type: "json" };
import saleHotel from "./sale-hotel.json" with { type: "json" };
import saleWarehouse from "./sale-warehouse.json" with { type: "json" };

import rentApartment from "./rent-apartment.json" with { type: "json" };
import rentVillaHouse from "./rent-villa-house.json" with { type: "json" };
import rentGardenVilla from "./rent-garden-villa.json" with { type: "json" };
import rentOffice from "./rent-office.json" with { type: "json" };
import rentCommercial from "./rent-commercial.json" with { type: "json" };
import rentFactoryWorkshop from "./rent-factory-workshop.json" with { type: "json" };
import rentHotel from "./rent-hotel.json" with { type: "json" };
import rentWarehouse from "./rent-warehouse.json" with { type: "json" };

import dailyApartmentSuite from "./daily-apartment-suite.json" with { type: "json" };
import dailyGardenVilla from "./daily-garden-villa.json" with { type: "json" };
import dailyHotel from "./daily-hotel.json" with { type: "json" };
import dailyOfficeBooth from "./daily-office-booth.json" with { type: "json" };

import partnership from "./partnership.json" with { type: "json" };
import presaleSpecial from "./presale-special.json" with { type: "json" };

export * from "./types";

const formSchemas: Record<string, AdFormSchema> = {
  "sale-apartment": saleApartment as AdFormSchema,
  "sale-villa-house": saleVillaHouse as AdFormSchema,
  "sale-garden-villa": saleGardenVilla as AdFormSchema,
  "sale-land": saleLand as AdFormSchema,
  "sale-office": saleOffice as AdFormSchema,
  "sale-commercial": saleCommercial as AdFormSchema,
  "sale-factory": saleFactory as AdFormSchema,
  "sale-hotel": saleHotel as AdFormSchema,
  "sale-warehouse": saleWarehouse as AdFormSchema,

  "rent-apartment": rentApartment as AdFormSchema,
  "rent-villa-house": rentVillaHouse as AdFormSchema,
  "rent-garden-villa": rentGardenVilla as AdFormSchema,
  "rent-office": rentOffice as AdFormSchema,
  "rent-commercial": rentCommercial as AdFormSchema,
  "rent-factory-workshop": rentFactoryWorkshop as AdFormSchema,
  "rent-hotel": rentHotel as AdFormSchema,
  "rent-warehouse": rentWarehouse as AdFormSchema,

  "daily-apartment-suite": dailyApartmentSuite as AdFormSchema,
  "daily-garden-villa": dailyGardenVilla as AdFormSchema,
  "daily-hotel": dailyHotel as AdFormSchema,
  "daily-office-booth": dailyOfficeBooth as AdFormSchema,

  partnership: partnership as AdFormSchema,
  "presale-special": presaleSpecial as AdFormSchema,
};

const formCodeByListingKey: Record<string, string> = {
  "project:project-partnership": "partnership",
  "project:project-presale": "presale-special",
  "rent:commercial-unit": "rent-commercial",
  "rent:daily-apartment-suite": "daily-apartment-suite",
  "rent:daily-garden-villa": "daily-garden-villa",
  "rent:daily-hotel-apartment": "daily-hotel",
  "rent:daily-workspace": "daily-office-booth",
  "rent:factory-workshop": "rent-factory-workshop",
  "rent:hotel-apartment": "rent-hotel",
  "rent:warehouse": "rent-warehouse",
  "sale:commercial-unit": "sale-commercial",
  "sale:factory-workshop": "sale-factory",
  "sale:garden-villa": "sale-garden-villa",
  "sale:hotel-apartment": "sale-hotel",
  "sale:office": "sale-office",
  "sale:warehouse": "sale-warehouse",
};

function getFormCodeForListing(transaction: string, category: string): string {
  return (
    formCodeByListingKey[`${transaction}:${category}`] ??
    [transaction, category].filter(Boolean).join("-")
  );
}

function normalizeOptions(
  options: string[] | undefined,
  key?: string,
  category?: string,
): string[] | undefined {
  if (!options) return options;
  if (key === "floor") return floorOptions;
  if (key === "totalFloors") {
    return category === "villa-house" ? villaTotalFloorsOptions : totalFloorsOptions;
  }
  if (key === "age") return ageOptions;
  if (key === "rooms") return roomOptions;
  if (key === "unitsPerFloor") return unitsPerFloorOptions;
  if (key === "villaType") return saleVillaHouseTypeOptions;
  return options;
}

function normalizeSchemaOptions(schema: AdFormSchema | null): AdFormSchema | null {
  if (!schema) return null;
  const clone = { ...schema };
  const category = clone.category;
  if (clone.create?.basicFields) {
    clone.create = {
      ...clone.create,
      basicFields: clone.create.basicFields.map((f) => ({
        ...f,
        options: normalizeOptions(f.options, f.key, category),
      })),
    };
  }
  if (clone.create?.moreFeatures?.fields) {
    clone.create = {
      ...clone.create,
      moreFeatures: {
        ...clone.create.moreFeatures,
        fields: clone.create.moreFeatures.fields.map((f) => ({
          ...f,
          options: normalizeOptions(f.options, f.key, category),
        })),
      },
    };
  }
  if (clone.filter?.sections) {
    clone.filter = {
      ...clone.filter,
      sections: clone.filter.sections.map((section) => {
        if (!section.options) return section;
        if (section.id === "floor") return { ...section, options: floorOptions };
        if (section.id === "totalFloors") {
          return {
            ...section,
            options: category === "villa-house" ? villaTotalFloorsOptions : totalFloorsOptions,
          };
        }
        if (section.id === "age") return { ...section, options: ageOptions };
        if (section.id === "rooms") return { ...section, options: roomOptions };
        if (section.id === "unitsPerFloor") return { ...section, options: unitsPerFloorOptions };
        if (section.id === "villaType") return { ...section, options: saleVillaHouseTypeOptions };
        if (section.id === "exchangeWith") return { ...section, options: exchangeTargets };
        return section;
      }),
    };
  }
  return clone;
}

function getFormSchema(formCode: string): AdFormSchema | null {
  return normalizeSchemaOptions(formSchemas[formCode] ?? null);
}

export function getFormSchemaByListing(transaction: string, category: string): AdFormSchema | null {
  const formCode = getFormCodeForListing(transaction, category);
  return getFormSchema(formCode);
}
