import { hasFeatureValue } from "./featureBuilders";

export function createFormDataAppenders(
  formData: FormData,
  dynamicFieldKeys: Set<string>,
) {
  const appendBaseValue = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return;
      formData.append(key, trimmed);
      return;
    }

    if (!hasFeatureValue(value)) return;

    const serializedValue = typeof value === "boolean" ? (value ? "1" : "0") : String(value);
    formData.append(key, serializedValue);
  };

  const appendDynamicValue = (key: string, value: unknown) => {
    if (!dynamicFieldKeys.has(key)) return;
    if (value === undefined || value === null) return;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return;
      formData.append(key, trimmed);
      return;
    }

    if (!hasFeatureValue(value)) return;

    const serializedValue = typeof value === "boolean" ? (value ? "1" : "0") : String(value);
    formData.append(key, serializedValue);
  };

  const appendFacilityCount = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return;
      if (dynamicFieldKeys.has(key)) {
        appendDynamicValue(key, trimmed);
      } else {
        appendBaseValue(key, trimmed);
      }
      return;
    }

    if (!hasFeatureValue(value)) return;

    if (dynamicFieldKeys.has(key)) {
      appendDynamicValue(key, value);
      return;
    }

    appendBaseValue(key, value);
  };

  const appendDynamicAliasValue = (keys: string[], value: unknown) => {
    const matchingKey = keys.find((key) => dynamicFieldKeys.has(key));
    if (!matchingKey) return;
    appendDynamicValue(matchingKey, value);
  };

  const appendDynamicArray = (key: string, value: string[]) => {
    if (!dynamicFieldKeys.has(key)) return;
    value
      .map((item) => (typeof item === "string" ? item.trim() : item))
      .filter(Boolean)
      .forEach((item) => {
        formData.append(key, item);
      });
  };

  const appendDynamicJson = (key: string, value: unknown) => {
    if (!dynamicFieldKeys.has(key)) return;
    if (!hasFeatureValue(value)) return;

    if (Array.isArray(value) && value.length === 0) return;
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value as Record<string, unknown>).length === 0
    )
      return;

    formData.append(key, JSON.stringify(value));
  };

  return {
    appendBaseValue,
    appendDynamicAliasValue,
    appendDynamicArray,
    appendDynamicJson,
    appendDynamicValue,
    appendFacilityCount,
  };
}

export type FormDataAppenders = ReturnType<typeof createFormDataAppenders>;
