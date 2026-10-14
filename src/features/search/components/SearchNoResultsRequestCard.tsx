import { useState, type FormEvent } from "react";

import NoSearchIcon from "../../../shared/assets/icons/NoSearch.svg";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

type SearchNoResultsRequestCardProps = {
  className?: string;
  hasFilters?: boolean;
  onSubmit?: (title: string) => void;
  showEmptyHeader?: boolean;
};

export function SearchNoResultsRequestCard({
  className = "",
  hasFilters = true,
  onSubmit,
  showEmptyHeader = true,
}: SearchNoResultsRequestCardProps) {
  const [title, setTitle] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasFilters) return;
    onSubmit?.(title.trim());
  };

  return (
    <form
      className={`mx-auto flex ${showEmptyHeader ? "min-h-[444px]" : ""} border-outline-var bg-surface-container-lowest w-full flex-col rounded-2xl border px-4 pt-8 pb-4 text-right [direction:rtl] ${className}`}
      onSubmit={submit}
    >
      <div>
        {showEmptyHeader ? (
          <>
            <div className="flex justify-center">
              <img
                alt=""
                aria-hidden="true"
                className="h-[66px] w-[66px] shrink-0 object-contain"
                draggable={false}
                src={NoSearchIcon}
              />
            </div>

            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="text-on-surface m-0 mt-4 text-center text-base leading-6 font-bold"
            >
              ملک مورد علاقه‌م یافت نشد!
            </Typography>
          </>
        ) : null}

        <ul
          className={`text-on-surface marker:text-on-surface m-0 list-disc space-y-0.5 pr-5 pl-1 text-sm leading-6 font-normal ${
            showEmptyHeader ? "mt-1" : "mt-0"
          }`}
        >
          <li>اگر چیزی که می‌خواهید را پیدا نکردید، همین حالا درخواست خود را ثبت کنید.</li>
          <li>این درخواست به مشاوران ما ارسال می‌شود.</li>
          <li>به محض وجود مورد مشابه، به شما اطلاع می‌دهیم.</li>
        </ul>
      </div>

      <div className="mt-auto pt-7">
        <label className="block">
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="semibold"
            className="text-on-surface mb-2 block text-sm leading-5 font-semibold"
          >
            عنوان درخواست{" "}
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="text-outline text-xs font-normal"
            >
              (اختیاری)
            </Typography>
          </Typography>
          <input
            className="border-outline-var bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-primary/10 h-14 w-full rounded-xl border px-3 text-right text-sm transition outline-none placeholder:text-sm focus:ring-2"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="یک نام برای درخواست خود وارد کنید"
            type="text"
            value={title}
          />
        </label>

        <Button
          unstyled
          disabled={!hasFilters}
          className={`mt-8 inline-flex h-10 w-full items-center justify-center rounded-xl border text-sm font-semibold transition ${
            !hasFilters
              ? "border-outline-var bg-surface-container text-outline cursor-not-allowed opacity-60"
              : "border-primary bg-primary-container text-primary focus-visible:outline-primary/25 focus-visible:outline-3 focus-visible:outline-offset-2"
          }`}
          type="submit"
        >
          {hasFilters ? "ثبت درخواست" : "ابتدا فیلترها را انتخاب کنید"}
        </Button>
      </div>
    </form>
  );
}
