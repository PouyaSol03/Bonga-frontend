import type { IconName } from "../viewAdTypes";

export type PropertyPreviewField = {
  icon?: IconName;
  label: string;
  labels: string[];
  formatter?: (value: unknown) => string;
};
