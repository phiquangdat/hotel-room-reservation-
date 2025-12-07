"use client";
import React, { useEffect, useState } from "react";
import { fetchAllBookings, updateBookingStatus } from "@/lib/actions";
import type { Booking } from "@/lib/actions";
import {
  Calendar,
  Users,
  DollarSign,
  Filter,
  ChevronLeft,
  ChevronRight,
  Check,
  LogIn,
  X,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";

const AdminBookingsPage: React.FC = () => {
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
        customer: b.customer || {
          firstName: "-",
          lastName: "-",
          email: "-",
          phoneNumber: "-",
        },
        room: b.room || {
          roomNumber: "N/A",
          roomType: { name: "-", pricePerNight: 0 },
        },
      }));

      setBookings(normalizedBookings);
      setTotalPages(data.totalPages ?? 1);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter, page, token, isAuthenticated]);

  const handleStatusChange = async (id: number, status: string) => {
    if (!isAuthenticated() || !token) {
      alert("Session expired. Please log in again.");
      return;
    }

    try {
      setUpdatingId(id);
      await updateBookingStatus(id, status, token);
      await loadBookings();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      CONFIRMED: "bg-green-100 text-green-800 border-green-200",
      CHECKED_IN: "bg-blue-100 text-blue-800 border-blue-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return (
      <span
        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
          styles[status as keyof typeof styles] || "bg-slate-100 text-slate-800"
        }`}
      >
        {status?.replace("_", " ")}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <CalendarCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Booking Management
              </h1>
              <p className="text-slate-600 mt-1">
                Manage and monitor all hotel bookings
              </p>
            </div>
          </div>
        </div>

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
              className="px-4 py-2.5 text-slate-900 bg-white border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all hover:border-slate-400 font-medium"
            >
              <option value="">All Bookings</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            {statusFilter && (
              <button
                onClick={() => {
                  setStatusFilter("");
                  setPage(0);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-600 font-medium">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-20 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <CalendarCheck className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No Bookings Found
            </h3>
            <p className="text-slate-600">
              {statusFilter
                ? `No bookings with status "${statusFilter}"`
                : "No bookings available at the moment"}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Guests
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Price
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-slate-900">
                            #{b.id}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Calendar className="w-4 h-4 text-green-500" />
                              {b.checkInDate ? formatDate(b.checkInDate) : "-"}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Calendar className="w-4 h-4 text-red-500" />
                              {b.checkOutDate
                                ? formatDate(b.checkOutDate)
                                : "-"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-900">
                              {b.numberOfGuests ?? "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-bold text-slate-900">
                              {b.totalPrice ?? "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(b.status ?? "unknown")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {updatingId === b.id ? (
                              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            ) : (
                              <>
                                <button
                                  className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                  onClick={() =>
                                    handleStatusChange(b.id, "CONFIRMED")
                                  }
                                  title="Confirm"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                  onClick={() =>
                                    handleStatusChange(b.id, "CHECKED_IN")
                                  }
                                  title="Check-in"
                                >
                                  <LogIn className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                  onClick={() =>
                                    handleStatusChange(b.id, "CANCELLED")
                                  }
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
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

export default AdminBookingsPage;
