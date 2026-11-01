import { Typography } from "../../../shared/ui/Typography";
import { CrmIcon } from "./CrmIcon";
import { Link } from "react-router";

export function DesktopRequiredPage() {
  return (
    <div className="grid h-screen w-full place-items-center bg-[#eef3fb] px-5" dir="rtl">
      <section className="w-full max-w-md rounded-3xl border border-[#dfe6f2] bg-white p-8 text-center shadow-[0_24px_70px_rgba(24,50,90,0.12)]">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]">
          <CrmIcon name="desktop" size={32} />
        </div>
        <Typography
          as="h1"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 mt-5 text-lg font-bold text-[#1e2633]"
        >
          نسخه مدیریت برای دسکتاپ طراحی شده است
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 mt-2 text-sm leading-7 text-[#6f7888]"
        >
          برای استفاده کامل از جدول‌ها، فرم‌ها و نقشه مدیریت، این صفحه را روی لپ‌تاپ یا نمایشگر
          بزرگ‌تر باز کنید.
        </Typography>
        <Link
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#0048c4] px-6 text-sm font-bold text-white no-underline"
          to="/account"
        >
          بازگشت به حساب من
        </Link>
      </section>
    </div>
  );
}
