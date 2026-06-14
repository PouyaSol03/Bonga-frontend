export const queryKeys = {
  account: {
    all: ["account"] as const,
    badges: () => [...queryKeys.account.all, "badges"] as const,
    myAds: (filters: { page: number; type: string }) =>
      [...queryKeys.account.all, "my-ads", filters.type, filters.page] as const,
    notes: () => [...queryKeys.account.all, "notes"] as const,
    profile: () => [...queryKeys.account.all, "profile"] as const,
    walletPayments: () => [...queryKeys.account.all, "wallet-payments"] as const,
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
  },
  categories: {
    all: ["categories"] as const,
    list: () => [...queryKeys.categories.all, "list"] as const,
  },
  cities: {
    all: ["cities"] as const,
    list: () => [...queryKeys.cities.all, "list"] as const,
    mostVisited: () => [...queryKeys.cities.all, "most-visited"] as const,
  },
};
