import { useNavigate } from "react-router";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";

export function CrmLocationMapEmptyState() {
  const navigate = useNavigate();

  return (
    <div className="grid h-full min-h-[520px] place-items-center rounded-xl bg-white p-8 text-center">
      <div>
        <Typography
          as="h1"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-[#1a1a1a]"
        >
          شهری انتخاب نشده است
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="mt-2 text-[#808080]"
        >
          از صفحه مدیریت موقعیت‌ها یک شهر را انتخاب و سپس نقشه را باز کنید.
        </Typography>
        <Button
          className="mt-5"
          onClick={() =>
            window.history.state?.idx > 0
              ? navigate(-1)
              : navigate("/crm/locations", { replace: true })
          }
          size="x-medium"
          variant="primary"
        >
          بازگشت به موقعیت‌ها
        </Button>
      </div>
    </div>
  );
}
