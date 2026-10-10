export type RankingLevel = {
  image: string;
  points: string;
  minPoints: number;
  maxPoints: number;
  title: string;
  slug: string;
};

export const AGENCY_RANKING_LEVELS: RankingLevel[] = [
  {
    image: "/vectors/agencyLevel/newbie.webp",
    points: "۰-۴۹",
    minPoints: 0,
    maxPoints: 49,
    title: "آژانس تازه‌کار",
    slug: "newbie",
  },
  {
    image: "/vectors/agencyLevel/active.webp",
    points: "۵۰-۶۴",
    minPoints: 50,
    maxPoints: 64,
    title: "آژانس فعال",
    slug: "active",
  },
  {
    image: "/vectors/agencyLevel/very_active.webp",
    points: "۶۵-۷۹",
    minPoints: 65,
    maxPoints: 79,
    title: "آژانس پویا",
    slug: "very_active",
  },
  {
    image: "/vectors/agencyLevel/top_one.webp",
    points: "۸۰-۸۹",
    minPoints: 80,
    maxPoints: 89,
    title: "آژانس برتر منطقه",
    slug: "top_one",
  },
  {
    image: "/vectors/agencyLevel/legendery.webp",
    points: "۹۰-۱۰۰",
    minPoints: 90,
    maxPoints: 100,
    title: "آژانس افسانه‌ای",
    slug: "legendery",
  },
];

export const CONSULTANT_RANKING_LEVELS: RankingLevel[] = [
  {
    image: "/vectors/agentLevel/beginner.png",
    points: "۰-۴۹",
    minPoints: 0,
    maxPoints: 49,
    title: "مشاور تازه‌کار",
    slug: "beginner",
  },
  {
    image: "/vectors/agentLevel/regional_expert.png",
    points: "۵۰-۶۴",
    minPoints: 50,
    maxPoints: 64,
    title: "کارشناس منطقه",
    slug: "regional_expert",
  },
  {
    image: "/vectors/agentLevel/selected_agent.png",
    points: "۶۵-۷۹",
    minPoints: 65,
    maxPoints: 79,
    title: "مشاور منتخب",
    slug: "selected_agent",
  },
  {
    image: "/vectors/agentLevel/deal_diamond.png",
    points: "۸۰-۸۹",
    minPoints: 80,
    maxPoints: 89,
    title: "الماس معاملات",
    slug: "deal_diamond",
  },
  {
    image: "/vectors/agentLevel/unmatched_star.png",
    points: "۹۰-۱۰۰",
    minPoints: 90,
    maxPoints: 100,
    title: "ستاره بی‌رقیب",
    slug: "unmatched_star",
  },
];

function normalizeText(text?: string | null): string {
  if (!text) return "";
  return text.trim().toLowerCase().replace(/[-_]/g, " ");
}

export const LEVEL_SLUG_TO_PERSIAN: Record<string, string> = {
  // Agency
  newbie: "آژانس تازه‌کار",
  new_agency: "آژانس تازه‌کار",
  "new agency": "آژانس تازه‌کار",
  active: "آژانس فعال",
  active_agency: "آژانس فعال",
  "active agency": "آژانس فعال",
  very_active: "آژانس پویا",
  dynamic: "آژانس پویا",
  top_one: "آژانس برتر منطقه",
  regional: "آژانس برتر منطقه",
  legendery: "آژانس افسانه‌ای",
  legendary: "آژانس افسانه‌ای",

  // Consultant
  beginner: "مشاور تازه‌کار",
  regional_expert: "کارشناس منطقه",
  selected_agent: "مشاور منتخب",
  deal_diamond: "الماس معاملات",
  unmatched_star: "ستاره بی‌رقیب",
};

export function formatRankingLevelTitle(params?: {
  isAgency?: boolean;
  score?: number | null;
  levelTitle?: string | null;
  levelSlug?: string | null;
}): string {
  const rawTitle = params?.levelTitle?.trim();
  if (rawTitle && /[\u0600-\u06FF]/.test(rawTitle)) {
    return rawTitle;
  }

  const slug = params?.levelSlug?.trim().toLowerCase();
  if (slug && LEVEL_SLUG_TO_PERSIAN[slug]) {
    return LEVEL_SLUG_TO_PERSIAN[slug];
  }

  const level = params?.isAgency
    ? getAgencyRankingLevel(params)
    : getConsultantRankingLevel(params);
  return level.title;
}

export function getAgencyRankingLevel(params?: {
  score?: number | null;
  levelTitle?: string | null;
  levelSlug?: string | null;
}): RankingLevel {
  const levels = AGENCY_RANKING_LEVELS;
  const title = normalizeText(params?.levelTitle);
  const slug = normalizeText(params?.levelSlug);

  if (title || slug) {
    const found = levels.find((lvl) => {
      const lvlTitle = normalizeText(lvl.title);
      const lvlSlug = normalizeText(lvl.slug);
      return (
        (title && (lvlTitle.includes(title) || title.includes(lvlTitle) || (title.includes("new") && lvlSlug === "newbie"))) ||
        (slug && (lvlSlug === slug || slug.includes(lvlSlug) || (slug.includes("new") && lvlSlug === "newbie")))
      );
    });
    if (found) return found;
  }

  const score = params?.score;
  if (typeof score === "number" && Number.isFinite(score)) {
    const foundByScore = levels.find(
      (lvl) => score >= lvl.minPoints && score <= lvl.maxPoints
    );
    if (foundByScore) return foundByScore;
    if (score > 100) return levels[levels.length - 1];
  }

  return levels[0];
}

export function getConsultantRankingLevel(params?: {
  score?: number | null;
  levelTitle?: string | null;
  levelSlug?: string | null;
}): RankingLevel {
  const levels = CONSULTANT_RANKING_LEVELS;
  const title = normalizeText(params?.levelTitle);
  const slug = normalizeText(params?.levelSlug);

  if (title || slug) {
    const found = levels.find((lvl) => {
      const lvlTitle = normalizeText(lvl.title);
      const lvlSlug = normalizeText(lvl.slug);
      return (
        (title && (lvlTitle.includes(title) || title.includes(lvlTitle))) ||
        (slug && (lvlSlug === slug || slug.includes(lvlSlug)))
      );
    });
    if (found) return found;
  }

  const score = params?.score;
  if (typeof score === "number" && Number.isFinite(score)) {
    const foundByScore = levels.find(
      (lvl) => score >= lvl.minPoints && score <= lvl.maxPoints
    );
    if (foundByScore) return foundByScore;
    if (score > 100) return levels[levels.length - 1];
  }

  return levels[0];
}
