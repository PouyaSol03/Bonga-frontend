import type { AdFormSchema } from "./types";

import saleApartment from "./sale-apartment.json";
import saleVillaHouse from "./sale-villa-house.json";
import saleGardenVilla from "./sale-garden-villa.json";
import saleLand from "./sale-land.json";
import saleOffice from "./sale-office.json";
import saleCommercial from "./sale-commercial.json";
import saleFactory from "./sale-factory.json";
import saleHotel from "./sale-hotel.json";
import saleWarehouse from "./sale-warehouse.json";

import rentApartment from "./rent-apartment.json";
import rentVillaHouse from "./rent-villa-house.json";
import rentGardenVilla from "./rent-garden-villa.json";
import rentOffice from "./rent-office.json";
import rentCommercial from "./rent-commercial.json";
import rentFactoryWorkshop from "./rent-factory-workshop.json";
import rentHotel from "./rent-hotel.json";
import rentWarehouse from "./rent-warehouse.json";

import dailyApartmentSuite from "./daily-apartment-suite.json";
import dailyGardenVilla from "./daily-garden-villa.json";
import dailyHotel from "./daily-hotel.json";
import dailyOfficeBooth from "./daily-office-booth.json";

import partnership from "./partnership.json";
import presaleSpecial from "./presale-special.json";

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

export function getFormCodeForListing(transaction: string, category: string): string {
  return formCodeByListingKey[`${transaction}:${category}`] ?? [transaction, category].filter(Boolean).join("-");
}

export function getFormSchema(formCode: string): AdFormSchema | null {
  return formSchemas[formCode] ?? null;
}

export function getFormSchemaByListing(transaction: string, category: string): AdFormSchema | null {
  const formCode = getFormCodeForListing(transaction, category);
  return getFormSchema(formCode);
}

export function getAllFormSchemas(): AdFormSchema[] {
  return Object.values(formSchemas);
}
