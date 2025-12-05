"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteHotel, type Hotel } from "@/lib/actions";

interface HotelTableProps {
  initialHotels: Hotel[];
}

export default function HotelTable({ initialHotels }: HotelTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const hotels = initialHotels;

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const result = await deleteHotel(id);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Hotel deleted successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        {/* ✅ Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Hotels</h1>
          <Link
            href="/admin/hotels/new"
            className="bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add New Hotel
          </Link>
        </div>

        {/* ✅ Empty State */}
        {hotels.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No hotels
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Get started by creating a new hotel.
            </p>
          </div>
        ) : (
          <>
            {/* ✅ Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 font-semibold text-gray-900">ID</th>
                    <th className="p-3 font-semibold text-gray-900">Name</th>
                    <th className="p-3 font-semibold text-gray-900">Address</th>
                    <th className="p-3 font-semibold text-gray-900">City</th>
                    <th className="p-3 font-semibold text-gray-900">Phone</th>
                    <th className="p-3 font-semibold text-gray-900 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map((hotel) => (
                    <tr key={hotel.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{hotel.id}</td>
                      <td className="p-3 font-medium text-gray-900">
                        {hotel.name}
                      </td>
                      <td className="p-3 text-gray-700">{hotel.address}</td>
                      <td className="p-3 text-gray-700">{hotel.city}</td>
                      <td className="p-3 text-gray-700">
                        {hotel.phoneNumber || "—"}
                      </td>
                      <td className="p-3 text-right space-x-4">
                        <Link
                          href={`/admin/hotels/${hotel.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(hotel.id)}
                          className="text-red-600 hover:text-red-800 hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Delete Hotel
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this hotel? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteId && handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
