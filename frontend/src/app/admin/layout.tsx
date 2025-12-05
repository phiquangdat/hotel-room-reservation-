import AdminGuard from "@/components/admin/AdminGuard";
import Link from "next/link";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Building2,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 flex">
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full">
          <div className="p-6">
            <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
          </div>

          <nav className="px-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            <Link
              href="/admin/hotels"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
            >
              <Building2 className="w-5 h-5" />
              Manage Hotels
            </Link>

            <Link
              href="/admin/rooms"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
            >
              <BedDouble className="w-5 h-5" />
              Manage Rooms
            </Link>

            <Link
              href="/admin/bookings"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
            >
              <CalendarCheck className="w-5 h-5" />
              Bookings
            </Link>
          </nav>
        </aside>

        <main className="flex-1 md:ml-64 p-8">{children}</main>
      </div>
    </AdminGuard>
  );
}
