import { useEffect, useState, type ReactNode } from "react";

import { AdCard, type AdCardData } from "../../shared/components/AdCard";
import LinearChat from "../../shared/icons/LinearChat";
import LinearPhone2 from "../../shared/icons/LinearPhone2";
import LinearShare from "../../shared/icons/LinearShare";
import LinearStar from "../../shared/icons/LinearStar";
import LinearRanking from "../../shared/icons/LinearRanking";
import LinearTag from "../../shared/icons/LinearTag";
import { Snackbar, type SnackbarVariant } from "../../shared/components/Snackbar";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

const listingImageSrc = "/figma/agency-preview/listing-kitchen.png";

const agentAds: AdCardData[] = [
  {
    id: 1,
    agency: "مشاور املاک",
    status: "",
    imageCount: "۵",
    priceLabelPrimary: "",
    pricePrimary: "۳/۸۵۰ میلیارد",
    priceLabelSecondary: "",
    priceSecondary: "",
    area: "۱۱۰ متر",
    rooms: "۲ اتاق",
    year: "۱۴۰۰",
    title: "آپارتمان ۱۱۰متری شمال تک واحدی سنددار رحیمی",
    timeAndLocation: "۱ ساعت پیش در الهیه",
    imageClassName: "",
    imageUrl: listingImageSrc,
    badges: ["فوری"],
  },
  {
    id: 2,
    agency: "مشاور املاک",
    status: "",
    imageCount: "۴",
    priceLabelPrimary: "",
    pricePrimary: "۲/۹۵۰ میلیارد",
    priceLabelSecondary: "",
    priceSecondary: "",
    area: "۸۵ متر",
    rooms: "۲ اتاق",
    year: "۱۳۹۸",
    title: "واحد خوش‌نقشه نزدیک مراکز خرید و حمل‌ونقل",
    timeAndLocation: "۳ ساعت پیش در صیاد شیرازی",
    imageClassName: "",
    imageUrl: listingImageSrc,
    badges: [],
  },
];

type PreviewToast = {
  message: string;
  title: string;
  variant: SnackbarVariant;
};

function getParam(name: string, fallback: string) {
  const value = new URLSearchParams(window.location.search).get(name);

  return value?.trim() || fallback;
}

async function shareOrCopyCurrentUrl(title: string) {
  const url = window.location.href;

  if (navigator.share) {
    await navigator.share({ title, url });
    return "shared" as const;
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return "copied" as const;
  }

  throw new Error("Sharing is not supported in this browser.");
}

export function AgentPreviewPage() {
  const [toast, setToast] = useState<PreviewToast | null>(null);
  const name = getParam("name", "مشاور املاک");
  const agency = getParam("agency", "مشاور مستقل");
  const location = getParam("location", "محله‌های منتخب");

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (
    message: string,
    title = "انجام شد",
    variant: SnackbarVariant = "success",
  ) => {
    setToast({ message, title, variant });
  };

  const handleShareClick = async () => {
    try {
      const result = await shareOrCopyCurrentUrl(name);

      if (result === "copied") {
        showToast("لینک صفحه مشاور کپی شد.");
      }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") {
        return;
      }

      showToast("اشتراک‌گذاری با خطا مواجه شد.", "خطا", "error");
    }
  };

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]">
      <TopBar
        actions={[
          {
            id: "share",
            label: "اشتراک‌گذاری",
            icon: <LinearShare className="h-6 w-6" />,
            onClick: () => void handleShareClick(),
          },
        ]}
        backTo="/home"
        contentClassName="px-1"
        title="صفحه مشاور"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-[84px]">
        <section className="bg-white px-4 pb-6 pt-4 text-center">
          <div className="mx-auto grid h-22 w-22 place-items-center rounded-3xl bg-gradient-to-br from-[#f6d8bc] to-[#c78a5c] text-4xl font-bold text-white shadow-[0_10px_24px_rgba(26,26,26,0.12)]">
            {name.trim().charAt(0) || "م"}
          </div>
          <Typography as="h1" variant="title" size="large" weight="semibold" className="m-0 mt-4 text-xl font-bold leading-7 text-[#1a1a1a]">
            {name}
          </Typography>
          <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 mt-1 text-sm font-medium leading-5 text-[#808080]">
            {agency}
          </Typography>
          <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-2 text-xs font-medium leading-5 text-[#0048c4]">
            {location}
          </Typography>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <AgentStat icon={<LinearStar className="h-5 w-5" />} label="امتیاز" value="۸۵" />
            <AgentStat icon={<LinearRanking className="h-5 w-5" />} label="رتبه" value="۱۲" />
            <AgentStat icon={<LinearTag className="h-5 w-5" />} label="آگهی فعال" value="۲۷" />
          </div>
        </section>

        <section className="mt-2 bg-white px-4 py-4">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-bold leading-6 text-[#1a1a1a]">
            درباره مشاور
          </Typography>
          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-3 text-right text-sm font-normal leading-7 text-[#4d4d4d]">
            این صفحه پیش‌نمایش عمومی مشاور است. اطلاعات دقیق‌تر بعداً می‌تواند از API مشاور خوانده شود.
          </Typography>
        </section>

        <section className="mt-2 bg-[#f0f0f0]">
          <div className="bg-white px-4 py-4">
            <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-bold leading-6 text-[#1a1a1a]">
              آگهی‌های مشاور
            </Typography>
          </div>
          <div className="space-y-2">
            {agentAds.map((ad) => (
              <AdCard ad={{ ...ad, agency: name }} key={ad.id} />
            ))}
          </div>
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-10 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(26,26,26,0.12)]">
        <div className="grid grid-cols-2 gap-3">
          <Button unstyled className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white" type="button">
            <LinearPhone2 className="h-5 w-5" />
            تماس
          </Button>
          <Button unstyled className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#0048c4] bg-white text-sm font-medium leading-5 text-[#0048c4]" type="button">
            <LinearChat className="h-5 w-5" />
            چت
          </Button>
        </div>
      </footer>

      {toast ? (
        <Snackbar
          className="top-16"
          message={toast.message}
          onDismiss={() => setToast(null)}
          title={toast.title}
          variant={toast.variant}
        />
      ) : null}
    </div>
  );
}

function AgentStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f7f7f7] px-2 py-3 text-center">
      <div className="mx-auto grid h-8 w-8 place-items-center rounded-xl bg-white text-[#0048c4]">
        {icon}
      </div>
      <strong className="mt-2 block text-sm font-bold leading-5 text-[#1a1a1a]">
        {value}
      </strong>
      <Typography as="span" variant="label" size="small" weight="medium" className="mt-0.5 block text-xs font-medium leading-4 text-[#808080]">
        {label}
      </Typography>
    </div>
  );
}
