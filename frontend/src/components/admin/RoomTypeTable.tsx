"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteRoomType, type RoomType } from "@/lib/actions";

interface RoomTypeTableProps {
  initialRoomTypes: RoomType[];
}

export default function RoomTypeTable({
  initialRoomTypes,
}: RoomTypeTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [roomTypes, setRoomTypes] = useState<RoomType[]>(initialRoomTypes);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const result = await deleteRoomType(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Room type deleted successfully");
        setRoomTypes((prev) => prev.filter((room) => room.id !== id));
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Room Types</h1>
          <Link
            href="/admin/room-types/new"
            className="bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add New Room Type
          </Link>
        </div>

        {roomTypes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No room types
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Get started by creating a new room type.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 font-semibold text-gray-900">ID</th>
                  <th className="p-3 font-semibold text-gray-900">Name</th>
                  <th className="p-3 font-semibold text-gray-900">Image</th>
                  <th className="p-3 font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="p-3 font-semibold text-gray-900">
                    Price/Night
                  </th>
                  <th className="p-3 font-semibold text-gray-900">Capacity</th>
                  <th className="p-3 font-semibold text-gray-900">
                    Hotel Name
                  </th>
                  <th className="p-3 font-semibold text-gray-900 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {roomTypes.map((room) => (
                  <tr key={room.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-700">{room.id}</td>
                    <td className="p-3 font-medium text-gray-900">
                      {room.name}
                    </td>
                    <td className="p-3">
                      {room.imageUrl ? (
                        <img
                          src={room.imageUrl}
                          alt={room.name}
                          className="w-20 h-14 object-cover rounded"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-3 text-gray-700">
                      {room.description || "N/A"}
                    </td>
                    <td className="p-3 text-gray-700">
                      ${room.pricePerNight.toFixed(2)}
                    </td>
                    <td className="p-3 text-gray-700">{room.capacity}</td>
                    <td className="p-3 text-gray-700">{room.hotelName}</td>
                    <td className="p-3 text-right space-x-4">
                      <Link
                        href={`/admin/room-types/${room.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(room.id)}
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
        )}
      </div>

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Delete Room Type
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this room type? This action cannot
              be undone.
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
