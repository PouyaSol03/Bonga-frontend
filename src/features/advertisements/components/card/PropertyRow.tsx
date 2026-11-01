import type { ReactNode } from "react";
import { Typography } from "../../../../shared/ui/Typography";
import type { AdCardData } from "./types";
import { getAdCardProperties } from "./properties";

export function PropertyRow({ ad, className = "" }: { ad: AdCardData; className?: string }) {
  const items = getAdCardProperties(ad);

  if (items.length === 0) return null;

  return (
    <div
      className={`text-on-surface flex items-center justify-start leading-5 font-medium [direction:rtl] ${className}`}
    >
      {items.map((item, index) => (
        <PropertyItem key={index} icon={item.icon} value={item.value} />
      ))}
    </div>
  );
}

function PropertyItem({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <Typography
      as="span"
      variant="body"
      size="medium"
      weight="medium"
      className="text-on-surface-var inline-flex items-center gap-1.5 whitespace-nowrap"
    >
      {icon}
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="medium"
        className="text-on-surface"
      >
        {value}
      </Typography>
    </Typography>
  );
}
