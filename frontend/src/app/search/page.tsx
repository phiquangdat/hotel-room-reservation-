import { Suspense } from "react";
import RoomCard, { RoomCardProps } from "@/components/RoomCard";
import { ServerCrash } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center text-center text-gray-500 py-20">
        <ServerCrash className="w-16 h-16 mb-4 text-red-500" />
        <h2 className="text-2xl font-semibold mb-2">Could Not Load Results</h2>
        <p>
          There was an error connecting to the server. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} {...room} />
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { city, checkInDate, checkOutDate } = searchParams;
  const searchTitle = city ? `Results for "${city}"` : "Search Results";
  const searchSubtitle =
    checkInDate && checkOutDate
      ? `From ${checkInDate} to ${checkOutDate}`
      : "Your available rooms";

  return (
    <div>
      <main>
        <h1>{searchTitle}</h1>
        <p>{searchSubtitle}</p>

        <SearchResults searchParams={searchParams} />
      </main>
    </div>
  );
}
