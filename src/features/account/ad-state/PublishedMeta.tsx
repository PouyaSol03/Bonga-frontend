import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";
import { readDateLike, readExpirationRemaining } from "./dateModel";

export function PublishedMeta({ ad }: { ad?: Record<string, unknown> }) {
  const publishedRaw =
    ad?.confirm_date ??
    ad?.confirmDate ??
    ad?.published_at ??
    ad?.publishedAt ??
    ad?.published_date ??
    ad?.sort_date ??
    ad?.sortDate ??
    ad?.created_at ??
    ad?.createdAt ??
    ad?.published_time_ago;

  const published = readDateLike(publishedRaw, ad?.published_hours_ago);
  const expires = readExpirationRemaining(
    ad?.expire_date ??
      ad?.expireDate ??
      ad?.expires_at ??
      ad?.expiresAt ??
      ad?.expiration_date ??
      ad?.expirationDate ??
      ad?.expired_at ??
      (typeof ad?.expire === "object" && ad?.expire && "expires_at" in ad.expire
        ? (ad.expire as { expires_at?: unknown }).expires_at
        : undefined) ??
      ad?.expires_time_ago,
    publishedRaw,
  );

  return (
    <div className="mt-4 text-sm leading-5 font-medium">
      <MetaRow label="انتشار" value={published} />
      <div className="border-outline-var border-t border-dashed" aria-hidden="true" />
      <MetaRow label="انقضا" value={expires} />
    </div>
  );
}

export function renderDateWithRelative(text: string) {
  if (!text) return null;

  const match1 = text.match(/^(.*?)\s*(\([0-9/\u06F0-\u06F9\-.]+\))$/);
  if (match1) {
    const relative = match1[1].trim();
    const date = match1[2].trim();
    return (
      <span className="inline-flex items-center gap-1.5 [direction:rtl]">
        <span className="text-outline text-sm font-medium">{relative}</span>
        <span className="text-on-surface text-sm font-medium">{date}</span>
      </span>
    );
  }

  const match2 = text.match(/^(.*?)\s*\((.*?(?:پیش|دیگر|مانده|قبل).*?)\)$/);
  if (match2) {
    const date = match2[1].trim();
    const relative = `(${match2[2].trim()})`;
    return (
      <span className="inline-flex items-center gap-1.5 [direction:rtl]">
        <span className="text-on-surface text-sm font-medium">{date}</span>
        <span className="text-outline text-sm font-medium">{relative}</span>
      </span>
    );
  }

  if (
    text.includes("پیش") ||
    text.includes("دیگر") ||
    text.includes("قبل") ||
    text.includes("مانده")
  ) {
    return <span className="text-outline text-sm font-medium">{text}</span>;
  }

  return <span className="text-on-surface text-sm font-medium">{text}</span>;
}

export function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-12 items-center justify-between gap-4 [direction:ltr]">
      <div className="[direction:rtl]">{renderDateWithRelative(value)}</div>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="text-outline [direction:rtl]"
      >
        {label}
      </Typography>
    </div>
  );
}
