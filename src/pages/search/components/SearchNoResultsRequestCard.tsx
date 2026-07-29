import { useState, type FormEvent } from "react";

import NoSearchIcon from "../../../assets/icons/NoSearch.svg";
import { Typography } from "../../../components/ui/Typography";

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
      className={`flex ${showEmptyHeader ? "min-h-[444px]" : ""} flex-col rounded-2xl border border-[#cccccc] bg-white px-4 pb-4 pt-8 text-right [direction:rtl] ${className}`}
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

            <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 mt-4 text-center text-base font-bold leading-6 text-[#1a1a1a]">
              ملک مورد علاقه‌م یافت نشد!
            </Typography>
          </>
        ) : null}

        <ul
          className={`m-0 list-disc space-y-0.5 pl-1 pr-5 text-sm font-normal leading-6 text-[#333333] marker:text-[#333333] ${
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
          <Typography as="span" variant="label" size="medium" weight="semibold" className="mb-2 block text-sm font-semibold leading-5 text-[#1a1a1a]">
            عنوان درخواست <Typography as="span" variant="body" size="small" weight="regular" className="text-xs font-normal text-[#808080]">(اختیاری)</Typography>
          </Typography>
          <input
            className="h-14 w-full rounded-xl border border-[#cccccc] bg-white px-3 text-right text-sm text-[#1a1a1a] outline-none transition placeholder:text-sm placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="یک نام برای درخواست خود وارد کنید"
            type="text"
            value={title}
          />
        </label>

        <button
          className="mt-8 inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#0066ff] bg-[#edf4ff] text-sm font-semibold text-[#0048c4] transition hover:bg-[#e3eeff] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          type="submit"
        >
          ثبت درخواست
        </button>
      </div>
    </form>
  );
}
