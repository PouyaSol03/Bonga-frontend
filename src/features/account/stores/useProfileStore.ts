import { create } from "zustand";
import type { UserProfile } from "../api/account-profile.types";
import { getMyProfile } from "../api/account-profile.service";
import { isUserIdentityVerified } from "../api/account.service";
import {
  authSessionChangedEventName,
  getStoredAuthSession,
} from "../../../shared/auth/auth-storage";

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: Error | null;
  fetchProfile: (force?: boolean) => Promise<UserProfile | null>;
  setProfile: (profile: UserProfile | null) => void;
  clearProfile: () => void;
  isVerified: () => boolean;
}

let inFlightPromise: Promise<UserProfile | null> | null = null;

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  fetchProfile: async (force = false) => {
    const session = getStoredAuthSession();
    if (!session) {
      set({ profile: null, isInitialized: true, isLoading: false, error: null });
      return null;
    }

    if (!force && get().profile) {
      return get().profile;
    }

    if (inFlightPromise) {
      return inFlightPromise;
    }

    set({ isLoading: true, error: null });

    inFlightPromise = (async () => {
      try {
        const data = await getMyProfile();
        set({ profile: data, isInitialized: true, isLoading: false, error: null });
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        set({ error, isLoading: false, isInitialized: true });
        return get().profile;
      } finally {
        inFlightPromise = null;
      }
    })();

    return inFlightPromise;
  },

  setProfile: (profile) => {
    set({ profile, isInitialized: true, error: null });
  },

  clearProfile: () => {
    set({ profile: null, isInitialized: false, isLoading: false, error: null });
  },

  isVerified: () => {
    return isUserIdentityVerified(get().profile);
  },
}));

if (typeof window !== "undefined") {
  window.addEventListener(authSessionChangedEventName, () => {
    const session = getStoredAuthSession();
    if (!session) {
      useProfileStore.getState().clearProfile();
    }
  });
}
