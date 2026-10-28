import type { ReactNode } from "react";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";

export function MoreFeaturesButton({
  children,
  onMoreFeatures,
}: {
  children: ReactNode;
  onMoreFeatures?: () => void;
}) {
  return (
    <Button
      unstyled
      className="text-primary mx-auto flex items-center justify-center gap-2 py-2.5 text-base leading-6 font-medium active:opacity-80"
      onClick={onMoreFeatures}
      type="button"
    >
      <Typography variant="label" size="medium" weight="medium">
        {children}
      </Typography>
      <Typography
        as="span"
        variant="title"
        size="large"
        weight="medium"
        className="text-lg leading-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M11.2249 6.22456C11.469 5.98048 11.8646 5.98049 12.1087 6.22456C12.3528 6.46864 12.3528 6.86427 12.1087 7.10835L9.21729 9.99979L12.1087 12.8912C12.3528 13.1353 12.3528 13.5309 12.1087 13.775C11.8646 14.0191 11.469 14.0191 11.2249 13.775L7.8916 10.4417C7.77441 10.3245 7.7085 10.1655 7.7085 9.99979C7.70851 9.83405 7.77441 9.67509 7.8916 9.55789L11.2249 6.22456Z"
            fill="currentColor"
          />
        </svg>
      </Typography>
    </Button>
  );
}
