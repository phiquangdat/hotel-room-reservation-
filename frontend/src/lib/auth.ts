import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  email: string;
  firstName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  tokenExpiry: number | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tokenExpiry: null,

      login: (user, token) => {
        const expiry = Date.now() + 1000 * 60 * 60;
        set({ user, token, tokenExpiry: expiry });

        setTimeout(() => {
          if (Date.now() >= expiry) {
            get().logout();
          }
        }, 1000 * 60 * 60 + 1000);
      },

      logout: () => set({ user: null, token: null, tokenExpiry: null }),

      isAuthenticated: () => {
        const { token, tokenExpiry } = get();
        if (!token || !tokenExpiry) return false;
        if (Date.now() > tokenExpiry) {
          get().logout();
          return false;
        }
        return true;
      },
    }),
    {
      name: "hotel-auth-storage",
    }
  )
);
