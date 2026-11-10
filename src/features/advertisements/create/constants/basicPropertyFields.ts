import type { BasicPropertyField } from "../types";
import {
  ageOptions,
  floorOptions,
  roomOptions,
  saleLandDocumentTypeOptions,
  saleCommercialPositionOptions,
  saleCommercialOwnershipOptions,
  landPositionOptions,
  suitableForOptions,
  saleAccommodationTypeOptions,
  saleHotelStarsOptions,
  saleLandPositionOptions,
  commercialLicenseOptions,
  dailyAccommodationTypeOptions,
  capacityOptions,
  dailyWorkspaceTypeOptions,
  dailyHotelStarsOptions,
  dailyHotelAccommodationTypeOptions,
} from "./propertyOptions";
const saleApartmentBasicFields: BasicPropertyField[] = [
  {
    key: "meterage",
    label: "متراژ آپارتمان",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const saleVillaHouseBasicFields: BasicPropertyField[] = [
  {
    key: "landArea",
    label: "متراژ زمین",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "buildingArea",
    label: "متراژ زیربنا",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const saleLandBasicFields: BasicPropertyField[] = [
  {
    key: "landArea",
    label: "متراژ زمین",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "documentType",
    label: "سند",
    control: "select",
    options: saleLandDocumentTypeOptions,
    required: true,
  },
];

const saleOfficeBasicFields: BasicPropertyField[] = [
  {
    key: "meterage",
    label: "متراژ",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سال ساخت", control: "select", options: ageOptions, required: true },
];

const saleCommercialUnitBasicFields: BasicPropertyField[] = [
  {
    key: "meterage",
    label: "متراژ",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "commercialPosition",
    label: "موقعیت تجاری",
    control: "select",
    options: saleCommercialPositionOptions,
    required: true,
  },
  {
    key: "documentType",
    label: "سند",
    control: "select",
    options: saleLandDocumentTypeOptions,
    required: true,
  },
  {
    key: "ownershipStatus",
    label: "وضعیت مالکیت",
    control: "select",
    options: saleCommercialOwnershipOptions,
    required: true,
  },
];

const saleWarehouseBasicFields: BasicPropertyField[] = [
  {
    key: "landArea",
    label: "متراژ زمین",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "buildingArea",
    label: "زیربنا",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "landPosition",
    label: "موقعیت زمین",
    control: "select",
    options: landPositionOptions,
    required: true,
  },
  {
    key: "suitableFor",
    label: "مناسب برای",
    control: "multiSelect",
    options: suitableForOptions,
    required: true,
  },
];

const saleHotelApartmentBasicFields: BasicPropertyField[] = [
  {
    key: "accommodationType",
    label: "نوع اقامتگاه",
    control: "select",
    options: saleAccommodationTypeOptions,
    required: true,
  },
  {
    key: "hotelStars",
    label: "رتبه اقامتگاه",
    control: "select",
    options: saleHotelStarsOptions,
    required: true,
  },
  {
    key: "landArea",
    label: "متراژ زمین",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "buildingArea",
    label: "متراژ بنا",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "documentType",
    label: "سند",
    control: "select",
    options: saleLandDocumentTypeOptions,
    required: true,
  },
];

const saleFactoryWorkshopBasicFields: BasicPropertyField[] = [
  {
    key: "landArea",
    label: "متراژ زمین",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "landPosition",
    label: "موقعیت زمین",
    control: "select",
    options: saleLandPositionOptions,
    required: true,
  },
  { key: "age", label: "سال ساخت", control: "select", options: ageOptions, required: true },
  {
    key: "documentType",
    label: "سند",
    control: "select",
    options: saleLandDocumentTypeOptions,
    required: true,
  },
];

const rentApartmentBasicFields: BasicPropertyField[] = [
  {
    key: "meterage",
    label: "متراژ آپارتمان",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const rentVillaHouseBasicFields: BasicPropertyField[] = [
  {
    key: "landArea",
    label: "متراژ زمین",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "buildingArea",
    label: "متراژ بنا",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const rentOfficeBasicFields: BasicPropertyField[] = [
  {
    key: "meterage",
    label: "متراژ",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سال ساخت", control: "select", options: ageOptions, required: true },
];

const rentCommercialUnitBasicFields: BasicPropertyField[] = [
  {
    key: "meterage",
    label: "متراژ",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "commercialPosition",
    label: "موقعیت تجاری",
    control: "select",
    options: saleCommercialPositionOptions,
    required: true,
  },
  { key: "age", label: "سال ساخت", control: "select", options: ageOptions, required: true },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
];

const rentWarehouseBasicFields: BasicPropertyField[] = [
  {
    key: "landArea",
    label: "متراژ زمین",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "buildingArea",
    label: "زیربنا",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "landPosition",
    label: "موقعیت زمین",
    control: "select",
    options: landPositionOptions,
    required: true,
  },
  {
    key: "ceilingHeight",
    label: "ارتفاع سقف",
    control: "input",
    numeric: true,
    leftText: "متر",
    required: true,
  },
  {
    key: "suitableFor",
    label: "مناسب برای",
    control: "multiSelect",
    options: suitableForOptions,
    required: true,
  },
  {
    key: "commercialLicense",
    label: "مجوز تجاری",
    control: "select",
    options: commercialLicenseOptions,
    required: true,
  },
];

const rentHotelApartmentBasicFields: BasicPropertyField[] = [
  {
    key: "accommodationType",
    label: "نوع اقامتگاه",
    control: "select",
    options: saleAccommodationTypeOptions,
    required: true,
  },
  {
    key: "hotelStars",
    label: "رتبه اقامتگاه",
    control: "select",
    options: saleHotelStarsOptions,
    required: true,
  },
  {
    key: "landArea",
    label: "متراژ زمین",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "buildingArea",
    label: "متراژ بنا",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const rentFactoryWorkshopBasicFields: BasicPropertyField[] = [
  {
    key: "landArea",
    label: "متراژ زمین",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "buildingArea",
    label: "متراژ بنا",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "landPosition",
    label: "موقعیت زمین",
    control: "select",
    options: saleLandPositionOptions,
    required: true,
  },
  { key: "age", label: "سال ساخت", control: "select", options: ageOptions, required: true },
];

const dailyApartmentBasicFields: BasicPropertyField[] = [
  {
    key: "accommodationType",
    label: "نوع اقامتگاه",
    control: "select",
    options: dailyAccommodationTypeOptions,
    required: true,
  },
  {
    key: "meterage",
    label: "متراژ",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  {
    key: "standardCapacity",
    label: "ظرفیت استاندارد",
    control: "select",
    options: capacityOptions,
    required: true,
  },
];

const dailyVillaBasicFields: BasicPropertyField[] = [
  {
    key: "landArea",
    label: "متراژ زمین",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  {
    key: "buildingArea",
    label: "متراژ بنا",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  {
    key: "standardCapacity",
    label: "ظرفیت استاندارد",
    control: "select",
    options: capacityOptions,
    required: true,
  },
];

const dailyWorkspaceBasicFields: BasicPropertyField[] = [
  {
    key: "spaceType",
    label: "نوع فضا",
    control: "select",
    options: dailyWorkspaceTypeOptions,
    required: true,
  },
  {
    key: "meterage",
    label: "متراژ",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  {
    key: "standardCapacity",
    label: "ظرفیت استاندارد",
    control: "select",
    options: capacityOptions,
    required: true,
  },
];

const dailyHotelRentBasicFields: BasicPropertyField[] = [
  {
    key: "hotelStars",
    label: "رتبه اقامتگاه",
    control: "select",
    options: dailyHotelStarsOptions,
    required: true,
  },
  {
    key: "accommodationType",
    label: "نوع اقامتگاه",
    control: "select",
    options: dailyHotelAccommodationTypeOptions,
    required: true,
  },
];

export const defaultBasicPropertyFields: BasicPropertyField[] = [
  {
    key: "meterage",
    label: "متراژ",
    control: "input",
    numeric: true,
    leftText: "متر مربع",
    required: true,
  },
];

export const basicPropertyFieldsByListingType: Record<string, BasicPropertyField[]> = {
  "sale:apartment": saleApartmentBasicFields,
  "sale:villa-house": saleVillaHouseBasicFields,
  "sale:garden-villa": saleVillaHouseBasicFields,
  "sale:land": saleLandBasicFields,
  "sale:office": saleOfficeBasicFields,
  "sale:commercial-unit": saleCommercialUnitBasicFields,
  "sale:warehouse": saleWarehouseBasicFields,
  "sale:hotel-apartment": saleHotelApartmentBasicFields,
  "sale:factory-workshop": saleFactoryWorkshopBasicFields,

  "rent:apartment": rentApartmentBasicFields,
  "rent:villa-house": rentVillaHouseBasicFields,
  "rent:garden-villa": saleVillaHouseBasicFields,
  "rent:office": rentOfficeBasicFields,
  "rent:commercial-unit": rentCommercialUnitBasicFields,
  "rent:warehouse": rentWarehouseBasicFields,
  "rent:hotel-apartment": rentHotelApartmentBasicFields,
  "rent:factory-workshop": rentFactoryWorkshopBasicFields,

  "rent:daily-apartment-suite": dailyApartmentBasicFields,
  "rent:daily-garden-villa": dailyVillaBasicFields,
  "rent:daily-workspace": dailyWorkspaceBasicFields,
  "rent:daily-hotel-apartment": dailyHotelRentBasicFields,
};