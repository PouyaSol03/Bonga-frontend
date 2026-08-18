import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache settings are temporarily disabled.
      // gcTime: 1000 * 60 * 30,
      // staleTime: 1000 * 60 * 5,
      gcTime: 0,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});
