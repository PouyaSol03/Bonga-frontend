import { landingAssets } from "../publicLandingData";

export function LandingHero() {
  return (
    <section className="relative isolate flex min-h-[278px] items-end justify-center overflow-hidden px-6 pb-[72px] pt-12 text-white">
      <img
        className="absolute inset-0 -z-[3] h-full w-full object-cover object-center"
        src={landingAssets.hero}
        alt=""
      />

      <div className="hero-tint absolute inset-0 -z-[2]" />

      <div className="flex w-full flex-col items-center gap-2 text-center">
        <BrandMark />

        <strong className="text-xl font-bold leading-[26px] text-white">
          ایران شناسا
        </strong>

        <h1 className="m-0 mt-1.5 flex max-w-full items-center justify-center gap-[5px] whitespace-nowrap rounded-xl bg-[#edf0fb] px-4 py-1 text-xl font-semibold leading-[26px] text-[#4d4d4d]">
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
      className="brand-mark relative mb-2 grid h-14 w-14 place-items-center rounded-full shadow-[0_4px_10px_#11a366,inset_0_-2px_2px_rgba(230,246,237,0.3)]"
      aria-hidden="true"
    >
      <span className="brand-roof" />
    </div>
  );
}
