import { getCrmRecordId, type CrmRecord } from "../api/crm.service";
import { featureLabelMap, formCodeLabels, type FeatureRecord } from "./constants";

export function readText(record: CrmRecord | undefined, keys: string[], fallback = ""): string {
  if (!record) return fallback;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }

  return fallback;
}

export function readNestedName(record: CrmRecord | undefined, keys: string[]): string {
  if (!record) return "";

  for (const key of keys) {
    const value = record[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const name = readText(value as CrmRecord, ["name", "title", "label"]);
      if (name) return name;
    }
  }

  return "";
}

export function readNestedId(record: CrmRecord | undefined, keys: string[]): string {
  if (!record) return "";

  for (const key of keys) {
    const value = record[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const id = readText(value as CrmRecord, ["id", "_id"]);
      if (id) return id;
    }
  }

  return "";
}

export function looksLikeRecordId(value: string): boolean {
  return /^[a-f\d]{20,}$/i.test(value) || /^\d{8,}$/.test(value);
}

export function readHumanText(record: CrmRecord | undefined, keys: string[]): string {
  const value = readText(record, keys);
  return value && !looksLikeRecordId(value) ? value : "";
}

export function normalizeFeatures(advertise: CrmRecord | undefined): FeatureRecord[] {
  if (!advertise) return [];

  const result: FeatureRecord[] = [];

  for (const key of ["features", "dynamic_fields", "dynamicFields"]) {
    const value = advertise[key];

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          result.push(item as FeatureRecord);
        }
      }
    } else if (value && typeof value === "object") {
      for (const [label, itemValue] of Object.entries(value as CrmRecord)) {
        result.push({ label, value: itemValue });
      }
    }
  }

  return result;
}

export function getFeatureKey(feature: FeatureRecord): string {
  return readText(feature, ["code", "key", "name", "label"]);
}

export function getFeatureValue(features: FeatureRecord[], keys: string[]): unknown {
  for (const key of keys) {
    const feature = features.find((item) => getFeatureKey(item) === key);

    if (feature && feature.value !== undefined && feature.value !== null && feature.value !== "") {
      return feature.value;
    }
  }

  return undefined;
}

export function getFormName(formCode: string): string {
  return formCodeLabels[formCode] ?? "فرم آگهی ثبت‌شده";
}

export function findRecordNameById(records: CrmRecord[], id: string): string {
  for (const record of records) {
    if (getCrmRecordId(record) === id) {
      return readText(record, ["name", "title", "label"]);
    }

    const children = Array.isArray(record.children) ? (record.children as CrmRecord[]) : [];
    const nestedName = findRecordNameById(children, id);
    if (nestedName) return nestedName;
  }

  return "";
}

export function getFeatureDisplayLabel(feature: FeatureRecord): string {
  const key = getFeatureKey(feature);
  const explicitLabel = readText(feature, ["display_name", "displayName", "title"]);

  return explicitLabel || featureLabelMap[key] || key || "ویژگی";
}
