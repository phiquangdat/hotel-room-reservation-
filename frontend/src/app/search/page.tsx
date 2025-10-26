import RoomCard, { RoomCardProps } from "@/components/RoomCard";
import { ServerCrash, Search, Calendar, Users } from "lucide-react";
import { searchRooms } from "@/lib/actions";

interface SearchPageProps {
  searchParams: {
    city?: string;
    checkInDate?: string;
    checkOutDate?: string;
    guestCapacity?: string;
  };
}

async function SearchResults({ searchParams }: SearchPageProps) {
  let rooms: RoomCardProps[] = [];

  try {
    rooms = await searchRooms(searchParams);
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 px-4">
        <div className="bg-red-50 rounded-full p-6 mb-6">
          <ServerCrash className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Could Not Load Results
        </h2>
        <p className="text-gray-600 max-w-md">
          There was an error connecting to the server. Please try again later.
        </p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 px-4">
        <div className="bg-gray-100 rounded-full p-6 mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          No Rooms Found
        </h2>
        <p className="text-gray-600 max-w-md">
          Try adjusting your search criteria or dates to find available rooms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} {...room} />
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { city, checkInDate, checkOutDate, guestCapacity } = searchParams;

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formattedCheckIn = formatDate(checkInDate);
  const formattedCheckOut = formatDate(checkOutDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {city ? (
              <>
                <span className="text-gray-600">Rooms in </span>
                {city}
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
            {guestCapacity && (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                <Users className="w-4 h-4" />
                <span>
                  {guestCapacity}{" "}
                  {parseInt(guestCapacity) === 1 ? "guest" : "guests"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchResults searchParams={searchParams} />
      </main>
    </div>
  );
}
