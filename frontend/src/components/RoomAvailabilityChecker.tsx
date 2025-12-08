"use client";
import React, { useState } from "react";
import { useAuthStore } from "@/lib/auth";
import {
  Home,
  Users,
  Search,
  DollarSign,
  XCircle,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { fetchAllRooms } from "@/lib/actions";

interface RoomResult {
  roomId: number;
  roomTypeName: string;
  roomNumber: string;
  pricePerNight: number;
  capacity: number;
  status: string;
}

const RoomAvailabilityChecker: React.FC = () => {
  const { token } = useAuthStore();

  const [guestCapacity, setGuestCapacity] = useState(1);
  const [rooms, setRooms] = useState<RoomResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearchPerformed(true);
    setRooms(null);
    setError(null);

    if (guestCapacity <= 0) {
      setError("Please provide a valid guest capacity.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const allRooms: RoomResult[] = await fetchAllRooms();

      const filteredRooms = allRooms.filter(
        (room) =>
          room.capacity >= guestCapacity &&
          room.status?.toUpperCase() !== "BOOKED"
      );

      setRooms(filteredRooms);
    } catch (err: any) {
      setError(err.message || "Failed to search for rooms.");
    } finally {
      setLoading(false);
    }
  };

  const isSearchValid = guestCapacity > 0;

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 border-green-300";
      case "OCCUPIED":
        return "bg-red-100 text-red-800 border-red-300";
      case "BOOKED":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-5 flex items-center gap-2">
        <Search className="w-6 h-6 text-indigo-600" /> Room Availability Check
        (Capacity Filter)
      </h2>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Guest Capacity
          </label>
          <input
            type="number"
            value={guestCapacity}
            min="1"
            onChange={(e) => setGuestCapacity(parseInt(e.target.value) || 1)}
            className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="md:col-span-1">
          <button
            type="submit"
            disabled={loading || !isSearchValid}
            className="bg-indigo-600 text-white w-full px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Search Rooms
          </button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100">
        {error && (
          <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>Error: {error}</span>
          </div>
        )}

        {loading && !error && searchPerformed && (
          <p className="text-indigo-600 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading all rooms...
          </p>
        )}

        {!loading &&
          searchPerformed &&
          rooms &&
          (rooms.length > 0 ? (
            <div className="space-y-4">
              <p className="text-lg font-semibold text-green-700 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> {rooms.length} room(s)
                match the capacity criteria.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {rooms.map((room) => (
                  <div
                    key={room.roomId}
                    className={`p-4 rounded-lg shadow-sm border ${getStatusStyle(
                      room.status
                    )}`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <Home className="w-4 h-4" /> Room #{room.roomNumber}
                    </div>
                    <p className="text-sm text-gray-800">
                      Type: {room.roomTypeName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Max Guests: {room.capacity}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 font-semibold">
                      Status:{" "}
                      <span className="uppercase">
                        {room.status || "Unknown"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <DollarSign className="w-3 h-3" /> $
                      {room.pricePerNight.toFixed(2)} / night
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-lg font-semibold text-red-700 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> No rooms match the requested
              capacity.
            </p>
          ))}
      </div>
    </div>
  );
};

export default RoomAvailabilityChecker;
