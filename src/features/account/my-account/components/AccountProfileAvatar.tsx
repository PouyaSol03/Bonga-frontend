import { useState } from "react";
import { AccountIcon } from "../accountIconMap";

export function AccountProfileAvatar({
  avatarUrl,
  className,
  iconClassName,
  label,
}: {
  avatarUrl?: string;
  className: string;
  iconClassName: string;
  label: string;
}) {
  return (
    <AccountProfileAvatarInner
      key={avatarUrl ?? ""}
      avatarUrl={avatarUrl}
      className={className}
      iconClassName={iconClassName}
      label={label}
    />
  );
}

function AccountProfileAvatarInner({
  avatarUrl,
  className,
  iconClassName,
  label,
}: {
  avatarUrl?: string;
  className: string;
  iconClassName: string;
  label: string;
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const showAvatar = Boolean(avatarUrl) && !hasImageError;

  return (
    <div className={`relative shrink-0 overflow-visible ${className}`}>
      <div className="bg-surface-container text-outline grid h-full w-full place-items-center overflow-hidden rounded-full">
        {showAvatar ? (
          <img
            alt={label}
            className="h-full w-full object-cover"
            src={avatarUrl}
            onError={() => setHasImageError(true)}
          />
        ) : (
          <AccountIcon name="user" className={iconClassName} />
        )}
      </div>
    </div>
  );
}
