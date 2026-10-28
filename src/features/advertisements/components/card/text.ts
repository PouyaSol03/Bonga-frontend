const AD_CARD_TEXT_MAX_LENGTH = 50;

export function truncateAdCardText(text: string) {
  if (text.length <= AD_CARD_TEXT_MAX_LENGTH) return text;

  return `${text.slice(0, AD_CARD_TEXT_MAX_LENGTH - 1).trimEnd()}…`;
}
