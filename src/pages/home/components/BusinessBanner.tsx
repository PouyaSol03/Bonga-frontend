// src/pages/home/components/BusinessBanner.tsx
import ArrowLeft from "../../../assets/icons/ArrowLeft";
import BannerHomePage from "../../../assets/icons/BannerHomePage.svg";

type BusinessBannerProps = {
  eyebrow: string;
  title: string;
  buttonText: string;
  activeIndex?: number;
  totalItems?: number;
};

export function BusinessBanner({
  eyebrow,
  title,
  buttonText,
  activeIndex = 0,
  totalItems = 3,
}: BusinessBannerProps) {
  return (
    <section className="bg-white px-4 pb-6 pt-4" aria-label={eyebrow}>
      <div className="relative flex min-h-[124px] flex-row-reverse items-center justify-between gap-2.5 rounded-xl bg-[#edf2ff] px-4 py-3 text-[#0048c4]">
        <img
          src={BannerHomePage}
          alt=""
          aria-hidden="true"
          className="h-auto w-auto shrink-0"
        />

        <div className="flex min-w-0 flex-col items-start gap-0.5 text-right">
          <p className="m-0 whitespace-nowrap text-base font-extrabold leading-6 text-[#11a366]">
            {eyebrow}
          </p>

          <h2 className="m-0 whitespace-nowrap text-xl font-black leading-7 text-[#0048c4]">
            {title}
          </h2>

          <button
            className="mt-1.5 flex justify-start items-center gap-3 bg-[#0048C4] text-white rounded-lg py-1.5 px-4"
            type="button"
          >
            {buttonText}
            <ArrowLeft />
          </button>
        </div>
      </div>

      <div
        className="mt-4 flex items-center justify-center gap-4"
        aria-label="اسلایدهای بنر"
      >
        {Array.from({ length: totalItems }, (_, index) => (
          <span
            key={index}
            className={`h-4 rounded-full transition-all ${
              index === activeIndex
                ? "w-[50px] bg-[#0048c4]"
                : "w-4 bg-[#dce5f2]"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}
