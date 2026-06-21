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
    detail: (id: string) => [...queryKeys.advertisements.all, "detail", id] as const,
    list: (filters: { categoryId?: string; cityId?: string; perPage: number }) =>
      [
        ...queryKeys.advertisements.all,
        "list",
        filters.cityId ?? "",
        filters.categoryId ?? "",
        filters.perPage,
      ] as const,
    map: (filters: {
      categoryId?: string;
      cityId?: string;
      east?: number;
      limit?: number;
      north?: number;
      south?: number;
      west?: number;
    }) =>
      [
        ...queryKeys.advertisements.all,
        "map",
        filters.cityId ?? "",
        filters.categoryId ?? "",
        filters.north ?? "",
        filters.south ?? "",
        filters.east ?? "",
        filters.west ?? "",
        filters.limit ?? "",
      ] as const,
    reportReasons: () =>
      [...queryKeys.advertisements.all, "report-reasons"] as const,
  },

  account: {
    all: ["account"] as const,
    profile: () => [...queryKeys.account.all, "profile"] as const,
    badges: () => [...queryKeys.account.all, "badges"] as const,
    bookmarksRoot: () => [...queryKeys.account.all, "bookmarks"] as const,
    bookmarks: (filters: { perPage: number }) =>
      [...queryKeys.account.bookmarksRoot(), filters.perPage] as const,
    notes: () => [...queryKeys.account.all, "notes"] as const,
    walletPayments: () => [...queryKeys.account.all, "wallet-payments"] as const,
    myAdsRoot: () => [...queryKeys.account.all, "my-ads"] as const,
    myAds: (filters: { perPage: number; type: string }) =>
      [...queryKeys.account.myAdsRoot(), filters.type, filters.perPage] as const,
  },

  searchHistory: {
    all: ["search-history"] as const,
    list: (qsearch?: string) =>
      [...queryKeys.searchHistory.all, "list", qsearch ?? ""] as const,
  },
};
