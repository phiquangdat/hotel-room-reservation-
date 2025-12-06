import Link from "next/link";
import { BedDouble, List, Building2, Calendar } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, Admin. Here is what's happening.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/admin/rooms" className="block group">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-indigo-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
              <BedDouble className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Rooms
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              View, edit, or delete rooms.
            </p>
          </div>
        </Link>

        <Link href="/admin/hotels" className="block group">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-amber-200">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Hotels
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              View, edit, or delete hotels.
            </p>
          </div>
        </Link>

        <Link href="/admin/room-types" className="block group">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-indigo-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
              <List className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Room Types
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              View, edit, or delete room types.
            </p>
          </div>
        </Link>

        <Link href="/admin/bookings" className="block group">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-purple-200">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" /> {/* Updated icon */}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Bookings
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              View, update, or cancel bookings.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
