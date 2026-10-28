import { QRCodeSVG } from "qrcode.react";
import { Typography } from "../../../../shared/ui/Typography";

interface AgencyQrCardProps {
  agencyUrl: string;
  qrLabel: string;
}

export function AgencyQrCard({ agencyUrl, qrLabel }: AgencyQrCardProps) {
  return (
    <section className="flex w-full flex-col items-center justify-center text-center">
      <div className="bg-surface-container-lowest relative h-[240px] w-[240px] overflow-hidden">
        <QRCodeSVG
          bgColor="var(--surface-container-lowest)"
          className="block h-[240px] w-[240px]"
          fgColor="var(--on-surface)"
          level="M"
          marginSize={0}
          size={240}
          title="کد QR"
          value={agencyUrl}
        />
        <div
          aria-hidden="true"
          className="from-primary to-secondary pointer-events-none absolute inset-0 bg-gradient-to-b mix-blend-screen"
        />
      </div>

      <Typography
        as="p"
        variant="headline"
        size="small"
        className="text-secondary m-0 mt-4 text-center text-2xl leading-9 font-semibold"
      >
        {qrLabel}
      </Typography>
    </section>
  );
}
