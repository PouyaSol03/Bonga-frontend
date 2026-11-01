import { formatNumber } from "../../../shared/lib/numberUtils";
import type { CrmRecord } from "../api/crm.service";

export function readText(record: CrmRecord, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }

  return fallback;
}

export function readNestedRecord(record: CrmRecord, keys: string[]): CrmRecord {
  for (const key of keys) {
    const value = record[key];
    if (value && typeof value === "object" && !Array.isArray(value)) return value as CrmRecord;
  }

  return {};
}

export function formatPaymentMoney(value: string): string {
  if (value === "-") return value;
  const amount = Number(value);
  return Number.isFinite(amount) ? `${formatNumber(amount)} تومان` : value;
}

export function readPaymentResponseValue(payment: CrmRecord, keys: string[], fallback = "-"): string {
  const bankResponse = readNestedRecord(payment, ["bank_res", "bank_response"]);
  const raw = readNestedRecord(bankResponse, ["raw"]);
  const data = readNestedRecord(raw, ["data"]);

  return readText(payment, keys, readText(bankResponse, keys, readText(data, keys, fallback)));
}

export function readPaymentReference(payment: CrmRecord): string {
  return readPaymentResponseValue(payment, [
    "ref_code",
    "ref_id",
    "reference_id",
    "tracking_code",
    "track_code",
  ]);
}

export function readPaymentOrderId(payment: CrmRecord): string {
  return readPaymentResponseValue(payment, ["order_id"]);
}

export function readPaymentCardPan(payment: CrmRecord): string {
  return readPaymentResponseValue(payment, ["card_pan"]);
}

export function readPaymentCardHash(payment: CrmRecord): string {
  return readPaymentResponseValue(payment, ["card_hash"]);
}

export function readPaymentBankCode(payment: CrmRecord): string {
  return readPaymentResponseValue(payment, ["code"]);
}

export function readPaymentBankMessage(payment: CrmRecord): string {
  return readPaymentResponseValue(payment, ["message"]);
}

export function readPaymentFeeType(payment: CrmRecord): string {
  return readPaymentResponseValue(payment, ["fee_type"]);
}

export function readPaymentFee(payment: CrmRecord): string {
  return formatPaymentMoney(readPaymentResponseValue(payment, ["fee"]));
}

export function readPaymentShaparakFee(payment: CrmRecord): string {
  return formatPaymentMoney(readPaymentResponseValue(payment, ["shaparak_fee"]));
}

export function readPaymentWages(payment: CrmRecord): string {
  return formatPaymentMoney(readPaymentResponseValue(payment, ["wages"]));
}
