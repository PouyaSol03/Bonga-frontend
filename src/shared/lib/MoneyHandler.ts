export const formatPrice = (value: number) => {
  if (!value && value !== 0) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const numberFormatter = new Intl.NumberFormat("fa-IR");

export const formatBigNumber = (value: number) => {
  if (!value && value !== 0) return "";

  const num = Number(value);
  const units = [
    { label: "همت", value: 1_000_000_000_000 },
    { label: "میلیارد", value: 1_000_000_000 },
    { label: "میلیون", value: 1_000_000 },
    { label: "هزار", value: 1_000 },
  ];
  const parts: string[] = [];
  let remaining = Math.trunc(num);

  units.forEach((unit) => {
    const amount = Math.floor(remaining / unit.value);

    if (amount > 0) {
      parts.push(`${numberFormatter.format(amount)} ${unit.label}`);
      remaining -= amount * unit.value;
    }
  });

  if (remaining > 0 || parts.length === 0) {
    parts.push(numberFormatter.format(remaining));
  }

  return parts.join(" و ");
};

const formatWithTwoDecimals = (val: number) => {
  const formatted = new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 2,
  }).format(val);
  return formatted.replace(/[٫.]/g, "/");
};

export const formatCardPrice = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "توافقی";
  const num =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/,/g, "").trim());
  if (Number.isNaN(num)) return String(value);

  if (num >= 1_000_000_000_000) {
    return `${formatWithTwoDecimals(num / 1_000_000_000_000)} همت`;
  }
  if (num >= 1_000_000_000) {
    return `${formatWithTwoDecimals(num / 1_000_000_000)} میلیارد`;
  }
  if (num >= 1_000_000) {
    return `${formatWithTwoDecimals(num / 1_000_000)} میلیون`;
  }
  return numberFormatter.format(num);
};

export const formatDetailPrice = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "توافقی";
  const num =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/,/g, "").trim());
  if (Number.isNaN(num)) return String(value);
  if (num === 0) return "۰";
  return formatBigNumber(num);
};

