import { type ReactNode } from "react";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { Typography } from "../../../shared/ui/Typography";

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <th className="border-b border-[#e5e5e5] bg-[#fafafa] px-4 py-3.5 text-right text-sm font-semibold text-[#4d4d4d] first:rounded-r-xl last:rounded-l-xl">
      {children}
    </th>
  );
}

export function TableCell({ children }: { children: ReactNode }) {
  return (
    <td className="border-b border-[#f0f0f0] px-4 py-4 align-middle text-sm text-[#4d4d4d]">
      {children}
    </td>
  );
}

export function TableLoadingRows({ columns, rows }: { columns: number; rows: number }) {
  return Array.from({ length: rows }).map((_, rowIndex) => (
    <tr key={rowIndex}>
      {Array.from({ length: columns }).map((__, columnIndex) => (
        <td className="border-b border-[#edf0f5] px-3 py-4" key={columnIndex}>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="block h-4 animate-pulse rounded-full bg-[#edf0f4]"
            style={{ width: `${58 + ((rowIndex + columnIndex) % 4) * 9}%` }}
          />
        </td>
      ))}
    </tr>
  ));
}

export function TableEmptyRow({ columns, message }: { columns: number; message: string }) {
  return (
    <tr>
      <td className="py-14 text-center text-sm text-[#8f98a6]" colSpan={columns}>
        {message}
      </td>
    </tr>
  );
}

export function SearchTableEmptyRow({ columns }: { columns: number }) {
  return (
    <tr>
      <td colSpan={columns}>
        <SearchEmptyState className="min-h-[320px]" />
      </td>
    </tr>
  );
}
