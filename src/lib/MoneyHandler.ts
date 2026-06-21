export const formatPrice = (value: number) => {
  if (!value && value !== 0) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const numberFormatter = new Intl.NumberFormat("fa-IR");

export const formatBigNumber = (value: number) => {
  if (!value && value !== 0) return "";

  const num = Number(value);
  const units = [
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
