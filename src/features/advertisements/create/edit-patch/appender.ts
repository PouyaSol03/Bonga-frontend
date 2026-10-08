import type { PatchAppender } from "./types";

export function createPatchAppender(
  formData: FormData,
  dynamicFieldKeysSet: Set<string>,
): PatchAppender {
  const appendBase = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string") {
      formData.append(key, value.trim());
      return;
    }
    const serialized = typeof value === "boolean" ? (value ? "1" : "0") : String(value);
    formData.append(key, serialized);
  };

  const appendDynamic = (key: string, value: unknown) => {
    if (!dynamicFieldKeysSet.has(key)) return;
    if (value === undefined || value === null) return;
    if (typeof value === "string") {
      formData.append(key, value.trim());
      return;
    }
    const serialized = typeof value === "boolean" ? (value ? "1" : "0") : String(value);
    formData.append(key, serialized);
  };

  const appendDynamicAlias = (keys: string[], value: unknown) => {
    const matched = keys.find((k) => dynamicFieldKeysSet.has(k));
    if (!matched) return;
    appendDynamic(matched, value);
  };

  const appendDynamicArray = (key: string, value: string[]) => {
    if (!dynamicFieldKeysSet.has(key)) return;
    value
      .map((item) => (typeof item === "string" ? item.trim() : item))
      .filter(Boolean)
      .forEach((item) => {
        formData.append(key, String(item));
      });
  };

  const appendDynamicJson = (key: string, value: unknown) => {
    if (!dynamicFieldKeysSet.has(key)) return;
    if (value === undefined || value === null) return;
    if (Array.isArray(value) && value.length === 0) return;
    if (typeof value === "object" && !Array.isArray(value) && Object.keys(value as object).length === 0) return;
    formData.append(key, JSON.stringify(value));
  };

  const appendFacilityCount = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (dynamicFieldKeysSet.has(key)) {
      appendDynamic(key, value);
    } else {
      appendBase(key, value);
    }
  };

  return {
    appendBase,
    appendDynamic,
    appendDynamicAlias,
    appendDynamicArray,
    appendDynamicJson,
    appendFacilityCount,
    formData,
  };
}
