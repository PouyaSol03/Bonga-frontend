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
  | "participationType";

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
  | "participationType";

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
  | "floor"
  | "rooms"
  | "totalFloors"
  | "unitsPerFloor"
  | "unitType"
  | "unitPosition"
  | "documentType"
  | "facadeMaterial"
  | "floorMaterial"
  | "cabinetMaterial"
  | "landPosition"
  | "villaType"
  | "density"
  | "commercialLicense"
  | "singleRoomCount"
  | "doubleRoomCount"
  | "suiteCount";

export type MoreFeatureNumberKey =
  | "landWidth"
  | "streetWidth"
  | "ceilingHeight";

export type MoreFeatureToggleKey =
  | "renovated"
  | "furnished"
  | "constructionPermit"
  | "commercialPermit";

export type MoreFeatureFormKey =
  | MoreFeatureSelectKey
  | MoreFeatureNumberKey
  | MoreFeatureToggleKey;

export type MoreFeatureField = {
  key: MoreFeatureFormKey;
  label: string;
  control: "select" | "number" | "toggle";
  leftText?: string;
};

/* -------------------------------- Project -------------------------------- */

export type ProjectSelectKey = "projectStatus";

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
  | ProjectSelectKey;

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
  standardCapacity: string;
  extraPeopleCapacity: string;
  commercialLicense: string;
  constructionLicense: string;
  participationType: string;

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
  renovated: boolean;
  furnished: boolean;
  facadeMaterial: string;
  floorMaterial: string;
  cabinetMaterial: string;
  villaType: string;
  landWidth: string;
  streetWidth: string;
  constructionPermit: boolean;
  commercialPermit: boolean;
  ceilingHeight: string;
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
  minPrice: string;
  maxPrice: string;
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
