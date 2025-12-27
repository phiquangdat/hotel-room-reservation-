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
  imageUrl?: string;
}

export interface RoomType {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  hotelId: number;
  hotelName: string;
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

export interface Customer {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface Room {
  roomNumber?: string;
  roomType?: RoomType;
}

export interface Booking {
  id: number;
  customer?: Customer;
  room?: Room;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  totalPrice?: number;
  status?: string;
}

const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Resolve a consistent backend API base.
// In Docker (SSR), process.env.API_URL should be set to the internal hostname (http://backend:8080).
// In Browser (Client), only NEXT_PUBLIC_API_URL is available (http://localhost:8080).
const _rawBackend =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";
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
    const response = await fetch(`${backendUrl}/hotels/top-rated`);

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

export async function createBooking(formData: BookingFormData, token?: string) {
  const url = `${backendUrl}/bookings`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create booking: ${res.status} - ${errorText}`);
    }

    const newBooking = await res.json();
    return newBooking;
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "An unknown error occurred during booking." };
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
      status: item.status ?? "Available",
    }));
  } catch (error) {
    console.error("Failed to fetch all rooms:", error);
    return [];
  }
}

export async function fetchAllRoomTypes(token?: string): Promise<RoomType[]> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${backendUrl}/room-types`, {
      cache: "no-store",
      headers: headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch room types: ${res.status} - ${errorText.substring(
          0,
          100
        )}`
      );
    }

    const contentType = res.headers.get("content-type");
    if (
      res.status === 204 ||
      !contentType ||
      !contentType.includes("application/json")
    ) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch room types:", error);
    return [];
  }
}

export async function fetchAllHotels(): Promise<Hotel[]> {
  try {
    const res = await fetch(`${backendUrl}/hotels`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch hotels");
    return await res.json();
  } catch (error) {
    console.error(error);
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

export async function updateRoom(roomId: number, data: any, token: string) {
  const url = `${backendUrl}/rooms/${roomId}`;
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(token),
      cache: "no-store",
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

export async function createRoom(data: any, token: string) {
  const url = `${backendUrl}/rooms`;

  const payload = {
    roomNumber: data.roomNumber,
    roomTypeId: Number(data.roomTypeId),
    hotelId: Number(data.hotelId),
    pricePerNight: parseFloat(data.price),
    status: data.status,
    capacity: data.capacity ? parseInt(data.capacity) : 2,
    description: data.description || "",
    imageUrl: data.imageUrl || null,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to create room: ${res.status}`);
    }

    const newRoom = await res.json();
    revalidatePath("/admin/rooms");
    return { success: true, data: newRoom };
  } catch (error) {
    console.error("Failed to create room:", error);
    return { error: "Failed to create room" };
  }
}

export async function fetchHotelDetails(id: number): Promise<Hotel> {
  try {
    const res = await fetch(`${backendUrl}/hotels/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch hotel");

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch hotel details:", error);
    throw new Error("Failed to fetch hotel");
  }
}

export async function createHotel(data: Partial<Hotel>, token: string) {
  try {
    const res = await fetch(`${backendUrl}/hotels`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to create hotel: ${res.status}`);
    }

    const newHotel = await res.json();
    revalidatePath("/admin/hotels");

    return { success: true, data: newHotel };
  } catch (error) {
    console.error("Failed to create hotel:", error);
    return { error: "Failed to create hotel" };
  }
}

export async function updateHotel(
  hotelId: number,
  data: Partial<Hotel>,
  token: string
) {
  try {
    const res = await fetch(`${backendUrl}/hotels/${hotelId}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      cache: "no-store",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to update hotel: ${res.status}`);
    }

    const updatedHotel = await res.json();

    revalidatePath("/admin/hotels");
    revalidatePath(`/admin/hotels/${hotelId}/edit`);

    return { success: true, data: updatedHotel };
  } catch (error) {
    console.error("Failed to update hotel:", error);
    return { error: "Failed to update hotel" };
  }
}

export async function deleteHotel(hotelId: number, token: string) {
  try {
    const res = await fetch(`${backendUrl}/hotels/${hotelId}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });

    if (!res.ok) {
      throw new Error(`Failed to delete hotel: ${res.status}`);
    }

    revalidatePath("/admin/hotels");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete hotel:", error);
    return { error: "Failed to delete hotel" };
  }
}

export async function fetchRoomTypeById(id: number, token: string) {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  try {
    const res = await fetch(`${backendUrl}/room-types/${id}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch room type: ${res.status} - ${errorText.substring(
          0,
          100
        )}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch room type:", error);
    throw error;
  }
}

export async function createRoomType(
  roomType: Omit<RoomType, "id" | "hotelName">,
  token: string
) {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  try {
    const res = await fetch(`${backendUrl}/room-types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roomType),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to create room type: ${res.status} - ${errorText.substring(
          0,
          100
        )}`
      );
    }

    const data = await res.json();
    revalidatePath("/admin/room-types");
    return data;
  } catch (error) {
    console.error("Failed to create room type:", error);
    throw error;
  }
}

export async function updateRoomType(
  id: number,
  roomType: Partial<RoomType>,
  token: string
) {
  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  const url = `${backendUrl}/room-types/${id}`;
  console.log("UPDATE URL:", url, "PAYLOAD:", roomType);

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(roomType),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update room type: ${res.status} - ${text}`);
  }

  const data = await res.json();

  revalidatePath("/admin/room-types");
  revalidatePath(`/admin/room-types/${id}/edit`);

  return data;
}

export async function deleteRoomType(id: number, token: string) {
  try {
    const res = await fetch(`${backendUrl}/room-types/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to delete room type");
    revalidatePath("/admin/room-types");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete room type:", error);
    return { error: "Failed to delete room type" };
  }
}

export async function fetchAllBookings(
  {
    status = "",
    page = 0,
    size = 10,
  }: {
    status?: string;
    page?: number;
    size?: number;
  },
  token: string
) {
  if (!token) {
    console.error("Authentication token is missing for fetchAllBookings.");
    return { content: [], totalPages: 1 };
  }

  const query = new URLSearchParams();
  if (status) query.append("status", status);
  query.append("page", String(page));
  query.append("size", String(size));

  const url = `${backendUrl}/bookings?${query.toString()}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch bookings: ${res.status} - ${errorText.substring(
          0,
          100
        )}`
      );
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return { content: [], totalPages: 1 };
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return { content: [], totalPages: 1 };
  }
}

export async function updateBookingStatus(
  id: number,
  status: string,
  token: string
) {
  try {
    const res = await fetch(
      `${backendUrl}/bookings/${id}/status?status=${status}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(token),
      }
    );

    if (!res.ok)
      throw new Error(`Failed to update booking status: ${res.status}`);

    revalidatePath("/admin/bookings");
    return await res.json();
  } catch (error) {
    console.error("Failed to update booking status:", error);
    return { error: "Failed to update booking status" };
  }
}

export async function fetchBookingById(
  id: number,
  token: string
): Promise<Booking | null> {
  if (!token) {
    console.error("Authentication token is missing for fetchBookingById.");
    return null;
  }

  try {
    const res = await fetch(`${backendUrl}/bookings/${id}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`API request failed with status ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch booking:", error);
    return null;
  }
}

export async function fetchUserBookings(token: string): Promise<any> {
  if (!token) {
    throw new Error("Authentication token is missing for fetchUserBookings.");
  }

  const url = `${backendUrl}/bookings/my-bookings`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch user bookings: ${res.status} - ${errorText.substring(
          0,
          100
        )}`
      );
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch user bookings:", error);
    throw new Error("Could not retrieve your bookings.");
  }
}
