import { Button } from "../../../../shared/ui/Button";
import type { MobilePaymentTab } from "../types";

export function MobileCreditTabs({
  activeTab,
  onChange,
}: {
  activeTab: MobilePaymentTab;
  onChange: (tab: MobilePaymentTab) => void;
}) {
  return (
    <nav className="bg-surface-container-lowest shrink-0 px-4 py-4" aria-label="نوع افزایش اعتبار">
      <div className="border-primary flex h-11 overflow-hidden rounded-xl border [direction:ltr]">
        <Button
          unstyled
          className={`flex flex-1 items-center justify-center text-base leading-6 font-medium [direction:rtl] ${
            activeTab === "panel"
              ? "bg-primary-container text-primary"
              : "bg-surface-container-lowest text-on-surface-var"
          }`}
          onClick={() => onChange("panel")}
          type="button"
        >
          اعتبار پنل
        </Button>
        <Button
          unstyled
          className={`border-primary flex flex-1 items-center justify-center border-l text-base leading-6 font-medium [direction:rtl] ${
            activeTab === "packages"
              ? "bg-primary-container text-primary"
              : "bg-surface-container-lowest text-on-surface-var"
          }`}
          onClick={() => onChange("packages")}
          type="button"
        >
          بسته‌ها
        </Button>
      </div>
    </nav>
  );
}
