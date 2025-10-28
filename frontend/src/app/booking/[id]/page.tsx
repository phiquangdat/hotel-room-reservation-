import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchRoomDetails } from "@/lib/actions";
import { CalendarDays, MapPin, Users, Bed, Wifi, Tv } from "lucide-react";

interface BookingPageProps {
  params: {
    id: string;
  };
  searchParams: {
    checkInDate?: string;
    checkOutDate?: string;
    guestCapacity?: string;
  };
}

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  let room;
  try {
    room = await fetchRoomDetails(params.id);
  } catch (error) {
    console.error(error);
    notFound();
  }

  const initialCheckIn = searchParams?.checkInDate;
  const initialCheckOut = searchParams?.checkOutDate;
  const initialGuests = searchParams?.guestCapacity
    ? parseInt(searchParams.guestCapacity, 10)
    : 1;
  const validInitialGuests =
    isNaN(initialGuests) || initialGuests < 1 ? 1 : initialGuests;

  console.log("Help", initialCheckIn);
  console.log("Help", initialCheckOut);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Room {room.roomNumber}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span className="text-base">{room.hotelName}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative w-full h-64 sm:h-80 lg:h-96">
                <Image
                  src={room.imageUrl}
                  alt={room.roomTypeName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Room Details
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-xl">
                  <Users className="w-8 h-8 text-indigo-600 mb-2" />
                  <span className="text-sm text-gray-600">Capacity</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {room.capacity} guests
                  </span>
                </div>
                <div className="flex flex-col text-center items-center p-4 bg-indigo-50 rounded-xl">
                  <Bed className="w-8 h-8 text-indigo-600 mb-2" />
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {room.roomTypeName}
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-xl">
                  <Wifi className="w-8 h-8 text-indigo-600 mb-2" />
                  <span className="text-sm text-gray-600">WiFi</span>
                  <span className="text-lg font-semibold text-gray-900">
                    Free
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-xl">
                  <Tv className="w-8 h-8 text-indigo-600 mb-2" />
                  <span className="text-sm text-gray-600">Smart TV</span>
                  <span className="text-lg font-semibold text-gray-900">
                    Yes
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 sticky top-8">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-gray-900">
                    ${room.pricePerNight}
                  </span>
                  <span className="text-gray-600">/ night</span>
                </div>
                <p className="text-sm text-gray-500">Taxes and fees included</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-600">
                    <CalendarDays className="w-5 h-5 mr-2 text-indigo-600" />{" "}
                    Check-in
                  </span>
                  <span className="font-medium text-gray-900">
                    {initialCheckIn}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-600">
                    <CalendarDays className="w-5 h-5 mr-2 text-indigo-600" />{" "}
                    Check-out
                  </span>
                  <span className="font-medium text-gray-900">
                    {initialCheckOut}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2 text-indigo-600" /> Guests
                  </span>
                  <span className="font-medium text-gray-900">
                    {validInitialGuests}{" "}
                    {validInitialGuests === 1 ? "guest" : "guests"}
                  </span>
                </div>
              </div>

              <Link
                href="/"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-center"
              >
                Reserve Now
              </Link>

              <p className="text-center text-sm text-gray-500 mt-4">
                Free cancellation within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
