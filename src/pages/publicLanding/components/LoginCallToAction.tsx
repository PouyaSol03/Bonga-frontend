import { RouteLink } from "../../../routes/RouteLink";
import CallCTABackground from "../../../assets/icons/CallCTABackground.svg";
import UserSolid from "../../../assets/icons/UserSolid";

export function LoginCallToAction() {
  return (
    <section
      className="flex flex-col items-center gap-4 bg-white px-4 pb-7 pt-8 min-[390px]:gap-5 min-[390px]:pb-[34px] min-[390px]:pt-10"
      aria-label="ورود"
    >
      <img
        src={CallCTABackground}
        alt=""
        className="h-auto w-full max-w-[300px] object-contain min-[390px]:max-w-[328px]"
        aria-hidden="true"
      />

      <RouteLink
        className="inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#0048c4] px-4 py-2.5 text-sm font-medium leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        to="/login"
      >
        <UserSolid />
        ورود به حساب کاربری
      </RouteLink>
    </section>
  );
}
