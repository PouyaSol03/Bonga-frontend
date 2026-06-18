export type FlowStep =
  | "details"
  | "moreFeatures"
  | "projectDetails"
  | "media";

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
  file: File;
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
  | "extraPeopleCapacity";

export type BasicPropertySelectKey =
  | "floor"
  | "rooms"
  | "age"
  | "usageType"
  | "landPosition"
  | "documentType"
  | "suitableFor"
  | "hotelStars";

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
  | "unitType"
  | "unitPosition"
  | "documentType"
  | "facadeMaterial"
  | "floorMaterial"
  | "cabinetMaterial"
  | "landPosition"
  | "villaType";

export type MoreFeatureNumberKey =
  | "density"
  | "landWidth"
  | "streetWidth"
  | "ceilingHeight"
  | "singleRoomCount"
  | "doubleRoomCount"
  | "suiteCount";

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
  minMeterage: string;
  maxMeterage: string;
  floors: string[];
  rooms: string[];
  positions: string[];
};

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

  projectTotalFloors: string;
  projectTotalUnits: string;
  projectStatus: string;
  projectDeliveryDate: string;
  projectDetails: ProjectDetailItem[];

  saleTermsEnabled: boolean;
  saleTermsPercent: string;
  saleTermsInstallmentMonths: string;

  totalFloors: string;
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

  selectedSpecs: string[];
  heatingCooling: string[];
  facilities: string[];

  price: string;
  loanEnabled: boolean;
  loanAmount: string;
  loanInstallment: string;
  exchangeEnabled: boolean;
  exchangeTargets: string[];

  photos: UploadedMediaFile[];
  hasVideo: boolean;
  video: UploadedMediaFile | null;
  hasVirtualTour: boolean;

  registrantType: RegistrantType;
  chatEnabled: boolean;
  phoneEnabled: boolean;
  telegram: string;
  whatsapp: string;

  title: string;
  description: string;
};

export type MoreFeaturesFormValues = Pick<
  NewAdFormValues,
  MoreFeatureFormKey
>;