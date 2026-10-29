import type { AccountAction } from "../types";
import { AccountMenuRow } from "./AccountMenuRow";

export function AccountSection({
  actions,
  className = "",
  spacedDividers = false,
}: {
  actions?: AccountAction[] | false | null;
  className?: string;
  spacedDividers?: boolean;
}) {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <section className={`bg-surface-container-lowest ${className}`} aria-label="گزینه‌های حساب">
      {actions.map((action, index) => (
        <AccountMenuRow
          action={action}
          hasDivider={index < actions.length - 1}
          key={action.label}
          spacedDivider={spacedDividers}
        />
      ))}
    </section>
  );
}
