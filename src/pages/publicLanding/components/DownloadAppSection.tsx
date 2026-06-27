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
          <a
            className="flex min-h-[84px] w-[98px] min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl bg-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:min-h-[80px] min-[390px]:gap-2 min-[390px]:py-3"
            href={option.href}
            key={option.label}
            target="_blank"
            rel="noreferrer"
            aria-label={`دانلود از ${option.label}`}
          >
            <img
              src={option.icon}
              alt=""
              className="h-5 w-5 shrink-0 object-contain min-[390px]:h-6 min-[390px]:w-6"
              aria-hidden="true"
            />

            <p className="text-sm font-extrabold leading-6">{option.typo}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
