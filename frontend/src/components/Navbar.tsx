"use client";

import Link from "next/link";
import { Hotel } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/auth";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.refresh();
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="flex px-16 items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Hotel className="h-8 w-8 text-indigo-600" />
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            Hotel Reservation
          </Link>
        </div>

        <div className="hidden md:block">
          <div className="ml-10 flex items-center space-x-2">
            {user ? (
              user.role === "ROLE_ADMIN" ? (
                <>
                  <Link
                    href="/admin"
                    className="px-4 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium"
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/bookings"
                    className="px-4 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </>
              )
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
