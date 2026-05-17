// src/pages/publicLanding/components/DownloadAppSection.tsx

import { downloadOptions } from "../publicLandingData";

export function DownloadAppSection() {
  return (
    <section
      className="mx-4 flex flex-col gap-4 rounded-3xl bg-[#f5f5f5] px-4 py-5 min-[390px]:gap-6 min-[390px]:px-5 min-[390px]:py-6"
      aria-labelledby="download-title"
    >
      <h2
        className="m-0 text-center text-sm font-semibold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6"
        id="download-title"
      >
        اپلیکیشن ایران شناسا را دانلود کنید!
      </h2>

      <div className="grid grid-cols-3 gap-2 min-[390px]:gap-4">
        {downloadOptions.map((option) => (
          <button
            className="flex min-h-16 min-w-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl bg-white px-2 py-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:min-h-[80px] min-[390px]:gap-2 min-[390px]:py-3"
            key={option.label}
            type="button"
            aria-label={`دانلود از ${option.label}`}
          >
            <img
              src={option.icon}
              alt=""
              className="h-5 w-5 shrink-0 object-contain min-[390px]:h-6 min-[390px]:w-6"
              aria-hidden="true"
            />

            <img
              src={option.typo}
              alt={option.label}
              className="h-4 max-w-[52px] object-contain min-[390px]:h-[18px] min-[390px]:max-w-[58px]"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
