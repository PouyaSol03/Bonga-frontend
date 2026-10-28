import { readText } from "../../../shared/lib/textUtils";

export function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : "";
}

export function readNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function readBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1" || value === "true") return true;
  if (value === 0 || value === "0" || value === "false") return false;

  return undefined;
}

export function readPathText(source: unknown, paths: string[]) {
  for (const path of paths) {
    let current: unknown = source;

    for (const key of path.split(".")) {
      current = asRecord(current)?.[key];
    }

    const text = readText(current);

    if (text) return text;
  }

  return "";
}

export function readPathString(source: unknown, paths: string[]) {
  for (const path of paths) {
    let current: unknown = source;

    for (const key of path.split(".")) {
      current = asRecord(current)?.[key];
    }

    const text = readString(current);

    if (text) return text;
  }

  return "";
}

export function readPathRecord(source: unknown, paths: string[]) {
  for (const path of paths) {
    let current: unknown = source;

    for (const key of path.split(".")) {
      current = asRecord(current)?.[key];
    }

    const record = asRecord(current);

    if (record) return record;
  }

  return undefined;
}

export function readPathBoolean(source: unknown, paths: string[]) {
  for (const path of paths) {
    let current: unknown = source;

    for (const key of path.split(".")) {
      current = asRecord(current)?.[key];
    }

    const value = readBoolean(current);

    if (value !== undefined) return value;
  }

  return undefined;
}
