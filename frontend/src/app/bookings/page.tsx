"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth";
import {
  fetchUserBookings,
  updateBookingStatus,
  type Booking,
} from "@/lib/actions";
import {
  Loader2,
  CalendarCheck,
  Calendar,
  DollarSign,
  Users,
  Trash2,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusBadge = (status: string) => {
  const statusKey = status.toUpperCase();
  const styles: Record<string, string> = {
    CONFIRMED: "bg-emerald-100 text-emerald-800 border-emerald-200",
    CHECKED_IN: "bg-blue-100 text-blue-800 border-blue-200",
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    CHECKED_OUT: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        styles[statusKey] || "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {statusKey.replace("_", " ")}
    </span>
  );
};

const MyBookingsPage = () => {
  const { token, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      if (!isAuthenticated() || !token) {
        setBookings([]);
        return;
      }

      const data: Booking[] = await fetchUserBookings(token);
      setBookings(data);
    } catch (error) {
      toast.error("Failed to load bookings.");
      console.error("Error fetching user bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated() && token) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  const handleCancellation = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to cancel this booking? This action is irreversible."
      )
    )
      return;
    if (!isAuthenticated() || !token) {
      toast.error("Session expired.");
      return;
    }

    try {
      setUpdatingId(id);
      await updateBookingStatus(id, "CANCELLED", token);
      toast.success("Booking cancelled successfully.");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to cancel booking.");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto w-10 h-10 text-indigo-600 mb-3" />
          <p className="text-gray-600">Loading your reservations...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <div className="max-w-md w-full bg-white border-2 border-red-200 rounded-2xl p-8 text-center shadow-lg">
          <p className="text-lg text-red-700 font-medium">
            You must be logged in to view your bookings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <CalendarCheck className="w-10 h-10 text-indigo-600" />
          My Reservations
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-slate-200">
            <CalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">
              You have no active or past bookings.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-200">
                    <div>
                      <h2 className="text-2xl font-bold text-indigo-600 mb-1">
                        Booking #{booking.id}
                      </h2>
                    </div>
                    {getStatusBadge(booking.status || "UNKNOWN")}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">
                          Check-in
                        </p>
                        <p className="text-base font-semibold text-slate-800">
                          {formatDate(booking.checkInDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-rose-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">
                          Check-out
                        </p>
                        <p className="text-base font-semibold text-slate-800">
                          {formatDate(booking.checkOutDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">
                          Guests
                        </p>
                        <p className="text-base font-semibold text-slate-800">
                          {booking.numberOfGuests}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">
                          Total Price
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          ${booking.totalPrice?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    {booking.status === "CONFIRMED" ||
                    booking.status === "PENDING" ? (
                      <button
                        onClick={() => handleCancellation(booking.id)}
                        disabled={updatingId === booking.id}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                      >
                        {updatingId === booking.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Cancel Booking
                          </>
                        )}
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Action not available for status:{" "}
                        {booking.status?.replace("_", " ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
