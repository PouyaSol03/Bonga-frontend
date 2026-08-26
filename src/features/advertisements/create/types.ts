export type FlowStep =
  | "details"
  | "moreFeatures"
  | "projectDetails"
  | "media"
  | "agencySelection";

export type RegistrantType = "" | "personal" | "agency";

export type TransactionType = "sale" | "rent" | "project";

export type ChipItem = {
  id: string;
  label: string;
};

export type UploadedMediaFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  file?: File;
  existingValue?: unknown;
};

/* ----------------------------- Basic Property ----------------------------- */

export type BasicPropertyFieldKey =
  | "meterage"
  | "landArea"
  | "buildingArea"
  | "floor"
  | "rooms"
  | "age"
  | "density"
  | "usageType"
  | "landPosition"
  | "documentType"
  | "suitableFor"
  | "hotelStars"
  | "standardCapacity"
  | "extraPeopleCapacity"
  | "landWidth"
  | "streetWidth"
  | "ceilingHeight"
  | "commercialLicense"
  | "constructionLicense"
  | "participationType"
  | "commercialPosition"
  | "ownershipStatus"
  | "currentStatus"
  | "accommodationType"
  | "spaceType";

export type BasicPropertySelectKey =
  | "floor"
  | "rooms"
  | "age"
  | "usageType"
  | "landPosition"
  | "documentType"
  | "suitableFor"
  | "hotelStars"
  | "standardCapacity"
  | "extraPeopleCapacity"
  | "commercialLicense"
  | "constructionLicense"
  | "participationType"
  | "commercialPosition"
  | "ownershipStatus"
  | "currentStatus"
  | "accommodationType"
  | "spaceType";

export type BasicPropertyField = {
  key: BasicPropertyFieldKey;
  label: string;
  control: "input" | "select";
  required?: boolean;
  numeric?: boolean;
  leftText?: string;
  options?: string[];
};

/* ----------------------------- More Features ----------------------------- */

export type MoreFeatureSelectKey =
  | "age"
  | "floor"
  | "rooms"
  | "totalFloors"
  | "unitsPerFloor"
  | "unitType"
  | "unitPosition"
  | "documentType"
  | "usageType"
  | "suitableFor"
  | "occupancyStatus"
  | "kitchenType"
  | "facadeMaterial"
  | "floorMaterial"
  | "cabinetMaterial"
  | "landPosition"
  | "buildingType"
  | "villaType"
  | "commercialPosition"
  | "ownershipStatus"
  | "currentStatus"
  | "industrialPropertyType"
  | "accessType"
  | "officePosition"
  | "officeDocumentType"
  | "petPolicy"
  | "density"
  | "commercialLicense"
  | "singleRoomCount"
  | "doubleRoomCount"
  | "suiteCount"
  | "extraPeopleCapacity"
  | "rentalPeriod"
  | "viewType"
  | "openingCount"
  | "projectStatus";

export type MoreFeatureNumberKey =
  | "buildingArea"
  | "landWidth"
  | "streetWidth"
  | "ceilingHeight"
  | "minContractMonths"
  | "minStayDays"
  | "evacuationGuarantee";

export type MoreFeatureDateKey = "readyDeliveryDate" | "projectDeliveryDate";

export type MoreFeatureTimeKey = "checkInTime" | "checkOutTime";

export type MoreFeatureToggleKey =
  | "renovated"
  | "furnished"
  | "constructionPermit"
  | "commercialPermit"
  | "managementRoom"
  | "conferenceRoom"
  | "receptionHall"
  | "signboard"
  | "kitchen"
  | "separateEntrance"
  | "hasDocument";

export type MoreFeatureFormKey =
  | MoreFeatureSelectKey
  | MoreFeatureNumberKey
  | MoreFeatureDateKey
  | MoreFeatureTimeKey
  | MoreFeatureToggleKey;

export type MoreFeatureField = {
  key: MoreFeatureFormKey;
  label: string;
  control: "select" | "number" | "date" | "time" | "toggle";
  leftText?: string;
  options?: string[];
};

/* -------------------------------- Project -------------------------------- */

export type ProjectSelectKey =
  | "projectStatus"
  | "projectType"
  | "documentType"
  | "kitchenType"
  | "facadeMaterial"
  | "floorMaterial"
  | "cabinetMaterial"
  | "participationType"
  | "currentStatus"
  | "landPosition"
  | "constructionLicense"
  | "projectTotalFloors"
  | "projectTotalUnits";

export type ProjectDetailItem = {
  id: string;
  meterage: string;
  floors: string[];
  rooms: string[];
  positions: string[];
  minMeterage?: string;
  maxMeterage?: string;
};

