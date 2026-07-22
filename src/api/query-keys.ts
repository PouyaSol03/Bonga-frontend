export const queryKeys = {
  categories: {
    all: ["categories"] as const,
    list: () => [...queryKeys.categories.all, "list"] as const,
  },

  cities: {
    all: ["cities"] as const,
    list: () => [...queryKeys.cities.all, "list"] as const,
    mostVisited: () => [...queryKeys.cities.all, "most-visited"] as const,
    search: (q?: string) => [...queryKeys.cities.all, "search", q ?? ""] as const,
  },

  agencies: {
    all: ["agencies"] as const,
    consultant: (userId: number | string) =>
      [...queryKeys.agencies.all, "my-consultant", String(userId)] as const,
    consultants: (filters: { page: number; perPage: number }) =>
      [
        ...queryKeys.agencies.all,
        "my-consultants",
        filters.page,
        filters.perPage,
      ] as const,
    publicAgents: (filters: {
      agencyId?: number | string;
      page?: number;
      perPage: number;
      search?: string;
    }) =>
      [
        ...queryKeys.agencies.all,
        "public-agents",
        String(filters.agencyId ?? ""),
        filters.search ?? "",
        filters.page ?? "infinite",
        filters.perPage,
      ] as const,
    list: (filters: {
      neighborhoodId?: string;
      perPage: number;
      search?: string;
      sort?: string;
    }) =>
      [
        ...queryKeys.agencies.all,
        "list",
        filters.search ?? "",
        filters.neighborhoodId ?? "",
        filters.sort ?? "",
        filters.perPage,
      ] as const,
  },

  neighborhoods: {
    all: ["neighborhoods"] as const,
    infoWithLoc: (filters: { cityId?: string; lat?: number; lng?: number }) =>
      [
        ...queryKeys.neighborhoods.all,
        "info-with-loc",
        filters.cityId ?? "",
        filters.lat ?? "",
        filters.lng ?? "",
      ] as const,
    list: (filters: { cityId?: string; page?: number; perPage?: number; q?: string }) =>
      [
        ...queryKeys.neighborhoods.all,
        "list",
        filters.cityId ?? "",
        filters.q ?? "",
        filters.page ?? "",
        filters.perPage ?? "",
      ] as const,
  },

  advertisements: {
    all: ["advertisements"] as const,
    checkout: (id: string) => [...queryKeys.advertisements.all, "checkout", id] as const,
    detail: (id: string) => [...queryKeys.advertisements.all, "detail", id] as const,
    preview: (id: string) => [...queryKeys.advertisements.all, "preview", id] as const,
    list: (filters: { cityId?: string; filters?: unknown; perPage: number }) =>
      [
        ...queryKeys.advertisements.all,
        "list",
        filters.cityId ?? "",
        JSON.stringify(filters.filters ?? {}),
        filters.perPage,
      ] as const,
    map: (filters: {
      cityId?: string;
      east?: number;
      filters?: unknown;
      geofence?: string;
      limit?: number;
      north?: number;
      south?: number;
      west?: number;
    }) =>
      [
        ...queryKeys.advertisements.all,
        "map",
        filters.cityId ?? "",
        JSON.stringify(filters.filters ?? {}),
        filters.geofence ?? "",
        filters.north ?? "",
        filters.south ?? "",
        filters.east ?? "",
        filters.west ?? "",
        filters.limit ?? "",
      ] as const,
    reportReasons: () =>
      [...queryKeys.advertisements.all, "report-reasons"] as const,
  },

  dashboard: {
    all: ["dashboard"] as const,
    agency: (period: string) =>
      [...queryKeys.dashboard.all, "agency", period] as const,
    agent: (period: string) =>
      [...queryKeys.dashboard.all, "agent", period] as const,
  },

  account: {
    all: ["account"] as const,
    profile: () => [...queryKeys.account.all, "profile"] as const,
    agencyProfile: () => [...queryKeys.account.all, "agency-profile"] as const,
    badges: () => [...queryKeys.account.all, "badges"] as const,
    bookmarksRoot: () => [...queryKeys.account.all, "bookmarks"] as const,
    bookmarks: (filters: { perPage: number }) =>
      [...queryKeys.account.bookmarksRoot(), filters.perPage] as const,
    notes: () => [...queryKeys.account.all, "notes"] as const,
    wallet: () => [...queryKeys.account.all, "wallet"] as const,
    walletPayments: (page: number) =>
      [...queryKeys.account.all, "wallet-payments", page] as const,
    creditHistory: (perPage: number) =>
      [...queryKeys.account.all, "credit-history", perPage] as const,
    myAdsRoot: () => [...queryKeys.account.all, "my-ads"] as const,
    myAds: (filters: { perPage: number; type: string }) =>
      [...queryKeys.account.myAdsRoot(), filters.type, filters.perPage] as const,
  },

  packages: {
    all: ["packages"] as const,
    list: () => [...queryKeys.packages.all, "list"] as const,
  },

  chats: {
    all: ["chats"] as const,
    detail: (threadId: string) => [...queryKeys.chats.all, "detail", threadId] as const,
    entry: (params: { advertiseId?: string; threadId?: string }) =>
      [
        ...queryKeys.chats.all,
        "entry",
        params.threadId ?? "",
        params.advertiseId ?? "",
      ] as const,
    list: (filters: { category: string; page: number; perPage: number }) =>
      [
        ...queryKeys.chats.all,
        "list",
        filters.category,
        filters.page,
        filters.perPage,
      ] as const,
    messages: (threadId: string) =>
      [...queryKeys.chats.detail(threadId), "messages"] as const,
    unreadCount: () => [...queryKeys.chats.all, "unread-count"] as const,
  },

  notifications: {
    all: ["notifications"] as const,
    list: (filters: {
      category?: string;
      includeDisabled?: boolean;
      perPage: number;
      read?: boolean;
      type?: string;
    }) =>
      [
        ...queryKeys.notifications.all,
        "list",
        filters.category ?? "",
        filters.type ?? "",
        filters.read ?? "",
        filters.includeDisabled ?? false,
        filters.perPage,
      ] as const,
    preferences: () =>
      [...queryKeys.notifications.all, "preferences"] as const,
    unreadCount: (category?: string) =>
      [...queryKeys.notifications.all, "unread-count", category ?? ""] as const,
  },

  searchHistory: {
    all: ["search-history"] as const,
    list: (qsearch?: string) =>
      [...queryKeys.searchHistory.all, "list", qsearch ?? ""] as const,
  },

  savedSearches: {
    all: ["saved-searches"] as const,
    list: () => [...queryKeys.savedSearches.all, "list"] as const,
  },
};
