import { useState, type FormEvent } from "react";

import NoSearchIcon from "../../../shared/assets/icons/NoSearch.svg";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

type SearchNoResultsRequestCardProps = {
  className?: string;
  onSubmit?: (title: string) => void;
  showEmptyHeader?: boolean;
};

export function SearchNoResultsRequestCard({
  className = "",
  onSubmit,
  showEmptyHeader = true,
}: SearchNoResultsRequestCardProps) {
  const [title, setTitle] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(title.trim());
  };

  return (
    <form
      className={`mx-auto flex ${showEmptyHeader ? "min-h-[444px]" : ""} w-full flex-col rounded-2xl border border-outline-var bg-surface-container-lowest px-4 pb-4 pt-8 text-right [direction:rtl] ${className}`}
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

            <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 mt-4 text-center text-base font-bold leading-6 text-on-surface">
              ملک مورد علاقه‌م یافت نشد!
            </Typography>
          </>
        ) : null}

        <ul
          className={`m-0 list-disc space-y-0.5 pl-1 pr-5 text-sm font-normal leading-6 text-on-surface marker:text-on-surface ${
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
          <Typography as="span" variant="label" size="medium" weight="semibold" className="mb-2 block text-sm font-semibold leading-5 text-on-surface">
            عنوان درخواست <Typography as="span" variant="body" size="small" weight="regular" className="text-xs font-normal text-outline">(اختیاری)</Typography>
          </Typography>
          <input
            className="h-14 w-full rounded-xl border border-outline-var bg-surface-container-lowest px-3 text-right text-sm text-on-surface outline-none transition placeholder:text-sm placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/10"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="یک نام برای درخواست خود وارد کنید"
            type="text"
            value={title}
          />
        </label>

        <Button unstyled
          className="mt-8 inline-flex h-10 w-full items-center justify-center rounded-xl border border-primary bg-primary-container text-sm font-semibold text-primary transition hover:opacity-90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/25"
          type="submit"
        >
          ثبت درخواست
        </Button>
      </div>
    </form>
  );
}
