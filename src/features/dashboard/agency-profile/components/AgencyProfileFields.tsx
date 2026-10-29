import type { ReactNode } from "react";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";

export function Section({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <section className="bg-surface-container-lowest px-4 py-4">
      {title ? (
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface m-0 text-right text-base font-semibold"
        >
          {title}
        </Typography>
      ) : null}
      {children}
    </section>
  );
}

export function Field({
  className = "",
  icon,
  multiline = false,
  onChange,
  placeholder,
  value,
}: {
  className?: string;
  icon?: ReactNode;
  multiline?: boolean;
  onChange?: (value: string) => void;
  placeholder: string;
  value?: string;
}) {
  return (
    <label className="block text-right">
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`border-outline-var bg-surface-container-lowest focus-within:border-primary focus-within:ring-primary/10 relative flex w-full items-center rounded-xl border px-3 py-4.5 focus-within:ring-2 ${className}`}
      >
        {multiline ? (
          <textarea
            className="text-on-surface placeholder:text-outline h-full min-w-0 flex-1 resize-none border-0 bg-transparent py-0 text-right text-sm leading-5 font-normal outline-none placeholder:text-sm"
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder}
            value={value}
          />
        ) : (
          <input
            className="text-on-surface placeholder:text-outline h-full min-w-0 flex-1 border-0 bg-transparent py-0 text-right text-sm leading-5 font-normal outline-none placeholder:text-sm"
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder}
            type="text"
            value={value}
          />
        )}
        {icon ? (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="absolute top-1/2 left-3 -translate-y-1/2"
          >
            {icon}
          </Typography>
        ) : null}
      </Typography>
    </label>
  );
}

export function SelectField({
  isLoading,
  onClick,
  placeholder,
  value,
}: {
  isLoading?: boolean;
  onClick: () => void;
  placeholder: string;
  value?: string;
}) {
  if (isLoading) {
    return (
      <div className="border-outline-var bg-surface-container-lowest relative flex w-full items-center rounded-xl border px-3 py-4.5">
        <div className="bg-surface-container-high h-4 w-32 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <Button
      unstyled
      className={`bg-surface-container-lowest focus-visible:outline-primary/25 relative flex w-full items-center rounded-xl border px-3 py-4.5 text-right focus-visible:outline-3 focus-visible:outline-offset-[-3px] ${
        value ? "border-primary" : "border-outline-var"
      }`}
      onClick={onClick}
      type="button"
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`min-w-0 flex-1 truncate text-right text-sm leading-5 font-normal ${
          value ? "text-on-surface" : "text-outline"
        }`}
      >
        {value ?? placeholder}
      </Typography>
      <LinearArrowDown1 className="text-on-surface-var h-5 w-5" />
    </Button>
  );
}

export function Separator() {
  return <div className="bg-outline-var my-4 h-px" />;
}
