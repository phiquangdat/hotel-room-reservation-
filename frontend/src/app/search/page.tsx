import RoomCard from "@/components/RoomCard";
import {
  type RoomCardProps,
  type SearchParams,
  searchRooms,
} from "@/lib/actions";
import { ServerCrash, Search, Calendar, Users } from "lucide-react";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: Promise<SearchParams>;
}

async function SearchResults({ searchParams }: { searchParams: SearchParams }) {
  let rooms: RoomCardProps[] = [];
  let error: string | null = null;

  const queryParams: SearchParams = {
    city: searchParams.city,
    checkInDate: searchParams.checkInDate,
    checkOutDate: searchParams.checkOutDate,
    guestCapacity: searchParams.guestCapacity,
  };

  try {
    rooms = await searchRooms(queryParams);
  } catch (err) {
    console.error("Failed to fetch search results:", err);
    error = err instanceof Error ? err.message : "An unknown error occurred.";
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const formattedCheckIn = formatDate(searchParams.checkInDate);
  const formattedCheckOut = formatDate(searchParams.checkOutDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchParams.city ? (
              <>
                <span className="text-gray-600">Rooms in </span>
                {searchParams.city}
              </>
            ) : (
              "Search Results"
            )}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-4">
            {formattedCheckIn && formattedCheckOut && (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4" />
                <span>
                  {formattedCheckIn} → {formattedCheckOut}
                </span>
              </div>
            )}
            {searchParams.guestCapacity && (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                <Users className="w-4 h-4" />
                <span>
                  {searchParams.guestCapacity}{" "}
                  {parseInt(searchParams.guestCapacity) === 1
                    ? "guest"
                    : "guests"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="flex flex-col items-center justify-center text-center py-24 px-4">
            <div className="bg-red-50 rounded-full p-6 mb-6">
              <ServerCrash className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Could Not Load Results
            </h2>
            <p className="text-gray-600 max-w-md">{error}</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 px-4">
            <div className="bg-gray-100 rounded-full p-6 mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Rooms Found
            </h2>
            <p className="text-gray-600 max-w-md">
              Try adjusting your search criteria or dates to find available
              rooms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.roomId} {...room} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;

  return (
    <Suspense fallback={<LoadingState />}>
      <SearchResults searchParams={resolvedParams} />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="h-9 bg-gray-300 rounded-full w-1/2 mb-2"></div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-4">
            <div className="h-8 bg-gray-200 rounded-full w-48"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            Finding matching rooms...
          </h3>
        </div>
      </main>
    </div>
  );
}
