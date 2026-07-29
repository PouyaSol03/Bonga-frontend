import type { ReactNode } from "react";

import Linear3d from "../../components/(icons)/Linear3d";
import LinearImage from "../../components/(icons)/LinearImage";
import LinearVideo from "../../components/(icons)/LinearVideo";
import { AdCardAlbumIcon } from "../../components/AdCardIcons";
import { Typography } from "../../components/ui/Typography";

export function RequestResultImageMeta({ imageCount }: { imageCount: string }) {
  return (
    <div className="absolute right-2 top-2 z-2 inline-flex h-7 items-center overflow-hidden rounded-[9px] bg-[#1a1a1aaa] text-[#fafafa] shadow-sm">
      <ImageMetaIcon
        icon={
          <Typography as="span" variant="body" size="medium" weight="regular" className="inline-flex items-center gap-0.5">
            <AdCardAlbumIcon className="h-4 w-4" />
            <Typography as="span" variant="label" size="small" weight="medium" className="text-[10px] font-medium leading-none">{imageCount}</Typography>
          </Typography>
        }
      />
      <ImageMetaIcon icon={<LinearImage className="h-4 w-4" />} />
      <ImageMetaIcon icon={<LinearVideo className="h-4 w-4" />} />
      <ImageMetaIcon icon={<Linear3d className="h-4 w-4" />} />
    </div>
  );
}

function ImageMetaIcon({ icon }: { icon: ReactNode }) {
  return (
    <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-7 min-w-7 place-items-center border-l border-white/30 px-1 last:border-l-0">
      {icon}
    </Typography>
  );
}
