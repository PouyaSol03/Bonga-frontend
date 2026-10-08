import type { NewAdFormValues } from "../types";

export interface EditPatchOptions {
  categoryId?: string | null;
  dynamicFieldKeys?: Iterable<string>;
  formCode?: string | null;
}

export interface EditPatchResult {
  formData: FormData;
  hasChanges: boolean;
  changedKeys: Set<keyof NewAdFormValues>;
}

export interface PatchAppender {
  appendBase: (key: string, value: unknown) => void;
  appendDynamic: (key: string, value: unknown) => void;
  appendDynamicAlias: (keys: string[], value: unknown) => void;
  appendDynamicArray: (key: string, value: string[]) => void;
  appendDynamicJson: (key: string, value: unknown) => void;
  appendFacilityCount: (key: string, value: unknown) => void;
  formData: FormData;
}
