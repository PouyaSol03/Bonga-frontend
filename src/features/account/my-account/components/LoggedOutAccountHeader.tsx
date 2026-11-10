import { Link } from "react-router";
import { Typography } from "../../../../shared/ui/Typography";
import LinearLock from "../../../../shared/icons/LinearLock";
import { ChevronLeftIcon, Divider } from "./AccountMenuRow";

export function LoggedOutAccountHeader() {
  return (
    <section className="bg-surface-container-lowest pt-4" aria-label="ورود به حساب">
      <div className="px-4 pt-2 pb-2">
        <Link
          className="border-primary text-primary focus-visible:outline-primary/25 flex h-14 w-full items-center gap-2 rounded-xl border px-4 [direction:ltr] focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
          to="/login/phone"
        >
          <ChevronLeftIcon className="h-6 w-6 shrink-0" />
          <Typography
            as="span"
            variant="label"
            size="large"
            weight="medium"
            className="min-w-0 flex-1 truncate text-right text-base leading-6 font-medium [direction:rtl]"
          >
            ورود به حساب کاربری
          </Typography>
          <LinearLock className="h-5 w-5" />
        </Link>

        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var m-0 mt-4 text-right text-sm leading-5 font-normal"
        >
          برای استفاده از تمام امکانات وارد حساب کاربری خود شوید.
        </Typography>
      </div>
      <Divider />
    </section>
  );
}
