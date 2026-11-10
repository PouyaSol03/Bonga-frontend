import type { ReactNode } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { inputClassName } from "../types";
import { CalendarIcon } from "./PaymentIcons";

export function FilterField({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="block">
      <Typography
        as="span"
        variant="label"
        size="small"
        weight="semibold"
        className="mb-1.5 block text-xs font-bold text-[#667085]"
      >
        {label}
      </Typography>
      {children}
    </label>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <th className="border-b border-[#e9edf3] px-4 py-3.5 font-bold first:pr-5 last:pl-5">
      {children}
    </th>
  );
}

export function TableCell({ children }: { children: ReactNode }) {
  return (
    <td className="border-b border-[#edf0f5] px-4 py-4 align-middle transition group-hover:bg-[#fbfcff] first:pr-5 last:pl-5">
      {children}
    </td>
  );
}

export function PaymentTableSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 7 }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <td className="border-b border-[#edf0f5] px-4 py-4" key={columnIndex}>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className={`block h-4 animate-pulse rounded-full bg-[#edf0f4] ${columnIndex === 0 ? "w-32" : "w-20"}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function DateFilterButton({
  label,
  onClick,
  value,
}: {
  label: string;
  onClick: () => void;
  value: string;
}) {
  return (
    <FilterField label={label}>
      <Button
        unstyled
        className={`${inputClassName} flex items-center justify-between text-right`}
        onClick={onClick}
        type="button"
      >
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className={value ? "text-[#303030]" : "text-[#999999]"}
        >
          {value || "انتخاب تاریخ شمسی"}
        </Typography>
        <CalendarIcon />
      </Button>
    </FilterField>
  );
}
