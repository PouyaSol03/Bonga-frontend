import type { NewAdFormValues } from "../types";
import type { EditPatchOptions, EditPatchResult } from "./types";
import { getChangedFieldKeys } from "./diff";
import { createPatchAppender } from "./appender";
import { mapChangedBaseFields } from "./base-mapper";
import { mapChangedDynamicFields } from "./dynamic-mapper";
import { getAdvertiseFormCode, getParams } from "../utils";

export function buildEditPatchFormData(
  currentValues: NewAdFormValues,
  baselineValues: NewAdFormValues,
  options: EditPatchOptions = {},
): EditPatchResult {
  const changedKeys = getChangedFieldKeys(currentValues, baselineValues);
  const formData = new FormData();

  if (changedKeys.size === 0) {
    return {
      formData,
      hasChanges: false,
      changedKeys,
    };
  }

  const params = getParams();
  const formCode = options.formCode?.trim() || getAdvertiseFormCode(params.transaction, params.category);
  const dynamicKeysSet = new Set(options.dynamicFieldKeys ?? []);
  const appender = createPatchAppender(formData, dynamicKeysSet);

  if (formCode) {
    appender.appendBase("form_code", formCode);
  }

  mapChangedBaseFields(currentValues, changedKeys, appender);
  mapChangedDynamicFields(currentValues, changedKeys, appender, formCode);

  return {
    formData,
    hasChanges: true,
    changedKeys,
  };
}
