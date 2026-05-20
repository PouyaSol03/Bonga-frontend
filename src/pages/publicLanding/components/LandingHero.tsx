import { landingAssets } from "../publicLandingData";
import ShenasaVector from "../../../assets/icons/ShenasaVector";

export function LandingHero() {
  return (
    <section className="relative isolate flex min-h-[260px] items-end justify-center overflow-hidden px-5 pb-16 pt-10 text-white min-[390px]:min-h-[278px] min-[390px]:px-6 min-[390px]:pb-[72px] min-[390px]:pt-12">
      <img
        className="absolute inset-0 -z-[3] h-full w-full object-cover object-center"
        src={landingAssets.hero}
        alt=""
      />

      <div className="hero-tint absolute inset-0 -z-[2]" />

      <div className="flex w-full flex-col items-center gap-2 text-center">
        <BrandMark />

        <strong className="text-lg font-bold leading-6 text-white min-[390px]:text-xl min-[390px]:leading-[26px]">
          ایران شناسا
        </strong>

        <h1 className="m-0 mt-1.5 flex max-w-full items-center justify-center gap-1 whitespace-nowrap rounded-xl bg-[#edf0fb] px-3 py-1 text-base font-semibold leading-6 text-[#4d4d4d] min-[390px]:gap-[5px] min-[390px]:px-4 min-[390px]:text-xl min-[390px]:leading-[26px]">
          <span className="font-black text-[#0048c4]">خونه رویایی</span>
          <em className="font-black not-italic text-[#11a366]">خودتو</em>
          <b className="font-semibold">پیدا کن!</b>
        </h1>

        <p className="m-0 text-sm font-medium leading-5 text-[#edf0fb]">
          سایت ملکی ایران برای خرید، فروش و اجاره ملک
        </p>
      </div>
    </section>
  );
}

function BrandMark() {
  return (
    <div
      className="brand-mark relative mb-2 grid h-12 w-12 place-items-center rounded-full shadow-[0_4px_10px_#11a366,inset_0_-2px_2px_rgba(230,246,237,0.3)] min-[390px]:h-14 min-[390px]:w-14"
      aria-hidden="true"
    >
      <ShenasaVector />
    </div>
  );
}
