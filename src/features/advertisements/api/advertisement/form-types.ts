export type AdvertiseFormOption = {
  label: string;
  value: boolean | number | string;
};

export type AdvertiseFormField = {
  dependsOn?: string;
  key: string;
  label: string;
  options: AdvertiseFormOption[];
  optionsEndpoint?: string;
  required: boolean;
  type: string;
  unit: string;
};

export type AdvertiseFormDefinition = {
  code: string;
  fields: AdvertiseFormField[];
  title?: string;
};
