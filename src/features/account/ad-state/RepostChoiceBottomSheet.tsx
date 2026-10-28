import { BottomSheet } from "../../../shared/components/BottomSheet";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearBuilding2 from "../../../shared/icons/LinearBuilding2";
import LinearUserSolid from "../../../shared/icons/LinearUserSolid";
import { ListItem } from "../../../shared/ui/ListItem";
import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";

export function RepostChoiceBottomSheet({
  isOpen,
  onClose,
  onSelectAgency,
  onSelectPersonal,
  isPersonalPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgency: () => void;
  onSelectPersonal: () => void;
  isPersonalPending: boolean;
}) {
  return (
    <BottomSheet
      ariaLabel="انتخاب روش انتشار مجدد"
      className="rounded-t-[24px]!"
      contentClassName="min-h-0 overflow-y-auto overscroll-contain pb-[max(0.875rem,env(safe-area-inset-bottom,0px))]"
      headerButtonAriaLabel="بستن"
      headerClassName="h-10! gap-1! px-2!"
      isOpen={isOpen}
      onClose={onClose}
      title="انتخاب روش انتشار مجدد"
      variant="actions"
      zIndexClassName="z-2000"
    >
      <div className="px-4 pb-2 text-right [direction:rtl]">
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var m-0 text-xs leading-5"
        >
          تمایل دارید همین آگهی را به چه صورت مجدداً فعال و منتشر نمایید؟ تمامی مشخصات ثبت‌شده ملک
          حفظ می‌شود.
        </Typography>
      </div>

      <div className="divide-outline-var divide-y">
        <ListItem
          description="پرداخت هزینه انتشار و انتشار فوری آگهی به صورت شخصی"
          disabled={isPersonalPending}
          leading={<LinearUserSolid aria-hidden="true" className="text-on-surface-var h-6 w-6" />}
          onClick={onSelectPersonal}
          tabIndex={isOpen ? 0 : -1}
          title={
            isPersonalPending
              ? "در حال انتقال به پرداخت..."
              : "انتشار شخصی و مستقیم (پرداخت آنلاین)"
          }
          trailing={<LinearArrowLeft1 aria-hidden="true" className="text-on-surface-var h-6 w-6" />}
        />

        <ListItem
          description="ارسال و واگذاری این آگهی به آژانس املاک برای مدیریت و انتشار"
          disabled={isPersonalPending}
          leading={<LinearBuilding2 aria-hidden="true" className="text-on-surface-var h-6 w-6" />}
          onClick={onSelectAgency}
          tabIndex={isOpen ? 0 : -1}
          title="ارسال و واگذاری به آژانس املاک دیگر"
          trailing={<LinearArrowLeft1 aria-hidden="true" className="text-on-surface-var h-6 w-6" />}
        />
      </div>
    </BottomSheet>
  );
}
