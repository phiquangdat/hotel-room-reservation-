"use server";
import { RoomCardProps } from "@/components/RoomCard";

export interface SearchParams {
  city?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCapacity?: string;
}

export interface Hotel {
  id: number;
  name: string;
  city: string;
  rating: number;
}

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

export async function searchRooms(
  searchParams: SearchParams
): Promise<RoomCardProps[]> {
  const query = new URLSearchParams();
  if (searchParams.city) query.append("city", searchParams.city);
  if (searchParams.checkInDate)
    query.append("checkInDate", searchParams.checkInDate);
  if (searchParams.checkOutDate)
    query.append("checkOutDate", searchParams.checkOutDate);
  if (searchParams.guestCapacity)
    query.append("guestCapacity", searchParams.guestCapacity);

  const queryString = query.toString();
  const url = `${backendUrl}/public/rooms/search?${queryString}`;

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

export async function fetchTopHotels(): Promise<Hotel[]> {
  try {
    const response = await fetch(`${backendUrl}/hotels/top-rated`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Data could not be fetched!");
    }

    const data: Hotel[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch top hotels: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}
