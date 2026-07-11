import { useState, type FormEvent } from "react";

import NoSearchIcon from "../../../assets/icons/NoSearch.svg";

type SearchNoResultsRequestCardProps = {
  onSubmit?: (title: string) => void;
};

export function SearchNoResultsRequestCard({
  onSubmit,
}: SearchNoResultsRequestCardProps) {
  const [title, setTitle] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(title.trim());
  };

  return (
    <form
      className="mx-3 rounded-2xl border border-[#d6d6d6] bg-white px-3 pb-3 pt-5 text-right [direction:rtl]"
      onSubmit={submit}
    >
      <div className="flex justify-center">
        <img
          alt=""
          aria-hidden="true"
          className="h-[58px] w-[58px] object-contain"
          draggable={false}
          src={NoSearchIcon}
        />
      </div>

      <h2 className="m-0 mt-3 text-center text-sm font-bold leading-6 text-[#1a1a1a]">
        ملک مورد علاقه‌م یافت نشد!
      </h2>

      <ul className="m-0 mt-1 list-disc space-y-0.5 pr-5 text-xs font-normal leading-5 text-[#333333] marker:text-[#333333]">
        <li>اگر چیزی که می‌خواهید را پیدا نکردید، همین حالا درخواست خود را ثبت کنید.</li>
        <li>این درخواست به مشاوران ما ارسال می‌شود.</li>
        <li>به محض وجود مورد مشابه، به شما اطلاع می‌دهیم.</li>
      </ul>

      <label className="mt-3 block">
        <span className="mb-2 block text-sm font-medium leading-5 text-[#1a1a1a]">
          عنوان درخواست <span className="font-normal text-[#808080]">(اختیاری)</span>
        </span>
        <input
          className="h-10 w-full rounded-xl border border-[#d6d6d6] bg-white px-3 text-right text-sm text-[#1a1a1a] outline-none transition placeholder:text-xs placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="یک نام برای درخواست خود وارد کنید"
          type="text"
          value={title}
        />
      </label>

      <button
        className="mt-5 inline-flex h-9 w-full items-center justify-center rounded-lg border border-[#0066ff] bg-[#edf4ff] text-sm font-medium text-[#0048c4] transition hover:bg-[#e3eeff] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        type="submit"
      >
        ثبت درخواست
      </button>
    </form>
  );
}
