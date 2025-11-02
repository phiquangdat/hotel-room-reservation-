"use client";

import { useSearchStore } from "@/lib/store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, User, Search } from "lucide-react";

export default function SearchBar() {
  const [city, setCity] = useState<string>("Vaasa");
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckoutDate] = useState<string>("");
  const [guestCapacity, setGuestCapacity] = useState<number>(0);

  const router = useRouter();
  const setSearchDates = useSearchStore((state) => state.setSearchDates);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchDates(checkInDate, checkOutDate, guestCapacity);

    const query = new URLSearchParams({
      city,
      checkInDate,
      checkOutDate,
      guestCapacity: guestCapacity.toString(),
    });

    router.push(`/search?${query.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-5 gap-4 items-center"
      >
        <div className="flex items-center border-b-2 border-gray-200 focus-within:border-indigo-600 transition">
          <MapPin className="h-5 w-5 text-black" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Destination"
            className="w-full p-2 outline-none bg-transparent text-black"
            required
          />
        </div>

        <div className="flex items-center border-b-2 border-gray-200 focus-within:border-indigo-600 transition">
          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full p-2 outline-none bg-transparent text-gray-500"
            required
          />
        </div>

        <div className="flex items-center border-b-2 border-gray-200 focus-within:border-indigo-600 transition">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckoutDate(e.target.value)}
            className="w-full p-2 outline-none bg-transparent text-gray-500"
            required
          />
        </div>

        <div className="flex items-center border-b-2 border-gray-200 focus-within:border-indigo-600 transition">
          <User className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="number"
            min="1"
            value={guestCapacity}
            onChange={(e) => setGuestCapacity(Number(e.target.value))}
            className="w-full p-2 outline-none bg-transparent text-black"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition shadow"
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
