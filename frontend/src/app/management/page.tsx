"use client";
import React, { useEffect, useState } from "react";
import { fetchAllBookings, updateBookingStatus } from "@/lib/actions";
import RoomAvailabilityChecker from "@/components/RoomAvailabilityChecker";
import type { Booking } from "@/lib/actions";
import {
  CalendarDays,
  DollarSign,
  Filter,
  ChevronLeft,
  ChevronRight,
  Check,
  LogIn,
  LogOut,
  Loader2,
  CalendarCheck,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";

const HeaderIcon = ({
  children,
  Icon,
}: {
  children: React.ReactNode;
  Icon: React.ElementType;
}) => (
  <span className="flex items-center gap-1">
    <Icon className="w-4 h-4" />
    {children}
  </span>
);

const ReceptionistBookingsPage: React.FC = () => {
  const { token, isAuthenticated } = useAuthStore();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const pageSize = 10;

  const loadBookings = async () => {
    try {
      setLoading(true);
      if (!isAuthenticated() || !token) {
        setLoading(false);
        return;
      }

      const data = await fetchAllBookings(
        {
          status: statusFilter,
          page,
          size: pageSize,
        },
        token
      );

      const normalizedBookings = data.content.map((b: any) => ({
        ...b,
        customer: b.customer || {},
        room: b.room || { roomType: {} },
      }));

      setBookings(normalizedBookings);
      setTotalPages(data.totalPages ?? 1);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter, page, token, isAuthenticated]);

  const handleStatusChange = async (
    id: number,
    status: string,
    actionName: string
  ) => {
    if (!isAuthenticated() || !token) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    if (
      status === "CANCELLED" &&
      !confirm("Are you sure you want to cancel this booking?")
    ) {
      return;
    }

    try {
      setUpdatingId(id);
      await updateBookingStatus(id, status, token);
      toast.success(`Booking successfully ${actionName}.`);
      await loadBookings();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${actionName.toLowerCase()} booking.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      CONFIRMED: "bg-green-100 text-green-800 border-green-200",
      CHECKED_IN: "bg-blue-100 text-blue-800 border-blue-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CHECKED_OUT: "bg-slate-100 text-slate-600 border-slate-300",
      UNKNOWN: "bg-gray-100 text-gray-500 border-gray-300",
    };

    return (
      <span
        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
          styles[status] || styles["UNKNOWN"]
        }`}
      >
        {status?.replace("_", " ")}
      </span>
    );
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <CalendarCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Receptionist Booking Management
              </h1>
              <p className="text-slate-600 mt-1">
                Manage all reservations, check-ins, and cancellations.
              </p>
            </div>
          </div>
        </div>

        <RoomAvailabilityChecker />

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <label className="text-sm font-semibold text-slate-700">
              Filter by Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(0);
                setStatusFilter(e.target.value);
              }}
              className="px-4 py-2.5 text-slate-900 bg-white border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all hover:border-slate-400 font-medium"
            >
              <option value="">All Bookings</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="CHECKED_OUT">Checked Out</option>
            </select>
            {statusFilter && (
              <button
                onClick={() => {
                  setStatusFilter("");
                  setPage(0);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
            <p className="text-slate-600 font-medium">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-20 flex flex-col items-center justify-center">
            <CalendarCheck className="w-10 h-10 text-slate-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No Bookings Found
            </h3>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <HeaderIcon Icon={CalendarDays}>Dates</HeaderIcon>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <HeaderIcon Icon={DollarSign}>Price</HeaderIcon>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {bookings.map((b) => (
                      <tr
                        key={b.id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                          #{b.id}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {formatDate(b.checkInDate)} -{" "}
                          {formatDate(b.checkOutDate)}
                        </td>

                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          ${b.totalPrice?.toFixed(2) ?? "0.00"}
                        </td>

                        <td className="px-6 py-4">
                          {getStatusBadge(b.status ?? "UNKNOWN")}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {updatingId === b.id ? (
                              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                            ) : (
                              // 🔑 FORCE ALL ACTIONS TO DISPLAY
                              <>
                                {/* Confirm */}
                                <button
                                  className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                  onClick={() =>
                                    handleStatusChange(
                                      b.id,
                                      "CONFIRMED",
                                      "confirmed"
                                    )
                                  }
                                  title="Confirm (PENDING -> CONFIRMED)"
                                >
                                  <Check className="w-4 h-4" />
                                </button>

                                {/* Check-in */}
                                <button
                                  className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                  onClick={() =>
                                    handleStatusChange(
                                      b.id,
                                      "CHECKED_IN",
                                      "checked in"
                                    )
                                  }
                                  title="Check-in (CONFIRMED -> CHECKED_IN)"
                                >
                                  <LogIn className="w-4 h-4" />
                                </button>

                                {/* Check-out */}
                                <button
                                  className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                                  onClick={() =>
                                    handleStatusChange(
                                      b.id,
                                      "CHECKED_OUT",
                                      "checked out"
                                    )
                                  }
                                  title="Check-out (CHECKED_IN -> CHECKED_OUT)"
                                >
                                  <LogOut className="w-4 h-4" />
                                </button>

                                {/* Cancel */}
                                <button
                                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                  onClick={() =>
                                    handleStatusChange(
                                      b.id,
                                      "CANCELLED",
                                      "cancelled"
                                    )
                                  }
                                  title="Cancel Booking"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Page{" "}
                  <span className="font-bold text-slate-900">{page + 1}</span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-900">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReceptionistBookingsPage;
