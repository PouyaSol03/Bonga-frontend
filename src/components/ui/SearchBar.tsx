import { forwardRef, type ButtonHTMLAttributes, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";

import { cn, focusRing } from "../../design-system/classes";
import LinearBookmarkSolid from "../(icons)/LinearBookmarkSolid";
import LinearCancelCircle from "../(icons)/LinearCancelCircle";
import SearchBarSearchIcon from "../(icons)/SearchBarSearchIcon";

type SearchBarProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  compact?: boolean;
  leadingIcon?: ReactNode;
  saved?: boolean;
  text: string;
};

export function SearchBar({
  className = "",
  compact = false,
  leadingIcon,
  saved = false,
  text,
  type = "button",
  ...props
}: SearchBarProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-[12px] border border-[#cccccc] bg-white px-4 text-right text-base font-normal leading-6 text-[#1a1a1a] transition [direction:rtl]",
        compact ? "h-12" : "h-14",
        focusRing,
        className,
      )}
      type={type}
      {...props}
    >
      {leadingIcon ?? <SearchBarSearchIcon aria-hidden="true" className="h-6 w-6 shrink-0 text-[#4d4d4d]" />}
      <span className="min-w-0 flex-1 truncate">{text}</span>
      {saved ? <LinearBookmarkSolid aria-hidden="true" className="h-5 w-5 shrink-0 text-[#0048c4]" /> : null}
    </button>
  );
}

type SearchInputBarProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "size" | "value"> & {
  compact?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  onClear?: () => void;
  onSubmit?: () => void;
  onValueChange: (value: string) => void;
  savedSlot?: ReactNode;
  showSearchIcon?: boolean;
  size?: "default" | "compact" | "dense";
  value: string;
};

export const SearchInputBar = forwardRef<HTMLInputElement, SearchInputBarProps>(function SearchInputBar(
  {
    className = "",
    compact = false,
    containerClassName = "",
    inputClassName = "",
    onClear,
    onSubmit,
    onValueChange,
    placeholder = "جستجو",
    savedSlot,
    showSearchIcon = true,
    size,
    tabIndex,
    type = "search",
    value,
    ...props
  },
  ref,
) {
  const hasValue = value.length > 0;
  const resolvedSize = size ?? (compact ? "compact" : "default");
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form
      className={cn(
        "flex w-full min-w-0 items-center rounded-[12px] border bg-white px-3 text-right transition [direction:ltr]",
        resolvedSize === "dense" ? "h-10" : resolvedSize === "compact" ? "h-12" : "h-14",
        hasValue ? "border-[#0048c4]" : "border-[#cccccc]",
        focusRing,
        containerClassName,
      )}
      onSubmit={handleSubmit}
    >
      {savedSlot ? (
        <>
          {savedSlot}
          <div className="me-3 h-6 w-px shrink-0 bg-[#cccccc]" />
        </>
      ) : null}

      {showSearchIcon ? <SearchBarSearchIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#4d4d4d]" /> : null}

      <input
        className={cn(
          "min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] [direction:rtl]",
          showSearchIcon ? "pr-2" : "",
          inputClassName,
          className,
        )}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        ref={ref}
        tabIndex={tabIndex}
        type={type}
        value={value}
        {...props}
      />

      {hasValue && onClear ? (
        <button
          aria-label="پاک کردن جستجو"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#808080] transition active:bg-[#f0f0f0]"
          onClick={onClear}
          tabIndex={tabIndex}
          type="button"
        >
          <LinearCancelCircle aria-hidden="true" className="h-6 w-6" />
        </button>
      ) : null}
    </form>
  );
});