export type DailyHotelRoomTypeId =
  | "single"
  | "double"
  | "triple"
  | "quad"
  | "quint"
  | "suite";

export type DailyHotelRoomConfig = {
  id: DailyHotelRoomTypeId;
  label: string;
  guestCount: string;
  extraGuestCount: string;
  mealPlan: string;
  normalPrice: string;
  weekendPrice: string;
  specialPrice: string;
};

export type DailyHotelRoomConfigKey = keyof DailyHotelRoomConfig;

/* -------------------------------- Sheets -------------------------------- */

export type SelectKey =
  | BasicPropertySelectKey
  | ProjectSelectKey
  | MoreFeatureSelectKey
  | MoreFeatureTimeKey
  | "rentConversionPolicy";

export type SheetState =
  | {
    kind: "select";
    key: SelectKey;
    title: string;
    options: string[];
  }
  | {
    kind: "exchange";
    title: string;
    options: string[];
  };

/* ------------------------------- Form Values ------------------------------ */

export type NewAdFieldErrorKey = keyof NewAdFormValues | "contactMethods";

export type NewAdFieldErrors = Partial<Record<NewAdFieldErrorKey, string>>;

export type NewAdFormValues = {
  location: string;

  meterage: string;
  landArea: string;
  buildingArea: string;

  floor: string;
  rooms: string;
  age: string;

  density: string;
  usageType: string;
  landPosition: string;
  documentType: string;
  suitableFor: string;
  hotelStars: string;
  accommodationType: string;
  spaceType: string;
  standardCapacity: string;
  extraPeopleCapacity: string;
  commercialLicense: string;
  constructionLicense: string;
  participationType: string;
  builderCompanyName: string;
  projectType: string;

  projectTotalFloors: string;
  projectTotalUnits: string;
  projectStatus: string;
  projectDeliveryDate: string;
  projectDetails: ProjectDetailItem[];

  saleTermsEnabled: boolean;
  saleTermsPercent: string;
  saleTermsInstallmentMonths: string;
  builderSharePercent: string;

  totalFloors: string;
  unitsPerFloor: string;
  unitType: string;
  unitPosition: string;
  occupancyStatus: string;
  kitchenType: string;
  petPolicy: string;
  readyDeliveryDate: string;
  minContractMonths: string;
  rentalPeriod: string;
  viewType: string;
  checkInTime: string;
  checkOutTime: string;
  minStayDays: string;
  evacuationGuarantee: string;
  renovated: boolean;
  furnished: boolean;
  facadeMaterial: string;
  floorMaterial: string;
  cabinetMaterial: string;
  buildingType: string;
  villaType: string;
  commercialPosition: string;
  ownershipStatus: string;
  currentStatus: string;
  industrialPropertyType: string;
  accessType: string;
  officePosition: string;
  officeDocumentType: string;
  hasDocument: boolean;
  managementRoom: boolean;
  conferenceRoom: boolean;
  receptionHall: boolean;
  signboard: boolean;
  kitchen: boolean;
  separateEntrance: boolean;
  landWidth: string;
  streetWidth: string;
  constructionPermit: boolean;
  commercialPermit: boolean;
  ceilingHeight: string;
  openingCount: string;
  singleRoomCount: string;
  doubleRoomCount: string;
  suiteCount: string;
  dailyHotelRooms: DailyHotelRoomConfig[];

  selectedSpecs: string[];
  heatingCooling: string[];
  facilities: string[];

  price: string;
  mortgagePrice: string;
  rentPrice: string;
  rentConversionEnabled: boolean;
  rentConversionMortgagePrice: string;
  rentConversionPolicy: string;
  minPrice: string;
  maxPrice: string;
  normalDailyPrice: string;
  weekendDailyPrice: string;
  specialDailyPrice: string;
  extraPersonPrice: string;
  loanEnabled: boolean;
  loanAmount: string;
  loanInstallment: string;
  exchangeEnabled: boolean;
  exchangeTargets: string[];

  photos: UploadedMediaFile[];
  hasVideo: boolean;
  video: UploadedMediaFile | null;
  hasVirtualTour: boolean;
  virtualTourLink: string;

  registrantType: RegistrantType;
  publisherName: string;
  agencyId: string;
  chatEnabled: boolean;
  phoneEnabled: boolean;
  phoneNumber: string;
  ownerFullName: string;
  ownerExactAddress: string;
  telegram: string;
  whatsapp: string;

  title: string;
  description: string;

  targetOwnerType: "" | "user" | "agency";
  targetOwnerId: string;
};

export type MoreFeaturesFormValues = Pick<
  NewAdFormValues,
  MoreFeatureFormKey
>;
