import { Typography } from "../../../../shared/ui/Typography";

/**
 * Renders promotional badges (e.g., ویژه, فوری, پیشتاز) for an ad card.
 */
export function AdCardBadges({
  badges,
  className = "",
}: {
  badges?: string[];
  className?: string;
}) {
  if (!Array.isArray(badges) || badges.length === 0) return null;

  return (
    <div className={`flex shrink-0 items-center gap-1.5 ${className}`}>
      {badges.map((badge) => (
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="medium"
          className={`rounded-lg px-2.5 py-1 whitespace-nowrap ${
            badge === "فوری" || badge === "ویژه"
              ? "bg-error-container text-error"
              : "bg-primary-container text-primary"
          }`}
          key={badge}
        >
          {badge}
        </Typography>
      ))}
    </div>
  );
}
