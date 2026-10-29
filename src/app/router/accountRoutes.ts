import type { AppRoute } from "./types";
import { accountCoreRoutes } from "./account/accountCoreRoutes";
import { accountSupportAndChatRoutes } from "./account/accountSupportAndChatRoutes";
import { accountBusinessRoutes } from "./account/accountBusinessRoutes";
import { accountManageAdsRoutes } from "./account/accountManageAdsRoutes";
import { accountAdWorkspaceRoutes } from "./account/accountAdWorkspaceRoutes";
import { accountCreditAndRankingRoutes } from "./account/accountCreditAndRankingRoutes";

export const accountRoutes: AppRoute[] = [
  ...accountCoreRoutes,
  ...accountSupportAndChatRoutes,
  ...accountBusinessRoutes,
  ...accountManageAdsRoutes,
  ...accountAdWorkspaceRoutes,
  ...accountCreditAndRankingRoutes,
];
