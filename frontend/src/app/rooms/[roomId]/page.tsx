"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { fetchRoomDetails, type BookingRoomProps } from "@/lib/actions";
import { useEffect, useState } from "react";
import {
  Bed,
  Wifi,
  Tv,
  Coffee,
  Users,
  MapPin,
  Wind,
  Utensils,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Calendar,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function RoomDetailsPage() {
  const { roomId } = useParams();
  const [room, setRoom] = useState<BookingRoomProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoomDetails(roomId: string) {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchRoomDetails(roomId);

        if (!data) {
          throw new Error("Failed to fetch room details");
        }

        setRoom(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    const id = Array.isArray(roomId) ? roomId[0] : roomId;

    if (!id) {
      setError("Room ID not found.");
      setLoading(false);
      return;
    }

    loadRoomDetails(id);
  }, [roomId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-neutral-900">
        <div className="relative">
          <Loader2 className="h-16 w-16 text-neutral-400 animate-spin" />
          <div className="absolute inset-0 h-16 w-16 bg-neutral-400/10 rounded-full blur-xl animate-pulse" />
        </div>
        <p className="text-lg text-neutral-400 font-medium mt-6">
          Loading room details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-neutral-900 px-4">
        <div className="bg-neutral-800 border border-neutral-700 rounded-3xl shadow-2xl p-12 max-w-md text-center">
          <AlertTriangle className="h-20 w-20 text-neutral-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-3">
            Something went wrong
          </h2>
          <p className="text-neutral-400 mb-8">{error}</p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-white hover:bg-neutral-100 text-neutral-900 rounded-2xl font-semibold transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-900">
        <div className="bg-neutral-800 rounded-3xl shadow-2xl p-12 text-center">
          <p className="text-xl text-neutral-300 mb-6">Room not found.</p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-white hover:bg-neutral-100 text-neutral-900 rounded-2xl font-semibold transition-all"
          >
            Explore Rooms
          </Link>
        </div>
      </div>
    );
  }

  const amenities = [
    { icon: Wifi, label: "High-Speed WiFi" },
    { icon: Tv, label: "4K Smart TV" },
    { icon: Coffee, label: "Coffee Bar" },
    { icon: Wind, label: "Climate Control" },
    { icon: Utensils, label: "24/7 Room Service" },
    { icon: Shield, label: "Safe & Secure" },
  ];

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        {room.imageUrl ? (
          <>
            <Image
              src={room.imageUrl}
              alt={`Photo of ${room.roomTypeName}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/70 via-neutral-900/40 to-neutral-900" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
            <Bed className="h-32 w-32 text-neutral-700" />
          </div>
        )}

        {/* Floating Header */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-xl ${
                  room.status.toLowerCase() === "available"
                    ? "bg-white/90 text-neutral-900"
                    : "bg-neutral-700/90 text-white"
                }`}
              >
                {room.status}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-white/10 backdrop-blur-xl text-white">
                Room #{room.roomNumber}
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3 drop-shadow-2xl">
              {room.roomTypeName}
            </h1>
            <div className="flex items-center gap-2 text-white/90 text-lg">
              <MapPin className="h-5 w-5" />
              <span>{room.hotelName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700 rounded-2xl p-6 text-center">
                <Users className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">
                  {room.capacity}
                </div>
                <div className="text-sm text-neutral-500">Guests</div>
              </div>
              <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700 rounded-2xl p-6 text-center">
                <Bed className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">1+</div>
                <div className="text-sm text-neutral-500">King Bed</div>
              </div>
              <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700 rounded-2xl p-6 text-center">
                <Sparkles className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">5★</div>
                <div className="text-sm text-neutral-500">Luxury</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="h-1 w-12 bg-white/30 rounded-full" />
                Experience Luxury
              </h2>
              <p className="text-neutral-300 leading-relaxed text-lg">
                Immerse yourself in unparalleled comfort and sophistication. Our{" "}
                {room.roomTypeName} at {room.hotelName} combines contemporary
                design with timeless elegance. Every detail has been carefully
                curated to ensure your stay is nothing short of extraordinary.
                From premium furnishings to state-of-the-art technology,
                experience hospitality redefined.
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="h-1 w-12 bg-white/30 rounded-full" />
                Premium Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-700/50 hover:border-neutral-600 transition-all"
                  >
                    <div className="flex-shrink-0">
                      <amenity.icon className="h-7 w-7 text-neutral-400" />
                    </div>
                    <span className="text-neutral-300 font-medium group-hover:text-white transition-colors">
                      {amenity.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="h-1 w-12 bg-white/30 rounded-full" />
                Guest Policies
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900/50">
                  <Calendar className="h-6 w-6 text-neutral-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white mb-1">
                      Flexible Cancellation
                    </p>
                    <p className="text-sm text-neutral-400">
                      Full refund if you cancel 24 hours before check-in
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900/50">
                  <Clock className="h-6 w-6 text-neutral-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white mb-1">
                      Check-in: 3:00 PM · Check-out: 11:00 AM
                    </p>
                    <p className="text-sm text-neutral-400">
                      Early check-in and late check-out available upon request
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 bg-neutral-800 border border-neutral-700 rounded-3xl p-8 shadow-2xl">
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">
                    ${room.pricePerNight}
                  </span>
                  <span className="text-neutral-400 text-lg">/ night</span>
                </div>
                <p className="text-sm text-neutral-500">
                  All taxes and fees included
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-4 bg-neutral-900/50 border border-neutral-700 rounded-xl text-white focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-4 bg-neutral-900/50 border border-neutral-700 rounded-xl text-white focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Number of Guests
                  </label>
                  <select className="w-full px-4 py-4 bg-neutral-900/50 border border-neutral-700 rounded-xl text-white focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all">
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map(
                      (num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "guest" : "guests"}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <Link
                href={`/booking/${room.roomId}`}
                className="block w-full text-center px-8 py-5 bg-white hover:bg-neutral-100 text-neutral-900 rounded-2xl font-bold text-lg mb-6 transition-all shadow-lg"
              >
                Reserve Your Stay
              </Link>

              <div className="space-y-3 pt-6 border-t border-neutral-700">
                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                  <span>Instant booking confirmation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                  <span>Free cancellation available</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                  <span>Best rate guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
