import type { ReactNode } from "react";
import { Typography } from "../../../../shared/ui/Typography";

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
  icon,
  onChange,
  placeholder,
  value,
}: {
  icon?: ReactNode;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="block text-right">
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="border-outline-var bg-surface-container-lowest focus-within:border-primary focus-within:ring-primary/10 relative flex w-full items-center rounded-xl border px-3 py-4.5 focus-within:ring-2"
      >
        <input
          className={`text-on-surface placeholder:text-outline h-full min-w-0 flex-1 border-0 bg-transparent py-0 text-right text-sm leading-5 font-normal outline-none placeholder:text-sm ${icon ? "pl-9" : ""}`}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type="text"
          value={value}
        />
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

export function DesktopField({
  icon,
  label,
  onChange,
  placeholder,
  value,
}: {
  icon?: ReactNode;
  label?: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="block min-w-0">
      {label ? (
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="semibold"
          className="text-on-surface mb-3 block text-right text-base leading-6 font-semibold"
        >
          {label}
        </Typography>
      ) : null}
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="relative block"
      >
        <input
          className={`border-outline-var bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-primary/10 h-[60px] w-full rounded-xl border py-0 text-right text-sm leading-5 font-normal transition outline-none focus:ring-2 ${icon ? "pr-5 pl-12" : "px-5"}`}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type="text"
          value={value}
        />
        {icon ? (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="absolute top-1/2 left-4 -translate-y-1/2"
          >
            {icon}
          </Typography>
        ) : null}
      </Typography>
    </label>
  );
}

export function DesktopSectionTitle({ icon, title }: { icon?: ReactNode; title: string }) {
  return (
    <div className="text-primary flex items-center gap-2">
      {icon ? (
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var"
        >
          {icon}
        </Typography>
      ) : null}
      <Typography
        as="h2"
        variant="title"
        size="large"
        weight="semibold"
        className="m-0 text-[22px] leading-8 font-bold"
      >
        {title}
      </Typography>
    </div>
  );
}

export function FieldError({ message }: { message: string }) {
  return (
    <Typography
      as="p"
      variant="body"
      size="small"
      weight="regular"
      className="text-error m-0 mt-2 text-right text-xs leading-5 font-normal"
    >
      {message}
    </Typography>
  );
}

export function Separator() {
  return <div className="bg-outline-var my-4 h-px" />;
}
