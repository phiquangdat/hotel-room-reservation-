"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import HotelCard from "@/components/HotelCard";
import { fetchTopHotels, type Hotel } from "@/lib/actions";
import { Star } from "lucide-react";

export default function Home() {
  const [featuredRooms, setFeaturedRooms] = useState<Hotel[]>([]);

  useEffect(() => {
    async function loadHotels() {
      try {
        const data: Hotel[] = await fetchTopHotels();
        setFeaturedRooms(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadHotels();
  }, []);

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
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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

      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-900">
                Top Rated Hotels
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most highly-rated accommodations, loved by travelers
              for exceptional service and comfort
            </p>
          </div>

          {featuredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRooms.map((hotel, index) => (
                <HotelCard key={hotel.id} {...hotel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Rated Hotels Yet
              </h3>
              <p className="text-gray-600">
                Check back soon for our top-rated accommodations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
