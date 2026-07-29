import { Typography } from "./ui/Typography";

type ColorableSvgIconProps = {
  className?: string;
  src: string;
};

export function ColorableSvgIcon({ className = "", src }: ColorableSvgIconProps) {
  return (
    <Typography as="span" variant="body" size="medium" weight="regular"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      style={{
        backgroundColor: "currentColor",
        maskImage: `url("${src}")`,
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskImage: `url("${src}")`,
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
