import {
  type AdvertiseFormOption,
  type AdvertiseFormField,
  type AdvertiseFormDefinition,
} from "./form-types";
import { asRecord } from "./detail-response";
import { ApiError } from "../../../../shared/api/api";

export function normalizeAdvertiseFormOption(
  value: unknown,
): AdvertiseFormOption | null {
  const record = asRecord(value);
  if (!record) return null;

  const optionValue = record.value;
  if (
    typeof optionValue !== "string" &&
    typeof optionValue !== "number" &&
    typeof optionValue !== "boolean"
  ) {
    return null;
  }

  const label =
    typeof record.label === "string" && record.label.trim()
      ? record.label.trim()
      : String(optionValue);

  return { label, value: optionValue };
}

export function normalizeAdvertiseFormField(
  value: unknown,
): AdvertiseFormField | null {
  const record = asRecord(value);
  if (!record) return null;

  const key = typeof record.key === "string" ? record.key.trim() : "";
  if (!key) return null;

  const options = Array.isArray(record.options)
    ? record.options
        .map(normalizeAdvertiseFormOption)
        .filter((item): item is AdvertiseFormOption => item !== null)
    : [];

  return {
    dependsOn:
      typeof record.dependsOn === "string" ? record.dependsOn : undefined,
    key,
    label: typeof record.label === "string" ? record.label : key,
    options,
    optionsEndpoint:
      typeof record.optionsEndpoint === "string"
        ? record.optionsEndpoint
        : undefined,
    required: record.required === true,
    type: typeof record.type === "string" ? record.type : "",
    unit: typeof record.unit === "string" ? record.unit : "",
  };
}

export function normalizeAdvertiseFormDefinition(
  value: unknown,
  requestedCode = "",
): AdvertiseFormDefinition | null {
  const record = asRecord(value);
  if (!record) return null;

  const fieldsValue =
    record.fields ??
    record.inputs ??
    record.dynamic_fields ??
    record.dynamicFields;
  if (!Array.isArray(fieldsValue)) return null;

  const fields = fieldsValue
    .map(normalizeAdvertiseFormField)
    .filter((item): item is AdvertiseFormField => item !== null);
  const codeCandidates = [
    record.code,
    record.form_code,
    record.formCode,
    record.slug,
  ];
  const code =
    codeCandidates
      .find(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      )
      ?.trim() ?? requestedCode;

  return {
    code,
    fields,
    title: typeof record.title === "string" ? record.title : undefined,
  };
}

export function unwrapAdvertiseFormDefinition(
  response: unknown,
  requestedCode: string,
): AdvertiseFormDefinition {
  const direct = normalizeAdvertiseFormDefinition(response, requestedCode);
  if (direct) return direct;

  if (Array.isArray(response)) {
    const fields = response
      .map(normalizeAdvertiseFormField)
      .filter((item): item is AdvertiseFormField => item !== null);

    if (fields.length === response.length && fields.length > 0) {
      return { code: requestedCode, fields };
    }

    for (const item of response) {
      const form = normalizeAdvertiseFormDefinition(item, requestedCode);
      if (form && (!requestedCode || form.code === requestedCode)) return form;
    }
  }

  const record = asRecord(response);
  const candidates = record
    ? [record.data, record.result, record.form, record.advertise_form]
    : [];

  for (const candidate of candidates) {
    const normalized = normalizeAdvertiseFormDefinition(
      candidate,
      requestedCode,
    );
    if (normalized) return normalized;

    if (Array.isArray(candidate)) {
      for (const item of candidate) {
        const form = normalizeAdvertiseFormDefinition(item, requestedCode);
        if (form && (!requestedCode || form.code === requestedCode))
          return form;
      }
    }
  }

  throw new ApiError(500, "ساختار فرم ثبت آگهی از سرور قابل استفاده نیست.");
}
