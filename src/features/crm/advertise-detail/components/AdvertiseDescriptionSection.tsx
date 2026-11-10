import LinearMapsLocation from "../../../../shared/icons/LinearMapsLocation";
import { Typography } from "../../../../shared/ui/Typography";
import { PublicStyleSection } from "./DetailPrimitives";

export function AdvertiseDescriptionSection({
  address,
  adminNote,
  description,
}: {
  address: string;
  adminNote?: string;
  description: string;
}) {
  return (
    <>
      <PublicStyleSection title="توضیحات">
        <Typography
          as="p"
          variant="body"
          size="large"
          weight="regular"
          className="m-0 text-base leading-8 whitespace-pre-wrap text-[#1a1a1a]"
        >
          {description}
        </Typography>
        <div className="mt-6 rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-4">
          <div className="flex items-start gap-3">
            <LinearMapsLocation className="mt-0.5 h-6 w-6 shrink-0 text-[#0048c4]" />
            <div>
              <Typography
                as="span"
                variant="body"
                size="small"
                weight="regular"
                className="text-xs text-[#808080]"
              >
                آدرس
              </Typography>
              <strong className="mt-1 block text-sm leading-6 text-[#1a1a1a]">{address}</strong>
            </div>
          </div>
        </div>
      </PublicStyleSection>

      {adminNote ? (
        <PublicStyleSection title="یادداشت مدیر">
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="m-0 text-sm leading-8 whitespace-pre-wrap text-[#4d4d4d]"
          >
            {adminNote}
          </Typography>
        </PublicStyleSection>
      ) : null}
    </>
  );
}
