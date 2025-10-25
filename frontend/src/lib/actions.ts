import { RoomCardProps } from "@/components/RoomCard";

export interface SearchParams {
  city?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCapacity?: string;
}

export async function searchRooms(
  searchParams: SearchParams
): Promise<RoomCardProps[]> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  const query = new URLSearchParams();
  if (searchParams.city) query.append("city", searchParams.city);
  if (searchParams.checkInDate)
    query.append("checkInDate", searchParams.checkInDate);
  if (searchParams.checkOutDate)
    query.append("checkOutDate", searchParams.checkOutDate);
  if (searchParams.guestCapacity)
    query.append("guestCapacity", searchParams.guestCapacity);

  const queryString = query.toString();
  const url = `${backendUrl}/api/public/rooms/search?${queryString}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch search results: ", error);
    throw new Error("Could not fetch room data. Please try again later.");
  }
}
