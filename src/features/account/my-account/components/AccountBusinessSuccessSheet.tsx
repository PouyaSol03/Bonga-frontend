import { useNavigate } from "react-router";
import { BottomSheet } from "../../../../shared/components/BottomSheet";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import LinearWalletAdd from "../../../../shared/icons/LinearWalletAdd";

export function AccountBusinessSuccessSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  return (
    <BottomSheet
      ariaLabel="ثبت موفق حساب"
      className="rounded-t-[20px]"
      contentClassName="px-3 pb-8"
      heightClassName="h-[346px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      showHeader={false}
      showHeaderDivider={false}
      zIndexClassName="z-[999]"
    >
      <div className="px-4 text-center">
        <div className="mx-auto grid h-[132px] w-[132px] place-items-center rounded-full">
          <img src="/vectors/States.svg" alt="" />
        </div>
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="semibold"
          className="text-tertiary m-0 mt-2 text-sm leading-5 font-semibold"
        >
          حساب شما با موفقیت ثبت شد
        </Typography>
        <div className="text-on-surface-var mt-2 flex flex-col gap-2.5 space-y-1 text-right text-sm leading-5 font-normal">
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="m-0 flex gap-2"
          >
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="bg-tertiary mt-2 h-1.25 w-1.25 shrink-0 rounded-full"
            />
            <Typography as="span" variant="body" size="medium" weight="regular">
              برای دسترسی کامل به امکانات سامانه ابتدا اعتبار زمانی پنل خود را فعال کنید.
            </Typography>
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="m-0 flex gap-2"
          >
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="bg-tertiary mt-2 h-1.25 w-1.25 shrink-0 rounded-full"
            />
            <Typography as="span" variant="body" size="medium" weight="regular">
              سپس یکی از بسته‌های اعتباری را خریداری کنید.
            </Typography>
          </Typography>
        </div>
        <Button
          unstyled
          className="bg-primary text-on-primary mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm leading-5 font-semibold"
          onClick={() => navigate("/account/credit/panel")}
          type="button"
        >
          <LinearWalletAdd color="white" className="text-on-primary h-5 w-5" />
          <Typography as="span" variant="body" size="medium" weight="regular">
            افزایش اعتبار
          </Typography>
        </Button>
      </div>
    </BottomSheet>
  );
}
