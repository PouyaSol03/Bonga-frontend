import { useNavigate } from "react-router";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { TopBar } from "../../../../shared/components/TopBar";
import type { DetailInfoSection } from "../viewAdDetails";
import { DetailInfoSectionBlock } from "./DetailInfoSectionBlock";

export function DetailInfoFullPage({
  title,
  sections,
  adId,
}: {
  title: string;
  sections: DetailInfoSection[];
  adId: string;
}) {
  const navigate = useNavigate();
  const isPreview = window.location.pathname.startsWith("/preview-ad/");
  const backTarget = adId
    ? isPreview
      ? `/preview-ad/${encodeURIComponent(String(adId))}`
      : `/ads/${encodeURIComponent(String(adId))}`
    : "/home";

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={backTarget}
        onBack={() => navigate(backTarget, { replace: true })}
        title={title}
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <DetailInfoSectionBlock key={section.title} section={section} separated={index > 0} />
          ))
        ) : (
          <div className="bg-surface-container-lowest text-outline mx-auto w-full px-4 py-10 text-center text-sm leading-5 font-medium">
            اطلاعاتی برای نمایش وجود ندارد.
          </div>
        )}
      </main>
    </PageFrame>
  );
}
