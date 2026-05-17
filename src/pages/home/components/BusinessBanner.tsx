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
    <section className="bg-white px-4 pb-5 pt-4 min-[390px]:pb-6" aria-label={eyebrow}>
      <div className="relative flex min-h-[108px] flex-row-reverse items-center justify-between gap-2 rounded-xl bg-[#edf2ff] px-3 py-3 text-[#0048c4] min-[390px]:min-h-[124px] min-[390px]:gap-2.5 min-[390px]:px-4">
        <img
          src={BannerHomePage}
          alt=""
          aria-hidden="true"
          className="h-auto w-[39%] max-w-[112px] shrink-0 min-[390px]:w-[42%] min-[390px]:max-w-[128px]"
        />

        <div className="flex min-w-0 flex-col items-start gap-0.5 text-right">
          <p className="m-0 whitespace-nowrap text-xs font-extrabold leading-4 text-[#11a366] min-[390px]:text-sm min-[390px]:leading-5">
            {eyebrow}
          </p>

          <h2 className="m-0 whitespace-nowrap text-base font-black leading-6 text-[#0048c4] min-[390px]:text-lg">
            {title}
          </h2>

          <button
            className="mt-1.5 flex items-center justify-start gap-2 rounded-lg bg-[#0048C4] px-3 py-1.5 text-xs font-medium leading-4 text-white min-[390px]:gap-3 min-[390px]:px-4"
            type="button"
          >
            {buttonText}
            <ArrowLeft />
          </button>
        </div>
      </div>

      <div
        className="mt-3 flex items-center justify-center gap-3 min-[390px]:mt-4 min-[390px]:gap-4"
        aria-label="اسلایدهای بنر"
      >
        {Array.from({ length: totalItems }, (_, index) => (
          <span
            key={index}
            className={`h-3 rounded-full transition-all min-[390px]:h-4 ${
              index === activeIndex
                ? "w-10 bg-[#0048c4] min-[390px]:w-[50px]"
                : "w-3 bg-[#dce5f2] min-[390px]:w-4"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}
