// src/pages/publicLanding/components/DownloadAppSection.tsx

import { downloadOptions } from "../publicLandingData";

export function DownloadAppSection() {
  return (
    <section
      className="mx-4 flex flex-col gap-6 rounded-3xl bg-[#f5f5f5] px-5 py-6"
      aria-labelledby="download-title"
    >
      <h2
        className="m-0 text-center text-base font-semibold leading-6 text-[#1a1a1a]"
        id="download-title"
      >
        اپلیکیشن ایران شناسا را دانلود کنید!
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {downloadOptions.map((option) => (
          <button
            className="flex min-h-[80px] min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-white px-2 py-3 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            key={option.label}
            type="button"
            aria-label={`دانلود از ${option.label}`}
          >
            <img
              src={option.icon}
              alt=""
              className="h-6 w-6 shrink-0 object-contain"
              aria-hidden="true"
            />

            <img
              src={option.typo}
              alt={option.label}
              className="h-[18px] max-w-[58px] object-contain"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
