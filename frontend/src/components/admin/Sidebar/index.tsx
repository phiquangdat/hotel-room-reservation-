"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BedDouble, CalendarDays } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
        { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
    ];

    return (
        <aside className="w-64 bg-white shadow-md">
            <div className="p-6 text-xl font-bold border-b">Admin Panel</div>
            <nav className="p-4 space-y-2">
                {navItems.map(({ name, href, icon: Icon }) => (
                    <Link
                        key={name}
                        href={href}
                        className={`flex items-center gap-3 p-3 rounded-lg transition ${
                            pathname === href
                                ? "bg-indigo-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        <Icon size={18} />
                        {name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}