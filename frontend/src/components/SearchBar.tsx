"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, User, Search } from "lucide-react";

export default function SearchBar() {
  const [city, setCity] = useState<string>("Vaasa");
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckoutDate] = useState<string>("");
  const [guests, setGuests] = useState<number>(2);

  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = new URLSearchParams({
      city,
      checkInDate,
      checkOutDate,
      guests: guests.toString(),
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
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
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
