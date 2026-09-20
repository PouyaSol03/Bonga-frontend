import { DetailSection, MoreLink } from './viewAdComponents';
import { Typography } from '../../../shared/ui/Typography';
import type { ViewAdDetails, ViewAdProjectDetailVariant } from './viewAdTypes';
import { getCurrentViewAdBasePath } from './viewAdDetails';
import { PropertyGrid } from './viewAdComponents';

function ProjectDetailsCard({ details }: { details: ViewAdProjectDetailVariant[] }) {
  const first = details[0];
  if (!first) return null;

  return (
    <div className="mt-6 rounded-xl border border-surface-container bg-surface-container-lowest p-4 [direction:rtl]">
      <Typography as="p" variant="label" size="large" weight="semibold" className="text-on-surface">
        {first.meterageTitle}
      </Typography>
      <div className="mt-4 space-y-4 text-right">
        <ChipRow label="موجود در طبقات:" values={first.floors} />
        <ChipRow label="نوع اتاق:" values={[first.roomLabel]} />
        <ChipRow label="نوع موقعیت:" values={first.positions} />
      </div>
    </div>
  );
}

function ChipRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-dashed border-outline-var/40 pb-3 last:border-0 [direction:rtl]">
      <Typography as="span" variant="label" size="medium" weight="medium" className="text-outline">
        {label}
      </Typography>
      {values.filter(Boolean).map((value) => (
        <span key={value} className="rounded-lg bg-surface-container-high px-3 py-1 text-sm text-on-surface">
          {value}
        </span>
      ))}
    </div>
  );
}

export function PreSaleViewContent({
  adId,
  details,
}: {
  adId: string;
  details: ViewAdDetails;
}) {
  const info = details.propertyInfoPreview.filter((item) => !item.label.includes('رتبه'));

  return (
    <>
      <section className="border-t-8 border-surface-container bg-surface-container-lowest px-4 py-4 [direction:rtl]">
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="text-on-surface">
          اطلاعات پروژه
        </Typography>
        <PropertyGrid items={info} />
        <MoreLink to={`${getCurrentViewAdBasePath(adId)}/property-info`}>اطلاعات بیشتر</MoreLink>
      </section>

      <DetailSection icon="apartment" title="جزئیات پروژه">
        {details.projectDetails?.length ? <ProjectDetailsCard details={details.projectDetails} /> : null}
        {details.projectDetails?.length ? (
          <MoreLink to={`${getCurrentViewAdBasePath(adId)}/project-details`}>اطلاعات بیشتر</MoreLink>
        ) : null}
      </DetailSection>

      <DetailSection icon="apartment" title="تجهیزات و امکانات">
        <PropertyGrid items={details.features.slice(0, 6)} withLabels={false} />
      </DetailSection>

      <DetailSection icon="apartment" title="توضیحات">
        <Typography as="p" variant="body" size="medium" weight="regular" className="mt-6 whitespace-pre-line text-right text-on-surface">
          {details.description}
        </Typography>
      </DetailSection>
    </>
  );
}
