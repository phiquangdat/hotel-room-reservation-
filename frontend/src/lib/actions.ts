"use server";

import { revalidatePath } from "next/cache";

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

// Resolve a consistent backend API base from NEXT_PUBLIC_API_URL.
// docker-compose sets NEXT_PUBLIC_API_URL=http://backend:8080 so we append /api
// if it's not already present. Fall back to localhost for local dev.
const _rawBackend = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const backendUrl = `${_rawBackend.replace(/\/$/, "")}/api`;

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
    const data = await res.json();

    return data.map((item: any) => ({
      roomId: item.roomId,
      hotelName: item.hotelName,
      city: item.city,
      roomTypeName: item.roomType,
      imageUrl: item.imageUrl || "/placeholder.jpg",
      pricePerNight: Number(item.pricePerNight),
      capacity: item.capacity,
    }));
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
    const data = await res.json();

    return {
      roomId: data.roomId ?? data.id ?? 0,
      imageUrl:
        data.imageUrl ??
        "https://via.placeholder.com/1200x800?text=No+Image+Available",
      hotelName: data.hotelName ?? "Unknown Hotel",
      roomTypeId: data.roomTypeId ?? "N/A",
      roomTypeName: data.roomTypeName ?? "Room",
      pricePerNight: data.pricePerNight ?? 0,
      capacity: data.capacity ?? 1,
      roomNumber: data.roomNumber ?? "N/A",
      status: data.status ?? "Available",
    };
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

export async function fetchAllRooms(): Promise<BookingRoomProps[]> {
  const url = `${backendUrl}/rooms`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch rooms: ${res.status}`);
    }

    const data = await res.json();

    return data.map((item: any) => ({
      roomId: item.id ?? item.roomId,
      hotelName:
        item.roomType?.hotel?.name ?? item.hotelName ?? "Unknown Hotel",
      roomTypeId: String(item.roomType?.id ?? item.roomTypeId ?? "0"),
      roomTypeName: item.roomType?.name ?? item.roomTypeName ?? "Room",
      imageUrl: item.roomType?.imageUrl ?? item.imageUrl ?? "/placeholder.jpg",
      roomNumber: item.roomNumber ?? "N/A",
      pricePerNight: Number(
        item.roomType?.pricePerNight ?? item.pricePerNight ?? 0
      ),
      capacity: item.roomType?.capacity ?? item.capacity ?? 0,
      status: data.status ?? "Available",
    }));
  } catch (error) {
    console.error("Failed to fetch all rooms:", error);
    return [];
  }
}

export async function deleteRoom(roomId: number) {
  const url = `${backendUrl}/rooms/${roomId}`;
  try {
    const res = await fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Failed to delete room: ${res.status}`);
    }

    revalidatePath("/admin/rooms");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete room:", error);
    return { error: "Failed to delete room" };
  }
}

export async function updateRoom(roomId: number, data: any) {
  const url = `${backendUrl}/rooms/${roomId}`;
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to update room: ${res.status}`);
    }

    const updatedRoom = await res.json();
    revalidatePath("/admin/rooms");
    revalidatePath(`/admin/rooms/${roomId}/edit`);
    return { success: true, data: updatedRoom };
  } catch (error) {
    console.error("Failed to update room:", error);
    return { error: "Failed to update room" };
  }
}
