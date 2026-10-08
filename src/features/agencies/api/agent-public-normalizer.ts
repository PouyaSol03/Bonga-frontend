import {
  asRecord,
  firstNumber,
  firstText,
  readAdvertises,
  readSocialValue,
  toAssetUrl,
  toStringArray,
  toText,
} from "./agency-helpers";
import type {
  PublicAgentAgencySummary,
  PublicAgentDetailDto,
  PublicAgentListApiItem,
  PublicAgentListDto,
} from "./agent-public.types";

export function normalizePublicAgentListItem(
  item: PublicAgentListApiItem,
): PublicAgentListDto | null {
  const id = firstText(item.id, item._id);
  const name = toText(item.name);
  const family = toText(item.family);
  const fullName = firstText(
    item.full_name,
    [name, family].filter(Boolean).join(" "),
  );

  if (!id || !fullName) return null;

  const agencyRecord = asRecord(item.agency);
  const agencyId = firstText(item.agency_id, agencyRecord.id, agencyRecord._id);
  const agencyName = firstText(agencyRecord.name, agencyRecord.title);
  const agency: PublicAgentAgencySummary | undefined =
    agencyId || agencyName
      ? {
          address: firstText(agencyRecord.address) || undefined,
          id: agencyId || undefined,
          logo: toAssetUrl(agencyRecord.logo ?? agencyRecord.img),
          name: agencyName || undefined,
        }
      : undefined;

  return {
    agencyId: agencyId || undefined,
    agency,
    avatar: toAssetUrl(item.avatar),
    family: family || undefined,
    fullName,
    id,
    levelSlug: toText(item.level_slug) || undefined,
    levelTitle: toText(item.level_title) || undefined,
    mobile: firstText(item.mobile, item.phonenumber) || undefined,
    name: name || undefined,
    rank: Number.isFinite(Number(item.rank)) ? Math.max(0, Number(item.rank)) : undefined,
    role: toText(item.role) || undefined,
    score: Number.isFinite(Number(item.score)) ? Math.max(0, Number(item.score)) : undefined,
    status: toText(item.status) || undefined,
    userId: firstText(item.user_id) || undefined,
  };
}

export function normalizePublicAgentDetail(
  item: Record<string, unknown>,
): PublicAgentDetailDto | null {
  const profile = asRecord(item.profile);
  const user = asRecord(item.user);
  const ranking = asRecord(item.ranking_summary ?? item.ranking);
  const currentRanking = asRecord(ranking.current);
  const level = asRecord(ranking.level);
  const agencyRecord = asRecord(item.agency ?? item.agency_summary);
  const id = firstText(item.id, item._id);
  const composedName = [
    firstText(profile.name, user.name),
    firstText(profile.family, user.family),
  ].filter(Boolean).join(" ").trim();
  const directName = [firstText(item.name), firstText(item.family)]
    .filter(Boolean)
    .join(" ")
    .trim();
  const name = firstText(item.full_name, directName, composedName);

  if (!id || !name) return null;

  const agencyId = firstText(item.agency_id, agencyRecord.id, agencyRecord._id);
  const agencyName = firstText(agencyRecord.name, agencyRecord.title);
  const agency: PublicAgentAgencySummary | undefined =
    agencyId || agencyName
      ? {
          address: firstText(agencyRecord.address) || undefined,
          id: agencyId || undefined,
          logo: toAssetUrl(agencyRecord.logo ?? agencyRecord.img),
          name: agencyName || undefined,
        }
      : undefined;

  return {
    active_advertises_count: Math.max(
      0,
      firstNumber(
        0,
        item.active_advertises_count,
        item.active_advertise_count,
        item.published_advertises_count,
        item.active_ads_count,
      ),
    ),
    about_us: firstText(
      item.about_us,
      item.about,
      item.bio,
      item.description,
      profile.about_us,
      profile.bio,
    ) || undefined,
    agencyId: agencyId || undefined,
    agency,
    avatar: toAssetUrl(item.avatar ?? item.img ?? profile.avatar ?? user.avatar),
    id,
    instagram: readSocialValue(item, "instagram") || undefined,
    level_slug: firstText(
      item.level_slug,
      item.level,
      ranking.level_slug,
      currentRanking.level_slug,
      level.slug,
    ) || undefined,
    level_title: firstText(
      item.level_title,
      ranking.level_title,
      currentRanking.level_title,
      level.title,
      level.name,
    ) || undefined,
    mobile: firstText(
      item.mobile,
      item.phonenumber,
      item.phone,
      profile.mobile,
      profile.phone,
      user.mobile,
      user.phone,
    ) || undefined,
    name,
    neighborhood_ids: toStringArray(
      item.neighborhood_ids ??
        item.activity_neighborhood_ids ??
        profile.neighborhood_ids ??
        item.neighborhood_id,
    ),
    rank: Math.max(
      0,
      firstNumber(0, item.rank, item.ranking_rank, ranking.rank, currentRanking.rank),
    ),
    recent_advertises: readAdvertises(
      item.recent_advertises,
      item.recent_ads,
      item.advertises,
    ),
    role: firstText(item.role) || undefined,
    score: Math.max(
      0,
      firstNumber(
        0,
        item.score,
        item.ranking_score,
        ranking.score,
        ranking.total_score,
        currentRanking.score,
        currentRanking.total_score,
      ),
    ),
    status: firstText(item.status) || undefined,
    telegram: readSocialValue(item, "telegram") || undefined,
    userId: firstText(item.user_id, user.id, user._id) || undefined,
    whatsapp: readSocialValue(item, "whatsapp") || undefined,
  };
}
