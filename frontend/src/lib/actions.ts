"use server";

export interface SearchParams {
  city?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCapacity?: string;
}

export interface Hotel {
  id: number;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  description: string;
  rating: number;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
}

export interface RoomCardProps {
  roomId: number;
  imageUrl: string;
  hotelName: string;
  roomTypeId: string;
  roomTypeName: string;
  pricePerNight: number;
  capacity: number;
}

export interface BookingRoomProps extends RoomCardProps {
  roomNumber: string;
  status: string;
  hotelName: string;
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

  console.log("SIÚ", searchParams.city);
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

export async function fetchRoomDetails(id: string): Promise<BookingRoomProps> {
  const url = `${backendUrl}/rooms/${id}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch room details: ", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Could not fetch room data.");
  }
}

export async function createBooking(formData: BookingFormData) {
  const url = `${backendUrl}/bookings`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to create booking");
    }

    const newBooking = await res.json();
    return newBooking;
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "An unknown error occurred" };
  }
}
