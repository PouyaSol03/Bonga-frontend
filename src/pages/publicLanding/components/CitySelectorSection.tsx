// src/pages/publicLanding/components/CitySelectorSection.tsx

import { cities } from "../publicLandingData";

export function CitySelectorSection() {
  return (
    <section
      className="relative z-10 mx-0 -mt-12 rounded-t-3xl rounded-b-3xl bg-white px-4 pb-6 pt-5 shadow-[0_4px_28px_rgba(77,77,77,0.08)]"
      aria-labelledby="city-title"
    >
      <h2
        className="m-0 text-center text-base font-semibold leading-6 text-[#1a1a1a]"
        id="city-title"
      >
        شهر مورد نظرت رو انتخاب کن:
      </h2>

      <label
        className="relative mt-8 flex h-[48px] items-center rounded-xl bg-[#f0f0f0]"
        aria-label="جستجو در شهر"
      >
        <input
          className="h-full w-full rounded-[inherit] border-0 bg-transparent py-0 pl-12 pr-4 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#808080]"
          type="search"
          placeholder="جستجو در شهر"
          readOnly
        />
        <span className="home-search-icon" aria-hidden="true" />
      </label>

      <div className="mt-8 grid grid-cols-4 gap-4" aria-label="شهرهای پیشنهادی">
        {cities.map((city) => (
          <button
            className="flex min-h-[72px] min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl bg-transparent px-1 py-2 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            key={city.name}
            type="button"
          >
            <img
              src={city.icon}
              alt=""
              className="h-10 w-10 shrink-0 object-contain"
              aria-hidden="true"
            />

            <span className="text-xs font-medium leading-4">{city.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
