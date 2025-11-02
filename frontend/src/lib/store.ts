import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SearchState {
  checkInDate: string | null;
  checkOutDate: string | null;
  guestCapacity: number;
  setSearchDates: (checkIn: string, checkOut: string, guests: number) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      checkInDate: null,
      checkOutDate: null,
      guestCapacity: 1,

      setSearchDates: (checkIn, checkOut, guests) =>
        set({
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestCapacity: guests,
        }),
    }),
    {
      name: "hotel-search-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
