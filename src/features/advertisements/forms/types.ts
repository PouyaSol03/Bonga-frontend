export type AdFormFieldInputType =
  | "text"
  | "number"
  | "currency"
  | "select"
  | "multiSelect"
  | "toggle"
  | "time"
  | "date";

export type AdFormFieldUiType = "input" | "bottomSheet" | "select" | "toggle";

export type AdFormFieldConfig = {
  key: string;
  title: string;
  input: AdFormFieldInputType;
  ui?: AdFormFieldUiType;
  placeholder?: string;
  leftText?: string;
  numeric?: boolean;
  required?: boolean;
  options?: string[];
  showPerMeter?: boolean;
};

export type AdFormChipsItem = {
  id: string;
  label: string;
};

export type AdFormPricingMode =
  | "sale"
  | "rent"
  | "dailyRent"
  | "partnership"
  | "project";

export type AdFormPricingConfig = {
  mode: AdFormPricingMode;
  loan?: boolean;
  exchange?: boolean;
  rentConversion?: boolean;
  saleTerms?: boolean;
};

export type AdFormCreateConfig = {
  specsTitle?: string;
  basicFields: AdFormFieldConfig[];
  pricing: AdFormPricingConfig;
  heatingCooling?: {
    enabled: boolean;
    items?: AdFormChipsItem[];
  };
  facilities?: {
    enabled: boolean;
    items?: AdFormChipsItem[];
  };
  moreFeatures?: {
    enabled: boolean;
    fields?: AdFormFieldConfig[];
  };
};

export type AdFormViewConfig = {
  sections?: unknown[];
};

export type AdFormFilterSectionConfig = {
  kind:
    | "neighborhood"
    | "range"
    | "single"
    | "multi"
    | "toggle"
    | "date"
    | "time"
    | "loan"
    | "advertiser"
    | "publicationTime"
    | "adFlags";
  id?: string;
  title?: string;
  icon?: string;
  variant?: "area" | "money" | "number" | "percent";
  unit?: string;
  showUnitInTitle?: boolean;
  options?: (string | { id: string; label: string })[];
  more?: boolean;
  moreLimit?: number;
  moreLabel?: string;
  moreIcon?: "down" | "left";
};

export type AdFormFilterConfig = {
  sections?: AdFormFilterSectionConfig[];
};

export type AdFormSchema = {
  $schema?: string;
  formCode: string;
  title: string;
  transaction: "sale" | "rent" | "project";
  category: string;
  create: AdFormCreateConfig;
  view?: AdFormViewConfig;
  filter?: AdFormFilterConfig;
};
