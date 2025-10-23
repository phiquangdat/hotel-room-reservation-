"use client";

import SearchBar from "../components/SearchBar";
import RoomCard, { RoomCardProps } from "@/components/RoomCard";

const featuredRooms: RoomCardProps[] = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    hotelName: "Scandic Waskia",
    roomType: "Standard Queen Room",
    pricePerNight: 125,
    capacity: 2,
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
    hotelName: "Original Sokos Hotel Royal",
    roomType: "Superior King Room",
    pricePerNight: 160,
    capacity: 2,
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop", // Stylish Resort Room
    hotelName: "Hotel Astor",
    roomType: "Junior Suite with Sea View",
    pricePerNight: 195,
    capacity: 3,
  },
];

export default function Home() {
  return (
    <div>
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://www.ca.kayak.com/rimg/dimg/dynamic/186/2023/08/295ffd3a54bd51fc33810ce59382d1da.webp')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-2xl">
              Find Your Next
              <span className="block bg-purple-200 bg-clip-text text-transparent">
                Great Stay
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto drop-shadow-lg">
              Discover the best hotels around the world at unbeatable prices
            </p>
          </div>
        </div>
      </div>

      <div className="relative -mt-20 z-20 flex justify-center px-4">
        <SearchBar />
      </div>

      <div className="py-16 bg-gray-50 text-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
