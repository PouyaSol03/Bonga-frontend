import { describe, expect, it } from "vitest";
import {
  formatPaymentMoney,
  readNestedRecord,
  readPaymentReference,
  readText,
} from "../../src/features/crm/payments/paymentBankHelpers";
import {
  jalaliDateToIso,
  jalaliDateToTimestamp,
  optionalNumber,
} from "../../src/features/crm/payments/paymentDateUtils";
import {
  readPaymentAmount,
  readPaymentMethod,
  readPaymentMethodLabel,
  readPaymentNumericAmount,
  readPaymentPurposeLabel,
  readPaymentStatus,
  readPaymentUserName,
} from "../../src/features/crm/payments/paymentHelpers";
import { buildPaymentMetrics } from "../../src/features/crm/payments/components/PaymentMetricsSection";

describe("CRM Payments Modularization", () => {
  describe("paymentHelpers", () => {
    it("reads payment status correctly", () => {
      expect(readPaymentStatus({ status: "1" })).toBe("success");
      expect(readPaymentStatus({ status: "paid" })).toBe("success");
      expect(readPaymentStatus({ status: "-1" })).toBe("failed");
      expect(readPaymentStatus({ status: "0" })).toBe("pending");
      expect(readPaymentStatus({ status: "other" })).toBe("unknown");
    });

    it("reads payment method correctly", () => {
      expect(readPaymentMethod({ method: "online" })).toBe("gateway");
      expect(readPaymentMethod({ payment_type: 0 })).toBe("gateway");
      expect(readPaymentMethod({ method: "wallet" })).toBe("wallet");
      expect(readPaymentMethodLabel({ method: "online" })).toBe("درگاه بانکی");
      expect(readPaymentMethodLabel({ method: "wallet" })).toBe("کیف پول / اعتبار");
    });

    it("reads payment purpose labels correctly", () => {
      expect(readPaymentPurposeLabel({ payment_for: "0" })).toBe("پرداخت آگهی");
      expect(readPaymentPurposeLabel({ payment_for: "1" })).toBe("شارژ کیف پول");
      expect(readPaymentPurposeLabel({ payment_for: "2" })).toBe("خرید بسته");
      expect(readPaymentPurposeLabel({ payment_for: "3" })).toBe("تسویه آگهی");
    });

    it("reads user full name or fallback", () => {
      expect(
        readPaymentUserName({
          user: { name: "Ali", family: "Mousavi" },
        }),
      ).toBe("Ali Mousavi");
      expect(readPaymentUserName({ user_name: "Pouya" })).toBe("Pouya");
      expect(readPaymentUserName({})).toBe("-");
    });

    it("calculates numeric amounts and formatted amounts", () => {
      expect(readPaymentNumericAmount({ amount: "1500000" })).toBe(1500000);
      expect(readPaymentNumericAmount({ price: 200000 })).toBe(200000);
      expect(readPaymentAmount({ amount: 1500000 })).toContain("۱٬۵۰۰٬۰۰۰ تومان");
    });
  });

  describe("paymentDateUtils", () => {
    it("handles optionalNumber properly", () => {
      expect(optionalNumber("")).toBeUndefined();
      expect(optionalNumber("42")).toBe(42);
      expect(optionalNumber("invalid")).toBeUndefined();
    });

    it("converts jalali date to timestamp and ISO string", () => {
      const ts = jalaliDateToTimestamp("1403/01/01");
      expect(ts).toBeGreaterThan(0);
      const isoStart = jalaliDateToIso("1403/01/01", false);
      expect(isoStart).toContain("T");
      const isoEnd = jalaliDateToIso("1403/01/01", true);
      expect(isoEnd).toContain(".999Z");
    });
  });

  describe("paymentBankHelpers", () => {
    it("reads nested records and text", () => {
      expect(readText({ title: "Test" }, ["title"])).toBe("Test");
      expect(readNestedRecord({ user: { id: "1" } }, ["user"])).toEqual({ id: "1" });
      expect(formatPaymentMoney("5000")).toContain("۵٬۰۰۰ تومان");
      expect(readPaymentReference({ ref_code: "REF123" })).toBe("REF123");
    });
  });

  describe("buildPaymentMetrics", () => {
    it("calculates aggregate metrics from payments", () => {
      const payments = [
        { status: "1", amount: 100000 },
        { status: "1", amount: 200000 },
        { status: "0", amount: 50000 },
        { status: "-1", amount: 30000 },
      ];
      const metrics = buildPaymentMetrics(payments, 4);
      expect(metrics).toHaveLength(4);
      expect(metrics[0].value).toBe("۴"); // total
      expect(metrics[1].value).toContain("۳۰۰٬۰۰۰ تومان"); // successful total
      expect(metrics[2].value).toBe("۱"); // pending
      expect(metrics[3].value).toBe("۱"); // failed
    });
  });
});
